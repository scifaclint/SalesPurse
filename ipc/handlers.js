import { ipcMain } from "electron";
import { userOperations } from "../database/userOperations.js";
import { salesOperations } from "../database/salesOperations.js";
import { productOperations } from "../database/productOperations.js";

export const setupIpcHandlers = () => {
  // User Handlers
  ipcMain.handle("add-user", async (event, userData) => {
    try {
      const result = await userOperations.addUser(userData);
      return { success: true, ...result };
    } catch (error) {
      console.error("Add user error:", error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("get-users", async () => {
    return await userOperations.getUsers();
  });

  ipcMain.handle("update-user", async (event, { id, updates }) => {
    try {
      const result = await userOperations.updateUser(id, updates);
      return { success: true, ...result };
    } catch (error) {
      console.error("Update user error:", error);
      return { success: false, message: error.message };
    }
  });
 ipcMain.handle("update-last-login", async (event, userId) => {
   try {
     const result = await userOperations.updateLastLogin(userId);
     return { success: true, ...result };
   } catch (error) {
     console.error("Update last login error:", error);
     return { success: false, message: error.message };
   }
 });
  ipcMain.handle("delete-user", async (event, { id }) => {
    try {
      await userOperations.deleteUser(id);
      return { success: true };
    } catch (error) {
      console.error("Delete user error:", error);
      return { success: false, message: error.message };
    }
  });

  // Sales Handlers
  ipcMain.handle("add-sale", async (event, saleData) => {
    return await salesOperations.addSale({
      customerName: saleData.customerName,
      customerPhone: saleData.customerPhone,
      totalAmount: saleData.totalAmount,
      discountPercentage: saleData.discount,
      paymentMethod: saleData.paymentMethod,
      workerId: saleData.created_by,
      notes: saleData.message,
      items: saleData.items.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
        unitPrice: item.price
      }))
    });
  });

  ipcMain.handle("add-pending-sale", async (event, saleData) => {
    try {
      return await salesOperations.addPendingSale({
        customerName: saleData.customerName,
        customerPhone: saleData.customerPhone,
        totalAmount: saleData.totalAmount,
        discountPercentage: saleData.discount,
        workerId: saleData.created_by,
        notes: saleData.message,
        items: saleData.items.map(item => ({
          productId: item.product_id,
          quantity: item.quantity,
          unitPrice: item.price
        }))
      });
    } catch (error) {
      console.error("Add pending sale error:", error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("get-sales", async () => {
    return await salesOperations.getSales();
  });

  ipcMain.handle("get-pending-sales", async () => {
    return await salesOperations.getPendingSales();
  });

  ipcMain.handle("complete-pending-sale", async (event, { pendingSaleId, paymentMethod }) => {
    return await salesOperations.completePendingSale(pendingSaleId, paymentMethod);
  });

  ipcMain.handle("delete-pending-sale", async (event, { pendingSaleId }) => {
    return await salesOperations.deletePendingSale(pendingSaleId);
  });

  ipcMain.handle("get-worker-sales", async (event, { workerId }) => {
    return await salesOperations.getWorkerSales(workerId);
  });

  // Product Handlers
  ipcMain.handle("get-products", async () => {
    return await productOperations.getProducts();
  });

  ipcMain.handle("add-product", async (event, productData) => {
    try {
      const result = await productOperations.addProduct(productData);
      return { success: true, result };
    } catch (error) {
      console.error("Add product error:", error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("update-product", async (event, productData) => {
    try {
      const result = await productOperations.updateProduct(productData);
      return { success: true, result };
    } catch (error) {
      console.error("Update product error:", error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("delete-product", async (event, { id }) => {
    try {
      const result = await productOperations.deleteProduct(id);
      return { success: true, result };
    } catch (error) {
      console.error("Delete product error:", error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle("get-low-stock-products", async () => {
    try {
      const result = await productOperations.getLowStockProducts();
      return { success: true, result };
    } catch (error) {
      console.error("Get low stock products error:", error);
      return { success: false, message: error.message };
    }
  });

  // Analytics Handlers
  ipcMain.handle("get-sales-with-revenue", async () => {
    return await salesOperations.getSalesWithDetails();
  });

  ipcMain.handle("get-total-revenue", async () => {
    return await salesOperations.getTotalRevenue();
  });
};
