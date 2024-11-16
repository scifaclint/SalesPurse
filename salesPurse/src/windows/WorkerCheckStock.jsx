import { useState, useEffect } from "react";
import { FiSearch, FiPackage, FiAlertCircle } from "react-icons/fi";
import { useProducts } from "../hooks/useDatabase";
import NavigationTabWorker from "../navigation/NavigationTabsWorke";
const WorkerCheckStock = () => {
  const { products, loading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [stockData, setStockData] = useState({
    items: [],
    lowStock: [],
    outOfStock: []
  });
  const [filteredItems, setFilteredItems] = useState([]);

  // Process products data when it changes
  useEffect(() => {
    if (products) {
      const processedItems = products.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category || 'Uncategorized',
        quantity: parseInt(product.quantity) || 0,
        status: product.status || getStockStatus(product.quantity, product.reorder_point),
        lastUpdated: formatDate(product.last_updated)
      }));

      const lowStockItems = processedItems.filter(
        item => item.status === 'Low Stock'
      );

      const outOfStockItems = processedItems.filter(
        item => item.quantity <= 0
      );

      setStockData({
        items: processedItems,
        lowStock: lowStockItems,
        outOfStock: outOfStockItems
      });
      setFilteredItems(processedItems);
    }
  }, [products]);

  const getStockStatus = (quantity, reorderPoint) => {
    if (quantity <= 0) return 'Out of Stock';
    if (quantity <= reorderPoint) return 'Low Stock';
    return 'In Stock';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    
    if (!value.trim()) {
      setFilteredItems(stockData.items);
      setSearchError("");
      return;
    }

    const matchingProducts = stockData.items.filter(product =>
      product.name.toLowerCase().includes(value.toLowerCase()) ||
      product.category.toLowerCase().includes(value.toLowerCase())
    );

    if (matchingProducts.length === 0) {
      setSearchError("No products found matching your search.");
    } else {
      setSearchError("");
    }

    setFilteredItems(matchingProducts);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 relative overflow-hidden">
      <NavigationTabWorker />
      <main className="flex-1 p-6 overflow-y-auto max-w-[1400px] mx-auto w-full ml-64 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {/* Total Items Card */}
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

            {/* Low Stock Items Card */}
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

            {/* Out of Stock Items Card */}
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

          {/* Search Bar */}
          <div className="mt-6 mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchError && (
              <p className="mt-2 text-red-500 text-sm">{searchError}</p>
            )}
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
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusStyle(item.status)}>
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

// Update status style function to return Tailwind classes
const getStatusStyle = (status) => {
  const baseStyle = "px-3 py-1 text-xs font-semibold rounded-full";
  switch (status) {
    case 'In Stock':
      return `${baseStyle} bg-green-100 text-green-800`;
    case 'Low Stock':
      return `${baseStyle} bg-yellow-100 text-yellow-800`;
    case 'Out of Stock':
      return `${baseStyle} bg-red-100 text-red-800`;
    default:
      return `${baseStyle} bg-gray-100 text-gray-800`;
  }
};

export default WorkerCheckStock;
