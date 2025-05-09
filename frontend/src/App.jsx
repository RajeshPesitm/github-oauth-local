import { useState, useEffect } from "react";
import api from "./api";

function App() {
  const [user, setUser] = useState(null);

  const loginWithGithub = async () => {
    const res = await api.get("/auth/github/login");
    window.location.href = res.data.url;
  };

  const fetchUser = async (token) => {
    const res = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const deleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await api.delete("/auth/delete", {
        headers: { Authorization: `Bearer ${token}` }
      });
      logout();
    }
  };

  const checkForCallback = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    const code = params.get("code");

    if (token) {
      localStorage.setItem("token", token);
      await fetchUser(token);
      window.history.replaceState({}, document.title, "/");
    } else if (code) {
      const res = await api.get(`/auth/github/callback?code=${code}`);
      const { access_token } = res.data;
      localStorage.setItem("token", access_token);
      await fetchUser(access_token);
      window.history.replaceState({}, document.title, "/");
    }
  };

  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetchUser(token);
      } catch (err) {
        console.error("Failed to fetch user", err);
        logout();
      }
    }
  };

  useEffect(() => {
    checkForCallback();
    loadUser();
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", backgroundColor: "#fff" }}>
      {!user ? (
        <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
          <button
            onClick={loginWithGithub}
            style={{
              backgroundColor: "#000",
              color: "#fff",
              padding: "12px 24px",
              fontSize: "18px",
              fontWeight: "bold",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Login with GitHub
          </button>
        </div>
      ) : (
        <div style={{ padding: "40px" }}>
          {/* Top Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>PESITM</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
              <span
                onClick={logout}
                style={{ fontSize: "24px", color: "green", fontWeight: "bold", cursor: "pointer" }}
              >
                Logout
              </span>
              <span
                onClick={deleteAccount}
                style={{ fontSize: "24px", color: "red", fontWeight: "bold", cursor: "pointer" }}
              >
                Delete
              </span>
              <img
                src={user.avatar_url}
                alt="avatar"
                width="100"
                height="100"
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Main Content */}
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "30px" }}>
              Welcome to Prerana Bank, {user.username}!
            </h1>
            <button
              onClick={() => alert("View Portfolio clicked")}
              style={{
                backgroundColor: "#000",
                color: "#fff",
                padding: "20px 30px",
                fontSize: "28px",
                fontWeight: "bold",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer"
              }}
            >
              View Portfolio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
