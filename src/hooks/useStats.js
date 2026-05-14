// ─────────────────────────────────────────────────────────────
// src/hooks/useStats.js
// Computes all dashboard statistics from the trades array.
// Memoized — only recalculates when trades array changes.
// ─────────────────────────────────────────────────────────────

import { useMemo } from "react";

/**
 * useStats
 * Takes the full trades array and returns all computed stats
 * needed by the Dashboard component.
 *
 * @param {Object[]} trades - Array of computed trade objects
 * @returns {Object|null} - Stats object, or null if no trades
 */
export function useStats(trades) {
  return useMemo(() => {
    if (!trades.length) return null;

    // ── Win / Loss Split ──────────────────────────────────────
    const wins      = trades.filter((t) => t.result === "WIN");
    const losses    = trades.filter((t) => t.result === "LOSS");
    const breakeven = trades.filter((t) => t.result === "BE");

    // ── Core Metrics ──────────────────────────────────────────
    const totalNet  = trades.reduce((s, t) => s + (t.net || 0), 0);
    const winRate   = (wins.length / trades.length) * 100;

    const avgWin  = wins.length
      ? wins.reduce((s, t) => s + (t.net || 0), 0) / wins.length
      : 0;

    const avgLoss = losses.length
      ? losses.reduce((s, t) => s + (t.net || 0), 0) / losses.length
      : 0;

    // Reward:Risk = avgWin / |avgLoss|
    const rr = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : 0;

    // Expectancy = (winRate × avgWin) + (lossRate × avgLoss)
    const expectancy =
      (winRate / 100) * avgWin + (1 - winRate / 100) * avgLoss;

    // ── Extremes ──────────────────────────────────────────────
    const biggestWin  = wins.length
      ? Math.max(...wins.map((t) => t.net || 0))
      : 0;

    const biggestLoss = losses.length
      ? Math.min(...losses.map((t) => t.net || 0))
      : 0;

    // ── Discipline ────────────────────────────────────────────
    const ruleFollow =
      (trades.filter((t) => t.followedRules === "Yes").length /
        trades.length) *
      100;

    const followedPnl = trades
      .filter((t) => t.followedRules === "Yes")
      .reduce((s, t) => s + (t.net || 0), 0);

    const brokenPnl = trades
      .filter((t) => t.followedRules === "No")
      .reduce((s, t) => s + (t.net || 0), 0);

    const brokenCount = trades.filter(
      (t) => t.followedRules === "No"
    ).length;

    // ── Grouped Breakdowns ────────────────────────────────────
    const bySetup   = {};
    const bySector  = {};
    const byMonth   = {};
    const byType    = {};

    trades.forEach((t) => {
      // Setup
      const setup = t.setup || "Other";
      if (!bySetup[setup]) bySetup[setup] = { count: 0, net: 0, wins: 0 };
      bySetup[setup].count++;
      bySetup[setup].net += t.net || 0;
      if (t.result === "WIN") bySetup[setup].wins++;

      // Sector
      const sector = t.sector || "Other";
      if (!bySector[sector]) bySector[sector] = { count: 0, net: 0, wins: 0 };
      bySector[sector].count++;
      bySector[sector].net += t.net || 0;
      if (t.result === "WIN") bySector[sector].wins++;

      // Month (YYYY-MM)
      const month = t.date?.slice(0, 7) || "Unknown";
      if (!byMonth[month]) byMonth[month] = { count: 0, net: 0, wins: 0 };
      byMonth[month].count++;
      byMonth[month].net += t.net || 0;
      if (t.result === "WIN") byMonth[month].wins++;

      // Trade Type
      const type = t.tradeType || "Other";
      if (!byType[type]) byType[type] = { count: 0, net: 0, wins: 0 };
      byType[type].count++;
      byType[type].net += t.net || 0;
      if (t.result === "WIN") byType[type].wins++;
    });

    return {
      // Counts
      total:       trades.length,
      wins,
      losses,
      breakeven,

      // Core metrics
      totalNet,
      winRate,
      avgWin,
      avgLoss,
      rr,
      expectancy,

      // Extremes
      biggestWin,
      biggestLoss,

      // Discipline
      ruleFollow,
      followedPnl,
      brokenPnl,
      brokenCount,

      // Breakdowns
      bySetup,
      bySector,
      byMonth,
      byType,
    };
  }, [trades]);
}