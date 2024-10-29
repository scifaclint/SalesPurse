import { useState } from "react";
import {
  Package,
  ShoppingCart,
  ClipboardList,
  BarChart,
  LogOut,
  Menu,
} from "lucide-react";
import { styles } from "../styles/worker";
import NewSaleContent from "../components/NewSales";

// Component for Dashboard Content
const DashboardContent = () => (
  <div>
    <h1
      style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}
    >
      Worker Dashboard
    </h1>

    <div style={styles.cardGrid}>
      <div style={styles.card}>
        <div style={styles.cardTitle}>{`Today's Sales`}</div>
        <div style={styles.cardValue}>GHC 12,500</div>
        <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
          5 orders completed
        </div>
      </div>

     

      
    </div>

    <div style={styles.table}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Order ID</th>
            <th style={styles.tableHeader}>Customer</th>
            <th style={styles.tableHeader}>Items</th>
            <th style={styles.tableHeader}>Amount</th>
            <th style={styles.tableHeader}>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.tableCell}>#12345</td>
            <td style={styles.tableCell}>John Construction Ltd</td>
            <td style={styles.tableCell}>Hydraulic Pump x2</td>
            <td style={styles.tableCell}>GHC 5,000</td>
            <td style={styles.tableCell}>
              <span
                style={{
                  backgroundColor: "#def7ec",
                  color: "#03543f",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                }}
              >
                Completed
              </span>
            </td>
          </tr>
          <tr>
            <td style={styles.tableCell}>#12344</td>
            <td style={styles.tableCell}>BuildRight Ghana</td>
            <td style={styles.tableCell}>Excavator Tracks x1</td>
            <td style={styles.tableCell}>GHC 3,500</td>
            <td style={styles.tableCell}>
              <span
                style={{
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                }}
              >
                Pending
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);




// Component for Check Stock Content
const CheckStockContent = () => (
  <div>
    <h1
      style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}
    >
      Check Stock
    </h1>
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Current Stock Levels</h2>
      {/* Add your stock check functionality here */}
      <p>Stock check functionality will be implemented here</p>
    </div>
  </div>
);

// Component for My Orders Content
const MyOrdersContent = () => (
  <div>
    <h1
      style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}
    >
      My Orders
    </h1>
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Order History</h2>
      {/* Add your orders list here */}
      <p>Orders list will be implemented here</p>
    </div>
  </div>
);

const WorkerDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardContent />;
      case "newSale":
        return <NewSaleContent />;
      case "checkStock":
        return <CheckStockContent />;
      case "myOrders":
        return <MyOrdersContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div style={styles.container}>
      <button
        style={styles.menuButton}
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <Menu />
      </button>

      <div
        style={{
          ...styles.sidebar,
          ...(isSidebarOpen ? {} : styles.sidebarHidden),
        }}
      >
        <div style={styles.logo}>
          <img
            src="/api/placeholder/64/64"
            alt="ABM Logo"
            style={{ borderRadius: "50%" }}
          />
        </div>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontWeight: "bold" }}>Worker View</div>
        </div>

        <nav style={styles.nav}>
          <div
            style={{
              ...styles.navItem,
              ...(currentView === "dashboard" ? styles.navItemActive : {}),
            }}
            onClick={() => setCurrentView("dashboard")}
          >
            <BarChart style={styles.navIcon} />
            <span>Dashboard</span>
          </div>
          <div
            style={{
              ...styles.navItem,
              ...(currentView === "newSale" ? styles.navItemActive : {}),
            }}
            onClick={() => setCurrentView("newSale")}
          >
            <ShoppingCart style={styles.navIcon} />
            <span>New Sale</span>
          </div>
          <div
            style={{
              ...styles.navItem,
              ...(currentView === "checkStock" ? styles.navItemActive : {}),
            }}
            onClick={() => setCurrentView("checkStock")}
          >
            <Package style={styles.navIcon} />
            <span>Check Stock</span>
          </div>
          <div
            style={{
              ...styles.navItem,
              ...(currentView === "myOrders" ? styles.navItemActive : {}),
            }}
            onClick={() => setCurrentView("myOrders")}
          >
            <ClipboardList style={styles.navIcon} />
            <span>My Orders</span>
          </div>
        </nav>

        <button style={styles.signOutButton}>
          <LogOut style={{ marginRight: "0.5rem" }} />
          <span>Sign Out</span>
        </button>
      </div>

      <main style={styles.mainContent}>{renderContent()}</main>
    </div>
  );
};

export default WorkerDashboard;
