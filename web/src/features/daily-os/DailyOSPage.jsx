import React from "react";

export default function DailyOSPage() {
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
        Daily OS (Today & This Week)
      </h2>
      <p
        style={{
          fontSize: "0.98rem",
          lineHeight: 1.7,
          opacity: 0.9,
          marginBottom: "0.75rem",
        }}
      >
        Daily OS is where your life plan meets your real calendar. It helps you
        see what really fits into today and this week, based on your energy,
        commitments and priorities.
      </p>
      <p
        style={{
          fontSize: "0.9rem",
          lineHeight: 1.6,
          opacity: 0.7,
        }}
      >
        In future versions, this screen will show a structured plan for today
        and the week: focus blocks, deep work, breaks, and recovery time —
        generated from your Life Map, Self OS and external calendars. For now,
        it is a simple placeholder wired into the HumanOS kernel.
      </p>
    </section>
  );
}