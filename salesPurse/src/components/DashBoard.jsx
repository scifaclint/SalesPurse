import "../styles/dashboard.css";

const inventoryData = [
  { name: "Excavators", value: 25 },
  { name: "Parts", value: 1500 },
];

const Dashboard = () => {
  const totalItems = inventoryData.reduce((sum, item) => sum + item.value, 0);
  const totalStockValue = 2500000;
  const topSellingPart = "Hydraulic Pumps";
  const lowStockAlert = "Low stock alert: Excavator Tracks";

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Sales Dashboard</h1>

      <div className="metric-cards">
        <div className="card">
          <h2 className="card-title">Total Items in Stock</h2>
          <p className="card-value">{totalItems}</p>
        </div>

        <div className="card">
          <h2 className="card-title">Total Stock Value</h2>
          <p className="card-value">GH₵{totalStockValue.toLocaleString()}</p>
        </div>

        <div className="card">
          <h2 className="card-title">Top Selling Part</h2>
          <p className="card-value">{topSellingPart}</p>
        </div>

        <div className="card">
          <h2 className="card-title">Alert</h2>
          <div className="alert alert-danger">
            <h3 className="alert-title">Low Stock</h3>
            <p className="alert-description">{lowStockAlert}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
