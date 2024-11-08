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
                username TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL,
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
                product TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                revenue FLOAT NOT NULL,
                worker_id INTEGER NOT NULL,
                worker_name TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (worker_id) REFERENCES users(id)
            )`);

      // Products table with BLOB for picture
      // Database table creation
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

      // After creating tables, add some initial sales data
      db.run(`INSERT OR IGNORE INTO sales (product, quantity, revenue, customer_name, phone, payment_method) VALUES 
        ('Widget A', 100, 5000, 'John Doe', '+233123456789', 'cash'),
        ('Gadget B', 50, 7500, 'Jane Smith', '+233987654321', 'card'),
        ('Doohickey C', 200, 10000, 'Bob Johnson', '+233456789123', 'cash'),
        ('Thingamajig D', 75, 3750, 'Alice Brown', '+233789123456', 'mobile_money')`);
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
