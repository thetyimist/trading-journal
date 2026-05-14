// ─────────────────────────────────────────────────────────────
// src/utils/export.js
// Excel (.xlsx) export using SheetJS (loaded from CDN on demand).
// Only loads the SheetJS library when the user clicks Export —
// not on app startup — so it doesn't slow the initial load.
// ─────────────────────────────────────────────────────────────

import { VERSION } from "../constants";
import { getDayName } from "./calculations";

/**
 * Lazy-load SheetJS from CDN.
 * Resolves immediately if already loaded.
 * @returns {Promise<void>}
 */
async function loadSheetJS() {
  if (window.XLSX) return;
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Failed to load SheetJS"));
    document.head.appendChild(script);
  });
}

/**
 * Export all trades and stats to a formatted .xlsx file.
 * Creates three sheets: TRADE LOG, DASHBOARD, INFO.
 *
 * @param {Object[]} trades  - Array of computed trade objects
 * @param {Object|null} stats - Stats object from useStats hook (can be null)
 * @returns {Promise<void>}
 */
export async function exportToXLSX(trades, stats) {
  await loadSheetJS();
  const XLSX = window.XLSX;
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: TRADE LOG ──────────────────────────────────────
  const headers = [
    "ID", "Date", "Day", "Stock", "Sector", "Trade Type",
    "Market Condition", "Setup", "Entry ₹", "Entry Time",
    "Stop Loss ₹", "Target ₹", "Qty", "Exit ₹", "Exit Time",
    "Gross P&L ₹", "Brokerage ₹", "Net P&L ₹", "Result",
    "R:R Ratio", "Risk ₹", "Rules Followed",
    "Emotion Entry", "Emotion Exit",
    "Did Right", "Did Wrong", "Lesson", "Chart Link", "Notes",
  ];

  const rows = trades.map((t) => [
    t.id,
    t.date,
    getDayName(t.date),
    t.stock,
    t.sector,
    t.tradeType,
    t.marketCondition,
    t.setup,
    parseFloat(t.entryPrice) || "",
    t.entryTime,
    parseFloat(t.stopLoss)   || "",
    parseFloat(t.target)     || "",
    parseFloat(t.quantity)   || "",
    parseFloat(t.exitPrice)  || "",
    t.exitTime,
    t.gross != null ? parseFloat(t.gross.toFixed(2))  : "",
    parseFloat(t.brokerage) || 0,
    t.net   != null ? parseFloat(t.net.toFixed(2))    : "",
    t.result,
    t.rr    != null ? parseFloat(t.rr.toFixed(2))     : "",
    t.risk  != null ? parseFloat(t.risk.toFixed(2))   : "",
    t.followedRules,
    t.emotionEntry,
    t.emotionExit,
    t.didRight,
    t.didWrong,
    t.lesson,
    t.chartLink,
    t.notes,
  ]);

  const ws1 = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws1["!cols"] = headers.map((_, i) => ({
    wch: i < 3 ? 12 : i < 8 ? 18 : i < 15 ? 11 : i < 22 ? 13 : 32,
  }));
  XLSX.utils.book_append_sheet(wb, ws1, "TRADE LOG");

  // ── Sheet 2: DASHBOARD ──────────────────────────────────────
  if (stats) {
    const p = (n) => parseFloat(n.toFixed(2));

    const dashRows = [
      ["PERFORMANCE DASHBOARD", ""],
      ["Generated", new Date().toLocaleString("en-IN")],
      ["", ""],

      ["── OVERALL STATS ──", ""],
      ["Total Trades",          stats.total],
      ["Winning Trades",        stats.wins.length],
      ["Losing Trades",         stats.losses.length],
      ["Win Rate %",            p(stats.winRate)],
      ["Total Net P&L ₹",       p(stats.totalNet)],
      ["Average Win ₹",         p(stats.avgWin)],
      ["Average Loss ₹",        p(stats.avgLoss)],
      ["Reward:Risk Ratio",     p(stats.rr)],
      ["Expectancy/Trade ₹",    p(stats.expectancy)],
      ["Biggest Win ₹",         p(stats.biggestWin)],
      ["Biggest Loss ₹",        p(stats.biggestLoss)],
      ["Rule Follow Rate %",    p(stats.ruleFollow)],
      ["P&L Rules Followed ₹",  p(stats.followedPnl)],
      ["P&L Rules Broken ₹",    p(stats.brokenPnl)],
      ["", ""],

      ["── SETUP PERFORMANCE ──", "", "", ""],
      ["Setup", "Trades", "Win Rate %", "Net P&L ₹"],
      ...Object.entries(stats.bySetup)
        .sort((a, b) => b[1].net - a[1].net)
        .map(([s, d]) => [
          s, d.count,
          p(d.wins / d.count * 100),
          p(d.net),
        ]),
      ["", ""],

      ["── MONTHLY P&L ──", "", "", ""],
      ["Month", "Trades", "Win Rate %", "Net P&L ₹"],
      ...Object.entries(stats.byMonth)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([m, d]) => [
          m, d.count,
          p(d.wins / d.count * 100),
          p(d.net),
        ]),
      ["", ""],

      ["── SECTOR PERFORMANCE ──", "", "", ""],
      ["Sector", "Trades", "Win Rate %", "Net P&L ₹"],
      ...Object.entries(stats.bySector)
        .sort((a, b) => b[1].net - a[1].net)
        .map(([s, d]) => [
          s, d.count,
          p(d.wins / d.count * 100),
          p(d.net),
        ]),
    ];

    const ws2 = XLSX.utils.aoa_to_sheet(dashRows);
    ws2["!cols"] = [{ wch: 28 }, { wch: 14 }, { wch: 14 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, ws2, "DASHBOARD");
  }

  // ── Sheet 3: INFO ───────────────────────────────────────────
  const infoRows = [
    ["Indian Equity Trading Journal"],
    ["Version",       VERSION],
    ["Exported on",   new Date().toLocaleString("en-IN")],
    ["Total Trades",  trades.length],
    ["", ""],
    ["Storage",       "localStorage (browser)"],
    ["License",       "MIT"],
    ["", ""],
    ["Note", "Export your trades regularly as a backup."],
    ["Note", "Clearing browser data will delete trades from the app."],
  ];

  const ws3 = XLSX.utils.aoa_to_sheet(infoRows);
  ws3["!cols"] = [{ wch: 18 }, { wch: 44 }];
  XLSX.utils.book_append_sheet(wb, ws3, "INFO");

  // ── Write File ──────────────────────────────────────────────
  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Trading_Journal_Export_${date}.xlsx`);
}