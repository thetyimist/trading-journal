// ─────────────────────────────────────────────────────────────
// src/components/ui/SectionTitle.jsx
// Colored left-border section header used in LogTrade form.
// ─────────────────────────────────────────────────────────────

import { COLORS } from "../../constants";

/**
 * SectionTitle
 * @prop {string} title  - Section heading text
 * @prop {string} color  - Left border color (defaults to blue)
 */
export function SectionTitle({ title, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          width: 3,
          height: 16,
          borderRadius: 2,
          background: color || COLORS.blue,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          color: "#e2e8f0",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {title}
      </span>
    </div>
  );
}