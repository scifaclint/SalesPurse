import { useState, useEffect } from "react";
import "../styles/homeStyles.css";
import logo from "../assets/imagepng.png";
import profile from "../assets/logo.png";
import { MdDashboard, MdInventory } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { ImProfile } from "react-icons/im";
import { TbReport } from "react-icons/tb";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDashboard } from "../features/appstate/dashboard";
const NavigationTabs = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  // Update activeTab based on current route
  useEffect(() => {
    const path = location.pathname;
    switch (path) {
      case "/admin":
        setActiveTab("dashboard");
        break;
      case "/admin_inventory":
        setActiveTab("inventory");
        break;
      case "/admin_users":
        setActiveTab("users");
        break;
      case "/admin_sales":
        setActiveTab("sales");
        break;
      case "/admin_reports":
        setActiveTab("reports");
        break;
      default:
        setActiveTab("dashboard");
    }
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  const handleSignOut = () => {
    // Implement sign out logic here
    // ask confirmations later

    navigate("/");
    dispatch(
      setDashboard({
        userDetails: {
          name: "",
          type: "",
          phone: "",
        },
        appState: "",
      })
    );
  };

  return (
    <div className="admin-dashboard">
      <aside className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Company Logo" className="company-logo" />
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            ☰
          </button>
        </div>
        <div className="admin-profile">
          <img src={profile} alt="Admin Avatar" className="admin-avatar" />
          <span className="admin-name">{` (Admin)`} </span>
        </div>
        <nav className="sidebar-nav">
          <button
            onClick={() => handleNavigation("dashboard", "/admin")}
            className={`sidebar-button ${
              activeTab === "dashboard" ? "active" : ""
            }`}
          >
            <MdDashboard className="icon" /> Dashboard
          </button>
          <button
            onClick={() => handleNavigation("inventory", "/admin_inventory")}
            className={`sidebar-button ${
              activeTab === "inventory" ? "active" : ""
            }`}
          >
            <MdInventory className="icon" /> Inventory
          </button>
          <button
            onClick={() => handleNavigation("users", "/admin_users")}
            className={`sidebar-button ${
              activeTab === "users" ? "active" : ""
            }`}
          >
            <ImProfile className="icon" /> Profiles
          </button>
          <button
            onClick={() => handleNavigation("sales", "/admin_sales")}
            className={`sidebar-button ${
              activeTab === "sales" ? "active" : ""
            }`}
          >
            <FcSalesPerformance className="icon" /> Sales
          </button>
          <button
            onClick={() => handleNavigation("reports", "/admin_reports")}
            className={`sidebar-button ${
              activeTab === "reports" ? "active" : ""
            }`}
          >
            <TbReport className="icon" /> Reports
          </button>
        </nav>
        <button className="sidebar-button sign-out" onClick={handleSignOut}>
          Sign Out
        </button>
      </aside>
    </div>
  );
};

export default NavigationTabs;
