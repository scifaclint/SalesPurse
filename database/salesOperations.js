import { getDatabase } from "./config.js";

export const salesOperations = {
  async addSale(customerName, phone, paymentMethod) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO sales (customer_name, phone, payment_method) VALUES (?, ?, ?)",
        [customerName, phone, paymentMethod],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  },

  async getSales() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM sales", [], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  },

  async updateSale(id, customerName, phone, paymentMethod) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE sales SET customer_name = ?, phone = ?, payment_method = ? WHERE id = ?",
        [customerName, phone, paymentMethod, id],
        function (err) {
          if (err) reject(err);
          resolve(this.changes);
        }
      );
    });
  },

  async deleteSale(id) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM sales WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        resolve(this.changes);
      });
    });
  },
};
