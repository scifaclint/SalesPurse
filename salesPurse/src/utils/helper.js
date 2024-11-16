import Papa from 'papaparse'; // Make sure to install papaparse

// Function to handle CSV import
export const importDatabaseFromCSV = async (file) => {
  try {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const { data } = results;

          // Import products
          if (file.name.includes('products')) {
            // Using your existing IPC channel for database operations
            const result = await window.electron.ipcRenderer.invoke('import-products', data);
            if (!result.success) {
              throw new Error(result.message);
            }
          }

          // Import sales
          if (file.name.includes('sales')) {
            const result = await window.electron.ipcRenderer.invoke('import-sales', data);
            if (!result.success) {
              throw new Error(result.message);
            }
          }

          resolve({ success: true, message: 'Import completed successfully' });
        },
        error: (error) => {
          reject({ success: false, message: error.message });
        }
      });
    });
  } catch (error) {
    throw new Error(`Import failed: ${error.message}`);
  }
};

// Function to backup database to CSV
export const backupDatabaseToCSV = async () => {
  try {
    // Get products data
    const products = await window.electron.ipcRenderer.invoke('get-all-products');
    
    // Get sales data
    const sales = await window.electron.ipcRenderer.invoke('get-all-sales');

    // Prepare sales data (stringify items array)
    const preparedSales = sales.map(sale => ({
      ...sale,
      items: JSON.stringify(sale.items)
    }));

    // Convert to CSV
    const productsCSV = Papa.unparse(products);
    const salesCSV = Papa.unparse(preparedSales);

    // Create and download products CSV
    const productsBlob = new Blob([productsCSV], { type: 'text/csv' });
    const productsURL = window.URL.createObjectURL(productsBlob);
    const productsLink = document.createElement('a');
    productsLink.href = productsURL;
    productsLink.setAttribute('download', `products_backup_${new Date().toISOString()}.csv`);
    document.body.appendChild(productsLink);
    productsLink.click();
    productsLink.remove();
    window.URL.revokeObjectURL(productsURL);

    // Create and download sales CSV
    const salesBlob = new Blob([salesCSV], { type: 'text/csv' });
    const salesURL = window.URL.createObjectURL(salesBlob);
    const salesLink = document.createElement('a');
    salesLink.href = salesURL;
    salesLink.setAttribute('download', `sales_backup_${new Date().toISOString()}.csv`);
    document.body.appendChild(salesLink);
    salesLink.click();
    salesLink.remove();
    window.URL.revokeObjectURL(salesURL);

    return { success: true, message: 'Backup completed successfully' };
  } catch (error) {
    throw new Error(`Backup failed: ${error.message}`);
  }
};
