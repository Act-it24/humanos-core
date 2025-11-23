import React from "react";

export default function LifeMapPage() {
  return (
    <section
      style={{
        padding: "2rem",
        background: "#020617",
        color: "#ffffff",
        borderRadius: "1.5rem",
        maxWidth: "720px",
        margin: "2rem auto",
        boxShadow: "0 18px 40px rgba(15,23,42,0.9)",
        border: "1px solid rgba(148,163,184,0.25)",
      }}
    >
      <h2
        style={{
          fontSize: "1.8rem",
          marginBottom: "0.75rem",
          fontWeight: 600,
        }}
      >
        Life Map OS (Domains, Goals & Projects)
      </h2>
      <p
        style={{
          fontSize: "0.98rem",
          lineHeight: 1.7,
          opacity: 0.9,
          marginBottom: "0.75rem",
        }}
      >
        Life Map OS organizes your life into domains, goals and projects. It
        ties everything you do back to what truly matters: health, relationships,
        creativity, work, money, and more.
      </p>
      <p
        style={{
          fontSize: "0.9rem",
          lineHeight: 1.6,
          opacity: 0.7,
        }}
      >
        In future versions, this screen will show your active domains, long-term
        goals, and concrete projects, all connected to your Self OS values and
        traits. For now, it is a placeholder so we can wire the architecture and
        blueprints into real UI.
      </p>
    </section>
  );
}