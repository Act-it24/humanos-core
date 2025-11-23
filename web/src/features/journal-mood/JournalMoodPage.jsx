import React from "react";

export default function JournalMoodPage() {
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
        Journal & Mood OS
      </h2>
      <p
        style={{
          fontSize: "0.98rem",
          lineHeight: 1.7,
          opacity: 0.9,
          marginBottom: "0.75rem",
        }}
      >
        Journal & Mood OS is the reflective layer of HumanOS. It captures your
        daily experiences, emotions and patterns so the system can understand
        what really affects your energy, focus and wellbeing.
      </p>
      <p
        style={{
          fontSize: "0.9rem",
          lineHeight: 1.6,
          opacity: 0.7,
        }}
      >
        Later, this screen will host quick mood check-ins, rich journal entries,
        and AI reflections that connect your inner world with your plans. For
        now it is a placeholder wired into the core HumanOS kernel.
      </p>
    </section>
  );
}