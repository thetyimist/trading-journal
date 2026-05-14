// ─────────────────────────────────────────────────────────────
// src/hooks/useToast.js
// Toast notification state — success and error messages.
// Used across the app for user feedback after actions.
// ─────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";

/**
 * useToast
 * Provides toast state and a show function.
 *
 * @returns {{ toast: Object|null, showToast: Function }}
 *
 * Usage:
 *   const { toast, showToast } = useToast();
 *   showToast("Trade logged ✓");
 *   showToast("Something went wrong", "error");
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  return { toast, showToast };
}