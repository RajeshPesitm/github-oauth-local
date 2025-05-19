import React from "react";

function Portfolio({ user }) {
  if (!user) return <h2 style={{ textAlign: "center", marginTop: "100px" }}>Please log in to view your portfolio.</h2>;

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "30px" }}>
        Portfolio of {user.username}
      </h1>
      <p style={{ fontSize: "20px", color: "#555" }}>
        This is where you can show financial or personal data related to {user.username}'s portfolio.
      </p>
    </div>
  );
}

export default Portfolio;
