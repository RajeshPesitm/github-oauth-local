// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import api from "./api";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    }

    window.addEventListener("message", (event) => {
      console.log("Received postMessage", event.origin, event.data);

      const allowedOrigins = [
        "https://fantastic-capybara-jj9v694r4qrcqpr4-8000.app.github.dev", // backend
        "https://fantastic-capybara-jj9v694r4qrcqpr4-5173.app.github.dev", // frontend
      ];
      if (!allowedOrigins.includes(event.origin)) return;

      const token = event.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        fetchUser(token);
      }
    });
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  const loginWithGithub = async () => {
    try {
      const res = await api.get("/auth/github/login");
      const authWindow = window.open(res.data.url, "_blank", "width=600,height=700");

      const interval = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(interval);
        }
      }, 500);
    } catch (err) {
      console.error("GitHub login failed", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete("/auth/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      logout();
    } catch (err) {
      console.error("Account deletion failed", err);
    }
  };

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
