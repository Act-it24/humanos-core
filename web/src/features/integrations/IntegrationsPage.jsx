import React from "react";

export default function IntegrationsPage() {
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
        border: "1px solid rgba(56,189,248,0.35)",
      }}
    >
      <h2
        style={{
          fontSize: "1.8rem",
          marginBottom: "0.75rem",
          fontWeight: 600,
        }}
      >
        Integrations Hub
      </h2>
      <p
        style={{
          fontSize: "0.98rem",
          lineHeight: 1.7,
          opacity: 0.9,
          marginBottom: "0.75rem",
        }}
      >
        The Integrations Hub connects HumanOS to the tools you already use
        (calendars, task apps and more). It is the bridge between your digital
        life outside and the Life Graph inside HumanOS.
      </p>
      <p
        style={{
          fontSize: "0.9rem",
          lineHeight: 1.6,
          opacity: 0.7,
        }}
      >
        In later versions, you will be able to connect Google Calendar and
        other services here so Daily OS can see your real schedule and create
        realistic plans. For now this is just a placeholder wired to the
        Integrations Hub blueprint.
      </p>
    </section>
  );
}