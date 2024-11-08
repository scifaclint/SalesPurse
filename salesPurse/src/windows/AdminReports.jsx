import "../styles/mainSectionAdmin.css";
import NavigationTabs from "../navigation/NavigationTabs";
import Reports from "../components/Reports";
const AdminReports = () => {
  return (
    <>
      <div className="admin-dashboard">
        <NavigationTabs />
        <main className="content">
          <header className="content-header"></header>
          <section className="content-body">
            <Reports />
          </section>
        </main>
      </div>
    </>
  );
};
export default AdminReports;
