import React from "react";

/**
 * EmptyState component for displaying placeholder content when data is not yet available
 * @param {Object} props
 * @param {string} props.title - Empty state title
 * @param {string} props.description - Empty state description
 * @param {React.ReactNode} props.action - Optional action button/component
 */
export default function EmptyState({ title, description, action }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "3rem 2rem",
        opacity: 0.7,
      }}
    >
      <h4
        style={{
          fontSize: "1.1rem",
          fontWeight: 500,
          marginBottom: "0.5rem",
          color: "#94a3b8",
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: "0.9rem",
          lineHeight: 1.6,
          color: "#64748b",
          marginBottom: action ? "1.5rem" : "0",
        }}
      >
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}

