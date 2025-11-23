import React from "react";

export default function AutomationsPage() {
  return (
    <section
      style={{
        padding: "2rem",
        background: "#020617",
        color: "#ffffff",
        borderRadius: "1.5rem",
        maxWidth: "720px",
        margin: "2rem auto 3rem",
        boxShadow: "0 18px 40px rgba(15,23,42,0.9)",
        border: "1px solid rgba(94,234,212,0.35)",
      }}
    >
      <h2
        style={{
          fontSize: "1.8rem",
          marginBottom: "0.75rem",
          fontWeight: 600,
        }}
      >
        Automations & AI Co-pilot
      </h2>
      <p
        style={{
          fontSize: "0.98rem",
          lineHeight: 1.7,
          opacity: 0.9,
          marginBottom: "0.75rem",
        }}
      >
        This is the automation layer of HumanOS: the rules, agents and
        background intelligence that keep your system up-to-date without you
        micromanaging everything.
      </p>
      <p
        style={{
          fontSize: "0.9rem",
          lineHeight: 1.6,
          opacity: 0.7,
        }}
      >
        Later, you will be able to turn on opinionated automations, see what
        each agent is allowed to do, and review a history of suggestions and
        changes. For now, this block is a placeholder connected to the AI
        Agents & Automation blueprint.
      </p>
    </section>
  );
}