// ─────────────────────────────────────────────────────────────
// src/hooks/useTrades.js
// All trade state management — add, edit, delete, form state.
// The single source of truth for trade data in the app.
// Persists to localStorage on every change via storage utils.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS, DEFAULT_TRADE } from "../constants";
import { storageGet, storageSet } from "../utils/storage";
import { computeTrade } from "../utils/calculations";

/**
 * useTrades
 * Manages the full lifecycle of trade data.
 *
 * @returns {Object} - Trade state and action handlers
 */
export function useTrades() {
  // ── State ───────────────────────────────────────────────────
  const [trades, setTrades] = useState(() =>
    storageGet(STORAGE_KEYS.trades, [])
  );

  const [form, setForm] = useState({ ...DEFAULT_TRADE });
  const [editId, setEditId] = useState(null);

  // ── Persist to localStorage on every trades change ──────────
  useEffect(() => {
    storageSet(STORAGE_KEYS.trades, trades);
  }, [trades]);

  // ── Form Helpers ────────────────────────────────────────────

  /**
   * Update a single field in the form.
   * @param {string} key
   * @param {*} value
   */
  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  /** Reset form to defaults and clear edit mode. */
  const resetForm = useCallback(() => {
    setForm({ ...DEFAULT_TRADE });
    setEditId(null);
  }, []);

  // ── CRUD Actions ─────────────────────────────────────────────

  /**
   * Submit the current form — either adds a new trade or
   * updates an existing one if editId is set.
   *
   * @returns {{ success: boolean, error?: string }}
   */
  const submitTrade = useCallback(() => {
    // Validate required fields
    const required = ["stock", "setup", "entryPrice", "exitPrice", "quantity"];
    for (const key of required) {
      if (!form[key]) {
        return {
          success: false,
          error: `Please fill required field: ${key}`,
        };
      }
    }

    const computed = computeTrade({ ...form, id: editId || Date.now() });

    if (editId) {
      setTrades((prev) =>
        prev.map((t) => (t.id === editId ? computed : t))
      );
    } else {
      setTrades((prev) => [...prev, computed]);
    }

    resetForm();
    return { success: true };
  }, [form, editId, resetForm]);

  /**
   * Load a trade into the form for editing.
   * @param {Object} trade
   */
  const startEdit = useCallback((trade) => {
    setForm({ ...trade });
    setEditId(trade.id);
  }, []);

  /** Cancel edit mode without saving. */
  const cancelEdit = useCallback(() => {
    resetForm();
  }, [resetForm]);

  /**
   * Permanently delete a trade by ID.
   * @param {number} id
   */
  const deleteTrade = useCallback((id) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Derived Data ─────────────────────────────────────────────

  /** Unique months present in trade data, newest first. */
  const months = [
    ...new Set(trades.map((t) => t.date?.slice(0, 7)).filter(Boolean)),
  ].sort().reverse();

  return {
    // State
    trades,
    form,
    editId,
    months,

    // Form actions
    setField,
    resetForm,
    cancelEdit,

    // Trade actions
    submitTrade,
    startEdit,
    deleteTrade,
  };
}