import { getDatabase } from "./config.js";

export const userOperations = {
  async addUser(username, name, password, phone, type) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (
          username, 
          name, 
          password, 
          phone, 
          type, 
          created_at, 
          last_login
        ) VALUES (?, ?, ?, ?, ?, DATETIME('now'), NULL)`,
        [username, name, password, phone, type],
        function (err) {
          if (err) {
            if (
              err.code === "SQLITE_CONSTRAINT" &&
              err.message.includes("UNIQUE constraint failed")
            ) {
              reject(
                new Error(
                  "Username already exists. Please choose another username."
                )
              );
            } else {
              reject(err);
            }
          } else {
            resolve(this.lastID);
          }
        }
      );
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

  async updateUser(id, username, name, password, phone, type) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users 
         SET username = ?, 
             name = ?,
             password = ?,
             phone = ?,
             type = ?
         WHERE id = ?`,
        [username, name, password, phone, type, id],
        function (err) {
          if (err) {
            if (
              err.code === "SQLITE_CONSTRAINT" &&
              err.message.includes("UNIQUE constraint failed")
            ) {
              reject(
                new Error(
                  "Username already exists. Please choose another username."
                )
              );
            } else {
              reject(err);
            }
          } else {
            resolve(this.changes);
          }
        }
      );
    });
  },

  async updateLastLogin(id) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users 
         SET last_login = DATETIME('now')
         WHERE id = ?`,
        [id],
        function (err) {
          if (err) reject(err);
          resolve(this.changes);
        }
      );
    });
  },

  async deleteUser(id) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        resolve(this.changes);
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
