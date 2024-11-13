import { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  ClipboardList,
  BarChart,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { styles } from "../styles/worker";
import { useNavigate, useLocation } from "react-router-dom";

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Sign Out</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to sign out?
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

const NavigationTabWorker = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("dashboard");
  const [showSignOutModal, setShowSignOutModal] = useState(false);

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
    setShowSignOutModal(true);
  };

  const handleConfirmSignOut = () => {
    setShowSignOutModal(false);
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

        <button style={styles.signOutButton} onClick={handleSignOut}>
          <LogOut style={{ marginRight: "0.5rem" }} />
          <span>Sign Out</span>
        </button>
      </div>

      <ConfirmationModal 
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleConfirmSignOut}
      />
    </div>
  );
};

export default NavigationTabWorker;
