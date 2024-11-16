import { getDatabase } from "./config.js";

export const userOperations = {
  async addUser(userData) {
    
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO users (username, name, password, phone, type, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `;
      const params = [
        userData.username,
        userData.name,
        userData.password,
        userData.phone,
        userData.type || 'worker'
      ];
      db.run(sql, params, function(err) {
        if (err) {
          console.error("Database error:", err);
          reject(err);
        } else {
          resolve({ userId: this.lastID });
        }
      });
    });
  },

  async getUsers() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          id,
          username,
          name,
          password,
          phone,
          type,
          created_at,
          last_login
        FROM users
        ORDER BY created_at DESC`,
        [],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  },

  async getUserById(id) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          id,
          username,
          name,
          password,
          phone,
          type,
          created_at,
          last_login
        FROM users 
        WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  },

  async updateUser(id, updates) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE users SET username = ?, name = ?, password = ?, phone = ?, type = ?
        WHERE id = ?
      `;
      const params = [
        updates.username,
        updates.name,
        updates.password,
        updates.phone,
        updates.type,
        id
      ];
      db.run(sql, params, function(err) {
        if (err) {
          console.error("Update error:", err);
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  },

  async updateLastLogin(id) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      const sql = `UPDATE users SET last_login = datetime('now') WHERE id = ?`;
      db.run(sql, [id], function(err) {
        if (err) {
          console.error("Update last login error:", err);
          reject(err);
        } else {
          resolve({ 
            success: true, 
            changes: this.changes 
          });
        }
      });
    });
  },

  async deleteUser(id) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM users WHERE id = ?`;
      db.run(sql, [id], function(err) {
        if (err) {
          console.error("Delete error:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  async getUsersByType(type) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          id,
          username,
          name,
          phone,
          type,
          created_at,
          last_login
        FROM users 
        WHERE type = ?
        ORDER BY created_at DESC`,
        [type],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  },

  async validateUser(username, password) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          id,
          username,
          name,
          type,
          phone
        FROM users 
        WHERE username = ? AND password = ?`,
        [username, password],
        (err, row) => {
          if (err) reject(err);
          if (row) {
            // Update last login time if user is found
            this.updateLastLogin(row.id)
              .then(() => resolve(row))
              .catch(reject);
          } else {
            resolve(null);
          }
        }
      );
    });
  }
};
