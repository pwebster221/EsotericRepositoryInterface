import neo4j, { Driver, Session, Result } from 'neo4j-driver';

// Neo4j connection configuration
const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const NEO4J_USERNAME = process.env.NEO4J_USERNAME || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || '';

class Neo4jService {
  private driver: Driver | null = null;

  constructor() {
    // Initialize connection on first use
  }

  private async connect() {
    if (!this.driver && NEO4J_PASSWORD) {
      try {
        this.driver = neo4j.driver(
          NEO4J_URI,
          neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
        );
        
        // Verify connectivity
        await this.driver.verifyConnectivity();
        console.log('Connected to Neo4j database');
      } catch (error) {
        console.error('Failed to connect to Neo4j:', error);
        this.driver = null;
      }
    }
    return this.driver;
  }

  async getSession(): Promise<Session | null> {
    const driver = await this.connect();
    return driver ? driver.session() : null;
  }

  // Get node by name/label
  async getNode(name: string) {
    const session = await this.getSession();
    if (!session) {
      return { error: 'Neo4j database not connected. Please configure Neo4j credentials.' };
    }

    try {
      const result = await session.run(
        `MATCH (n) 
         WHERE n.name = $name OR n.label = $name OR n.title = $name
         RETURN n, labels(n) as labels
         LIMIT 1`,
        { name }
      );

      if (result.records.length === 0) {
        return null;
      }

      const record = result.records[0];
      const node = record.get('n');
      const labels = record.get('labels');

      // Get related nodes
      const relatedResult = await session.run(
        `MATCH (n)-[r]-(related)
         WHERE n.name = $name OR n.label = $name OR n.title = $name
         RETURN DISTINCT related, type(r) as relationship, labels(related) as labels
         LIMIT 20`,
        { name }
      );

      const relatedNodes = relatedResult.records.map(rec => ({
        node: rec.get('related').properties,
        relationship: rec.get('relationship'),
        labels: rec.get('labels')
      }));

      return {
        node: node.properties,
        labels,
        relatedNodes
      };
    } catch (error) {
      console.error('Neo4j query error:', error);
      return { error: 'Failed to query Neo4j database' };
    } finally {
      await session.close();
    }
  }

  // Find shortest path between two nodes
  async findPath(fromNode: string, toNode: string, maxLength: number = 5) {
    const session = await this.getSession();
    if (!session) {
      return { error: 'Neo4j database not connected. Please configure Neo4j credentials.' };
    }

    try {
      const result = await session.run(
        `MATCH path = shortestPath(
          (from)-[*..${maxLength}]-(to)
         )
         WHERE (from.name = $fromNode OR from.label = $fromNode OR from.title = $fromNode)
           AND (to.name = $toNode OR to.label = $toNode OR to.title = $toNode)
         RETURN path, 
                [n IN nodes(path) | {node: n, labels: labels(n)}] as nodes,
                [r IN relationships(path) | type(r)] as relationships`,
        { fromNode, toNode }
      );

      if (result.records.length === 0) {
        return { 
          message: 'No path found between these nodes',
          fromNode,
          toNode 
        };
      }

      const record = result.records[0];
      const nodes = record.get('nodes').map((n: any) => ({
        properties: n.node.properties,
        labels: n.labels
      }));
      const relationships = record.get('relationships');

      return {
        path: {
          nodes,
          relationships,
          length: relationships.length
        }
      };
    } catch (error) {
      console.error('Neo4j path query error:', error);
      return { error: 'Failed to find path in Neo4j database' };
    } finally {
      await session.close();
    }
  }

  // Pattern search - find nodes matching specific patterns
  async searchPattern(pattern: {
    nodeType?: string;
    properties?: Record<string, any>;
    relationships?: string[];
    connectedTo?: string;
    limit?: number;
  }) {
    const session = await this.getSession();
    if (!session) {
      return { error: 'Neo4j database not connected. Please configure Neo4j credentials.' };
    }

    try {
      // Build dynamic Cypher query based on pattern
      let query = 'MATCH (n';
      const params: any = {};
      
      if (pattern.nodeType) {
        query += `:${pattern.nodeType}`;
      }
      query += ')';

      // Add property filters
      if (pattern.properties) {
        const whereClause = Object.entries(pattern.properties)
          .map(([key, value], index) => {
            params[`prop${index}`] = value;
            return `n.${key} = $prop${index}`;
          })
          .join(' AND ');
        query += ` WHERE ${whereClause}`;
      }

      // Add relationship filters
      if (pattern.relationships && pattern.relationships.length > 0) {
        const relPattern = pattern.relationships.map(r => `:${r}`).join('|');
        query = `MATCH (n)-[r${relPattern}]-(connected) ` + query.substring(6);
      }

      // Add connection filter
      if (pattern.connectedTo) {
        query += pattern.properties ? ' AND' : ' WHERE';
        query += ` EXISTS {
          MATCH (n)-[]-(target)
          WHERE target.name = $connectedTo OR target.label = $connectedTo
        }`;
        params.connectedTo = pattern.connectedTo;
      }

      query += ' RETURN DISTINCT n, labels(n) as labels';
      query += ` LIMIT ${pattern.limit || 50}`;

      const result = await session.run(query, params);

      const nodes = result.records.map(record => ({
        properties: record.get('n').properties,
        labels: record.get('labels')
      }));

      return { nodes, query };
    } catch (error) {
      console.error('Neo4j pattern search error:', error);
      return { error: 'Failed to search pattern in Neo4j database' };
    } finally {
      await session.close();
    }
  }

  // Get graph statistics
  async getGraphStats() {
    const session = await this.getSession();
    if (!session) {
      return { error: 'Neo4j database not connected' };
    }

    try {
      const nodeCountResult = await session.run(
        'MATCH (n) RETURN count(n) as nodeCount'
      );
      const nodeCount = nodeCountResult.records[0].get('nodeCount').toNumber();

      const relCountResult = await session.run(
        'MATCH ()-[r]-() RETURN count(r)/2 as relCount'
      );
      const relCount = relCountResult.records[0].get('relCount');

      const labelsResult = await session.run(
        'CALL db.labels() YIELD label RETURN collect(label) as labels'
      );
      const labels = labelsResult.records[0].get('labels');

      const typesResult = await session.run(
        'CALL db.relationshipTypes() YIELD relationshipType RETURN collect(relationshipType) as types'
      );
      const relationshipTypes = typesResult.records[0].get('types');

      return {
        nodeCount,
        relationshipCount: relCount,
        labels,
        relationshipTypes
      };
    } catch (error) {
      console.error('Neo4j stats error:', error);
      return { error: 'Failed to get graph statistics' };
    } finally {
      await session.close();
    }
  }

  async close() {
    if (this.driver) {
      await this.driver.close();
      this.driver = null;
    }
  }
}

export const neo4jService = new Neo4jService();