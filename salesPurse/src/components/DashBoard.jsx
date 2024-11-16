import { useState, useEffect } from 'react';
import { FiDatabase, FiUpload, FiAlertTriangle, FiPackage, FiDollarSign, FiTrendingUp, FiX, FiCheck } from 'react-icons/fi';
import { useProducts, useSales } from '../hooks/useDatabase';
import { importDatabaseFromCSV, backupDatabaseToCSV } from '../utils/helper';
import LoadingSpinner from './LoadingSpinner';

const ResultModal = ({ isOpen, onClose, success, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <div className={`p-3 ${success ? 'bg-green-100' : 'bg-red-100'} rounded-full mb-4`}>
            {success ? (
              <FiCheck className={`w-6 h-6 ${success ? 'text-green-600' : 'text-red-600'}`} />
            ) : (
              <FiX className="w-6 h-6 text-red-600" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {success ? 'Success' : 'Error'}
          </h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={onClose}
            className={`px-4 py-2 ${
              success ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            } text-white rounded-lg transition-colors duration-200`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { products, loading: productsLoading } = useProducts();
  const { sales, loading: salesLoading } = useSales();
  const [dashboardData, setDashboardData] = useState({
    totalItems: 0,
    totalStockValue: 0,
    topSellingPart: 'No sales yet',
    lowStockAlerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    success: false,
    message: ''
  });

  useEffect(() => {
    const calculateDashboardData = () => {
      try {
        if (!products || !sales) return;

        // Calculate low stock items
        const lowStockItems = products
          .filter(product => product.quantity <= (product.reorder_point || 10))
          .map(product => ({
            name: product.name,
            quantity: product.quantity
          }));

        // Calculate total items and stock value
        const totalItems = products.reduce((sum, product) => sum + (product.quantity || 0), 0);
        const totalStockValue = products.reduce((sum, product) => 
          sum + ((product.quantity || 0) * (product.base_price || 0)), 0
        );

        // Calculate top selling product
        const productSales = {};
        sales.forEach(sale => {
          if (sale.status === 'completed') {
            sale.items?.forEach(item => {
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

    if (!productsLoading && !salesLoading) {
      calculateDashboardData();
    }
  }, [products, sales, productsLoading, salesLoading]);

  const handleImport = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv';
      input.multiple = true;
      
      input.onchange = async (e) => {
        setIsProcessing(true);
        try {
          const files = Array.from(e.target.files);
          for (const file of files) {
            await importDatabaseFromCSV(file);
          }
          calculateDashboardData();
          setModalState({
            isOpen: true,
            success: true,
            message: 'Database imported successfully!'
          });
        } catch (error) {
          setModalState({
            isOpen: true,
            success: false,
            message: `Import failed: ${error.message}`
          });
        } finally {
          setIsProcessing(false);
        }
      };

      input.click();
    } catch (error) {
      setModalState({
        isOpen: true,
        success: false,
        message: error.message
      });
    }
  };

  const handleBackup = async () => {
    setIsProcessing(true);
    try {
      await backupDatabaseToCSV();
      setModalState({
        isOpen: true,
        success: true,
        message: 'Database backup completed successfully!'
      });
    } catch (error) {
      setModalState({
        isOpen: true,
        success: false,
        message: `Backup failed: ${error.message}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || productsLoading || salesLoading) {
    return <LoadingSpinner fullScreen text="Loading dashboard data..." />;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 w-full max-w-7xl mx-auto">
      {/* Show processing spinner */}
      {isProcessing && (
        <LoadingSpinner 
          fullScreen 
          text="Processing your request..." 
          color={modalState.success ? "green" : "indigo"} 
        />
      )}

      {/* Show result modal */}
      <ResultModal 
        isOpen={modalState.isOpen}
        success={modalState.success}
        message={modalState.message}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Sales Dashboard
        </h1>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={handleImport}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
          >
            <FiUpload className="w-5 h-5 mr-2" />
            Import
          </button>
          <button 
            onClick={handleBackup}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          >
            <FiDatabase className="w-5 h-5 mr-2" />
            Backup
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-gray-500 mb-2">Total Items in Stock</p>
            <p className="text-3xl font-bold text-gray-900 mb-4">
              {dashboardData.totalItems.toLocaleString()}
            </p>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiPackage className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-gray-500 mb-2">Total Stock Value</p>
            <p className="text-3xl font-bold text-gray-900 mb-4">
              GH₵{dashboardData.totalStockValue.toLocaleString()}
            </p>
            <div className="p-3 bg-green-100 rounded-full">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-gray-500 mb-2">Top Selling Part</p>
            <p className="text-3xl font-bold text-gray-900 mb-4 truncate w-full">
              {dashboardData.topSellingPart}
            </p>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiTrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-gray-500 mb-2">Alerts</p>
            <div className="p-3 bg-red-100 rounded-full mb-4">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="w-full overflow-y-auto max-h-[120px] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
              {dashboardData.lowStockAlerts.length > 0 ? (
                <div className="space-y-2">
                  {dashboardData.lowStockAlerts.map((item, index) => (
                    <div key={index} className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-left">
                      <h3 className="text-red-800 font-medium text-sm">Low Stock</h3>
                      <p className="text-red-600 text-sm mt-1">
                        {item.name} ({item.quantity} remaining)
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="text-green-800 text-sm">All stock levels are healthy</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
