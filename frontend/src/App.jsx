import { useState, useEffect } from "react";  // ✅ import useEffect
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
    const token = params.get("access_token");  // Fetch the token from URL query parameters
    const code = params.get("code");
    
    if (token) {
      localStorage.setItem("token", token);
      await fetchUser(token);
      window.history.replaceState({}, document.title, "/");  // clean URL
    } else if (code) {
      const res = await api.get(`/auth/github/callback?code=${code}`); // Call backend with code to fetch token
      const { access_token } = res.data;
      localStorage.setItem("token", access_token);
      await fetchUser(access_token);
      window.history.replaceState({}, document.title, "/");  // clean URL
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

  useEffect(() => {   // ✅ CORRECT: useEffect now
    checkForCallback();
    loadUser();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!user ? (
        <button onClick={loginWithGithub}>Login with GitHub</button>
      ) : (
        <div>
          <h1>Welcome, {user.username}!</h1>
          <img src={user.avatar_url} width="100" alt="avatar" />
          <div style={{ marginTop: "20px" }}>
            <button onClick={logout} style={{ marginRight: "10px" }}>
              Logout
            </button>
            <button onClick={deleteAccount} style={{ color: "red" }}>
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

