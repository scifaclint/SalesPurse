import { useState, useEffect } from "react";
import { styled } from "../styles/mainWorkerSection";
import NavigationTabWorker from "../navigation/NavigationTabsWorke";
import { FiCalendar, FiSearch, FiFilter, FiDownload, FiX } from "react-icons/fi";
import { useSales } from "../hooks/useDatabase";
import { useSelector } from "react-redux";

const ResultsModal = ({ onClose, filteredResults }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-xl">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Filtered Sales Results</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <FiX className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
        {filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FiCalendar className="text-4xl mb-4" />
            <p className="text-lg">No sales found for this period</p>
            <p className="text-sm mt-2">Try selecting a different date range</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResults.map((sale) => (
              <div key={sale.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {sale.customerName || 'Walk-in Customer'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(sale.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${sale.paymentMethod === 'cash' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'}`}
                  >
                    {sale.paymentMethod}
                  </span>
                </div>

                {/* Sale Items */}
                <div className="space-y-2 mb-3">
                  {sale.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product_name} x {item.quantity}
                      </span>
                      <span className="text-gray-800">
                        GH₵ {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Sale Summary */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Total Items: {sale.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                  </div>
                  <div className="text-lg font-semibold text-gray-800">
                    GH₵ {sale.totalAmount.toLocaleString()}
                  </div>
                </div>

                {sale.notes && (
                  <div className="mt-2 text-sm text-gray-500 italic">
                    Note: {sale.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Footer with Summary */}
      {filteredResults.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-gray-500">Total Sales:</span>
              <span className="ml-2 text-xl font-semibold text-gray-800">
                {filteredResults.length}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Total Revenue:</span>
              <span className="ml-2 text-xl font-semibold text-gray-800">
                GH₵ {filteredResults.reduce((sum, sale) => sum + sale.totalAmount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

const WorkerMyOrders = () => {
  const { sales, loading, error } = useSales();
  const currentUser = useSelector((state) => state.account.user);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const handleApplyFilter = () => {
    if (!sales) return;

    const filtered = sales.filter(sale => {
      const saleDate = new Date(sale.created_at);
      return saleDate.getMonth() === selectedMonth && 
             saleDate.getFullYear() === selectedYear &&
             sale.workerId === currentUser.id;
    });

    setFilteredResults(filtered);
    setShowFilterModal(false);
    setShowResultsModal(true);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log("Export functionality to be implemented");
  };

  // Get all orders for the current worker
  const workerOrders = sales?.filter(sale => sale.workerId === currentUser?.id) || [];
  
  // Filter orders based on search query
  const filteredOrders = workerOrders.filter(order => 
    order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items?.some(item => 
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calculate summary statistics
  const summaryStats = {
    totalOrders: workerOrders.length,
    totalRevenue: workerOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    completedOrders: workerOrders.filter(order => order.status === 'completed').length,
    pendingOrders: workerOrders.filter(order => order.status === 'pending').length
  };

  return (
    <div style={styled.container}>
      <NavigationTabWorker />
      <main style={styled.mainWrapper} className="bg-gray-50">
        {/* Header with search, filter, and export */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">My Orders</h1>
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-indigo-500 focus:border-indigo-500"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button 
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 
                       rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiFilter /> Filter
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white 
                       rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FiDownload /> Export
            </button>
          </div>
        </div>

        {/* Summary Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FiCalendar className="text-indigo-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {summaryStats.totalOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiDownload className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  GH₵ {summaryStats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiFilter className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Completed Orders</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {summaryStats.completedOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiSearch className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {summaryStats.pendingOrders}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Error loading orders. Please try again.
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No orders found.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} 
                   className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {order.customerName || 'Walk-in Customer'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${order.paymentMethod === 'cash' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'}`}
                  >
                    {order.paymentMethod}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-2 mb-3">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product_name} x {item.quantity}
                      </span>
                      <span className="text-gray-800">
                        GH₵ {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Total Items: {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                  </div>
                  <div className="text-lg font-semibold text-gray-800">
                    GH₵ {order.totalAmount.toLocaleString()}
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-2 text-sm text-gray-500 italic">
                    Note: {order.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filter Orders</h3>
                <button 
                  onClick={() => setShowFilterModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyFilter}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Modal */}
        {showResultsModal && (
          <ResultsModal 
            filteredResults={filteredResults} 
            onClose={() => setShowResultsModal(false)} 
          />
        )}
      </main>
    </div>
  );
};

export default WorkerMyOrders;
