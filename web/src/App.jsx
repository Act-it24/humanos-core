import React, { useState } from "react";
import "./App.css";
import SelfOSPage from "./features/self-os/SelfOSPage.jsx";
import LifeMapPage from "./features/life-map/LifeMapPage.jsx";
import DailyOSPage from "./features/daily-os/DailyOSPage.jsx";
import JournalMoodPage from "./features/journal-mood/JournalMoodPage.jsx";
import IntegrationsPage from "./features/integrations/IntegrationsPage.jsx";
import AutomationsPage from "./features/automations/AutomationsPage.jsx";

const SECTIONS = [
  { id: "self-os", label: "Self OS", component: <SelfOSPage /> },
  { id: "life-map", label: "Life Map", component: <LifeMapPage /> },
  { id: "daily-os", label: "Daily OS", component: <DailyOSPage /> },
  { id: "journal-mood", label: "Journal & Mood", component: <JournalMoodPage /> },
  { id: "integrations", label: "Integrations", component: <IntegrationsPage /> },
  { id: "automations", label: "Automations & AI", component: <AutomationsPage /> },
];

function App() {
  const [activeSectionId, setActiveSectionId] = useState("self-os");
  const activeSection = SECTIONS.find((s) => s.id === activeSectionId) ?? SECTIONS[0];

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
      {/* Header */}
      <header
        style={{
          padding: "2.5rem 1.5rem 0.5rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            marginBottom: "0.4rem",
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
            marginBottom: "1.5rem",
          }}
        >
          Digital Life OS – Self, Work, Health & Beyond
        </p>
      </header>

      {/* Navigation Tabs */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
          padding: "0 1rem 1.5rem",
        }}
      >
        {SECTIONS.map((section) => {
          const isActive = section.id === activeSectionId;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              style={{
                padding: "0.55rem 0.9rem",
                borderRadius: "999px",
                border: isActive
                  ? "1px solid rgba(96,165,250,0.9)"
                  : "1px solid rgba(148,163,184,0.4)",
                background: isActive
                  ? "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(56,189,248,0.18))"
                  : "rgba(15,23,42,0.85)",
                color: "#e5e7eb",
                fontSize: "0.85rem",
                cursor: "pointer",
                outline: "none",
                boxShadow: isActive
                  ? "0 10px 25px rgba(15,23,42,0.9)"
                  : "0 6px 16px rgba(15,23,42,0.8)",
                transition: "all 0.18s ease-out",
                backdropFilter: "blur(8px)",
              }}
            >
              {section.label}
            </button>
          );
        })}
      </nav>

      {/* Active Section */}
      <main
        style={{
          flex: 1,
          padding: "0 1rem 3rem",
        }}
      >
        {activeSection.component}
      </main>
    </div>
  );
}

export default App;