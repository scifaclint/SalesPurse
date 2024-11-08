import "../styles/mainSectionAdmin.css";
import NavigationTabs from "../navigation/NavigationTabs";
import InventoryManagement from "../components/Inventory";
const AdminInventory = () => {
  return (
    <>
      <div className="admin-dashboard">
        <NavigationTabs />
        <main className="content">
          <header className="content-header"></header>
          <section className="content-body">
            <InventoryManagement />
          </section>
        </main>
      </div>
    </>
  );
};

export default AdminInventory;
