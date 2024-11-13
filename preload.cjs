const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // User operations
  addUser: (userData) => ipcRenderer.invoke("add-user", userData),
  getUsers: () => ipcRenderer.invoke("get-users"),
  updateUser: (id, updates) => ipcRenderer.invoke("update-user", { id, updates }),
  deleteUser: (id) => ipcRenderer.invoke("delete-user", { id }),

  // Sales operations
  addSale: (saleData) => ipcRenderer.invoke("add-sale", saleData),
  addPendingSale: (saleData) => ipcRenderer.invoke("add-pending-sale", saleData),
  getSales: () => ipcRenderer.invoke("get-sales"),
  getPendingSales: () => ipcRenderer.invoke("get-pending-sales"),
  completePendingSale: (pendingSaleId, paymentMethod) => 
    ipcRenderer.invoke("complete-pending-sale", { pendingSaleId, paymentMethod }),
  deletePendingSale: (pendingSaleId) => 
    ipcRenderer.invoke("delete-pending-sale", { pendingSaleId }),
  getWorkerSales: (workerId) => 
    ipcRenderer.invoke("get-worker-sales", { workerId }),

  // Product operations
  getProducts: () => ipcRenderer.invoke("get-products"),
  addProduct: (productData) => ipcRenderer.invoke("add-product", productData),
  updateProduct: (id, updates) => ipcRenderer.invoke("update-product", { id, updates }),
  deleteProduct: (id) => ipcRenderer.invoke("delete-product", { id }),

  // Analytics operations
  getSalesWithRevenue: () => ipcRenderer.invoke("get-sales-with-revenue"),
  getTotalRevenue: () => ipcRenderer.invoke("get-total-revenue"),
});
