// ═══════════════════════════════════════════════════════════════════════════
// VOICE ASSISTANT v3.0 – Enhanced with Offline Support
// PERSISTENT MODE: stays on until user manually disables
// FULL CONTROL: navigate, pay bills, select payment modes, go back, etc.
// OFFLINE: Works without internet using local command dictionary
// NO ECHO: Never repeats what the user says
// ═══════════════════════════════════════════════════════════════════════════

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Language code mapping for speech APIs
const LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  as: 'as-IN',
  bn: 'bn-IN',
};

// ─── Speech-to-Text (Persistent Mode) ───────────────────────────────────

let audioContext = null;
let _audioStream = null;
let analyser = null;
let microphone = null;
let javascriptNode = null;
let _onLevelCb = null;
let _persistentMode = false;
let _currentLang = 'en';
let _onResultCb = null;
let _onErrorCb = null;
let recognition = null;
let _lastSpokenText = '';  // Track last spoken text to prevent echo
let _isSpeaking = false;   // Track if TTS is active
let _offlineMode = false;  // Track offline status

/**
 * Check if browser supports speech recognition
 */
export const isSpeechRecognitionSupported = () => !!SpeechRecognition;

/**
 * Check if we're in offline mode
 */
export const isOffline = () => _offlineMode || !window.navigator.onLine;

/**
 * Start PERSISTENT listening – keeps listening until stopListening() is called.
 * Automatically restarts after each final result.
 * Now supports offline mode with local command matching.
 */
export const startListening = (lang, onResult, onEnd, onError, onLevel) => {
  if (!SpeechRecognition) {
    onError?.('not_supported');
    return false;
  }

  _persistentMode = true;
  _currentLang = lang;
  _onResultCb = onResult;
  _onErrorCb = onError;
  _onLevelCb = onLevel;
  _offlineMode = !window.navigator.onLine;

  // Monitor online/offline status
  window.addEventListener('online', _handleOnline);
  window.addEventListener('offline', _handleOffline);

  _startRecognitionSession();
  _startVolumeMonitoring();
  return true;
};

const _handleOnline = () => {
  _offlineMode = false;
  // Restart recognition when back online for better accuracy
  if (_persistentMode && recognition) {
    try { recognition.stop(); } catch(e) { /* ignore */ }
  }
};

const _handleOffline = () => {
  _offlineMode = true;
};

/**
 * Monitor microphone volume level for sensitivity feedback
 */
const _startVolumeMonitoring = async () => {
  if (!window.AudioContext && !window.webkitAudioContext) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        // Lower threshold for better sensitivity
        channelCount: 1,
        sampleRate: 16000,
      } 
    });
    _audioStream = stream;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);
    javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.85;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);

    javascriptNode.onaudioprocess = () => {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      let values = 0;
      for (let i = 0; i < array.length; i++) {
        values += array[i];
      }
      const average = values / array.length;
      // Amplify low-level audio for better sensitivity
      const amplified = Math.min(100, Math.round(average * 1.5));
      _onLevelCb?.(amplified);
    };
  } catch (err) {
    console.warn('[SUVIDHA Voice] Volume monitor failed:', err);
  }
};

/**
 * Start a single recognition session.
 * In persistent mode, auto-restarts on end.
 */
const _startRecognitionSession = () => {
  if (!_persistentMode) return;

  // Clean up any existing session
  if (recognition) {
    try { recognition.stop(); } catch(e) { /* ignore */ }
    recognition = null;
  }

  recognition = new SpeechRecognition();
  recognition.lang = LANG_MAP[_currentLang] || 'en-IN';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 3; // More alternatives for better accuracy

  recognition.onresult = (event) => {
    const last = event.results[event.results.length - 1];
    const text = last[0].transcript;
    
    // Don't process if TTS is currently speaking (prevents echo)
    if (_isSpeaking) return;
    
    // Don't echo back the same text that was just spoken by TTS
    if (last.isFinal && _lastSpokenText && 
        text.toLowerCase().trim().includes(_lastSpokenText.toLowerCase().trim())) {
      return;
    }
    
    _onResultCb?.(text, last.isFinal);
  };

  recognition.onend = () => {
    recognition = null;
    // AUTO-RESTART if persistent mode is still on
    if (_persistentMode) {
      setTimeout(() => _startRecognitionSession(), 300);
    }
  };

  recognition.onerror = (event) => {
    console.warn('[SUVIDHA Voice] Recognition error:', event.error);
    
    // Handle offline gracefully
    if (!window.navigator.onLine || event.error === 'network') {
      _offlineMode = true;
      // Don't stop on network errors - keep trying
      if (_persistentMode) {
        // Notify about offline but keep running
        _onErrorCb?.('offline_partial');
        return;
      }
    }

    // Don't stop persistent mode on transient errors like 'no-speech'
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      _persistentMode = false;
      recognition = null;
      _onErrorCb?.(event.error);
    }
  };

  try {
    recognition.start();
  } catch (err) {
    console.warn('[SUVIDHA Voice] Start failed:', err);
    if (_persistentMode) {
      setTimeout(() => _startRecognitionSession(), 500);
    }
  }
};

/**
 * Stop speech recognition and exit persistent mode
 */
export const stopListening = () => {
  _persistentMode = false;
  _onResultCb = null;
  _onErrorCb = null;
  _onLevelCb = null;

  // Remove online/offline listeners
  window.removeEventListener('online', _handleOnline);
  window.removeEventListener('offline', _handleOffline);

  if (recognition) {
    try { recognition.stop(); } catch (e) { /* already stopped */ }
    recognition = null;
  }

  // Stop audio monitoring
  if (javascriptNode) {
    javascriptNode.disconnect();
    javascriptNode = null;
  }
  if (microphone) {
    microphone.disconnect();
    microphone = null;
  }
  if (_audioStream) {
    _audioStream.getTracks().forEach(track => track.stop());
    _audioStream = null;
  }
  if (audioContext) {
    try { audioContext.close(); } catch (e) {}
    audioContext = null;
  }
};

/**
 * Check if currently in persistent listening mode
 */
export const isListening = () => _persistentMode;

// ─── Text-to-Speech (Enhanced – No Echo) ────────────────────────────────

/**
 * Speak text aloud using browser TTS
 * Temporarily pauses recognition to prevent echo
 */
export const speak = (text, lang = 'en') => {
  if (!window.speechSynthesis) return;

  stopSpeaking();

  // Clean emoji/special chars for cleaner speech
  const cleanText = text.replace(/[\u{1F600}-\u{1F6FF}]/gu, '').replace(/[•·←→]/g, ',').replace(/\d️⃣/g, '').trim();
  if (!cleanText) return;

  // Track the spoken text to prevent echo
  _lastSpokenText = cleanText;
  _isSpeaking = true;

  // Temporarily pause recognition while speaking
  const wasListening = _persistentMode;
  if (wasListening && recognition) {
    try { recognition.stop(); } catch(e) { /* ignore */ }
    recognition = null;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = LANG_MAP[lang] || 'en-IN';
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const targetLang = LANG_MAP[lang] || 'en-IN';
  const match = voices.find(v => v.lang === targetLang) ||
                voices.find(v => v.lang.startsWith(lang));
  if (match) utterance.voice = match;

  utterance.onend = () => {
    _isSpeaking = false;
    // Clear last spoken text after a delay so recognition doesn't pick up remnants
    setTimeout(() => {
      _lastSpokenText = '';
      // Resume recognition if it was active
      if (wasListening && _persistentMode) {
        _startRecognitionSession();
      }
    }, 500);
  };

  utterance.onerror = () => {
    _isSpeaking = false;
    _lastSpokenText = '';
    if (wasListening && _persistentMode) {
      setTimeout(() => _startRecognitionSession(), 300);
    }
  };

  window.speechSynthesis.speak(utterance);
};

/**
 * Stop any current TTS output
 */
export const stopSpeaking = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  _isSpeaking = false;
};

// ─── Voice Commands – FULL CONTROL ──────────────────────────────────────
// Supports: navigation, actions (pay, book, submit), payment modes, back
// Works offline with local dictionary matching

const VOICE_COMMANDS = {
  // ── Navigation ──
  'electricity': { type: 'nav', screen: 'electricity', feedback: 'Opening electricity services.' },
  'electric': { type: 'nav', screen: 'electricity', feedback: 'Opening electricity services.' },
  'bijli': { type: 'nav', screen: 'electricity', feedback: 'बिजली सेवाएँ खोल रहे हैं।' },
  'view bill': { type: 'nav', screen: 'elec-bill', feedback: 'Opening your electricity bills.' },
  'bill': { type: 'nav', screen: 'elec-bill', feedback: 'Opening your bills.' },
  'gas': { type: 'nav', screen: 'gas', feedback: 'Opening gas services.' },
  'cylinder': { type: 'nav', screen: 'gas-book', feedback: 'Booking a cylinder for you.' },
  'book cylinder': { type: 'nav', screen: 'gas-book', feedback: 'Booking a cylinder for you.' },
  'silender': { type: 'nav', screen: 'gas-book', feedback: 'सिलेंडर बुकिंग खोल रहे हैं।' },
  'municipal': { type: 'nav', screen: 'municipal', feedback: 'Opening municipal services.' },
  'nagar': { type: 'nav', screen: 'municipal', feedback: 'नगर निगम सेवाएँ खोल रहे हैं।' },
  'property tax': { type: 'nav', screen: 'mun-prop', feedback: 'Opening property tax details.' },
  'property': { type: 'nav', screen: 'mun-prop', feedback: 'Opening property details.' },
  'sampatti': { type: 'nav', screen: 'mun-prop', feedback: 'संपत्ति कर विवरण खोल रहे हैं।' },
  'water': { type: 'nav', screen: 'mun-water', feedback: 'Opening water bill services.' },
  'water bill': { type: 'nav', screen: 'mun-water', feedback: 'Opening water bill services.' },
  'pani': { type: 'nav', screen: 'mun-water', feedback: 'पानी का बिल खोल रहे हैं।' },
  'health': { type: 'nav', screen: 'health', feedback: 'Opening health services.' },
  'vaccination': { type: 'nav', screen: 'health-vacc', feedback: 'Opening vaccination slots.' },
  'vaccine': { type: 'nav', screen: 'health-vacc', feedback: 'Opening vaccination slots.' },
  'tika': { type: 'nav', screen: 'health-vacc', feedback: 'टीकाकरण स्लॉट खोल रहे हैं।' },
  'ayushman': { type: 'nav', screen: 'health-card', feedback: 'Opening Ayushman card services.' },
  'ambulance': { type: 'nav', screen: 'health-amb', feedback: 'Calling for ambulance services.' },
  'emergency': { type: 'nav', screen: 'emergency', feedback: 'Opening emergency contacts.' },
  'complaint': { type: 'nav', screen: 'complaint', feedback: 'Opening complaint registration.' },
  'shikayat': { type: 'nav', screen: 'complaint', feedback: 'शिकायत पंजीकरण खोल रहे हैं।' },
  'dashboard': { type: 'nav', screen: 'dashboard', feedback: 'Going to home screen.' },
  'home': { type: 'nav', screen: 'dashboard', feedback: 'Going to home screen.' },
  'admin': { type: 'nav', screen: 'admin', feedback: 'Opening administrator panel.' },
  'lab test': { type: 'nav', screen: 'health-lab', feedback: 'Opening lab test booking.' },
  'mental health': { type: 'nav', screen: 'health-mental', feedback: 'Opening mental health support.' },
  'medicine': { type: 'nav', screen: 'health-med', feedback: 'Finding nearby medicine stores.' },
  'trade license': { type: 'nav', screen: 'mun-trade', feedback: 'Opening trade license application.' },
  'birth certificate': { type: 'nav', screen: 'mun-birth', feedback: 'Opening birth certificate services.' },
  'death certificate': { type: 'nav', screen: 'mun-death', feedback: 'Opening death certificate services.' },
  'building plan': { type: 'nav', screen: 'mun-build', feedback: 'Opening building plan approvals.' },
  'subsidy': { type: 'nav', screen: 'gas-subsidy', feedback: 'Checking your gas subsidy status.' },
  'new connection': { type: 'nav', screen: 'new-conn', feedback: 'Opening new connection application.' },

  // ── Actions ──
  'pay bill': { type: 'action', action: 'pay', feedback: 'Proceeding to payment.' },
  'pay now': { type: 'action', action: 'pay', feedback: 'Proceeding to payment.' },
  'pay': { type: 'action', action: 'pay', feedback: 'Proceeding to payment.' },
  'bhugtan': { type: 'action', action: 'pay', feedback: 'भुगतान के लिए आगे बढ़ रहे हैं।' },
  'payment': { type: 'action', action: 'pay', feedback: 'Proceeding to payment.' },
  'book now': { type: 'action', action: 'book', feedback: 'Booking now.' },
  'book': { type: 'action', action: 'book', feedback: 'Booking now.' },
  'submit': { type: 'action', action: 'submit', feedback: 'Submitting your details.' },
  'back': { type: 'action', action: 'back', feedback: 'Going back.' },
  'go back': { type: 'action', action: 'back', feedback: 'Going back.' },
  'peeche': { type: 'action', action: 'back', feedback: 'पीछे जा रहे हैं।' },
  'logout': { type: 'action', action: 'logout', feedback: 'Logging you out safely.' },
  'log out': { type: 'action', action: 'logout', feedback: 'Logging you out safely.' },
  'start': { type: 'action', action: 'start', feedback: 'Starting your session.' },
  'shuru': { type: 'action', action: 'start', feedback: 'सत्र शुरू कर रहे हैं।' },

  // ── Login Page Commands ──
  'send otp': { type: 'login_action', action: 'send_otp', feedback: '' },
  'otp bhejo': { type: 'login_action', action: 'send_otp', feedback: '' },
  'verify': { type: 'login_action', action: 'verify_otp', feedback: '' },
  'verify otp': { type: 'login_action', action: 'verify_otp', feedback: '' },
  'login': { type: 'login_action', action: 'verify_otp', feedback: '' },
  'resend': { type: 'login_action', action: 'resend_otp', feedback: '' },
  'resend otp': { type: 'login_action', action: 'resend_otp', feedback: '' },
  'change number': { type: 'login_action', action: 'change_number', feedback: '' },
  'number badlo': { type: 'login_action', action: 'change_number', feedback: '' },

  // ── Payment methods ──
  'upi': { type: 'payment_method', method: 'upi', feedback: 'Selecting UPI for payment.' },
  'net banking': { type: 'payment_method', method: 'net', feedback: 'Selecting net banking.' },
  'debit card': { type: 'payment_method', method: 'debit', feedback: 'Selecting debit card.' },
  'credit card': { type: 'payment_method', method: 'credit', feedback: 'Selecting credit card.' },
  'card': { type: 'payment_method', method: 'debit', feedback: 'Selecting card payment.' },

  // ── Language ──
  'english': { type: 'language', lang: 'en', feedback: 'Switching to English.' },
  'hindi': { type: 'language', lang: 'hi', feedback: 'हिंदी में बदल रहे हैं।' },
  'assamese': { type: 'language', lang: 'as', feedback: 'অসমীয়ালৈ সলনি কৰা হৈছে।' },
  'bengali': { type: 'language', lang: 'bn', feedback: 'বাংলায় পরিবর্তন করা হচ্ছে।' },
  'bangla': { type: 'language', lang: 'bn', feedback: 'বাংলায় পরিবর্তন করা হচ্ছে।' },

  // ── Conversational Commands (No Echo) ──
  'help': { type: 'talk', feedback: 'You can say: Go to electricity, Pay bill, Book cylinder, or Change language.' },
  'madad': { type: 'talk', feedback: 'आप कह सकते हैं: बिजली बिल देखें, भुगतान करें, सिलेंडर बुक करें।' },
  'hello': { type: 'talk', feedback: 'Hello! I am Suvidha assistant. How can I help you?' },
  'namaste': { type: 'talk', feedback: 'नमस्ते! मैं सुविधा सहायक हूँ। कैसे मदद करूँ?' },
  'who are you': { type: 'talk', feedback: 'I am Suvidha, your digital kiosk assistant for civic services.' },
  'kaun ho': { type: 'talk', feedback: 'मैं सुविधा हूँ, आपकी नागरिक सेवाओं के लिए डिजिटल सहायक।' },
  'thank you': { type: 'talk', feedback: 'You are welcome! Happy to assist you.' },
  'shukriya': { type: 'talk', feedback: 'आपका स्वागत है! मदद करके खुशी हुई।' },
  'dhanyavaad': { type: 'talk', feedback: 'आपका स्वागत है!' },
};

// ─── Fuzzy/Offline Command Matching ─────────────────────────────────────

/**
 * Simple Levenshtein distance for fuzzy matching
 */
const levenshteinDistance = (a, b) => {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
};

/**
 * Parse voice input to find command
 * Enhanced with fuzzy matching for offline/noisy environments
 * @param {string} text - Recognized speech text
 * @returns {{ type: string, ... } | null} Command object or null
 */
export const parseVoiceCommand = (text) => {
  const lower = text.toLowerCase().trim();

  // Direct match first (most specific)
  if (VOICE_COMMANDS[lower]) return VOICE_COMMANDS[lower];

  // Multi-word match (longer phrases first for better accuracy)
  const sortedKeys = Object.keys(VOICE_COMMANDS).sort((a, b) => b.length - a.length);
  for (const phrase of sortedKeys) {
    if (lower.includes(phrase)) return VOICE_COMMANDS[phrase];
  }

  // Fuzzy matching for offline mode or noisy environments
  let bestMatch = null;
  let bestDistance = Infinity;
  
  for (const phrase of sortedKeys) {
    // Only fuzzy match shorter phrases (single/double words)
    if (phrase.split(' ').length > 2) continue;
    
    const words = lower.split(' ');
    for (const word of words) {
      if (word.length < 3) continue;
      const dist = levenshteinDistance(word, phrase);
      const threshold = Math.max(1, Math.floor(phrase.length * 0.3));
      if (dist <= threshold && dist < bestDistance) {
        bestDistance = dist;
        bestMatch = VOICE_COMMANDS[phrase];
      }
    }
  }
  
  return bestMatch;
};
