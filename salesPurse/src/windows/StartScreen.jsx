import { useState } from "react";
import "../styles/startScreen.css";
import { useNavigate } from "react-router-dom";
import Animation from "../components/Animation";
import appLogo from "../assets/appLogo.png";
import { useUsers } from "../hooks/useDatabase";
import { useDispatch } from "react-redux";
import { setDashboard } from "../features/appstate/dashboard";
const SalesPulseLogin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { users } = useUsers();
  const dispatch = useDispatch();

  // go to admin dashboard
  const goToAdmin = () => {
    navigate("/admin");
  };
  // navigate to worker
  const goToWorker = () => {
    navigate("/worker");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Input Fields Cannot be Empty");
    }
    // handle admin here
    if (isAdmin) {
      for (const item of users) {
        if (
          username.trim() === item.name &&
          item.type === "admin" &&
          password.trim() === password
        ) {
          dispatch(
            setDashboard({
              userDetails: {
                name: item.name,
                type: item.type,
                phone: item.phone,
              },
              appState: "admin",
            })
          );
          goToAdmin();
          break;
        } else {
          alert("Incorrect login details, or you do not have admin access. ");
        }
      }
    }
    // handle worker
    if (!isAdmin) {
      for (const item of users) {
        if (
          username.trim() === item.name &&
          item.type === "worker" &&
          password.trim() === password
        ) {
          dispatch(
            setDashboard({
              userDetails: {
                name: item.name,
                type: item.type,
                phone: item.phone,
              },
              appState: "worker",
            })
          );
          goToWorker();
          break;
        } else {
          alert("Incorrect login details, or you do not have admin access. ");
        }
      }
    }
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
