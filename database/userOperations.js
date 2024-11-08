import { getDatabase } from "./config.js";

export const userOperations = {
  async addUser(username, name, password, phone, type) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (username, name,password,phone,type) VALUES (?, ?,?,?,?)",
        [username, name, password, phone, type],
        function (err) {
          if (err) {
            // Check if the error is due to the UNIQUE constraint on 'name'
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
              reject(err); // For other types of errors
            }
          } else {
            resolve(this.lastID); // Success: resolve with the new user's ID
          }
        }
      );
    });
  },

  async getUsers() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT id,username,name,password,phone,type FROM users",
        [],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  },

  async updateUser(id, username, name, password, phone, type) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE users SET username = ?, name = ? ,password = ?,phone = ?,type = ? WHERE id = ?",
        [username, name, password, phone, type, id],
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
};
