import { ipcMain } from "electron";
import { userOperations } from "../database/userOperations.js";
import { salesOperations } from "../database/salesOperations.js";
import { productOperations } from "../database/productOperations.js";

export function setupIpcHandlers() {
  // Users
  ipcMain.handle("add-user", async (event, { name, password,phone,type }) => {
    return await userOperations.addUser(name, password,phone,type);
  });

  ipcMain.handle("get-users", async () => {
    return await userOperations.getUsers();
  });

  ipcMain.handle("update-user", async (event, { id, name, password }) => {
    return await userOperations.updateUser(id, name, password);
  });

  ipcMain.handle("delete-user", async (event, { id }) => {
    return await userOperations.deleteUser(id);
  });

  // Sales
  ipcMain.handle(
    "add-sale",
    async (event, { customerName, phone, paymentMethod }) => {
      return await salesOperations.addSale(customerName, phone, paymentMethod);
    }
  );

  ipcMain.handle("get-sales", async () => {
    return await salesOperations.getSales();
  });

  ipcMain.handle(
    "update-sale",
    async (event, { id, customerName, phone, paymentMethod }) => {
      return await salesOperations.updateSale(
        id,
        customerName,
        phone,
        paymentMethod
      );
    }
  );

  ipcMain.handle("delete-sale", async (event, { id }) => {
    return await salesOperations.deleteSale(id);
  });

  // Products
  ipcMain.handle("add-product", async (event, { name, quantity, picture }) => {
    return await productOperations.addProduct(name, quantity, picture);
  });

  ipcMain.handle("get-products", async () => {
    return await productOperations.getProducts();
  });

  ipcMain.handle(
    "update-product",
    async (event, { id, name, quantity, picture }) => {
      return await productOperations.updateProduct(id, name, quantity, picture);
    }
  );

  ipcMain.handle("delete-product", async (event, { id }) => {
    return await productOperations.deleteProduct(id);
  });
}
