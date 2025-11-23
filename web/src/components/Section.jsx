import React from "react";

/**
 * Section component for organizing content into distinct areas
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.children - Section content
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
export default function Section({ title, children, className = "", style = {} }) {
  return (
    <section
      className={`section ${className}`}
      style={{
        marginBottom: "2rem",
        ...style,
      }}
    >
      {title && (
        <h3
          style={{
            fontSize: "1.3rem",
            fontWeight: 600,
            marginBottom: "1rem",
            color: "#e5e7eb",
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

