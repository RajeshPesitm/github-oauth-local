import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import api from "./api";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";

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
    <Router>
      <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", backgroundColor: "#fff" }}>
        <Navbar user={user} logout={logout} deleteAccount={deleteAccount} />
        <Routes>
          <Route path="/" element={<Home user={user} loginWithGithub={loginWithGithub} />} />
          <Route path="/portfolio" element={<Portfolio user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
