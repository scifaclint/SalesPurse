import "../styles/homeStyles.css";
import Dashboard from "../components/DashBoard";
import NavigationTabs from "../navigation/NavigationTabs";
// screens

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <NavigationTabs />
      <main className="content">
        <header className="content-header"></header>
        <section className="content-body">
          <Dashboard />
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
