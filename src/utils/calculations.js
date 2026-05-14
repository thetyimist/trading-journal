// ─────────────────────────────────────────────────────────────
// src/utils/calculations.js
// Pure functions — trade math, formatters, date helpers.
// No side effects. No React. No imports from other project files.
// Every function here is independently unit-testable.
// ─────────────────────────────────────────────────────────────

// ── Number Formatters ─────────────────────────────────────────

/**
 * Format a number to 2 decimal places (absolute value).
 * Returns "—" for null / undefined / NaN.
 * @param {number} n
 * @returns {string}
 */
export const fmt2 = (n) =>
  isNaN(n) || n == null ? "—" : Math.abs(n).toFixed(2);

/**
 * Format as Indian currency with +/- prefix.
 * e.g.  1234.5  → "+ ₹1,234.50"
 *       -345.0  → "- ₹345.00"
 * @param {number} n
 * @returns {string}
 */
export const fmtCurrency = (n) => {
  if (isNaN(n) || n == null) return "—";
  const abs = Math.abs(n)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (n >= 0 ? "+ ₹" : "- ₹") + abs;
};

/**
 * Format as Indian currency without prefix.
 * e.g. 1234.5 → "₹1,234.50"
 * @param {number} n
 * @returns {string}
 */
export const fmtCurrencyRaw = (n) => {
  if (isNaN(n) || n == null) return "—";
  const abs = Math.abs(n)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return "₹" + abs;
};

/**
 * Format as percentage to 1 decimal place.
 * e.g. 57.333 → "57.3%"
 * @param {number} n
 * @returns {string}
 */
export const fmtPct = (n) =>
  isNaN(n) || n == null ? "—" : n.toFixed(1) + "%";

// ── Date Helpers ──────────────────────────────────────────────

/**
 * Get full weekday name from a YYYY-MM-DD string.
 * e.g. "2026-05-12" → "Tuesday"
 * @param {string} dateStr
 * @returns {string}
 */
export const getDayName = (dateStr) => {
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
      weekday: "long",
    });
  } catch {
    return "";
  }
};

/**
 * Get 3-letter weekday abbreviation.
 * e.g. "2026-05-12" → "Tue"
 * @param {string} dateStr
 * @returns {string}
 */
export const getDayShort = (dateStr) => getDayName(dateStr).slice(0, 3);

// ── Trade Calculations ────────────────────────────────────────

/**
 * Compute derived fields for a raw trade object.
 * Adds: gross, net, result, rr (reward:risk ratio), risk (capital at risk).
 *
 * @param {Object} trade - Raw trade form data
 * @returns {Object} - Trade with all computed fields attached
 */
export function computeTrade(trade) {
  const entry  = parseFloat(trade.entryPrice);
  const exit   = parseFloat(trade.exitPrice);
  const qty    = parseFloat(trade.quantity);
  const brok   = parseFloat(trade.brokerage) || 0;
  const sl     = parseFloat(trade.stopLoss);
  const target = parseFloat(trade.target);

  const gross =
    !isNaN(entry) && !isNaN(exit) && !isNaN(qty)
      ? (exit - entry) * qty
      : null;

  const net = gross !== null ? gross - brok : null;

  const result =
    net === null ? "—" : net > 0 ? "WIN" : net < 0 ? "LOSS" : "BE";

  // R:R = |target - entry| / |entry - stopLoss|
  const rr =
    !isNaN(entry) && !isNaN(sl) && !isNaN(target) && entry - sl !== 0
      ? Math.abs((target - entry) / (entry - sl))
      : null;

  // Capital at risk = |entry - stopLoss| × qty
  const risk =
    !isNaN(entry) && !isNaN(sl) && !isNaN(qty)
      ? Math.abs(entry - sl) * qty
      : null;

  return { ...trade, gross, net, result, rr, risk };
}

/**
 * Compute live preview values while the Log Trade form is being filled.
 * Returns null for any value not yet calculable.
 *
 * @param {Object} form - Current form state
 * @returns {Object} - Live calculated values for UI preview
 */
export function computeLivePreview(form) {
  const entry  = parseFloat(form.entryPrice);
  const sl     = parseFloat(form.stopLoss);
  const target = parseFloat(form.target);
  const qty    = parseFloat(form.quantity);
  const exit   = parseFloat(form.exitPrice);
  const brok   = parseFloat(form.brokerage) || 0;

  const rr =
    !isNaN(entry) && !isNaN(sl) && !isNaN(target) && entry - sl !== 0
      ? Math.abs((target - entry) / (entry - sl))
      : null;

  const risk =
    !isNaN(entry) && !isNaN(sl) && !isNaN(qty)
      ? Math.abs(entry - sl) * qty
      : null;

  const gross =
    !isNaN(entry) && !isNaN(exit) && !isNaN(qty)
      ? (exit - entry) * qty
      : null;

  const net = gross !== null ? gross - brok : null;

  const riskPerShare   = !isNaN(entry) && !isNaN(sl)     ? Math.abs(entry - sl)     : null;
  const rewardPerShare = !isNaN(entry) && !isNaN(target)  ? Math.abs(target - entry) : null;

  return {
    rr, risk, gross, net, brok,
    riskPerShare, rewardPerShare,
    entry, sl, target, qty, exit,
  };
}