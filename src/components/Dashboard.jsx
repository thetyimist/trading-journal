// ─────────────────────────────────────────────────────────────
// src/components/Dashboard.jsx
// Tab 0 — Performance analytics and charts.
// ─────────────────────────────────────────────────────────────

import { COLORS, resultColor } from "../constants";
import { fmtCurrency, fmtCurrencyRaw, fmtPct, fmt2 } from "../utils/calculations";
import { Card } from "./ui/Card";
import { BarRow } from "./ui/BarRow";

/**
 * Dashboard
 * @prop {Object|null} stats    - From useStats hook
 * @prop {Object[]}    trades   - Full trades array
 * @prop {Function}    onLogFirst - Navigate to Log Trade tab
 */
export function Dashboard({ stats, trades, onLogFirst }) {
  if (!stats) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: 64, marginBottom: 14 }}>📊</div>
        <div style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
          No trades yet
        </div>
        <div style={{ color: "#475569", fontSize: 13, marginBottom: 24 }}>
          Log your first trade to see your performance analytics
        </div>
        <button
          onClick={onLogFirst}
          style={{
            background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
            border: "none",
            color: "#fff",
            padding: "13px 28px",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
            fontFamily: "inherit",
          }}
        >
          📝 Log First Trade
        </button>
      </div>
    );
  }

  const maxSetupNet  = Math.max(...Object.values(stats.bySetup).map((d) => Math.abs(d.net)), 1);
  const maxMonthNet  = Math.max(...Object.values(stats.byMonth).map((d) => Math.abs(d.net)), 1);

  return (
    <div>
      {/* ── Key Stats Grid ───────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <Card label="Total Trades"   value={stats.total}                                               big />
        <Card label="Win Rate"       value={fmtPct(stats.winRate)}       color={stats.winRate >= 50 ? COLORS.win : COLORS.be} big />
        <Card label="Net P&L"        value={fmtCurrency(stats.totalNet)} color={stats.totalNet >= 0 ? COLORS.win : COLORS.loss} big />
        <Card label="Avg Win"        value={fmtCurrencyRaw(stats.avgWin)}                color={COLORS.win} />
        <Card label="Avg Loss"       value={fmtCurrencyRaw(Math.abs(stats.avgLoss))}     color={COLORS.loss} />
        <Card label="Reward:Risk"    value={"1 : " + fmt2(stats.rr)}     color={stats.rr >= 1.5 ? COLORS.win : COLORS.be} />
        <Card label="Expectancy"     value={fmtCurrency(stats.expectancy)} color={stats.expectancy >= 0 ? COLORS.win : COLORS.loss} sub="per trade" />
        <Card label="Rule Follow"    value={fmtPct(stats.ruleFollow)}    color={stats.ruleFollow >= 80 ? COLORS.win : COLORS.loss} />
        <Card label="Best Win"       value={fmtCurrencyRaw(stats.biggestWin)}            color={COLORS.win} />
        <Card label="Worst Loss"     value={fmtCurrencyRaw(Math.abs(stats.biggestLoss))} color={COLORS.loss} />
      </div>

      {/* ── Alerts ───────────────────────────────────────────── */}
      {stats.ruleFollow < 70 && (
        <Alert color="red">
          <strong>Discipline Alert — Rule Follow Rate: {fmtPct(stats.ruleFollow)}</strong>
          <br />
          Below 70%. Losses are likely from breaking your own rules, not a bad strategy.
          Fix execution before changing setup.
        </Alert>
      )}
      {stats.rr < 1 && stats.total >= 10 && (
        <Alert color="yellow">
          <strong>R:R Alert — Ratio: 1:{fmt2(stats.rr)}</strong>
          <br />
          Risking more than you make per trade. Even 60% win rate loses money long-term.
        </Alert>
      )}

      {/* ── Charts Row ───────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* Setup Performance */}
        <Panel title="🎯 Setup Performance">
          {Object.entries(stats.bySetup)
            .sort((a, b) => b[1].net - a[1].net)
            .map(([s, d]) => (
              <div key={s} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ color: "#94a3b8", fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "55%" }}>
                    {s}
                  </span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: "#475569", fontSize: 10 }}>{d.count}T</span>
                    <span style={{ color: "#475569", fontSize: 10 }}>{fmtPct(d.wins / d.count * 100)}</span>
                    <span style={{ color: d.net >= 0 ? COLORS.win : COLORS.loss, fontSize: 11, fontWeight: 700 }}>
                      {fmtCurrency(d.net)}
                    </span>
                  </div>
                </div>
                <BarRow value={d.net} max={maxSetupNet} color={d.net >= 0 ? COLORS.win : COLORS.loss} />
              </div>
            ))}
        </Panel>

        {/* Monthly P&L */}
        <Panel title="📅 Monthly P&L">
          {Object.entries(stats.byMonth)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .slice(0, 8)
            .map(([m, d]) => (
              <div key={m} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ color: "#64748b", fontSize: 11, width: 68, flexShrink: 0 }}>{m}</span>
                <div style={{ flex: 1 }}>
                  <BarRow value={d.net} max={maxMonthNet} color={d.net >= 0 ? COLORS.win : COLORS.loss} height={6} />
                </div>
                <span style={{ color: d.net >= 0 ? COLORS.win : COLORS.loss, fontSize: 11, fontWeight: 700, width: 90, textAlign: "right", flexShrink: 0 }}>
                  {fmtCurrency(d.net)}
                </span>
              </div>
            ))}
        </Panel>
      </div>

      {/* ── Bottom Row ───────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Sector */}
        <Panel title="🏭 Sector Performance">
          {Object.entries(stats.bySector)
            .sort((a, b) => b[1].net - a[1].net)
            .map(([s, d]) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "7px 10px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: 8,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600 }}>{s}</span>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: "#475569", fontSize: 11 }}>{d.count}T · {fmtPct(d.wins / d.count * 100)}</span>
                  <span style={{ color: d.net >= 0 ? COLORS.win : COLORS.loss, fontSize: 11, fontWeight: 700 }}>
                    {fmtCurrency(d.net)}
                  </span>
                </div>
              </div>
            ))}
        </Panel>

        {/* Discipline */}
        <Panel title="🧠 Discipline">
          {[
            { l: "P&L — Rules Followed",  v: fmtCurrency(stats.followedPnl), c: stats.followedPnl >= 0 ? COLORS.win : COLORS.loss },
            { l: "P&L — Rules Broken",    v: fmtCurrency(stats.brokenPnl),   c: stats.brokenPnl >= 0 ? COLORS.win : COLORS.loss },
            { l: "Trades Rules Broken",   v: stats.brokenCount,               c: COLORS.loss },
            { l: "Winning Trades",         v: stats.wins.length,               c: COLORS.win },
            { l: "Losing Trades",          v: stats.losses.length,             c: COLORS.loss },
            { l: "Breakeven Trades",       v: stats.breakeven.length,          c: COLORS.be },
          ].map(({ l, v, c }) => (
            <div
              key={l}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "7px 10px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: 8,
                marginBottom: 6,
              }}
            >
              <span style={{ color: "#64748b", fontSize: 12 }}>{l}</span>
              <span style={{ color: c, fontWeight: 700, fontSize: 12 }}>{v}</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

// ── Local helpers ─────────────────────────────────────────────

function Panel({ title, children }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: 18,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 13, color: "#e2e8f0", marginBottom: 14 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Alert({ color, children }) {
  const isRed = color === "red";
  return (
    <div
      style={{
        background: isRed ? "rgba(239,68,68,0.08)"  : "rgba(245,158,11,0.08)",
        border:     isRed ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(245,158,11,0.25)",
        borderRadius: 12,
        padding: "14px 18px",
        marginBottom: 14,
        display: "flex",
        gap: 10,
        fontSize: 12,
        color: isRed ? "#f87171" : "#fbbf24",
        lineHeight: 1.6,
      }}
    >
      <span>⚠️</span>
      <div>{children}</div>
    </div>
  );
}