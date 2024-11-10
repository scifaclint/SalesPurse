import { FiDatabase, FiUpload, FiAlertTriangle, FiPackage, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  const inventoryData = [
    { name: "Excavators", value: 25 },
    { name: "Parts", value: 1500 },
  ];

  const totalItems = inventoryData.reduce((sum, item) => sum + item.value, 0);
  const totalStockValue = 2500000;
  const topSellingPart = "Hydraulic Pumps";
  const lowStockAlert = "Low stock alert: Excavator Tracks";

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
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
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
                GH₵{totalStockValue.toLocaleString()}
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
              <p className="text-2xl font-bold text-gray-900">{topSellingPart}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiTrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Alert</p>
            <div className="p-3 bg-red-100 rounded-full">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <h3 className="text-red-800 font-medium">Low Stock</h3>
            <p className="text-red-600 text-sm mt-1">{lowStockAlert}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
