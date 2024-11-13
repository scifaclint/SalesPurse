import { ipcMain } from "electron";
import { userOperations } from "../database/userOperations.js";
import { salesOperations } from "../database/salesOperations.js";
import { productOperations } from "../database/productOperations.js";

export const setupIpcHandlers = () => {
  // User Handlers
  ipcMain.handle("add-user", async (event, userData) => {
    return await userOperations.addUser(userData);
  });

  ipcMain.handle("get-users", async () => {
    return await userOperations.getUsers();
  });

  ipcMain.handle("update-user", async (event, { id, updates }) => {
    return await userOperations.updateUser(id, updates);
  });

  ipcMain.handle("delete-user", async (event, { id }) => {
    return await userOperations.deleteUser(id);
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
    return await productOperations.addProduct(productData);
  });

  ipcMain.handle("update-product", async (event, { id, updates }) => {
    return await productOperations.updateProduct(id, updates);
  });

  ipcMain.handle("delete-product", async (event, { id }) => {
    return await productOperations.deleteProduct(id);
  });

  // Analytics Handlers
  ipcMain.handle("get-sales-with-revenue", async () => {
    return await salesOperations.getSalesWithDetails();
  });

  ipcMain.handle("get-total-revenue", async () => {
    return await salesOperations.getTotalRevenue();
  });
};
