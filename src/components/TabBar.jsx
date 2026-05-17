// ─────────────────────────────────────────────────────────────
// src/components/TabBar.jsx
// Tab navigation bar — renders all 5 tabs.
// ─────────────────────────────────────────────────────────────

import { TABS, TAB_ICONS } from "../constants";

/**
 * TabBar
 * @prop {number}   activeTab - Index of the currently active tab
 * @prop {Function} onSelect  - Called with tab index when clicked
 */
export function TabBar({ activeTab, onSelect }) {
  return (
    <div
      style={{
        background: "rgba(0,0,0,0.2)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "0 20px",
        display: "flex",
        gap: 2,
        overflowX: "auto",
      }}
    >
      {TABS.map((label, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          style={{
            background: activeTab === i ? "rgba(59,130,246,0.12)" : "transparent",
            border: "none",
            color: activeTab === i ? "#60a5fa" : "#64748b",
            padding: "13px 16px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 12,
            borderBottom: activeTab === i ? "2px solid #3b82f6" : "2px solid transparent",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
            fontFamily: "inherit",
          }}
        >
          {TAB_ICONS[i]} {label}
        </button>
      ))}
    </div>
  );
}