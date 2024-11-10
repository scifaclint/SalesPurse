import NavigationTabs from "../navigation/NavigationTabs";
import UserAccountManagement from "../components/Profiles";
const AdminProfiles = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-shrink-0">
        <NavigationTabs />
      </div>
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-center">
          <UserAccountManagement />
        </div>
      </main>
    </div>
  );
};

export default AdminProfiles;
