/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect, useRef } from 'react';
import { Spinner, BBtn } from './ui/Atoms';
import api from '../utils/api';
import { validateMobile, validateOTP, otpRateLimiter } from '../utils/security';
import { verifyFirebaseOTP, isFirebaseReady } from '../config/firebase';
import { MOCK_OTP_CODES, MOCK_USERS } from '../config/mockData';
import { startListening, stopListening, speak, isSpeechRecognitionSupported, parseVoiceCommand } from '../utils/voiceAssistant';

const Login = ({ onLogin, onBack, t, lang }) => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp]       = useState("");
  const [step, setStep]     = useState("mob");
  const [loading, setLoading] = useState(false);
  const [err, setErr]       = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [mockOtp, setMockOtp] = useState(null);

  // Voice assistance state
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [voiceLevel, setVoiceLevel] = useState(0);
  const mobileRef = useRef(null);
  const otpRef = useRef(null);

  // ─── REFS for current values (fixes stale closure in voice callbacks) ──
  const stepRef = useRef(step);
  const mobileValRef = useRef(mobile);
  const otpValRef = useRef(otp);
  const mockOtpRef = useRef(mockOtp);
  const loadingRef = useRef(loading);
  const resendTimerRef = useRef(resendTimer);
  const otpAttemptsRef = useRef(otpAttempts);

  // Keep refs in sync with state
  useEffect(() => { stepRef.current = step; }, [step]);
  useEffect(() => { mobileValRef.current = mobile; }, [mobile]);
  useEffect(() => { otpValRef.current = otp; }, [otp]);
  useEffect(() => { mockOtpRef.current = mockOtp; }, [mockOtp]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { resendTimerRef.current = resendTimer; }, [resendTimer]);
  useEffect(() => { otpAttemptsRef.current = otpAttempts; }, [otpAttempts]);

  // Cleanup voice on unmount
  useEffect(() => {
    return () => {
      // Intentionally not stopping here to allow handoff to Dashboard
    };
  }, []);

  // Resend countdown timer
  const startResendTimer = useCallback(() => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // ─── Core actions as ref-based functions (never stale) ─────────────
  const doSendOtp = useCallback(async () => {
    const currentMobile = mobileValRef.current;
    if (!validateMobile(currentMobile)) {
      setErr(t("badMobile"));
      speak("Please enter a valid 10-digit mobile number first.", lang || 'en');
      return;
    }
    if (!otpRateLimiter.check(currentMobile)) {
      setErr(t("otpRateLimit"));
      return;
    }
    setErr(""); setLoading(true);
    otpRateLimiter.attempt(currentMobile);

    const generatedOtp = MOCK_OTP_CODES[currentMobile] || Math.floor(100000 + Math.random() * 900000).toString();
    console.info('[SUVIDHA] Generated Mock OTP:', generatedOtp);

    setLoading(false);
    setMockOtp(generatedOtp);
    setStep("otp");
    startResendTimer();

    // SECURITY: Never speak OTP aloud — only a brief confirmation
    speak("OTP sent to your registered number. Please check your screen and enter it.", lang || 'en');
  }, [t, lang, startResendTimer]);

  const doVerify = useCallback(async () => {
    const currentOtp = otpValRef.current;
    const currentMockOtp = mockOtpRef.current;
    const currentMobile = mobileValRef.current;

    if (!validateOTP(currentOtp)) {
      setErr(t("badOtp"));
      speak("Please enter a valid OTP.", lang || 'en');
      return;
    }
    if (otpAttemptsRef.current >= 3) {
      setErr(t("otpRateLimit"));
      return;
    }
    setErr(""); setLoading(true);
    setOtpAttempts(prev => prev + 1);

    // Keep voice running for conversational feedback and handoff to Dashboard
    // setVoiceActive(false);

    if (isFirebaseReady()) {
      const result = await verifyFirebaseOTP(currentOtp);
      setLoading(false);
      if (result.success) {
        onLogin({ success: true, token: result.token, user: result.user });
      } else {
        const r = await api.login();
        setLoading(false);
        if (r.success) onLogin(r);
        else setErr(t("badOtp"));
      }
    } else {
      if (currentOtp === currentMockOtp) {
        setLoading(false);
        const userData = MOCK_USERS[currentMobile] || MOCK_USERS["9876543210"];
        speak("Login successful! Welcome.", lang || 'en');
        onLogin({ success: true, token: "mock-jwt-token-xyz", user: { name: userData.name, uid: currentMobile }, data: userData });
      } else {
        setLoading(false);
        setErr(t("badOtp"));
        speak("Invalid OTP. Please try again.", lang || 'en');
      }
    }
  }, [t, lang, onLogin]);

  const doResend = useCallback(() => {
    if (resendTimerRef.current > 0) return;
    setOtp("");
    setErr("");
    doSendOtp();
  }, [doSendOtp]);

  // ─── Voice command handler (uses refs, never stale) ────────────────
  // SECURITY: Never speaks back OTP, phone numbers, or repeats user input
  const handleVoiceCommand = useCallback((text) => {
    const currentStep = stepRef.current;
    
    // Try to parse as a voice command
    const cmd = parseVoiceCommand(text);
    if (cmd) {
      // Don't speak command feedback here — each action function handles its own
      // This prevents double-speaking and avoids echoing sensitive data

      if (cmd.type === 'login_action') {
        if (cmd.action === 'send_otp' && currentStep === 'mob') {
          doSendOtp();
        } else if (cmd.action === 'verify_otp' && currentStep === 'otp') {
          doVerify();
        } else if (cmd.action === 'resend_otp' && currentStep === 'otp') {
          doResend();
        } else if (cmd.action === 'change_number') {
          setStep("mob"); setErr(""); setOtp("");
        }
      } else if (cmd.type === 'action') {
        if (cmd.action === 'back') onBack();
      }
      return;
    }

    // Try to extract digits from speech (phone number or OTP)
    const digits = text.replace(/\D/g, '');
    
    if (currentStep === 'mob' && digits.length >= 10) {
      const phone = digits.slice(-10);
      setMobile(phone);
      // SECURITY: Don't speak the number — just confirm silently on screen
    } else if (currentStep === 'otp' && digits.length >= 4 && digits.length <= 6) {
      const otpDigits = digits.slice(-6).padStart(6, '0');
      setOtp(digits.length === 6 ? digits : otpDigits);
      // SECURITY: Never speak OTP — just confirm silently on screen
    }
    // Don't speak on unrecognized input — avoid being chatty/repeating
  }, [lang, onBack, doSendOtp, doVerify, doResend]);

  // Toggle voice on login page
  const toggleVoice = useCallback(() => {
    if (!isSpeechRecognitionSupported()) return;

    if (voiceActive) {
      stopListening();
      setVoiceActive(false);
      setVoiceText("");
      setVoiceLevel(0);
    } else {
      setVoiceActive(true);
      setVoiceText("");
      // Brief, non-sensitive activation message
      speak("Voice active. Ready for your command.", lang || 'en');

      startListening(
        lang || 'en',
        (text, isFinal) => {
          if (!isFinal) {
            setVoiceText(text);
            return;
          }
          setVoiceText(text);
          handleVoiceCommand(text);
          setTimeout(() => setVoiceText(""), 3000);
        },
        () => {
          setVoiceActive(false);
          setVoiceLevel(0);
        },
        (errType) => {
          if (errType === 'offline_partial') {
            setVoiceText("Offline mode: limited voice support");
          } else {
            setVoiceActive(false);
            setVoiceLevel(0);
          }
        },
        (lvl) => setVoiceLevel(lvl)
      );
    }
  }, [voiceActive, lang, handleVoiceCommand]);

  // Also listen for voice-action events from parent App (header voice button)
  useEffect(() => {
    const handleExternalVoiceAction = (e) => {
      const cmd = e.detail;
      if (cmd?.type === 'login_action') {
        handleVoiceCommand(cmd.action === 'send_otp' ? 'send otp' 
          : cmd.action === 'verify_otp' ? 'verify otp'
          : cmd.action === 'resend_otp' ? 'resend otp' 
          : cmd.action === 'change_number' ? 'change number' : '');
      }
    };
    window.addEventListener('voice-action', handleExternalVoiceAction);
    return () => window.removeEventListener('voice-action', handleExternalVoiceAction);
  }, [handleVoiceCommand]);

  return (
    <div className="fi" style={{ minHeight:"calc(100vh - 64px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,background:"var(--bg)" }}>
      {/* Invisible reCAPTCHA container for Firebase */}
      <div id="recaptcha-container" />

      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40,width:"100%",maxWidth:440,position:"relative",overflow:"hidden" }}>
        
        {/* Glassmorphism accent */}
        <div style={{ position:"absolute",top:-40,right:-40,width:120,height:120,borderRadius:"50%",background:"linear-gradient(135deg, var(--teal), transparent)",opacity:0.15,filter:"blur(30px)" }} />
        
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
          <BBtn onBack={onBack} t={t}/>
          
          {/* Voice assistance button on login */}
          {isSpeechRecognitionSupported() && (
            <button
              onClick={toggleVoice}
              title={voiceActive ? "Stop voice" : "Voice assistance"}
              aria-label={voiceActive ? "Stop voice assistance" : "Start voice assistance"}
              id="login-voice-btn"
              style={{
                display:"flex",alignItems:"center",gap:8,
                background: voiceActive ? "var(--red)" : "var(--g50)",
                color: voiceActive ? "#fff" : "var(--g600)",
                border: `1.5px solid ${voiceActive ? "var(--red)" : "var(--g200)"}`,
                borderRadius: 24,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 600,
                minHeight: 40,
                animation: voiceActive ? "pulse 1.5s infinite" : "none",
                boxShadow: voiceActive ? `0 0 ${8 + voiceLevel/3}px rgba(198,40,40,0.4)` : "var(--sh-sm)",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize:16 }}>🎤</span>
              {voiceActive ? "Listening..." : "Voice Help"}
            </button>
          )}
        </div>
        
        <div style={{ width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg, var(--navy), var(--teal))",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,fontSize:26,boxShadow:"0 4px 16px rgba(0,137,123,0.3)" }}>🔐</div>
        <h2 style={{ fontSize:24,fontWeight:700,marginBottom:4 }}>{t("secureLogin")}</h2>
        <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>
          {step==="mob"? t("mobilePrompt") : `${t("otpSent")}${mobile.slice(0,4)}XXXXXX`}
        </p>
        
        {/* Voice feedback bubble */}
        {voiceText && (
          <div style={{
            background: "linear-gradient(135deg, rgba(0,137,123,0.1), rgba(0,172,193,0.1))",
            border: "1px solid var(--teal)",
            borderRadius: 12,
            padding: "10px 16px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "fadeIn 0.3s ease",
          }}>
            <div style={{ display:"flex",gap:2,alignItems:"center",height:20 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  width: 3,
                  background: "var(--teal)",
                  height: Math.max(4, (voiceLevel * (i+1) / 8) % 18),
                  transition: "height 0.1s ease",
                  borderRadius: 2
                }} />
              ))}
            </div>
            <span style={{ fontSize:13,color:"var(--teal)",fontWeight:600 }}>"{voiceText}"</span>
          </div>
        )}
        
        {/* Progress bar */}
        <div style={{ display:"flex",gap:8,marginBottom:28 }}>
          {[0,1].map(i=><div key={i} style={{ flex:1,height:4,borderRadius:2,background:i===0||step==="otp"?"var(--teal)":"var(--g100)",transition:"background 0.3s ease" }}/>)}
        </div>

        {step==="mob" ? <>
          <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5 }}>{t("mobileLbl")}</label>
          <div style={{ display:"flex",alignItems:"center",marginTop:6,marginBottom:20 }}>
            <span style={{ background:"var(--g50)",border:"1.5px solid var(--g200)",borderRight:"none",borderRadius:"var(--r-sm) 0 0 var(--r-sm)",padding:"14px 12px",fontSize:14,color:"var(--g600)",fontWeight:600 }}>+91</span>
            <input ref={mobileRef} type="tel" maxLength={10} value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,""))} placeholder="Enter 10-digit number" aria-label={t("mobileLbl")} style={{ flex:1,border:"1.5px solid var(--g200)",borderRadius:"0 var(--r-sm) var(--r-sm) 0",padding:"14px 16px",fontSize:16,outline:"none",color:"var(--navy)",fontFamily:"'Space Mono',monospace",letterSpacing:2,background:"var(--input-bg, #fff)" }}/>
          </div>
          {err&&<p style={{ color:"var(--red)",fontSize:12,marginBottom:12 }} role="alert">{err}</p>}
          <button onClick={doSendOtp} disabled={loading} className="btn" style={{ width:"100%",background:"linear-gradient(135deg, var(--navy), #0D47A1)",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none",boxShadow:"0 4px 16px rgba(10,47,90,0.3)" }}>
            {loading?<Spinner/>:t("sendOtp")}
          </button>
          
          {voiceActive && (
            <p style={{ fontSize:11,color:"var(--teal)",textAlign:"center",marginTop:12,fontWeight:600,animation:"fadeIn 0.3s" }}>
              🎤 Say your phone number or "Send OTP"
            </p>
          )}
        </> : <>
          <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5 }}>{t("otpLbl")}</label>
          <input ref={otpRef} type="tel" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,""))} placeholder="••••••" aria-label={t("otpLbl")} style={{ width:"100%",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"16px",fontSize:28,textAlign:"center",letterSpacing:14,marginTop:6,marginBottom:10,outline:"none",fontFamily:"'Space Mono',monospace",color:"var(--navy)",background:"var(--input-bg, #fff)" }}/>
          
          {/* MOCK OTP DISPLAY */}
          <div style={{ background: "linear-gradient(135deg, rgba(32,184,169,0.08), rgba(0,172,193,0.08))", border: "1px dashed var(--teal)", borderRadius: "var(--r-sm)", padding: "12px", textAlign: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "var(--teal)", fontWeight: 600, margin: 0 }}>
              Testing OTP: <span style={{ fontSize: 20, letterSpacing: 4, fontFamily:"'Space Mono',monospace" }}>{mockOtp}</span>
            </p>
          </div>

          {err&&<p style={{ color:"var(--red)",fontSize:12,marginBottom:12 }} role="alert">{err}</p>}
          <button onClick={doVerify} disabled={loading} className="btn" style={{ width:"100%",background:"linear-gradient(135deg, var(--teal), #00ACC1)",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700,marginBottom:12,cursor:"pointer",fontFamily:"inherit",border:"none",boxShadow:"0 4px 16px rgba(0,137,123,0.3)" }}>
            {loading?<Spinner/>:t("verifyOtp")}
          </button>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <button onClick={()=>{setStep("mob");setErr("");setOtp("");}} style={{ background:"none",color:"var(--g400)",fontSize:13,minHeight:40,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("changeNum")}</button>
            <button onClick={doResend} disabled={resendTimer > 0} style={{ background:"none",color:resendTimer>0?"var(--g400)":"var(--teal)",fontSize:13,minHeight:40,cursor:resendTimer>0?"default":"pointer",fontFamily:"inherit",border:"none",fontWeight:600 }}>
              {resendTimer > 0 ? `${t("otpResend")} ${resendTimer}s` : t("otpResendReady")}
            </button>
          </div>
          
          {voiceActive && (
            <p style={{ fontSize:11,color:"var(--teal)",textAlign:"center",marginTop:12,fontWeight:600,animation:"fadeIn 0.3s" }}>
              🎤 Say your OTP digits, "Verify", or "Resend OTP"
            </p>
          )}
        </>}

        <div style={{ marginTop:24,padding:"12px 16px",background:"var(--g50)",borderRadius:"var(--r-sm)",display:"flex",gap:8,alignItems:"flex-start" }}>
          <span>🛡️</span>
          <p style={{ fontSize:11,color:"var(--g600)",lineHeight:1.6 }}><strong>{t("secNote")}</strong> {t("secMsg")}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
