import React from "react";

function Navbar({ user, logout, deleteAccount }) {
  if (!user) return null;

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "40px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>PESITM</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        <span onClick={logout} style={{ fontSize: "24px", color: "green", fontWeight: "bold", cursor: "pointer" }}>
          Logout
        </span>
        <span onClick={deleteAccount} style={{ fontSize: "24px", color: "red", fontWeight: "bold", cursor: "pointer" }}>
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
  );
}

export default Navbar;
