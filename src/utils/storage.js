// ─────────────────────────────────────────────────────────────
// src/utils/storage.js
// All localStorage read/write helpers.
//
// FUTURE UPGRADE NOTE:
// When upgrading to Firebase, replace the bodies of these four
// functions only. Every other file in the project stays the same
// because nothing imports localStorage directly — only this file.
// ─────────────────────────────────────────────────────────────

/**
 * Read a value from localStorage.
 * Returns `fallback` if key doesn't exist or JSON parsing fails.
 *
 * @param {string} key
 * @param {*} fallback
 * @returns {*}
 */
export function storageGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Write a value to localStorage as JSON.
 * Silently fails if storage is full or unavailable.
 *
 * @param {string} key
 * @param {*} value
 */
export function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`[storage] Could not save key: ${key}`);
  }
}

/**
 * Remove a single key from localStorage.
 *
 * @param {string} key
 */
export function storageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn(`[storage] Could not remove key: ${key}`);
  }
}

/**
 * Clear all provided keys from localStorage.
 * Used for a full data reset.
 *
 * @param {string[]} keys
 */
export function storageClearAll(keys) {
  keys.forEach((k) => storageRemove(k));
}