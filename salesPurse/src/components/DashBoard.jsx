import { useState, useEffect } from 'react';
import { FiDatabase, FiUpload, FiAlertTriangle, FiPackage, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { useProducts, useSales } from '../hooks/useDatabase';

const Dashboard = () => {
  const { products, getLowStockProducts } = useProducts();
  const { sales } = useSales();
  const [dashboardData, setDashboardData] = useState({
    totalItems: 0,
    totalStockValue: 0,
    topSellingPart: '',
    lowStockAlerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calculateDashboardData = async () => {
      try {
        setLoading(true);

        // Get low stock products
        const lowStockItems = await getLowStockProducts();

        // Calculate total items and stock value
        const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
        const totalStockValue = products.reduce((sum, product) => 
          sum + (product.quantity * product.base_price), 0
        );

        // Calculate top selling product
        const productSales = {};
        sales.forEach(sale => {
          if (sale.status === 'completed') {
            sale.items.forEach(item => {
              if (!productSales[item.product_id]) {
                productSales[item.product_id] = {
                  name: item.product_name,
                  quantity: 0
                };
              }
              productSales[item.product_id].quantity += item.quantity;
            });
          }
        });

        const topSeller = Object.values(productSales)
          .sort((a, b) => b.quantity - a.quantity)[0];

        setDashboardData({
          totalItems,
          totalStockValue,
          topSellingPart: topSeller?.name || 'No sales yet',
          lowStockAlerts: lowStockItems
        });

      } catch (err) {
        console.error('Error calculating dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    calculateDashboardData();
  }, [products, sales, getLowStockProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Sales Dashboard
        </h1>
        
        <div className="flex gap-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors duration-200">
            <FiUpload className="mr-2" />
            Import
          </button>

          <button className="flex-1 lg:flex-none flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200">
            <FiDatabase className="mr-2" />
            Backup
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Items in Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.totalItems.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiPackage className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">
                GH₵{dashboardData.totalStockValue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Top Selling Part</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.topSellingPart}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiTrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Alerts</p>
            <div className="p-3 bg-red-100 rounded-full">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          {dashboardData.lowStockAlerts.length > 0 ? (
            <div className="space-y-2">
              {dashboardData.lowStockAlerts.map((item, index) => (
                <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <h3 className="text-red-800 font-medium">Low Stock</h3>
                  <p className="text-red-600 text-sm mt-1">
                    {item.name} ({item.quantity} remaining)
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-800">All stock levels are healthy</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
