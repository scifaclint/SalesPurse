import { useState } from "react";
import "../styles/startScreen.css";
import { useNavigate } from "react-router-dom";
import Animation from "../components/Animation";
import appLogo from "../assets/appLogo.png";
import { useUsers } from "../hooks/useDatabase";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/account/accountSlice";

const SalesPulseLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users } = useUsers();
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password");
      return;
    }
    
    try {
      // Find matching user
      const matchedUser = users.find(user => 
        username.trim() === user.username && 
        password.trim() === user.password
      );

      if (!matchedUser) {
        alert("Invalid username or password");
        setError("Invalid credentials");
        return;
      }

      // Check user type
      if (isAdmin && matchedUser.type !== "admin") {
        alert("Access denied: This login is for administrators only");
        setError("Invalid user type");
        return;
      }

      if (!isAdmin && matchedUser.type !== "worker") {
        alert("Access denied: This login is for workers only");
        setError("Invalid user type");
        return;
      }

     

      // Dispatch login success
      dispatch(
        loginSuccess({
          id: matchedUser.id,
          name: matchedUser.name,
          username: matchedUser.username,
          type: matchedUser.type,
          phone: matchedUser.phone
        })
      );

      // Navigate based on user type
      if (matchedUser.type === "admin") {
        navigate("/admin");
      } else {
        navigate("/worker");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-title">
          <img src={appLogo} className="imageLogo" alt="App Logo" />
        </div>
        <div className="card-header">
          <Animation />
        </div>
        <div className="card-content">
          <div className="space-y-4">
            <div className="toggle-container">
              <button
                className={`toggle ${
                  isAdmin ? "toggle-admin" : "toggle-worker"
                }`}
                onClick={() => {
                  setIsAdmin(!isAdmin);
                  setError("");
                  setUsername("");
                  setPassword("");
                }}
              >
                {isAdmin ? "Admin" : "Worker"}
              </button>
            </div>
            <input
              type="text"
              placeholder={`${isAdmin ? 'Admin' : 'Worker'} Username`}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              className="input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="input"
            />
            <button className="button" onClick={handleLogin}>
              Login as {isAdmin ? 'Admin' : 'Worker'}
            </button>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPulseLogin;
