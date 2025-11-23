import React from "react";

export default function SelfOSPage() {
  return (
    <section
      style={{
        padding: "2rem",
        background: "#050816",
        color: "#ffffff",
        borderRadius: "1.5rem",
        maxWidth: "720px",
        margin: "2rem auto",
        boxShadow: "0 18px 45px rgba(0,0,0,0.6)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <h2
        style={{
          fontSize: "1.8rem",
          marginBottom: "0.75rem",
          fontWeight: 600,
        }}
      >
        Self OS (Core Identity)
      </h2>
      <p
        style={{
          fontSize: "0.98rem",
          lineHeight: 1.7,
          opacity: 0.9,
          marginBottom: "0.75rem",
        }}
      >
        This is the kernel of your inner world: your personality patterns,
        values, energy rhythms, and life context. In future versions, this
        screen will show your real Self OS profile, generated from onboarding
        assessments and daily reflections.
      </p>
      <p
        style={{
          fontSize: "0.9rem",
          lineHeight: 1.6,
          opacity: 0.7,
        }}
      >
        For now, it is just a placeholder so we can connect the product
        blueprints to real UI code and grow HumanOS step by step.
      </p>
    </section>
  );
}
