import { useState } from "react";
import { useUsers } from "../hooks/useDatabase";

const UserAccountManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const email = "implementlater@gmail"
  const [usersd, setUsers] = useState();

  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    phone: "",
    username: "",
    password: "",
    userType: "worker",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.phone && newUser.username && newUser.password) {
      setUsers([...users, { ...newUser, id: Date.now() }]);
      setNewUser({
        name: "",
        phone: "",
        username: "",
        password: "",
        userType: "worker",
      });
      setIsAdding(false);
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleUpdateUser = () => {
    if (selectedUser) {
      setUsers(
        users.map((user) => (user.id === selectedUser.id ? selectedUser : user))
      );
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    setSelectedUser(null);
  };

  const handleSearch = () => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-5 font-sans">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">User Account Management</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => {
            setIsAdding(true);
            setSelectedUser(null);
          }}
        >
          Add New User
        </button>
      </div>

      <div className="mb-5">
        <input
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-3">User List</h2>
          <div className="border border-gray-200 rounded h-[400px] overflow-y-auto">
            {handleSearch().map((user) => (
              <div
                key={user.id}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 
                  ${selectedUser?.id === user.id ? 'bg-gray-100' : ''}`}
                onClick={() => {
                  setSelectedUser(user);
                  setIsAdding(false);
                }}
              >
                <div className="font-medium">{user.name}</div>
                <div className="text-gray-600 text-sm">{user.phone}</div>
                <div className="text-gray-600 text-sm">Type: {user.type}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 border border-gray-200 rounded p-6">
          {isAdding ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Add New User</h2>
              <div className="space-y-4">
                <input
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={handleInputChange}
                />
                <input
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="phone"
                  name="phone"
                  placeholder="Phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                />
                <input
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={handleInputChange}
                />
                <input
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={handleInputChange}
                />
                <select
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="userType"
                  value={newUser.type}
                  onChange={handleInputChange}
                >
                  <option value="worker">Worker</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    onClick={handleAddUser}
                  >
                    Add User
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    onClick={() => setIsAdding(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          ) : selectedUser ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Edit User</h2>
              <div className="space-y-4">
                <input
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={selectedUser.name}
                  onChange={handleInputChange}
                />
                <input
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="phone"
                  name="phone"
                  placeholder="Phone"
                  value={selectedUser.phone}
                  onChange={handleInputChange}
                />
                <input
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={selectedUser.username}
                  onChange={handleInputChange}
                />
                <select
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="userType"
                  value={selectedUser.type}
                  onChange={handleInputChange}
                >
                  <option value="worker">Worker</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    onClick={handleUpdateUser}
                  >
                    Update User
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    onClick={() => handleDeleteUser(selectedUser.id)}
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-600">
              Select a user to edit or click Add New User to create a new account.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccountManagement;
