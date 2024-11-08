import { getDatabase } from "./config.js";

export const salesOperations = {
  async addSale({ customerName, phone, paymentMethod, products, workerId, workerName }) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        
        try {
          const stmt = db.prepare(`
            INSERT INTO sales (
              customer_name, phone, payment_method, product, 
              quantity, revenue, worker_id, worker_name, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          // Insert each product as a separate sale entry
          products.forEach(product => {
            stmt.run([
              customerName,
              phone,
              paymentMethod,
              product.name,
              product.quantity,
              product.revenue,
              workerId,
              workerName,
              'pending'
            ]);
          });

          stmt.finalize();
          db.run("COMMIT", (err) => {
            if (err) reject(err);
            else resolve();
          });
        } catch (error) {
          db.run("ROLLBACK");
          reject(error);
        }
      });
    });
  },

  async completeSale(saleId) {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE sales SET status = 'completed' WHERE id = ?",
        [saleId],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
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
