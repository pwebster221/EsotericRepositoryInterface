import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertReadingSchema, insertChartSchema } from "@shared/schema";
import { neo4jService } from "./neo4j";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - from Replit Auth blueprint
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user birth data (for natal charts)
  app.patch('/api/auth/user/birth-data', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.updateUserBirthData(userId, req.body);
      res.json(user);
    } catch (error) {
      console.error("Error updating birth data:", error);
      res.status(500).json({ message: "Failed to update birth data" });
    }
  });

  // Readings API
  app.get('/api/readings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const readings = await storage.getUserReadings(userId);
      res.json(readings);
    } catch (error) {
      console.error("Error fetching readings:", error);
      res.status(500).json({ message: "Failed to fetch readings" });
    }
  });

  app.get('/api/readings/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reading = await storage.getReading(req.params.id, userId);
      if (!reading) {
        return res.status(404).json({ message: "Reading not found" });
      }
      res.json(reading);
    } catch (error) {
      console.error("Error fetching reading:", error);
      res.status(500).json({ message: "Failed to fetch reading" });
    }
  });

  app.post('/api/readings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertReadingSchema.parse({ ...req.body, userId });
      const reading = await storage.createReading(validatedData);
      res.json(reading);
    } catch (error) {
      console.error("Error creating reading:", error);
      res.status(500).json({ message: "Failed to create reading" });
    }
  });

  app.patch('/api/readings/:id/privacy', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { isPrivate } = req.body;
      const reading = await storage.updateReadingPrivacy(req.params.id, userId, isPrivate);
      if (!reading) {
        return res.status(404).json({ message: "Reading not found" });
      }
      res.json(reading);
    } catch (error) {
      console.error("Error updating reading privacy:", error);
      res.status(500).json({ message: "Failed to update reading privacy" });
    }
  });

  app.delete('/api/readings/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await storage.deleteReading(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ message: "Reading not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting reading:", error);
      res.status(500).json({ message: "Failed to delete reading" });
    }
  });

  // Charts API
  app.get('/api/charts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const charts = await storage.getUserCharts(userId);
      res.json(charts);
    } catch (error) {
      console.error("Error fetching charts:", error);
      res.status(500).json({ message: "Failed to fetch charts" });
    }
  });

  app.get('/api/charts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const chart = await storage.getChart(req.params.id, userId);
      if (!chart) {
        return res.status(404).json({ message: "Chart not found" });
      }
      res.json(chart);
    } catch (error) {
      console.error("Error fetching chart:", error);
      res.status(500).json({ message: "Failed to fetch chart" });
    }
  });

  app.post('/api/charts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertChartSchema.parse({ ...req.body, userId });
      const chart = await storage.createChart(validatedData);
      res.json(chart);
    } catch (error) {
      console.error("Error creating chart:", error);
      res.status(500).json({ message: "Failed to create chart" });
    }
  });

  app.patch('/api/charts/:id/privacy', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { isPrivate } = req.body;
      const chart = await storage.updateChartPrivacy(req.params.id, userId, isPrivate);
      if (!chart) {
        return res.status(404).json({ message: "Chart not found" });
      }
      res.json(chart);
    } catch (error) {
      console.error("Error updating chart privacy:", error);
      res.status(500).json({ message: "Failed to update chart privacy" });
    }
  });

  app.delete('/api/charts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await storage.deleteChart(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ message: "Chart not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting chart:", error);
      res.status(500).json({ message: "Failed to delete chart" });
    }
  });

  // Neo4j graph endpoints
  app.get('/api/graph/node/:name', async (req, res) => {
    try {
      const { name } = req.params;
      const result = await neo4jService.getNode(decodeURIComponent(name));
      
      if (!result) {
        return res.status(404).json({ message: "Node not found" });
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching node:", error);
      res.status(500).json({ message: "Failed to fetch node from graph" });
    }
  });

  app.get('/api/graph/path', async (req, res) => {
    try {
      const { from, to, maxLength } = req.query;
      
      if (!from || !to) {
        return res.status(400).json({ message: "Both 'from' and 'to' parameters are required" });
      }
      
      const result = await neo4jService.findPath(
        from as string,
        to as string,
        maxLength ? parseInt(maxLength as string) : 5
      );
      
      res.json(result);
    } catch (error) {
      console.error("Error finding path:", error);
      res.status(500).json({ message: "Failed to find path in graph" });
    }
  });

  app.post('/api/graph/search', async (req, res) => {
    try {
      const pattern = req.body;
      const result = await neo4jService.searchPattern(pattern);
      res.json(result);
    } catch (error) {
      console.error("Error searching pattern:", error);
      res.status(500).json({ message: "Failed to search pattern in graph" });
    }
  });
  
  app.get('/api/graph/stats', async (req, res) => {
    try {
      const stats = await neo4jService.getGraphStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting graph stats:", error);
      res.status(500).json({ message: "Failed to get graph statistics" });
    }
  });

  // Swiss Ephemeris endpoints (placeholder for later task)
  app.post('/api/ephemeris/natal-chart', isAuthenticated, async (req, res) => {
    // TODO: Call Swiss Ephemeris API
    res.json({ message: "Swiss Ephemeris integration coming soon" });
  });

  const httpServer = createServer(app);
  return httpServer;
}