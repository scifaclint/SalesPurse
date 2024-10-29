import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, "..", "database.sqlite");
const sq = sqlite3.verbose();

let db;

export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sq.Database(dbPath, (err) => {
      if (err) {
        console.error("Database connection error:", err);
        reject(err);
      } else {
        console.log("Connected to SQLite database");
        createTables()
          .then(() => resolve(db))
          .catch(reject);
      }
    });
  });
}

async function createTables() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                phone TEXT NOT NULL,
                type TEXT NOT NULL
            )`);

      // Sales table
      db.run(`CREATE TABLE IF NOT EXISTS sales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_name TEXT NOT NULL,
                phone TEXT,
                payment_method TEXT,
                item TEXT,
                quantity INTEGER,
                total FLOAT,
                date DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

      // Products table with BLOB for picture
      db.run(
        `CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                quantity INTEGER DEFAULT 0,
                price FLOAT,
                picture BLOB
            )`,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  });
}

export function getDatabase() {
  return db;
}

export function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    } else {
      resolve();
    }
  });
}
