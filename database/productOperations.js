import { getDatabase } from "./config.js";

export const productOperations = {
  async addProduct(name, quantity, price, picture) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO products (name, quantity, price,picture) VALUES (?, ?, ?,?)",
        [name, quantity, picture, price],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  },

  async getProducts() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  },

  async updateProduct(id, name, quantity, price, picture) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      const sql = picture
        ? "UPDATE products SET name = ?, quantity = ?, price = ?, picture = ? WHERE id = ?"
        : "UPDATE products SET name = ?, quantity = ?,price = ?, WHERE id = ?";
      const params = picture
        ? [name, quantity, price, picture, id]
        : [name, quantity, price, picture, id];

      db.run(sql, params, function (err) {
        if (err) reject(err);
        resolve(this.changes);
      });
    });
  },

  async deleteProduct(id) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        resolve(this.changes);
      });
    });
  },
};
