import "../styles/mainSectionAdmin.css";
import NavigationTabs from "../navigation/NavigationTabs";
import SalesDashboard from "../components/Sales";

const AdminSalesManagement = () => {
  return (
    <>
      <div className="admin-dashboard">
        <NavigationTabs />
        <main className="content">
          <header className="content-header"></header>
          <section className="content-body">
            <SalesDashboard />
          </section>
        </main>
      </div>
    </>
  );
};
export default AdminSalesManagement;
