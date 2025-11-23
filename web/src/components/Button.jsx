import React from "react";

/**
 * Button component with consistent styling
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label
 * @param {Function} props.onClick - Click handler
 * @param {string} props.variant - Button style variant: 'primary' | 'secondary' | 'ghost'
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  style = {},
}) {
  const baseStyle = {
    padding: "0.55rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid transparent",
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.18s ease-out",
    outline: "none",
    ...style,
  };

  const variantStyles = {
    primary: {
      background: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(56,189,248,0.18))",
      borderColor: "rgba(96,165,250,0.9)",
      color: "#e5e7eb",
      boxShadow: "0 6px 16px rgba(15,23,42,0.8)",
    },
    secondary: {
      background: "rgba(15,23,42,0.85)",
      borderColor: "rgba(148,163,184,0.4)",
      color: "#e5e7eb",
      boxShadow: "0 6px 16px rgba(15,23,42,0.8)",
    },
    ghost: {
      background: "transparent",
      borderColor: "transparent",
      color: "#94a3b8",
    },
  };

  const disabledStyle = disabled
    ? {
        opacity: 0.5,
        cursor: "not-allowed",
      }
    : {};

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={className}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...disabledStyle,
      }}
    >
      {children}
    </button>
  );
}

