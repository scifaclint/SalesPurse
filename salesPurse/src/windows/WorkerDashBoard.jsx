import { useState, useEffect } from "react";
import { styled } from "../styles/mainWorkerSection";
import NavigationTabWorker from "../navigation/NavigationTabsWorke";
import { FiDollarSign, FiPackage, FiTruck, FiClock, FiX } from "react-icons/fi";
import { useSales } from "../hooks/useDatabase";
import { useSelector } from "react-redux";

const DashboardContent = () => {
  const { sales, loading, error, completePendingSale, deleteSale } = useSales();
  const currentUser = useSelector((state) => state.account.user);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    todaySales: 0,
    productsSold: 0,
    pendingOrders: [],
    averageTime: 0,
    recentActivity: []
  });

  const stats = [
    {
      title: "Today's Sales",
      value: `GH₵ ${dashboardData.todaySales.toLocaleString()}`,
      icon: <FiDollarSign />,
      color: '#4ade80'
    },
    {
      title: "Products Sold",
      value: `${dashboardData.productsSold} items`,
      icon: <FiPackage />,
      color: '#60a5fa'
    },
    {
      title: "Pending Orders",
      value: `${dashboardData.pendingOrders.length} orders`,
      icon: <FiTruck />,
      color: '#f97316'
    },
    {
      title: "Average Time",
      value: `${dashboardData.averageTime} mins`,
      icon: <FiClock />,
      color: '#a78bfa'
    }
  ];

  useEffect(() => {
    if (sales && sales.length > 0) {
      calculateDashboardData();
    }
  }, [sales]);

  const calculateDashboardData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's completed sales
    const todayCompletedSales = sales.filter(sale => {
      const saleDate = new Date(sale.created_at);
      return saleDate >= today && sale.status === 'completed';
    });

    // Calculate today's total sales
    const todaySales = todayCompletedSales.reduce((sum, sale) => 
      sum + sale.total_amount, 0
    );

    // Calculate products sold today
    const productsSold = todayCompletedSales.reduce((sum, sale) => 
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    // Get pending orders
    const pendingOrders = sales.filter(sale => sale.status === 'pending');

    // Get recent activity (last 5 transactions)
    const recentActivity = [...sales]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    setDashboardData({
      todaySales,
      productsSold,
      pendingOrders,
      recentActivity
    });
  };

  const handleCompleteSale = async (saleId) => {
    try {
      await completePendingSale(saleId);
      calculateDashboardData();
      alert("Sale completed successfully!");
    } catch (err) {
      alert("Failed to complete sale: " + err.message);
    }
  };

  const handleDeleteSale = async (saleId) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        await deleteSale(saleId);
        calculateDashboardData();
        alert("Sale deleted successfully!");
      } catch (err) {
        alert("Failed to delete sale: " + err.message);
      }
    }
  };

  const PendingSalesModal = () => {
    const pendingSales = sales.filter(sale => sale.status === 'pending');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Pending Sales</h2>
            <button 
              onClick={() => setShowPendingModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Loading pending sales...</p>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 text-center">
                Error loading sales: {error}
              </div>
            ) : pendingSales.length === 0 ? (
              <div className="text-gray-500 p-8 text-center">
                No pending sales available
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSales.map((sale) => (
                  <div key={sale.id} 
                       className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {sale.customer_name || 'Customer'}
                        </h3>
                        <div className="mt-2 space-y-1">
                          {sale.items.map((item, index) => (
                            <p key={index} className="text-sm text-gray-600 flex justify-between">
                              <span>{item.product_name} x{item.quantity}</span>
                              <span className="font-medium">
                                GH₵ {(item.price * item.quantity).toLocaleString()}
                              </span>
                            </p>
                          ))}
                        </div>
                        <p className="mt-2 font-semibold text-gray-800">
                          Total: GH₵ {sale.total_amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {new Date(sale.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex md:flex-col gap-2 justify-end">
                        <button 
                          onClick={() => handleCompleteSale(sale.id)}
                          disabled={loading}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 
                                   disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium
                                   transition-colors duration-200"
                        >
                          {loading ? 'Processing...' : 'Complete'}
                        </button>
                        <button 
                          onClick={() => handleDeleteSale(sale.id)}
                          disabled={loading}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 
                                   disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium
                                   transition-colors duration-200"
                        >
                          {loading ? 'Processing...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main style={styled.mainWrapper} className="bg-gray-50">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome back, {currentUser?.name || 'Worker'}!
        </h1>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} 
               className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl
                             ${stat.color === '#4ade80' ? 'bg-green-100 text-green-600' :
                               stat.color === '#60a5fa' ? 'bg-blue-100 text-blue-600' :
                               stat.color === '#f97316' ? 'bg-orange-100 text-orange-600' :
                               'bg-purple-100 text-purple-600'}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {dashboardData.recentActivity.length > 0 ? (
            dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} 
                   className={`flex items-center justify-between p-4 rounded-lg
                             ${activity.status === 'completed' 
                               ? 'bg-green-50' 
                               : 'bg-yellow-50'}`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full 
                                 ${activity.status === 'completed'
                                   ? 'bg-green-100'
                                   : 'bg-yellow-100'}`}>
                    <FiDollarSign className={`${activity.status === 'completed'
                                             ? 'text-green-600'
                                             : 'text-yellow-600'}`} />
                  </div>
                  <div>
                    <p className="font-medium">
                      {activity.items.length} items - GH₵{activity.total_amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No recent activity</p>
          )}
        </div>
      </div>

      {/* Pending Sales Button */}
      <button
        onClick={() => setShowPendingModal(true)}
        className="fixed bottom-6 right-6 bg-orange-500 text-white px-6 py-3 rounded-lg
                   shadow-lg flex items-center gap-2 hover:bg-orange-600 transition-colors
                   duration-200"
      >
        <FiTruck />
        <span>Pending Sales</span>
        <span className="bg-white text-orange-500 px-2 py-0.5 rounded-full text-sm font-semibold">
          {dashboardData.pendingOrders.length}
        </span>
      </button>

      {showPendingModal && <PendingSalesModal />}
    </main>
  );
};

const WorkerDashboard = () => {
  return (
    <div style={styled.container}>
      <NavigationTabWorker />
      <DashboardContent />
    </div>
  );
};

export default WorkerDashboard;
