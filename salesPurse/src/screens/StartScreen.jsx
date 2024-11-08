import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../features/account/accountSlice";
import { startScreenStyles as styles } from "../styles/startScreen";

const StartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electron.ipcRenderer.invoke('query', {
        sql: 'SELECT * FROM users WHERE username = ? AND password = ?',
        params: [credentials.username, credentials.password]
      });

      console.log("Login result:", result);

      if (result && result.length > 0) {
        const user = result[0];
        console.log("Found user:", user);

        dispatch(loginSuccess({
          id: user.id,
          name: user.name,
          username: user.username,
          type: user.type,
          phone: user.phone
        }));

        console.log("Dispatched to Redux");

        if (user.type === 'admin') {
          navigate('/admin');
        } else {
          navigate('/worker');
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <h1 style={styles.title}>Sales Purse</h1>
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              style={styles.input}
              required
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartScreen; 