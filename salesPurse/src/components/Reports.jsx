import { useState } from "react";
import "../styles/reports.css";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("monthly");

  // Static data for reports - replace with actual data from your backend
  const reportsData = {
    monthly: [
      { month: "January", sales: 45000 },
      { month: "February", sales: 52000 },
      { month: "March", sales: 48000 },
      { month: "April", sales: 51000 },
      { month: "May", sales: 55000 },
      { month: "June", sales: 59000 },
    ],
    topProducts: [
      { product: "Widget A", sales: 1200 },
      { product: "Gadget B", sales: 980 },
      { product: "Doohickey C", sales: 850 },
      { product: "Thingamajig D", sales: 720 },
      { product: "Gizmo E", sales: 650 },
    ],
    categories: [
      { category: "Electronics", sales: 25000 },
      { category: "Home & Kitchen", sales: 18000 },
      { category: "Sports & Outdoors", sales: 15000 },
      { category: "Books", sales: 12000 },
      { category: "Clothing", sales: 20000 },
    ],
  };

  const renderReport = () => {
    switch (selectedReport) {
      case "monthly":
        return (
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.monthly.map((item, index) => (
                <tr key={index}>
                  <td>{item.month}</td>
                  <td>GH₵{item.sales.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "topProducts":
        return (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.topProducts.map((item, index) => (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "categories":
        return (
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.categories.map((item, index) => (
                <tr key={index}>
                  <td>{item.category}</td>
                  <td>GH₵{item.sales.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return <p>Select a report to view</p>;
    }
  };

  return (
    <div className="reports-container">
      <h1>Sales Reports</h1>
      <div className="report-selector">
        <button
          className={selectedReport === "monthly" ? "active" : ""}
          onClick={() => setSelectedReport("monthly")}
        >
          Monthly Sales
        </button>
        <button
          className={selectedReport === "topProducts" ? "active" : ""}
          onClick={() => setSelectedReport("topProducts")}
        >
          Top Products
        </button>
        <button
          className={selectedReport === "categories" ? "active" : ""}
          onClick={() => setSelectedReport("categories")}
        >
          Sales by Category
        </button>
      </div>
      <div className="report-content">
        <h2>
          {selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)}{" "}
          Report
        </h2>
        {renderReport()}
      </div>
    </div>
  );
};

export default Reports;
