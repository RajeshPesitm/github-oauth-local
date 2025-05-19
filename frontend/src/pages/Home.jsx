import React from "react";
import { useNavigate } from "react-router-dom";

function Home({ user, loginWithGithub }) {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={{ display: "flex", height: "80vh", alignItems: "center", justifyContent: "center" }}>
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
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "30px" }}>
        Welcome to Prerana Bank, {user.username}!
      </h1>
      <button
        onClick={() => navigate("/portfolio")}
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
  );
}

export default Home;
