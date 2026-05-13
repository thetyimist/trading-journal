export const VERSION = "v1.0.0";

// ── Dropdown Options ──────────────────────────────────────────

export const SETUPS = [
  "Breakout",
  "Breakdown",
  "Trend Continuation",
  "Reversal",
  "Support Bounce",
  "Resistance Rejection",
  "Gap Up Play",
  "Gap Down Play",
  "VWAP Bounce",
  "MA Cross",
  "Other",
];

export const EMOTIONS = [
  "Confident",
  "Calm",
  "Hesitant",
  "Anxious",
  "FOMO",
  "Greedy",
  "Revenge",
  "Overconfident",
  "Disciplined",
  "Neutral",
];

export const TRADE_TYPES = ["Delivery", "Intraday", "Swing"];

export const SECTORS = [
  "Banking",
  "IT",
  "FMCG",
  "Auto",
  "Pharma",
  "Metal",
  "Energy",
  "Realty",
  "Infra",
  "Telecom",
  "Other",
];

export const MARKET_CONDITIONS = [
  "Trending Up",
  "Trending Down",
  "Sideways",
  "High Volatility",
  "Low Volatility",
];

export const RULES_FOLLOWED_OPTIONS = ["Yes", "No", "Partially"];

// ── Navigation ────────────────────────────────────────────────

export const TABS = [
  "Dashboard",
  "Log Trade",
  "Trade History",
  "Monthly Review",
  "My Rules",
];

export const TAB_ICONS = ["📊", "📝", "📋", "📅", "📜"];

// ── Colors ────────────────────────────────────────────────────

export const COLORS = {
  win:    "#10b981",
  loss:   "#ef4444",
  be:     "#f59e0b",
  blue:   "#3b82f6",
  purple: "#8b5cf6",
  pink:   "#ec4899",
  cyan:   "#06b6d4",
  orange: "#f97316",
  indigo: "#6366f1",
};

// ── Result Helpers ────────────────────────────────────────────

export const resultColor = (r) =>
  r === "WIN" ? COLORS.win : r === "LOSS" ? COLORS.loss : r === "BE" ? COLORS.be : "#94a3b8";

export const resultBg = (r) =>
  r === "WIN"  ? "rgba(16,185,129,0.1)"  :
  r === "LOSS" ? "rgba(239,68,68,0.1)"   :
  r === "BE"   ? "rgba(245,158,11,0.1)"  :
  "rgba(148,163,184,0.08)";

// ── Default Form State ────────────────────────────────────────

export const DEFAULT_TRADE = {
  date:            new Date().toISOString().slice(0, 10),
  stock:           "",
  sector:          "",
  tradeType:       "Delivery",
  marketCondition: "Trending Up",
  setup:           "",
  entryPrice:      "",
  entryTime:       "",
  stopLoss:        "",
  target:          "",
  quantity:        "",
  exitPrice:       "",
  exitTime:        "",
  brokerage:       "",
  followedRules:   "Yes",
  emotionEntry:    "",
  emotionExit:     "",
  didRight:        "",
  didWrong:        "",
  lesson:          "",
  chartLink:       "",
  notes:           "",
};

// ── Default Trading Rules ─────────────────────────────────────

export const DEFAULT_RULES = `ENTRY RULES
1. Only enter trades matching a defined setup — no exceptions.
2. Define stop loss BEFORE entering. No stop loss = no trade.
3. Minimum R:R ratio must be 1.5 before entering.
4. For breakouts: wait for candle CLOSE above the level.
5. Do not chase trades that have already moved significantly.

EXIT RULES
1. NEVER move stop loss in the direction of a loss.
2. Exit at predefined target — not out of greed.
3. If market conditions change significantly, early exit is allowed.
4. Do not re-enter a trade stopped out on the same day.

POSITION SIZING
1. Max risk per trade = 1.5% of total capital.
2. Max capital in one stock = 30%.
3. Max simultaneous positions = 3.
4. Calculate size BEFORE placing the order.

PSYCHOLOGICAL RULES
1. After 2 consecutive losses in a day — STOP for that day.
2. No setup = no trade. Never trade out of boredom.
3. No revenge trading. A loss is a business expense.
4. Log every trade within 30 minutes of closing it.
5. Read these rules every morning before 9:15 AM.

NEVER DO
1. Trade without a predefined stop loss.
2. Average down on a losing trade.
3. Follow Telegram / WhatsApp tips.
4. Skip journaling because embarrassed about the result.
5. Add capital after a losing month to recover faster.`;

// ── localStorage Keys ─────────────────────────────────────────

export const STORAGE_KEYS = {
  trades:  "tj_trades",
  rules:   "tj_rules",
  reviews: "tj_reviews",
};