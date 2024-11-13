import { getDatabase } from "./config.js";

export const salesOperations = {
  // Add a completed sale
  async addSale({ customerName, customerPhone, totalAmount, discountPercentage, paymentMethod, workerId, notes, items }) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        // Insert main sale record
        db.run(
          `INSERT INTO sales (
            customer_name,
            customer_phone,
            total_amount,
            discount_percentage,
            payment_method,
            worker_id,
            notes,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, DATETIME('now'))`,
          [customerName, customerPhone, totalAmount, discountPercentage, paymentMethod, workerId, notes],
          function(err) {
            if (err) {
              db.run("ROLLBACK");
              reject(err);
              return;
            }

            const saleId = this.lastID;
            const stmt = db.prepare(
              `INSERT INTO sale_items (
                sale_id,
                product_id,
                quantity,
                unit_price
              ) VALUES (?, ?, ?, ?)`
            );

            // Insert sale items and update product quantities
            try {
              items.forEach(item => {
                stmt.run([saleId, item.productId, item.quantity, item.unitPrice]);
                
                // Update product quantity
                db.run(
                  `UPDATE products 
                   SET quantity = quantity - ?,
                       status = CASE 
                         WHEN (quantity - ?) > reorder_point THEN 'In Stock'
                         WHEN (quantity - ?) > 0 THEN 'Low Stock'
                         ELSE 'Out of Stock'
                       END,
                       last_updated = DATETIME('now')
                   WHERE id = ?`,
                  [item.quantity, item.quantity, item.quantity, item.productId]
                );

                // Log stock update
                db.run(
                  `INSERT INTO stock_updates (
                    product_id,
                    previous_quantity,
                    new_quantity,
                    update_type,
                    updated_by,
                    notes,
                    created_at
                  ) VALUES (
                    ?,
                    (SELECT quantity + ? FROM products WHERE id = ?),
                    (SELECT quantity FROM products WHERE id = ?),
                    'sale',
                    ?,
                    'Sale transaction',
                    DATETIME('now')
                  )`,
                  [item.productId, item.quantity, item.productId, item.productId, workerId]
                );
              });

              stmt.finalize();
              db.run("COMMIT", (err) => {
                if (err) reject(err);
                else resolve(saleId);
              });
            } catch (error) {
              db.run("ROLLBACK");
              reject(error);
            }
          }
        );
      });
    });
  },

  // Add a pending sale
  async addPendingSale({ customerName, customerPhone, totalAmount, discountPercentage, workerId, notes, items }) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        db.run(
          `INSERT INTO pending_sales (
            customer_name,
            customer_phone,
            total_amount,
            discount_percentage,
            worker_id,
            notes,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'))`,
          [customerName, customerPhone, totalAmount, discountPercentage, workerId, notes],
          function(err) {
            if (err) {
              db.run("ROLLBACK");
              reject(err);
              return;
            }

            const pendingSaleId = this.lastID;
            const stmt = db.prepare(
              `INSERT INTO pending_sale_items (
                pending_sale_id,
                product_id,
                quantity,
                unit_price
              ) VALUES (?, ?, ?, ?)`
            );

            try {
              items.forEach(item => {
                stmt.run([pendingSaleId, item.productId, item.quantity, item.unitPrice]);
              });

              stmt.finalize();
              db.run("COMMIT", (err) => {
                if (err) reject(err);
                else resolve(pendingSaleId);
              });
            } catch (error) {
              db.run("ROLLBACK");
              reject(error);
            }
          }
        );
      });
    });
  },

  // Convert pending sale to completed sale
  async completePendingSale(pendingSaleId, paymentMethod) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        // Get pending sale details
        db.get(
          `SELECT * FROM pending_sales WHERE id = ?`,
          [pendingSaleId],
          async (err, pendingSale) => {
            if (err) {
              db.run("ROLLBACK");
              reject(err);
              return;
            }

            try {
              // Get pending sale items
              const items = await new Promise((resolve, reject) => {
                db.all(
                  `SELECT * FROM pending_sale_items WHERE pending_sale_id = ?`,
                  [pendingSaleId],
                  (err, items) => {
                    if (err) reject(err);
                    else resolve(items);
                  }
                );
              });

              // Add as completed sale
              await this.addSale({
                customerName: pendingSale.customer_name,
                customerPhone: pendingSale.customer_phone,
                totalAmount: pendingSale.total_amount,
                discountPercentage: pendingSale.discount_percentage,
                paymentMethod,
                workerId: pendingSale.worker_id,
                notes: pendingSale.notes,
                items
              });

              // Delete pending sale
              db.run(
                `DELETE FROM pending_sales WHERE id = ?`,
                [pendingSaleId],
                (err) => {
                  if (err) {
                    db.run("ROLLBACK");
                    reject(err);
                  } else {
                    db.run("COMMIT");
                    resolve();
                  }
                }
              );
            } catch (error) {
              db.run("ROLLBACK");
              reject(error);
            }
          }
        );
      });
    });
  },

  // Get all completed sales
  async getSales() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          s.*,
          u.name as worker_name,
          GROUP_CONCAT(
            json_object(
              'product_id', si.product_id,
              'product_name', p.name,
              'quantity', si.quantity,
              'unit_price', si.unit_price
            )
          ) as items
        FROM sales s
        LEFT JOIN users u ON s.worker_id = u.id
        LEFT JOIN sale_items si ON s.id = si.sale_id
        LEFT JOIN products p ON si.product_id = p.id
        GROUP BY s.id
        ORDER BY s.created_at DESC`,
        [],
        (err, rows) => {
          if (err) reject(err);
          else {
            // Parse the items JSON string for each sale
            const sales = rows.map(row => ({
              ...row,
              items: JSON.parse(`[${row.items}]`)
            }));
            resolve(sales);
          }
        }
      );
    });
  },

  // Get all pending sales
  async getPendingSales() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          ps.*,
          u.name as worker_name,
          GROUP_CONCAT(
            json_object(
              'product_id', psi.product_id,
              'product_name', p.name,
              'quantity', psi.quantity,
              'unit_price', psi.unit_price
            )
          ) as items
        FROM pending_sales ps
        LEFT JOIN users u ON ps.worker_id = u.id
        LEFT JOIN pending_sale_items psi ON ps.id = psi.pending_sale_id
        LEFT JOIN products p ON psi.product_id = p.id
        GROUP BY ps.id
        ORDER BY ps.created_at DESC`,
        [],
        (err, rows) => {
          if (err) reject(err);
          else {
            const pendingSales = rows.map(row => ({
              ...row,
              items: JSON.parse(`[${row.items}]`)
            }));
            resolve(pendingSales);
          }
        }
      );
    });
  },

  // Delete a pending sale
  async deletePendingSale(pendingSaleId) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM pending_sales WHERE id = ?",
        [pendingSaleId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  },

  async getSalesWithDetails() {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          s.*,
          u.name as worker_name
        FROM sales s
        LEFT JOIN users u ON s.worker_id = u.id
        ORDER BY s.date DESC
      `, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  async getWorkerSales(workerId) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM sales WHERE worker_id = ? ORDER BY date DESC",
        [workerId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
};
