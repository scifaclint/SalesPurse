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
  const [isAdmin, setIsAdmin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    
    for (const user of users) {
      if (
        username.trim() === user.username &&
        password.trim() === user.password
      ) {
        // Dispatch complete user data to account slice
        dispatch(
          loginSuccess({
            id: user.id,
            name: user.name,
            username: user.username,
            type: user.type,
            phone: user.phone
          })
        );

        // Navigate based on user type
        if (user.type === "admin") {
          navigate("/admin");
        } else {
          navigate("/worker");
        }
        return;
      }
    }
    setError("Invalid credentials");
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-title">
          <img src={appLogo} className="imageLogo"></img>
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
                onClick={() => setIsAdmin(!isAdmin)}
              >
                {isAdmin ? "Admin" : "Worker"}
              </button>
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
            <button className="button" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPulseLogin;
