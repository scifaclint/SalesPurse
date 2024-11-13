import { getDatabase } from "./config.js";

export const productOperations = {
  async addProduct(productData) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO products (
        name,
        category,
        quantity,
        base_price,
        status,
        reorder_point,
        picture,
        last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, DATETIME('now'))`;

      const status = productData.quantity > productData.reorder_point ? 
        'In Stock' : 
        productData.quantity > 0 ? 'Low Stock' : 'Out of Stock';

      const params = [
        productData.name,
        productData.category || null,
        productData.quantity || 0,
        productData.base_price,
        status,
        productData.reorder_point || 5,
        productData.picture || null
      ];

      db.run(sql, params, function (err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('UNIQUE')) {
            reject(new Error('Product name already exists'));
          } else {
            console.error("SQL Error:", err);
            reject(err);
          }
        } else {
          resolve(this.lastID);
        }
      });
    });
  },

  async getProducts() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          id,
          name,
          category,
          quantity,
          base_price,
          status,
          reorder_point,
          picture,
          last_updated
        FROM products
        ORDER BY name ASC`, 
        [], 
        (err, rows) => {
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
                  const base64Image = Buffer.from(row.picture).toString("base64");
                  pictureData = `data:image/jpeg;base64,${base64Image}`;
                } catch (imageError) {
                  console.error("Error converting image data:", imageError);
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
        }
      );
    });
  },

  async updateProduct(productData) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      let sql = `UPDATE products SET 
        name = ?,
        category = ?,
        quantity = ?,
        base_price = ?,
        status = ?,
        reorder_point = ?,
        ${productData.picture ? 'picture = ?,' : ''}
        last_updated = DATETIME('now')
        WHERE id = ?`;

      const status = productData.quantity > productData.reorder_point ? 
        'In Stock' : 
        productData.quantity > 0 ? 'Low Stock' : 'Out of Stock';

      let params = [
        productData.name,
        productData.category,
        productData.quantity,
        productData.base_price,
        status,
        productData.reorder_point
      ];

      if (productData.picture) {
        params.push(productData.picture);
      }
      params.push(productData.id);

      db.run(sql, params, function (err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('UNIQUE')) {
            reject(new Error('Product name already exists'));
          } else {
            console.error("SQL Error:", err);
            reject(err);
          }
        } else {
          resolve(this.changes);
        }
      });
    });
  },

  async updateStock(productId, newQuantity, userId, notes = '') {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Get current quantity
        db.get(
          'SELECT quantity FROM products WHERE id = ?',
          [productId],
          (err, row) => {
            if (err) {
              db.run('ROLLBACK');
              reject(err);
              return;
            }

            const previousQuantity = row.quantity;
            const updateType = newQuantity > previousQuantity ? 'restock' : 'adjustment';

            // Update product quantity and status
            db.run(
              `UPDATE products 
               SET quantity = ?,
                   status = CASE 
                     WHEN ? > reorder_point THEN 'In Stock'
                     WHEN ? > 0 THEN 'Low Stock'
                     ELSE 'Out of Stock'
                   END,
                   last_updated = DATETIME('now')
               WHERE id = ?`,
              [newQuantity, newQuantity, newQuantity, productId],
              function(err) {
                if (err) {
                  db.run('ROLLBACK');
                  reject(err);
                  return;
                }

                // Log the stock update
                db.run(
                  `INSERT INTO stock_updates (
                    product_id,
                    previous_quantity,
                    new_quantity,
                    update_type,
                    updated_by,
                    notes,
                    created_at
                  ) VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'))`,
                  [productId, previousQuantity, newQuantity, updateType, userId, notes],
                  function(err) {
                    if (err) {
                      db.run('ROLLBACK');
                      reject(err);
                    } else {
                      db.run('COMMIT');
                      resolve(this.changes);
                    }
                  }
                );
              }
            );
          }
        );
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

  async getLowStockProducts() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM products 
         WHERE status = 'Low Stock' 
         ORDER BY quantity ASC`,
        [],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  },

  async getStockHistory(productId) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          su.*,
          u.name as updated_by_name
         FROM stock_updates su
         LEFT JOIN users u ON su.updated_by = u.id
         WHERE su.product_id = ?
         ORDER BY su.created_at DESC`,
        [productId],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }
};
