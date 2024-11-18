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
    db = new sq.Database(dbPath, async (err) => {
      if (err) {
        console.error("Database connection error:", err);
        reject(err);
        return;
      }
      
      console.log("Connected to SQLite database");
      try {
        await createTables();
        await migrateDatabase();
        await addDefaultAdmin();
        resolve(db);
      } catch (error) {
        console.error("Database initialization error:", error);
        reject(error);
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
        type TEXT NOT NULL CHECK (type IN ('admin', 'worker')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )`);

      // Products table
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        category TEXT,
        quantity INTEGER DEFAULT 0,
        base_price DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'In Stock' CHECK (status IN ('In Stock', 'Low Stock', 'Out of Stock')),
        reorder_point INTEGER DEFAULT 5,
        picture BLOB,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Sales table (completed sales only)
      db.run(`CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        customer_phone TEXT,
        total_amount DECIMAL(10,2) NOT NULL,
        discount_percentage DECIMAL(5,2) DEFAULT 0,
        payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'mobile_money')),
        worker_id INTEGER NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (worker_id) REFERENCES users(id)
      )`);

      // Sale Items table
      db.run(`CREATE TABLE IF NOT EXISTS sale_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )`);

      // Pending Sales table
      db.run(`CREATE TABLE IF NOT EXISTS pending_sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        customer_phone TEXT,
        total_amount DECIMAL(10,2) NOT NULL,
        discount_percentage DECIMAL(5,2) DEFAULT 0,
        worker_id INTEGER NOT NULL,
        notes TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (worker_id) REFERENCES users(id)
      )`);

      // Pending Sale Items table
      db.run(`CREATE TABLE IF NOT EXISTS pending_sale_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pending_sale_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (pending_sale_id) REFERENCES pending_sales(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )`);

      // Daily Metrics table
      db.run(`CREATE TABLE IF NOT EXISTS daily_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE UNIQUE NOT NULL,
        total_sales DECIMAL(10,2) DEFAULT 0,
        total_items_sold INTEGER DEFAULT 0,
        number_of_transactions INTEGER DEFAULT 0,
        average_order_value DECIMAL(10,2) DEFAULT 0,
        pending_orders INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Stock Updates table
      db.run(`CREATE TABLE IF NOT EXISTS stock_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        previous_quantity INTEGER NOT NULL,
        new_quantity INTEGER NOT NULL,
        update_type TEXT CHECK (update_type IN ('restock', 'sale', 'adjustment', 'return')),
        updated_by INTEGER NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (updated_by) REFERENCES users(id)
      )`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

export function getDatabase() {
  if (!db) {
    throw new Error("Database not initialized");
  }
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

async function addDefaultAdmin() {
  if (!db) {
    throw new Error("Database not initialized");
  }

  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
      if (err) {
        console.error("Error checking users:", err);
        reject(err);
        return;
      }

      if (row.count === 0) {
        const defaultAdmin = {
          username: "developer",
          name: "developer",
          password: "1234",
          phone: "0240827610",
          type: "admin"
        };

        db.run(
          `INSERT INTO users (username, name, password, phone, type, created_at) 
           VALUES (?, ?, ?, ?, ?, DATETIME('now'))`,
          [
            defaultAdmin.username,
            defaultAdmin.name,
            defaultAdmin.password,
            defaultAdmin.phone,
            defaultAdmin.type
          ],
          (err) => {
            if (err) {
              console.error("Error adding default admin:", err);
              reject(err);
              return;
            }
            console.log("Default admin user created successfully");
            resolve();
          }
        );
      } else {
        console.log("Users already exist, skipping default admin creation");
        resolve();
      }
    });
  });
}

async function migrateDatabase() {
  if (!db) {
    throw new Error("Database not initialized");
  }

  return new Promise((resolve, reject) => {
    // Use db.all() instead of db.get() to get all columns
    db.all("PRAGMA table_info(pending_sales)", (err, rows) => {
      if (err) {
        console.error("Error checking table info:", err);
        reject(err);
        return;
      }

      // Now rows is an array and we can use .some()
      const hasStatusColumn = rows.some(row => row.name === 'status');
      
      if (!hasStatusColumn) {
        // Add the status column if it doesn't exist
        db.run(`
          ALTER TABLE pending_sales 
          ADD COLUMN status TEXT DEFAULT 'pending'
        `, (err) => {
          if (err) {
            console.error("Error adding status column:", err);
            reject(err);
            return;
          }
          console.log("Added status column to pending_sales table");
          resolve();
        });
      } else {
        console.log("Status column already exists");
        resolve();
      }
    });
  });
}

