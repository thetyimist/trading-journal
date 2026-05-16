// ─────────────────────────────────────────────────────────────
// src/components/ui/BarRow.jsx
// Horizontal bar chart row — used in Dashboard breakdowns.
// ─────────────────────────────────────────────────────────────

/**
 * BarRow
 * @prop {number} value  - The value this bar represents
 * @prop {number} max    - The maximum value in the set (sets 100% width)
 * @prop {string} color  - Bar fill color
 * @prop {number} height - Bar height in px (default: 5)
 */
export function BarRow({ value, max, color, height = 5 }) {
  const width = max ? Math.min((Math.abs(value) / Math.abs(max)) * 100, 100) : 0;

  return (
    <div
      style={{
        height,
        background: "rgba(255,255,255,0.06)",
        borderRadius: 3,
        overflow: "hidden",
        marginTop: 4,
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: 3,
          background: color,
          width: `${width}%`,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}