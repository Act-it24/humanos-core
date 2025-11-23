import React from "react";
import "./App.css";
import SelfOSPage from "./features/self-os/SelfOSPage.jsx";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "3rem 1.5rem 1rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            marginBottom: "0.5rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          HumanOS
        </h1>
        <p
          style={{
            fontSize: "1.05rem",
            opacity: 0.8,
          }}
        >
          Digital Life OS – Self, Work, Health & Beyond
        </p>
      </header>

      <main style={{ flex: 1 }}>
        {/* First pillar we bring to life: Self OS */}
        <SelfOSPage />
      </main>
    </div>
  );
}

export default App;