import { useState, useEffect } from "react";
import "../styles/sales.css";

const SalesDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const sales = await window.api.getSalesWithDetails();
      setSalesData(sales);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (saleId) => {
    try {
      await window.api.completeSale(saleId);
      await fetchSalesData(); // Refresh data
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredSales = salesData.filter(sale => {
    if (filterStatus === "all") return true;
    return sale.status === filterStatus;
  });

  return (
    <div className="sales-dashboard">
      <h1>Sales Dashboard</h1>
      
      <div className="filters">
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Sales</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="sales-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Worker</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <tr key={sale.id} className={`status-${sale.status}`}>
                <td>{new Date(sale.date).toLocaleDateString()}</td>
                <td>{sale.customer_name}</td>
                <td>{sale.product}</td>
                <td>GH₵{sale.revenue.toLocaleString()}</td>
                <td>{sale.worker_name}</td>
                <td>{sale.status}</td>
                <td>
                  {sale.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(sale.id)}
                      className="complete-button"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesDashboard;
