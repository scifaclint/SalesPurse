import  { useState } from "react";

const UserAccountManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      username: "john_doe",
      userType: "admin",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      username: "jane_smith",
      userType: "worker",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      username: "bob_johnson",
      userType: "worker",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
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
    if (newUser.name && newUser.email && newUser.username && newUser.password) {
      setUsers([...users, { ...newUser, id: Date.now() }]);
      setNewUser({
        name: "",
        email: "",
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
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    searchBar: {
      display: "flex",
      marginBottom: "20px",
    },
    input: {
      flex: 1,
      padding: "10px",
      marginRight: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    button: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      backgroundColor: "#007bff",
      color: "white",
      marginRight: "10px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      gap: "20px",
    },
    userList: {
      border: "1px solid #ccc",
      borderRadius: "4px",
      height: "400px",
      overflowY: "auto",
    },
    userItem: {
      padding: "10px",
      borderBottom: "1px solid #eee",
      cursor: "pointer",
    },
    selectedUser: {
      backgroundColor: "#f0f0f0",
    },
    userDetails: {
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    select: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>User Account Management</h1>
        <button
          style={styles.button}
          onClick={() => {
            setIsAdding(true);
            setSelectedUser(null);
          }}
        >
          Add New User
        </button>
      </div>

      <div style={styles.searchBar}>
        <input
          style={styles.input}
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.grid}>
        <div>
          <h2>User List</h2>
          <div style={styles.userList}>
            {handleSearch().map((user) => (
              <div
                key={user.id}
                style={{
                  ...styles.userItem,
                  ...(selectedUser?.id === user.id ? styles.selectedUser : {}),
                }}
                onClick={() => {
                  setSelectedUser(user);
                  setIsAdding(false);
                }}
              >
                <div>{user.name}</div>
                <div>{user.email}</div>
                <div>Type: {user.userType}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.userDetails}>
          {isAdding ? (
            <>
              <h2>Add New User</h2>
              <input
                style={styles.input}
                type="text"
                name="name"
                placeholder="Name"
                value={newUser.name}
                onChange={handleInputChange}
              />
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleInputChange}
              />
              <input
                style={styles.input}
                type="text"
                name="username"
                placeholder="Username"
                value={newUser.username}
                onChange={handleInputChange}
              />
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="Password"
                value={newUser.password}
                onChange={handleInputChange}
              />
              <select
                style={styles.select}
                name="userType"
                value={newUser.userType}
                onChange={handleInputChange}
              >
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
              </select>
              <button style={styles.button} onClick={handleAddUser}>
                Add User
              </button>
            </>
          ) : selectedUser ? (
            <>
              <h2>Edit User</h2>
              <input
                style={styles.input}
                type="text"
                name="name"
                placeholder="Name"
                value={selectedUser.name}
                onChange={handleInputChange}
              />
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="Email"
                value={selectedUser.email}
                onChange={handleInputChange}
              />
              <input
                style={styles.input}
                type="text"
                name="username"
                placeholder="Username"
                value={selectedUser.username}
                onChange={handleInputChange}
              />
              <select
                style={styles.select}
                name="userType"
                value={selectedUser.userType}
                onChange={handleInputChange}
              >
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
              </select>
              <button style={styles.button} onClick={handleUpdateUser}>
                Update User
              </button>
              <button
                style={{ ...styles.button, backgroundColor: "#dc3545" }}
                onClick={() => handleDeleteUser(selectedUser.id)}
              >
                Delete User
              </button>
            </>
          ) : (
            <p>
              Select a user to edit or click Add New User to create a new
              account.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccountManagement;
