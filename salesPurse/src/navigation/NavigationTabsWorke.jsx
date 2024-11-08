import { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  ClipboardList,
  BarChart,
  LogOut,
  Menu,
} from "lucide-react";
import { styles } from "../styles/worker";
import { useNavigate, useLocation } from "react-router-dom";

const NavigationTabWorker = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("dashboard");

  // Update currentView based on location

  useEffect(() => {
    const path = location.pathname;
    if (path === "/worker") setCurrentView("dashboard");
    else if (path === "/worker_stock") setCurrentView("checkStock");
    else if (path === "/worker_sales") setCurrentView("newSale");
    else if (path === "/worker_orders") setCurrentView("myOrders");
  }, [location]);

  const handleNavigation = (current) => {
    switch (current) {
      case "dashboard":
        setCurrentView("dashboard");
        navigate("/worker");
        break;
      case "checkStock":
        setCurrentView("checkStock");
        navigate("/worker_stock");
        break;
      case "newSale":
        setCurrentView("newSale");
        navigate("/worker_sales");
        break;
      case "myOrders":
        setCurrentView("myOrders");
        navigate("/worker_orders");
        break;
      default:
        break;
    }
  };

  const handleSignOut = () => {
    navigate("/");
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
            onClick={() => handleNavigation("dashboard")}
          >
            <BarChart style={styles.navIcon} />
            <span>Dashboard</span>
          </div>
          <div
            style={{
              ...styles.navItem,
              ...(currentView === "newSale" ? styles.navItemActive : {}),
            }}
            onClick={() => handleNavigation("newSale")}
          >
            <ShoppingCart style={styles.navIcon} />
            <span>New Sale</span>
          </div>
          <div
            style={{
              ...styles.navItem,
              ...(currentView === "checkStock" ? styles.navItemActive : {}),
            }}
            onClick={() => handleNavigation("checkStock")}
          >
            <Package style={styles.navIcon} />
            <span>Check Stock</span>
          </div>
          <div
            style={{
              ...styles.navItem,
              ...(currentView === "myOrders" ? styles.navItemActive : {}),
            }}
            onClick={() => handleNavigation("myOrders")}
          >
            <ClipboardList style={styles.navIcon} />
            <span>My Orders</span>
          </div>
        </nav>

        <button style={styles.signOutButton} onClick={() => handleSignOut()}>
          <LogOut style={{ marginRight: "0.5rem" }} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default NavigationTabWorker;
