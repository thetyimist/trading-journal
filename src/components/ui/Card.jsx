// ─────────────────────────────────────────────────────────────
// src/components/ui/Card.jsx
// Stat card used on the Dashboard.
// ─────────────────────────────────────────────────────────────

export function Card({ label, value, sub, color, big }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: big ? "18px 20px" : "14px 18px",
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: color || "#f1f5f9",
          fontSize: big ? 24 : 18,
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ color: "#475569", fontSize: 10, marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  );
}