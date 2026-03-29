/* eslint-disable react-hooks/exhaustive-deps */
// ═══════════════════════════════════════════════════════════════════════════
// SAFE LOCALSTORAGE HELPERS
// Typed get/set with fallbacks, never throws
// ═══════════════════════════════════════════════════════════════════════════

const PREFIX = 'suvidha_';

/**
 * Get value from localStorage with a default fallback
 */
export const getStorage = (key, defaultValue = null) => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
};

/**
 * Set value in localStorage (JSON serialized)
 */
export const setStorage = (key, value) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn('[SUVIDHA Storage] Write failed:', err.message);
  }
};

/**
 * Remove a key from localStorage
 */
export const removeStorage = (key) => {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // Ignore
  }
};

/**
 * Clear all SUVIDHA keys from localStorage
 */
export const clearSession = () => {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
  } catch {
    // Ignore
  }
};
