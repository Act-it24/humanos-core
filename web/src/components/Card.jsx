import React from "react";

/**
 * Card component for displaying content in a contained, elevated container
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to display inside the card
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
export default function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`card ${className}`}
      style={{
        padding: "2rem",
        background: "#020617",
        color: "#ffffff",
        borderRadius: "1.5rem",
        maxWidth: "720px",
        margin: "2rem auto",
        boxShadow: "0 18px 40px rgba(15,23,42,0.9)",
        border: "1px solid rgba(148,163,184,0.25)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

