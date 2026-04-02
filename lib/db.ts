import path from "node:path";
import fs from "node:fs";
import Database from "better-sqlite3";

interface GlobalSQLite {
  db: Database.Database | null;
  initialized: boolean;
}

declare global {
  var sqlite: GlobalSQLite | undefined;
}

const sqliteDefaultPath = path.join(process.cwd(), "data", "subscriptions.sqlite");
const sqlitePathFromEnv = process.env.SQLITE_PATH;
const databaseUrl = process.env.DATABASE_URL;

const dbPathInput =
  sqlitePathFromEnv && sqlitePathFromEnv.trim().length > 0
    ? sqlitePathFromEnv
    : databaseUrl && !/^mongodb(\+srv)?:\/\//i.test(databaseUrl)
      ? databaseUrl
      : sqliteDefaultPath;

const sqlitePath = path.isAbsolute(dbPathInput)
  ? dbPathInput
  : path.join(process.cwd(), dbPathInput);

const cached = global.sqlite ?? { db: null, initialized: false };
if (!global.sqlite) {
  global.sqlite = cached;
}

function initializeSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS domains (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      domain TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_domains_expires_at ON domains(expires_at);
  `);
}

export function connectDB() {
  if (!cached.db) {
    fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });
    cached.db = new Database(sqlitePath);
    cached.db.pragma("journal_mode = WAL");
    cached.db.pragma("foreign_keys = ON");
  }

  if (!cached.initialized) {
    initializeSchema(cached.db);
    cached.initialized = true;
  }

  return cached.db;
}

export default connectDB;
