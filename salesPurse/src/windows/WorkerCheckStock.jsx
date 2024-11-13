import { useState, useEffect } from "react";
import { FiSearch, FiPackage, FiAlertCircle } from "react-icons/fi";
import NavigationTabWorker from "../navigation/NavigationTabsWorke";
import { useProducts } from "../hooks/useDatabase";
import { styled } from "../styles/mainWorkerSection";

const WorkerCheckStock = () => {
  const { products, loading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [stockData, setStockData] = useState({
    items: [],
    lowStock: [],
    outOfStock: []
  });
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // Fetch products from database
        const processedItems = products.map(product => ({
          id: product.id,
          name: product.name,
          quantity: product.quantity,
          status: getProductStatus(product),
          lastUpdated: formatDate(product.last_updated),
          category: product.category,
          reorder_point: product.reorder_point
        }));

        setStockData({
          items: processedItems,
          lowStock: processedItems.filter(item => 
            item.quantity > 0 && item.quantity <= item.reorder_point
          ),
          outOfStock: processedItems.filter(item => item.quantity === 0)
        });

      } catch (err) {
        console.error("Failed to fetch stock data:", err);
      }
    };

    fetchStockData();
  }, [products]);

  // Helper function to get product status
  const getProductStatus = (product) => {
    if (product.quantity === 0) return "Out of Stock";
    if (product.quantity <= product.reorder_point) return "Low Stock";
    return "In Stock";
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      const matchingProducts = products.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.category.toLowerCase().includes(value.toLowerCase())
      );

      if (value && matchingProducts.length === 0) {
        setSearchError("No products found matching your search");
      } else {
        setSearchError("");
      }
    }, 300); // 300ms delay

    setSearchTimeout(timeout);
  };

  // Get filtered items
  const filteredItems = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styled.container} className="bg-gray-100">
      <NavigationTabWorker />
      
      <main style={styled.mainWrapper} className="pt-6">
        <div className="space-y-6 max-w-[1400px] mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Stock Inventory
            </h1>
            
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by product name or category..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  ${searchError ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                  transition-colors duration-200`}
              />
              {searchError && (
                <p className="absolute text-sm text-red-500 mt-1">{searchError}</p>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div style={styled.dashboardGrid}>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <FiPackage className="text-indigo-600 text-xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stockData.items.length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <FiAlertCircle className="text-red-600 text-xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stockData.lowStock.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <FiAlertCircle className="text-amber-600 text-xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Out of Stock</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stockData.outOfStock.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`${styles[`status${item.status.replace(/\s+/g, '')}`]}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkerCheckStock;
