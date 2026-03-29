/* eslint-disable react-hooks/exhaustive-deps */
// ═══════════════════════════════════════════════════════════════════════════
// SECURITY UTILITIES
// XSS prevention, input validation, rate limiting
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sanitize user input to prevent XSS attacks
 * Strips HTML tags and encodes dangerous characters
 */
export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Strip all HTML tags from input (for display purposes)
 */
export const stripTags = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '');
};

/**
 * Validate Indian mobile number (10 digits, starts with 6-9)
 */
export const validateMobile = (num) => {
  return /^[6-9]\d{9}$/.test(num);
};

/**
 * Validate 6-digit OTP
 */
export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

/**
 * Validate 12-digit Aadhaar number (basic format check)
 */
export const validateAadhaar = (num) => {
  return /^\d{12}$/.test(num);
};

/**
 * Simple in-memory rate limiter
 * Tracks attempts per key (e.g., phone number) within a time window
 */
export class RateLimiter {
  constructor(maxAttempts = 3, windowMs = 5 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.store = new Map();
  }

  /**
   * Check if the key is rate-limited
   * @returns {boolean} true if allowed, false if rate-limited
   */
  check(key) {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry) return true;

    // Clear expired entries
    if (now - entry.firstAttempt > this.windowMs) {
      this.store.delete(key);
      return true;
    }

    return entry.attempts < this.maxAttempts;
  }

  /**
   * Record an attempt for the key
   * @returns {boolean} true if allowed, false if now rate-limited
   */
  attempt(key) {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now - entry.firstAttempt > this.windowMs) {
      this.store.set(key, { attempts: 1, firstAttempt: now });
      return true;
    }

    entry.attempts += 1;
    return entry.attempts <= this.maxAttempts;
  }

  /**
   * Get remaining attempts for a key
   */
  remaining(key) {
    const now = Date.now();
    const entry = this.store.get(key);
    if (!entry || now - entry.firstAttempt > this.windowMs) return this.maxAttempts;
    return Math.max(0, this.maxAttempts - entry.attempts);
  }

  /**
   * Reset rate limit for a key
   */
  reset(key) {
    this.store.delete(key);
  }
}

// Singleton rate limiter for OTP attempts
export const otpRateLimiter = new RateLimiter(3, 5 * 60 * 1000);
