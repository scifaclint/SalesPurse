import { getDatabase } from "./config.js";

export const productOperations = {
  async addProduct(name, quantity, price, picture) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      const sql = picture
        ? "INSERT INTO products (name, quantity, price, picture) VALUES (?, ?, ?, ?)"
        : "INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)";

      const params = picture
        ? [name, quantity, price, picture]
        : [name, quantity, price];

      db.run(sql, params, function (err) {
        if (err) {
          console.error("SQL Error:", err);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  },

  async getProducts() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
          console.error("Database error:", err);
          reject(err);
        }
        try {
          // Convert BLOB data to base64 string for each product
          const products = rows.map((row) => {
            let pictureData = "/api/placeholder/150/150"; // Default placeholder

            if (row.picture) {
              try {
                // Convert BLOB to base64
                const base64Image = Buffer.from(row.picture).toString("base64");
                pictureData = `data:image/jpeg;base64,${base64Image}`;
              } catch (imageError) {
                console.error("Error converting image data:", imageError);
                // Keep default placeholder if conversion fails
              }
            }

            return {
              ...row,
              picture: pictureData,
            };
          });

          resolve(products);
        } catch (error) {
          console.error("Error processing products:", error);
          reject(error);
        }
      });
    });
  },

  async updateProduct(id, name, quantity, price, picture) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      let sql, params;

      if (picture) {
        sql =
          "UPDATE products SET name = ?, quantity = ?, price = ?, picture = ? WHERE id = ?";
        params = [name, quantity, price, picture, id];
      } else {
        sql =
          "UPDATE products SET name = ?, quantity = ?, price = ? WHERE id = ?";
        params = [name, quantity, price, id];
      }

      db.run(sql, params, function (err) {
        if (err) {
          console.error("SQL Error:", err); // Add logging for debugging
          reject(err);
        } else {
          resolve(this.changes);
        }
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
