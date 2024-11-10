import { useState, useEffect } from "react";
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
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <aside
        className={`
          fixed md:static 
          h-screen
          w-[250px] min-w-[250px]
          bg-indigo-900 text-white
          flex flex-col
          z-30
          transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col flex-grow">
          <div className="p-5 border-b border-white/10">
            <div className="flex justify-between items-center">
              <img src={logo} alt="Company Logo" className="max-w-[120px] h-auto" />
              <button onClick={toggleMobileMenu} className="md:hidden text-2xl">
                ☰
              </button>
            </div>
          </div>

          <div className="p-5 flex items-center space-x-3 border-b border-white/10">
            <img src={profile} alt="Admin Avatar" className="w-[50px] h-[50px] rounded-full" />
            <span className="text-base font-bold">(Admin)</span>
          </div>

          <nav className="flex-1 py-4 overflow-y-auto">
            {[
              { name: "dashboard", path: "/admin", icon: <MdDashboard />, label: "Dashboard" },
              { name: "inventory", path: "/admin_inventory", icon: <MdInventory />, label: "Inventory" },
              { name: "users", path: "/admin_users", icon: <ImProfile />, label: "Profiles" },
              { name: "sales", path: "/admin_sales", icon: <FcSalesPerformance />, label: "Sales" },
              { name: "reports", path: "/admin_reports", icon: <TbReport />, label: "Reports" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.name, item.path)}
                className={`
                  w-full px-5 py-4 
                  flex items-center space-x-3
                  text-left transition-colors
                  ${activeTab === item.name 
                    ? "bg-indigo-700 font-bold" 
                    : "hover:bg-indigo-800"
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <button 
          onClick={handleSignOut}
          className="
            w-full
            bg-red-700 hover:bg-red-800
            px-5 py-4
            text-left
            transition-colors
          "
        >
          Sign Out
        </button>
      </aside>
    </>
  );
};

export default NavigationTabs;
