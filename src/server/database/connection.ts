import mysql from "mysql2/promise";
import path from "path";
import fs from "fs";
import { config } from "../../lib/config";

// Type definition for SQLite Database (for when using sqlite)
interface SQLiteDatabase {
  all(sql: string, params?: any[]): Promise<any[]>;
  get(sql: string, params?: any[]): Promise<any>;
  run(sql: string, params?: any[]): Promise<{ changes: number; lastID: number }>;
  exec(sql: string): Promise<void>;
  close(): Promise<void>;
}

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
  private db: SQLiteDatabase | mysql.Connection | null = null;
  private dbPath: string;
  private dbType: string;

  constructor() {
    this.dbType = config.database.type;
    // For SQLite development
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
      return this.createDBConnection(this.db);
    }

    try {
      if (this.dbType === "mysql") {
        // For MySQL
        this.db = await mysql.createConnection({
          host: config.database.host || "localhost",
          port: config.database.port || 3306,
          user: config.database.user || "root",
          password: config.database.password || "",
          database: config.database.name || "club_salvadoreno_db",
        });
        console.log("✅ MySQL Database connected successfully");
      } else if (this.dbType === "sqlite") {
        // For SQLite (development)
        const sqlite3 = (await import("sqlite3")).default;
        const { open } = await import("sqlite");
        this.db = await open({
          filename: this.dbPath,
          driver: sqlite3.Database,
        });
        console.log("✅ SQLite Database connected successfully:", this.dbPath);
        // Enable foreign keys for SQLite
        await (this.db as SQLiteDatabase).exec("PRAGMA foreign_keys = ON");
      } else if (this.dbType === "memory") {
        // For in-memory SQLite (development/testing)
        const sqlite3 = (await import("sqlite3")).default;
        const { open } = await import("sqlite");
        this.db = await open({
          filename: ":memory:",
          driver: sqlite3.Database,
        });
        console.log("✅ In-memory SQLite Database connected successfully");
        // Enable foreign keys for SQLite
        await (this.db as SQLiteDatabase).exec("PRAGMA foreign_keys = ON");
      } else {
        throw new Error(`Unsupported database type: ${this.dbType}`);
      }

      return this.createDBConnection(this.db);
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  async initialize(): Promise<void> {
    const db = await this.connect();

    // Read and execute schema - use MySQL schema for MySQL, SQLite for others
    const schemaFile =
      this.dbType === "mysql" ? "schema-mysql.sql" : "schema.sql";
    const schemaPath = path.join(
      process.cwd(),
      "src",
      "server",
      "database",
      schemaFile,
    );
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, "utf8");
      await db.exec(schema);
      console.log(`✅ Database schema initialized (${this.dbType})`);
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

  private createDBConnection(db: SQLiteDatabase | mysql.Connection): DBConnection {
    if (this.dbType === "mysql") {
      const mysqlDb = db as mysql.Connection;
      return {
        async all(sql: string, params?: any[]): Promise<any[]> {
          const [rows] = await mysqlDb.execute(sql, params);
          return rows as any[];
        },
        async get(sql: string, params?: any[]): Promise<any> {
          const [rows] = await mysqlDb.execute(sql, params);
          return (rows as any[])[0];
        },
        async run(
          sql: string,
          params?: any[],
        ): Promise<{ changes: number; lastID: number }> {
          const [result] = await mysqlDb.execute(sql, params);
          const resultData = result as any;
          return {
            changes: resultData.affectedRows || 0,
            lastID: resultData.insertId || 0,
          };
        },
        async exec(sql: string): Promise<void> {
          // Split SQL into individual statements and execute them one by one
          const statements = sql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

          for (const statement of statements) {
            if (statement.trim()) {
              try {
                await mysqlDb.query(statement);
              } catch (error: any) {
                // Ignore "Duplicate key name" errors for indexes that already exist
                if (error.code === 'ER_DUP_KEYNAME' && statement.includes('CREATE INDEX')) {
                  console.log(`⚠️  Index already exists, skipping: ${statement.split(' ')[2]}`);
                  continue;
                }
                // Re-throw other errors
                throw error;
              }
            }
          }
        },
        async close(): Promise<void> {
          await mysqlDb.end();
        },
      };
    } else {
      // SQLite
      return db as SQLiteDatabase;
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      if (this.dbType === "mysql") {
        await (this.db as mysql.Connection).end();
      } else {
        await (this.db as SQLiteDatabase).close();
      }
      this.db = null;
      console.log("✅ Database connection closed");
    }
  }

  getDb(): SQLiteDatabase | mysql.Connection {
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

// Create a lazy database connection for models
let dbConnection: DBConnection | null = null;

export const db = {
  async get(): Promise<DBConnection> {
    if (!dbConnection) {
      dbConnection = await dbManager.connect();
    }
    return dbConnection;
  },

  async all(sql: string, params?: any[]): Promise<any[]> {
    const conn = await this.get();
    return conn.all(sql, params);
  },

  async run(
    sql: string,
    params?: any[],
  ): Promise<{ changes: number; lastID: number }> {
    const conn = await this.get();
    return conn.run(sql, params);
  },

  async exec(sql: string): Promise<void> {
    const conn = await this.get();
    return conn.exec(sql);
  },
};
