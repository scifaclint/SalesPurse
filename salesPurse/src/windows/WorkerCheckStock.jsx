import { useState } from "react";
import { checkStockStyles as styles } from "../styles/checkStock";
import { FiSearch, FiPackage, FiAlertCircle } from "react-icons/fi";
import NavigationTabWorker from "../navigation/NavigationTabsWorke";
import { styled } from "../styles/mainWorkerSection";

const WorkerCheckStock = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy stock data (will be replaced with real DB data later)
  const stockItems = [
    {
      id: 1,
      name: "Excavator Parts",
      quantity: 15,
      status: "In Stock",
      lastUpdated: "2024-02-20",
      category: "Heavy Machinery",
    },
    {
      id: 2,
      name: "Hydraulic Pump",
      quantity: 3,
      status: "Low Stock",
      lastUpdated: "2024-02-19",
      category: "Hydraulics",
    },
    {
      id: 3,
      name: "Engine Filter",
      quantity: 45,
      status: "In Stock",
      lastUpdated: "2024-02-18",
      category: "Filters",
    },
    {
      id: 4,
      name: "Track Chains",
      quantity: 0,
      status: "Out of Stock",
      lastUpdated: "2024-02-17",
      category: "Tracks",
    }
  ];

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const StockContent = () => (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Stock Inventory</h1>
        <div style={styles.searchBar}>
          <FiSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by product name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiPackage />
          </div>
          <div style={styles.statInfo}>
            <h3 style={styles.statTitle}>Total Items</h3>
            <p style={styles.statValue}>{stockItems.length}</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, backgroundColor: '#fee2e2'}}>
            <FiAlertCircle style={{color: '#ef4444'}} />
          </div>
          <div style={styles.statInfo}>
            <h3 style={styles.statTitle}>Low Stock Items</h3>
            <p style={styles.statValue}>
              {stockItems.filter(item => item.status === "Low Stock").length}
            </p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, backgroundColor: '#fef3c7'}}>
            <FiAlertCircle style={{color: '#f59e0b'}} />
          </div>
          <div style={styles.statInfo}>
            <h3 style={styles.statTitle}>Out of Stock</h3>
            <p style={styles.statValue}>
              {stockItems.filter(item => item.status === "Out of Stock").length}
            </p>
          </div>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Product Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} style={styles.tr}>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.category}</td>
                <td style={styles.td}>{item.quantity}</td>
                <td style={styles.td}>
                  <span style={styles[`status${item.status.replace(/\s+/g, '')}`]}>
                    {item.status}
                  </span>
                </td>
                <td style={styles.td}>{item.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={styled.container}>
      <NavigationTabWorker />
      <main style={styles.mainContent}>
        <StockContent />
      </main>
    </div>
  );
};

export default WorkerCheckStock;
