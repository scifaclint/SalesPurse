import "../styles/sales.css";

const SalesDashboard = () => {
  // Static sales data - replace this with actual data from your backend
  const salesData = [
    { id: 1, product: "Widget A", quantity: 100, revenue: 5000 },
    { id: 2, product: "Gadget B", quantity: 50, revenue: 7500 },
    { id: 3, product: "Doohickey C", quantity: 200, revenue: 10000 },
    { id: 4, product: "Thingamajig D", quantity: 75, revenue: 3750 },
  ];

  // Calculate total revenue
  const totalRevenue = salesData.reduce((sum, sale) => sum + sale.revenue, 0);

  return (
    <div className="sales-dashboard">
      <h1>Sales Dashboard</h1>
      <div className="total-revenue">
        <h2>Total Revenue</h2>
        <p>GH₵{totalRevenue.toLocaleString()}</p>
      </div>
      <div className="sales-table">
        <h2>Sales Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.product}</td>
                <td>{sale.quantity}</td>
                <td>GH₵{sale.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesDashboard;
