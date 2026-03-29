// ═══════════════════════════════════════════════════════════════════════════
// Firebase Configuration (Optional – falls back to mock if not configured)
// ═══════════════════════════════════════════════════════════════════════════
// To enable real OTP:
// 1. Run: npm install firebase
// 2. Create a Firebase project, enable Phone Authentication
// 3. Set these environment variables in .env:
//    REACT_APP_FIREBASE_API_KEY
//    REACT_APP_FIREBASE_AUTH_DOMAIN
//    REACT_APP_FIREBASE_PROJECT_ID
//    REACT_APP_FIREBASE_APP_ID

let auth = null;
let firebaseReady = false;
let confirmationResult = null;
let _RecaptchaVerifier = null;
let _signInWithPhoneNumber = null;

const initFirebase = async () => {
  const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
  if (!apiKey) {
    console.info('[SUVIDHA] Firebase not configured – using mock OTP.');
    return;
  }

  try {
    /* eslint-disable no-unused-vars */
    const firebaseApp = await import(/* webpackIgnore: true */ 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const firebaseAuth = await import(/* webpackIgnore: true */ 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    /* eslint-enable no-unused-vars */

    const app = firebaseApp.initializeApp({
      apiKey,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
    });

    auth = firebaseAuth.getAuth(app);
    _RecaptchaVerifier = firebaseAuth.RecaptchaVerifier;
    _signInWithPhoneNumber = firebaseAuth.signInWithPhoneNumber;
    firebaseReady = true;
    console.info('[SUVIDHA] Firebase Auth initialized.');
  } catch (err) {
    console.warn('[SUVIDHA] Firebase init failed, using mock OTP:', err.message);
  }
};

// Initialize on module load
initFirebase();

/**
 * Send OTP via Firebase Phone Auth
 */
export const sendFirebaseOTP = async (phoneNumber) => {
  if (!firebaseReady || !auth) {
    return { success: false, error: 'firebase_not_configured' };
  }

  try {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new _RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      });
    }

    confirmationResult = await _signInWithPhoneNumber(
      auth,
      phoneNumber,
      window.recaptchaVerifier
    );

    return { success: true };
  } catch (err) {
    console.error('[SUVIDHA] Firebase OTP error:', err.code);
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    return { success: false, error: err.code || 'send_failed' };
  }
};

/**
 * Verify OTP via Firebase
 */
export const verifyFirebaseOTP = async (otp) => {
  if (!confirmationResult) {
    return { success: false, error: 'no_confirmation' };
  }

  try {
    const result = await confirmationResult.confirm(otp);
    const token = await result.user.getIdToken();
    return {
      success: true,
      token,
      user: { name: result.user.displayName || 'Citizen', uid: result.user.uid },
    };
  } catch (err) {
    console.error('[SUVIDHA] Firebase verify error:', err.code);
    return { success: false, error: err.code || 'verify_failed' };
  }
};

export const isFirebaseReady = () => firebaseReady;
