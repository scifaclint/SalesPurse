import { useState } from "react";
import "../styles/homeStyles.css";
import logo from "../assets/imagepng.png";
import profile from "../assets/logo.png";
import { MdDashboard, MdInventory } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { ImProfile } from "react-icons/im";
import { TbReport } from "react-icons/tb";
// screens 

import Dashboard from "../components/DashBoard";
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <div><Dashboard/></div>;
      case "inventory":
        return <div>Inventory Content</div>;
      case "profiles":
        return <div>Profiles Content</div>;
      case "sales":
        return <div>Sales Content</div>;
      case "report":
        return <div>Reports</div>;
      default:
        return <div>Dashboard Content</div>;
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = () => {
    // Implement sign out logic here
    console.log("Signing out...");
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
          <span className="admin-name">Admin</span>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-button ${
              activeTab === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <MdDashboard className="icon" /> Dashboard
          </button>
          <button
            className={`sidebar-button ${
              activeTab === "inventory" ? "active" : ""
            }`}
            onClick={() => setActiveTab("inventory")}
          >
            <MdInventory className="icon" /> Inventory
          </button>
          <button
            className={`sidebar-button ${
              activeTab === "profiles" ? "active" : ""
            }`}
            onClick={() => setActiveTab("profiles")}
          >
            <ImProfile className="icon" /> Profiles
          </button>
          <button
            className={`sidebar-button ${
              activeTab === "sales" ? "active" : ""
            }`}
            onClick={() => setActiveTab("sales")}
          >
            <FcSalesPerformance className="icon" /> Sales
          </button>
          <button
            className={`sidebar-button ${
              activeTab === "report" ? "active" : ""
            }`}
            onClick={() => setActiveTab("report")}
          >
            <TbReport className="icon" /> Reports
          </button>
        </nav>
        <button className="sidebar-button sign-out" onClick={handleSignOut}>
          Sign Out
        </button>
      </aside>
      <main className="content">
        <header className="content-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
        </header>
        <section className="content-body">{renderContent()}</section>
      </main>
    </div>
  );
};

export default AdminDashboard;
