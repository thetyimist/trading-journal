// ─────────────────────────────────────────────────────────────
// src/components/ui/Pill.jsx
// Small label badge — used for WIN/LOSS, setup, sector, type.
// ─────────────────────────────────────────────────────────────

/**
 * Pill
 * @prop {string} label - Text to display
 * @prop {string} color - Text color
 * @prop {string} bg    - Background color
 */
export function Pill({ label, color, bg }) {
  return (
    <span
      style={{
        background: bg || "rgba(255,255,255,0.08)",
        color: color || "#94a3b8",
        borderRadius: 20,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}