import { useState, useEffect } from "react";
import { useUsers } from "../hooks/useDatabase";

const UserAccountManagement = () => {
  const { users, loading, error, addUser, updateUser, deleteUser } = useUsers();

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [newUser, setNewUser] = useState({
    name: "",
    phone: "",
    username: "",
    password: "",
    type: "worker",
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    userId: null
  });

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "type") {
      if (selectedUser) {
        setSelectedUser({ ...selectedUser, type: value });
      } else {
        setNewUser({ ...newUser, type: value });
      }
    } else {
      if (selectedUser) {
        setSelectedUser({ ...selectedUser, [name]: value });
      } else {
        setNewUser({ ...newUser, [name]: value });
      }
    }
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.username?.trim() || !newUser.name?.trim() || !newUser.password?.trim() || !newUser.phone?.trim()) {
        alert("All fields are required");
        return;
      }

      console.log("Adding user with data:", newUser);

      const result = await addUser(newUser);
      if (result.success) {
        setNewUser({ name: "", phone: "", username: "", password: "", type: "worker" });
        setIsAdding(false);
      }
    } catch (err) {
      console.error("Failed to add user:", err);
      alert(err.message || "Failed to add user. Please try again.");
    }
  };

  const handleUpdateUser = async () => {
    try {
      if (!selectedUser) return;
      const result = await updateUser(selectedUser.id, selectedUser);
      if (result.success) {
        setSelectedUser(null);
      }
    } catch (err) {
      console.error("Failed to update user:", err);
      alert(err.message || "Failed to update user. Please try again.");
    }
  };

  const handleDeleteUser = async (id) => {
    setDeleteConfirmation({
      isOpen: false,
      userId: null
    });
    
    try {
      await deleteUser(id);
      setSelectedUser(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert(err.message || "Failed to delete user. Please try again.");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation({
      isOpen: true,
      userId: id
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-5 font-sans">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
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
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 
                      ${selectedUser?.id === user.id ? "bg-gray-100" : ""}`}
                    onClick={() => {
                      setSelectedUser(user);
                      setIsAdding(false);
                    }}
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-gray-600 text-sm">{user.phone}</div>
                    <div className="text-gray-600 text-sm">
                      Type: {user.type}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Last Login:{" "}
                      {user.last_login
                        ? new Date(user.last_login).toLocaleString()
                        : "Never"}
                    </div>
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
                      type="text"
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
                      name="type"
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
                      name="type"
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
                        onClick={() => handleDeleteClick(selectedUser.id)}
                      >
                        Delete User
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-600">
                  Select a user to edit or click Add New User to create a new
                  account.
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                onClick={() => setDeleteConfirmation({ isOpen: false, userId: null })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                onClick={() => handleDeleteUser(deleteConfirmation.userId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccountManagement;
