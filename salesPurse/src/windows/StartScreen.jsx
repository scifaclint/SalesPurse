import { useState } from "react";
import "../styles/startScreen.css";
import Animation from "../components/Animation";
import appLogo from "../assets/appLogo.png";
const SalesPulseLogin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log(`Logging in as ${isAdmin ? "Admin" : "Worker"}`);
    console.log(`Username: ${username}, Password: ${password}`);
    // Add your login logic here
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-title">
            <img src={appLogo} className="imageLogo" >
            </img>
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
