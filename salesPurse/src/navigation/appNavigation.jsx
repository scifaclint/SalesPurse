import WorkerDashboard from "../windows/WorkerDashBoard";
import StartScreen from "../windows/StartScreen";
import HomeScreen from "../windows/HomeScreen";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../styles/homeStyles.css";
function AppNavigation() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/admin" element={<HomeScreen />} />
        <Route path="/worker" element={<WorkerDashboard />} />
      </Routes>
    </Router>
  );
}

export default AppNavigation;
