import {
  users,
  readings,
  charts,
  type User,
  type UpsertUser,
  type Reading,
  type InsertReading,
  type Chart,
  type InsertChart,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserBirthData(
    userId: string,
    birthData: Partial<UpsertUser>
  ): Promise<User>;
  
  // Reading operations
  createReading(reading: InsertReading): Promise<Reading>;
  getUserReadings(userId: string): Promise<Reading[]>;
  getReading(id: string, userId: string): Promise<Reading | undefined>;
  deleteReading(id: string, userId: string): Promise<boolean>;
  updateReadingPrivacy(
    id: string,
    userId: string,
    isPrivate: boolean
  ): Promise<Reading | undefined>;
  
  // Chart operations
  createChart(chart: InsertChart): Promise<Chart>;
  getUserCharts(userId: string): Promise<Chart[]>;
  getChart(id: string, userId: string): Promise<Chart | undefined>;
  deleteChart(id: string, userId: string): Promise<boolean>;
  updateChartPrivacy(
    id: string,
    userId: string,
    isPrivate: boolean
  ): Promise<Chart | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserBirthData(
    userId: string,
    birthData: Partial<UpsertUser>
  ): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...birthData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  // Reading operations
  async createReading(reading: InsertReading): Promise<Reading> {
    const [newReading] = await db.insert(readings).values(reading).returning();
    return newReading;
  }
  
  async getUserReadings(userId: string): Promise<Reading[]> {
    return await db
      .select()
      .from(readings)
      .where(eq(readings.userId, userId))
      .orderBy(desc(readings.createdAt));
  }
  
  async getReading(id: string, userId: string): Promise<Reading | undefined> {
    const [reading] = await db
      .select()
      .from(readings)
      .where(and(eq(readings.id, id), eq(readings.userId, userId)));
    return reading;
  }
  
  async deleteReading(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(readings)
      .where(and(eq(readings.id, id), eq(readings.userId, userId)))
      .returning({ id: readings.id });
    return result.length > 0;
  }
  
  async updateReadingPrivacy(
    id: string,
    userId: string,
    isPrivate: boolean
  ): Promise<Reading | undefined> {
    const [reading] = await db
      .update(readings)
      .set({ isPrivate })
      .where(and(eq(readings.id, id), eq(readings.userId, userId)))
      .returning();
    return reading;
  }
  
  // Chart operations
  async createChart(chart: InsertChart): Promise<Chart> {
    const [newChart] = await db.insert(charts).values(chart).returning();
    return newChart;
  }
  
  async getUserCharts(userId: string): Promise<Chart[]> {
    return await db
      .select()
      .from(charts)
      .where(eq(charts.userId, userId))
      .orderBy(desc(charts.createdAt));
  }
  
  async getChart(id: string, userId: string): Promise<Chart | undefined> {
    const [chart] = await db
      .select()
      .from(charts)
      .where(and(eq(charts.id, id), eq(charts.userId, userId)));
    return chart;
  }
  
  async deleteChart(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(charts)
      .where(and(eq(charts.id, id), eq(charts.userId, userId)))
      .returning({ id: charts.id });
    return result.length > 0;
  }
  
  async updateChartPrivacy(
    id: string,
    userId: string,
    isPrivate: boolean
  ): Promise<Chart | undefined> {
    const [chart] = await db
      .update(charts)
      .set({ isPrivate })
      .where(and(eq(charts.id, id), eq(charts.userId, userId)))
      .returning();
    return chart;
  }
}

export const storage = new DatabaseStorage();