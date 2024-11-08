const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  // User operations
  addUser: (user) => ipcRenderer.invoke("add-user", user),
  getUsers: () => ipcRenderer.invoke("get-users"),
  updateUser: (user) => ipcRenderer.invoke("update-user", user),
  deleteUser: (id) => ipcRenderer.invoke("delete-user", { id }),

  // Sales operations
  addSale: (sale) => ipcRenderer.invoke("add-sale", sale),
  getSales: () => ipcRenderer.invoke("get-sales"),
  updateSale: (sale) => ipcRenderer.invoke("update-sale", sale),
  deleteSale: (id) => ipcRenderer.invoke("delete-sale", { id }),

  // Product operations
  addProduct: async (product) => {
    // If product has an image file, convert it to Buffer
    if (product.picture instanceof File) {
      const arrayBuffer = await product.picture.arrayBuffer();
      product.picture = Buffer.from(arrayBuffer);
    }
    return ipcRenderer.invoke("add-product", product);
  },
  getProducts: () => ipcRenderer.invoke("get-products"),
  updateProduct: async (product) => {
    // If product has an image file, convert it to Buffer
    if (product.picture instanceof File) {
      const arrayBuffer = await product.picture.arrayBuffer();
      product.picture = Buffer.from(arrayBuffer);
    }
    return ipcRenderer.invoke("update-product", product);
  },
  deleteProduct: (id) => ipcRenderer.invoke("delete-product", { id }),

  // Add new methods for sales data
  getSalesWithRevenue: () => ipcRenderer.invoke("get-sales-with-revenue"),
  getTotalRevenue: () => ipcRenderer.invoke("get-total-revenue"),
});
