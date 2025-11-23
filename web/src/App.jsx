import React from "react";
import "./App.css";
import SelfOSPage from "./features/self-os/SelfOSPage.jsx";
import LifeMapPage from "./features/life-map/LifeMapPage.jsx";
import DailyOSPage from "./features/daily-os/DailyOSPage.jsx";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #0f172a 0, #020617 55%, #000 100%)",
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

      <main
        style={{
          flex: 1,
          paddingBottom: "3rem",
        }}
      >
        {/* Kernel pillars we start with */}
        <SelfOSPage />
        <LifeMapPage />
        <DailyOSPage />
      </main>
    </div>
  );
}

export default App;