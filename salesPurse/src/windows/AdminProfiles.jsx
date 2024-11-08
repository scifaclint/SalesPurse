import "../styles/mainSectionAdmin.css";
import NavigationTabs from "../navigation/NavigationTabs";
import UserAccountManagement from "../components/Profiles";
const AdminProfiles = () => {
  return (
    <>
      <div className="admin-dashboard">
        <NavigationTabs />
        <main className="content">
          <header className="content-header"></header>
          <section className="content-body">
            <UserAccountManagement />
          </section>
        </main>
      </div>
    </>
  );
};

export default AdminProfiles;
