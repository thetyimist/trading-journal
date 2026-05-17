// ─────────────────────────────────────────────────────────────
// src/components/Header.jsx
// Top navigation bar — logo, live P&L summary, export button.
// ─────────────────────────────────────────────────────────────

import { VERSION, COLORS } from "../constants";
import { fmtCurrency } from "../utils/calculations";

/**
 * Header
 * @prop {Object|null} stats      - Stats from useStats hook
 * @prop {boolean}     exporting  - Whether export is in progress
 * @prop {boolean}     hasTrades  - Whether any trades exist
 * @prop {Function}    onExport   - Export button handler
 * @prop {Function}    onAbout    - About button handler
 */
export function Header({ stats, exporting, hasTrades, onExport, onAbout }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Logo + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
            borderRadius: 10,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          📈
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: "#f1f5f9", lineHeight: 1 }}>
            Trading Journal
          </div>
          <div style={{ color: "#475569", fontSize: 10, marginTop: 2 }}>
            NSE · BSE · Indian Equity · {VERSION}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {/* Live P&L Summary */}
        {stats && (
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginRight: 6 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#475569", fontSize: 9, letterSpacing: 0.6 }}>NET P&L</div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: stats.totalNet >= 0 ? COLORS.win : COLORS.loss,
                }}
              >
                {fmtCurrency(stats.totalNet)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#475569", fontSize: 9, letterSpacing: 0.6 }}>TRADES</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#f1f5f9" }}>
                {stats.total}
              </div>
            </div>
          </div>
        )}

        {/* Export Button */}
        <button
          onClick={onExport}
          disabled={exporting || !hasTrades}
          style={{
            background: hasTrades
              ? "linear-gradient(135deg,#10b981,#059669)"
              : "rgba(255,255,255,0.04)",
            border: "none",
            color: hasTrades ? "#fff" : "#475569",
            padding: "8px 14px",
            borderRadius: 10,
            cursor: hasTrades ? "pointer" : "not-allowed",
            fontWeight: 700,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            fontFamily: "inherit",
          }}
        >
          {exporting ? "⏳" : "⬇️"} {exporting ? "Exporting..." : "Export Excel"}
        </button>

        {/* About Button */}
        <button
          onClick={onAbout}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#64748b",
            padding: "8px 12px",
            borderRadius: 10,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          ℹ️
        </button>
      </div>
    </div>
  );
}