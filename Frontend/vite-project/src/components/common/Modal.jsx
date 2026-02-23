import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#2b2b2b",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: "20px 25px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 style={{ color: "#d4af37", margin: 0, fontSize: "20px", fontWeight: 700 }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "24px",
              cursor: "pointer",
              padding: "0 5px",
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: "25px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
