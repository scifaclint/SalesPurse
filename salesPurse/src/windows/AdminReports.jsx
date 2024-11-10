import NavigationTabs from "../navigation/NavigationTabs";
import Reports from "../components/Reports";
const AdminReports = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-shrink-0">
        <NavigationTabs />
      </div>
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-center">
          <Reports />
        </div>
      </main>
    </div>
  );
};
export default AdminReports;
