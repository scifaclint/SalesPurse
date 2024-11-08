import WorkerDashboard from "../windows/WorkerDashBoard";
import StartScreen from "../windows/StartScreen";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavigationTabs from "./NavigationTabs";
// admin page screens
import AdminInventory from "../windows/AdminInventory";
import AdminDashboard from "../windows/HomeScreen";
import AdminReports from "../windows/AdminReports";
import AdminSalesManagement from "../windows/AdminSalesMangement";
import AdminProfiles from "../windows/AdminProfiles";

// worker page screens
import WorkerCheckStock from "../windows/WorkerCheckStock";
import WorkerMyOrders from "../windows/WorkerMyOrders";
import WorkerNewSales from "../windows/WorkerNewSales";

import NavigationTabWorker from "./NavigationTabsWorke";

function AppNavigation() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/worker" element={<WorkerDashboard />} />
        <Route path="/admin_inventory" element={<AdminInventory />} />
        <Route path="/admin_users" element={<AdminProfiles />} />
        <Route path="/admin_sales" element={<AdminSalesManagement />} />
        <Route path="/admin_reports" element={<AdminReports />} />
        <Route path="/nav" element={<NavigationTabs />} />
        <Route path="/nav_worker" element={<NavigationTabWorker />} />
        <Route path="/worker_stock" element={<WorkerCheckStock />} />
        <Route path="/worker_orders" element={<WorkerMyOrders />} />
        <Route path="/worker_sales" element={<WorkerNewSales />} />
      </Routes>
    </Router>
  );
}

export default AppNavigation;
