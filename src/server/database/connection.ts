import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";
import fs from "fs";
import { config } from "../../lib/config";

export interface DBConnection {
  all(sql: string, params?: any[]): Promise<any[]>;
  get(sql: string, params?: any[]): Promise<any>;
  run(
    sql: string,
    params?: any[],
  ): Promise<{ changes: number; lastID: number }>;
  exec(sql: string): Promise<void>;
  close(): Promise<void>;
}

class DatabaseManager {
  private db: Database | null = null;
  private dbPath: string;

  constructor() {
    // For development, use SQLite
    this.dbPath = path.join(process.cwd(), "data", "club_salvadoreno.db");
    this.ensureDataDirectory();
  }

  private ensureDataDirectory() {
    const dataDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  async connect(): Promise<DBConnection> {
    if (this.db) {
      return this.db;
    }

    try {
      // For SQLite (development)
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database,
      });

      console.log("✅ Database connected successfully:", this.dbPath);

      // Enable foreign keys
      await this.db.exec("PRAGMA foreign_keys = ON");

      return this.db;
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  async initialize(): Promise<void> {
    const db = await this.connect();

    // Read and execute schema
    const schemaPath = path.join(
      process.cwd(),
      "src",
      "server",
      "database",
      "schema.sql",
    );
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, "utf8");
      await db.exec(schema);
      console.log("✅ Database schema initialized");
    }

    // Read and execute seed data
    const seedPath = path.join(
      process.cwd(),
      "src",
      "server",
      "database",
      "seed.sql",
    );
    if (fs.existsSync(seedPath)) {
      const seed = fs.readFileSync(seedPath, "utf8");
      await db.exec(seed);
      console.log("✅ Database seeded with initial data");
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      console.log("✅ Database connection closed");
    }
  }

  getDb(): Database {
    if (!this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }
}

// Export singleton instance
export const dbManager = new DatabaseManager();

// Helper function to get database connection
export async function getDatabase(): Promise<DBConnection> {
  return await dbManager.connect();
}
