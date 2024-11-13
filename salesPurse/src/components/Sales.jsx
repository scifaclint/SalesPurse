import { useState, useEffect, useCallback } from "react";
import { useSales } from "../hooks/useDatabase";

const SalesDashboard = () => {
  const { 
    sales, 
    loading, 
    error, 
    completePendingSale, 
    getSalesByDateRange,
    getDailySalesMetrics
  } = useSales();

  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [metrics, setMetrics] = useState(null);

  const fetchDailyMetrics = useCallback(async () => {
    try {
      const dailyMetrics = await getDailySalesMetrics(dateRange.start);
      setMetrics(dailyMetrics);
    } catch (err) {
      console.error("Failed to fetch daily metrics:", err);
    }
  }, [dateRange.start, getDailySalesMetrics]);

  useEffect(() => {
    fetchDailyMetrics();
  }, [dateRange, fetchDailyMetrics]);

  const handleDateRangeChange = async (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));

    try {
      await getSalesByDateRange(dateRange.start, dateRange.end);
    } catch (err) {
      console.error("Failed to fetch sales by date range:", err);
    }
  };

  const handleStatusChange = async (saleId, paymentMethod) => {
    try {
      await completePendingSale(saleId, paymentMethod);
      fetchDailyMetrics(); // Refresh metrics after completing sale
    } catch (err) {
      console.error("Failed to complete sale:", err);
    }
  };

  const filteredSales = sales.filter(sale => {
    if (filterStatus === "all") return true;
    return sale.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
        Sales Dashboard
      </h1>
      
      {/* Date Range Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            name="start"
            value={dateRange.start}
            onChange={handleDateRangeChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            name="end"
            value={dateRange.end}
            onChange={handleDateRangeChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Daily Metrics Summary */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Sales</h3>
            <p className="text-2xl font-bold text-green-600">
              GH₵{metrics.totalSales.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Items</h3>
            <p className="text-2xl font-bold text-blue-600">
              {metrics.totalItems}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Average Sale</h3>
            <p className="text-2xl font-bold text-purple-600">
              GH₵{metrics.averageSale.toLocaleString()}
            </p>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-48 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Sales</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48 text-gray-500">
          Loading sales data...
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.map((sale) => (
                  <tr 
                    key={sale.id} 
                    className={`status-${sale.status}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(sale.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.customer_name}
                      <br />
                      <small className="text-gray-500">{sale.customer_phone}</small>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.items.map((item, index) => (
                        <div key={index} className="sale-item">
                          {item.product_name} x {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      GH₵{sale.total_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.discount_percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.worker_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            onClick={() => handleStatusChange(sale.id, 'cash')}
                            className="complete-button"
                          >
                            Cash
                          </button>
                          <button
                            onClick={() => handleStatusChange(sale.id, 'card')}
                            className="complete-button"
                          >
                            Card
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
