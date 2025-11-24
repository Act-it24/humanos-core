import React, { useEffect } from "react";

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} props.title
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode=} props.footer
 */
export default function Modal({ isOpen, onClose, title, children, footer }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,0.75)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "2rem 1.5rem",
        overflowY: "auto",
        zIndex: 1000,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "820px",
          background: "rgba(2,6,23,0.98)",
          borderRadius: "1.1rem",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
          border: "1px solid rgba(148,163,184,0.35)",
          padding: "1.25rem 1.5rem 1.4rem",
          color: "#e5e7eb",
          position: "relative",
        }}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "0.9rem",
            right: "0.9rem",
            background: "rgba(15,23,42,0.7)",
            border: "1px solid rgba(148,163,184,0.45)",
            borderRadius: "0.55rem",
            color: "#e5e7eb",
            padding: "0.35rem 0.5rem",
            cursor: "pointer",
          }}
        >
          X
        </button>

        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.3rem" }}>{title}</h3>
        </div>

        <div style={{ marginBottom: footer ? "1.5rem" : 0 }}>{children}</div>

        {footer && (
          <div
            style={{
              borderTop: "1px solid rgba(148,163,184,0.15)",
              paddingTop: "1rem",
              display: "flex",
              justifyContent: "space-between",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
