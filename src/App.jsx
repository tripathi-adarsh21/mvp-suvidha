// ═══════════════════════════════════════════════════════════════════════════
// SUVIDHA – Unified Touch-Based Civic Services KIOSK Platform  v3.0
// Production-Ready MVP
// WCAG 2.1 | Dark Mode | Voice Assistant | AI Chatbot | Firebase OTP Ready
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";
import "./App.css";

// Config
import { useT } from "./config/translations";

// Utils
import { removeStorage, setStorage, getStorage } from "./utils/storage";
import { parseVoiceCommand, startListening, stopListening, isSpeechRecognitionSupported, speak } from "./utils/voiceAssistant";

// Components
import AccessibilityControls from "./components/ui/AccessibilityControls";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { Electricity, ElecBill } from "./components/Electricity";
import { Gas, GasBook, GasSubsidy } from "./components/Gas";
import { Municipal, PropertyTax, WaterBill, CertificateService } from "./components/Municipal";
import { Health, Vaccination, AyushmanCard, MentalHealth, MedStoreLocator, AmbulanceScreen, LabTest } from "./components/Health";
import Emergency from "./components/Emergency";
import Admin from "./components/Admin";
import Complaint from "./components/Complaint";
import PayGateway from "./components/PayGateway";
import Chatbot from "./components/Chatbot";
import TimeoutModal from "./components/TimeoutModal";

// ─── Voice Navigation Hook ──────────────────────────────────────────────
const useVoiceNav = (lang, nav, doLogout, user) => {
  const [voiceNavActive, setVoiceNavActive] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);

  const toggleVoiceNav = useCallback(() => {
    if (!isSpeechRecognitionSupported()) return;

    if (voiceNavActive) {
      stopListening();
      setVoiceNavActive(false);
    } else {
      setVoiceNavActive(true);
      startListening(
        lang,
        (text, isFinal) => {
          if (isFinal) {
            const cmd = parseVoiceCommand(text);
            if (!cmd) return;
            // Verbal feedback (speak handles echo prevention)
            if (cmd.feedback) speak(cmd.feedback, lang);
            // 15 min reset on any valid voice command
            window.dispatchEvent(new Event('chat-activity'));

            if (cmd.type === 'nav') {
              if (cmd.screen === '__logout__') doLogout();
              else nav(cmd.screen);
            } else if (cmd.type === 'action' || cmd.type === 'payment_method') {
              if (cmd.action === 'logout') {
                 doLogout();
              } else if (cmd.action === 'start') {
                 nav('dashboard');
              } else {
                 // Broadcast custom event for screens to pick up (e.g. 'pay', 'upi')
                 window.dispatchEvent(new CustomEvent('voice-action', { detail: cmd }));
              }
            } else if (cmd.type === 'login_action') {
              // Broadcast login actions for the Login page
              window.dispatchEvent(new CustomEvent('voice-action', { detail: cmd }));
            } else if (cmd.type === 'language') {
              // App root doesn't have setLang in this scope, but welcome screen uses it.
            }
          }
        },
        () => { 
          setVoiceNavActive(false); 
          setVoiceLevel(0);
        },
        (err) => { 
          // Don't stop on partial offline errors
          if (err === 'offline_partial') return;
          setVoiceNavActive(false); 
          setVoiceLevel(0);
        },
        (lvl) => setVoiceLevel(lvl)
      );
    }
  }, [voiceNavActive, lang, nav, doLogout]);

  return { voiceNavActive, toggleVoiceNav, voiceLevel };
};

// ─── ROOT APP ────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]        = useState("welcome");
  const [user, setUser]            = useState(null);
  const [lang, setLang]            = useState(() => getStorage("lang", "en"));
  const [chatOpen, setChatOpen]    = useState(false);
  const [sessionTime, setSessTime] = useState(900); // 15 mins
  const [showTimeout, setShowTO]   = useState(false);
  const [emergMsg]                 = useState("Scheduled maintenance: Sector 12 water supply off on 16 Mar 2026, 10AM–2PM");
  const [payCtx, setPayCtx]       = useState({ amount:"₹0.00", returnTo:"dashboard" });

  const t = useT(lang);

  // ─── Session Timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    if (sessionTime <= 0) { doLogout(); return; }
    if (sessionTime === 30) setShowTO(true);
    const id = setTimeout(() => setSessTime(s => s - 1), 1000);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionTime, user]);

  const resetSess = useCallback(() => {
    if (user) { setSessTime(900); setShowTO(false); }
  }, [user]);

  useEffect(() => {
    window.addEventListener("click", resetSess);
    window.addEventListener("keydown", resetSess);
    window.addEventListener("chat-activity", resetSess);
    return () => {
      window.removeEventListener("click", resetSess);
      window.removeEventListener("keydown", resetSess);
      window.removeEventListener("chat-activity", resetSess);
    };
  }, [resetSess]);

  // ─── Auth ───────────────────────────────────────────────────────────
  const doLogout = useCallback(() => {
    removeStorage("jwt");
    setUser(null);
    import("./utils/api").then(m=>m.default.currentUserData=null);
    setScreen("welcome");
    setSessTime(900);
    setShowTO(false);
    setChatOpen(false);
  }, []);

  const doLogin = (r) => {
    setStorage("jwt", r.token);
    setUser(r);
    import("./utils/api").then(m=>m.default.currentUserData=r.data);
    setScreen("dashboard");
  };

  const nav = useCallback((s) => setScreen(s), []);

  const goPayment = (amount, returnTo, serviceName, deptName) => {
    setPayCtx({ amount, returnTo, serviceName, deptName });
    nav("payment");
  };

  // ─── Voice Navigation ──────────────────────────────────────────────
  const { voiceNavActive, toggleVoiceNav, voiceLevel } = useVoiceNav(lang, nav, doLogout, user);

  // ─── Chatbot Navigation ───────────────────────────────────────────
  const chatNavigate = useCallback((screen) => {
    setChatOpen(false);
    nav(screen);
  }, [nav]);

  const noHeader = ["welcome"].includes(screen);

  return (
    <>
      {/* Skip to main content – accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Emergency banner */}
      {emergMsg && (
        <div role="alert" style={{ background:"linear-gradient(90deg, #C62828, #B71C1C)",color:"#fff",padding:"10px 20px",display:"flex",alignItems:"center",gap:10,fontSize:14,fontWeight:600,borderBottom:"2px solid rgba(0,0,0,.15)",zIndex:9999 }}>
          <span style={{ fontSize:18,animation:"pulse 2s infinite" }}>⚠️</span> EMERGENCY ALERT: {emergMsg}
        </div>
      )}

      {/* Header */}
      {!noHeader && (
        <header style={{ background:"var(--navy-dk)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",height:64,boxShadow:"0 2px 12px rgba(0,0,0,.2)",position:"sticky",top:0,zIndex:1000,backdropFilter:"blur(12px)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:40,height:40,borderRadius:10,background:"linear-gradient(135deg,#00897B,#00ACC1)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,color:"#fff",boxShadow:"0 2px 8px rgba(0,137,123,0.3)" }}>S</div>
            <div>
              <div style={{ fontWeight:700,fontSize:15,letterSpacing:.5 }}>{t("appName")}</div>
              <div style={{ fontSize:10,color:"rgba(255,255,255,.6)",letterSpacing:.5 }}>{t("appSub")}</div>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            {user && <div style={{ fontSize:12,color:"rgba(255,255,255,.7)",marginRight:8,display:"flex",alignItems:"center",gap:4 }}>
              <span style={{ width:24,height:24,borderRadius:"50%",background:"linear-gradient(135deg,var(--teal),#00ACC1)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10 }}>👤</span>
              {user.user?.name?.split(" ")[0]}
            </div>}

            {/* Voice Nav button – available on all pages when logged in */}
            {user && (
              <button
                onClick={toggleVoiceNav}
                title="Voice Navigation"
                aria-label="Voice Navigation"
                id="voice-nav-btn"
                style={{
                  background: voiceNavActive ? "linear-gradient(135deg, var(--red), #D32F2F)" : "rgba(255,255,255,.1)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,.2)",
                  borderRadius: 8,
                  padding: "6px 14px",
                  fontSize: 12,
                  minHeight: 36,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontWeight: 600,
                  animation: voiceNavActive ? "pulse 1.5s infinite" : "none",
                  boxShadow: voiceNavActive ? `0 0 ${8 + voiceLevel/3}px rgba(198,40,40,0.5)` : "none",
                  transition: "all 0.2s ease",
                }}
              >
                🎤 {voiceNavActive ? "ON" : "Voice"}
              </button>
            )}

            {/* Accessibility Controls */}
            <AccessibilityControls t={t} />

            {user && (
              <button
                onClick={doLogout}
                id="logout-btn"
                style={{ background:"rgba(198,40,40,.8)",color:"#fff",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600,minHeight:36,transition:"all 0.2s ease" }}
              >
                {t("logout")}
              </button>
            )}
          </div>
        </header>
      )}

      {/* SCREENS */}
      <main id="main-content">
        {screen==="welcome"    && <Welcome onStart={(l)=>{ setLang(l); setStorage("lang", l); nav("login"); }}/>}
        {screen==="login"      && <Login   onLogin={doLogin} onBack={()=>nav("welcome")} t={t} lang={lang}/>}
        {screen==="dashboard"  && user && <Dashboard user={user} onNav={nav} sessionTime={sessionTime} t={t}/>}

        {/* Electricity */}
        {screen==="electricity" && <Electricity onNav={nav} onBack={()=>nav("dashboard")} t={t}/>}
        {screen==="elec-bill"   && <ElecBill    onNav={(s)=>{ if(s==="pay-elec") goPayment("₹1,248.00","electricity", t("sElec"), t("sElec")); else nav(s); }} onBack={()=>nav("electricity")} t={t}/>}
        {screen==="elec-pay"    && <ElecBill    onNav={(s)=>{ if(s==="pay-elec") goPayment("₹1,248.00","electricity", t("sElec"), t("sElec")); else nav(s); }} onBack={()=>nav("electricity")} t={t}/>}
        {screen==="new-conn"    && <CertificateService title="New Electricity Connection" icon="🔌" desc="Apply for new domestic/commercial connection" onBack={()=>nav("electricity")} t={t} fields={[{key:"name",label:"Applicant Name",req:true},{key:"addr",label:"Service Address",req:true},{key:"load",label:"Required Load (kW)",req:true},{key:"type",label:"Connection Type",type:"select",options:["Domestic","Commercial","Agricultural","Industrial"]}]}/>}

        {/* Gas */}
        {screen==="gas"         && <Gas         onNav={nav} onBack={()=>nav("dashboard")} t={t}/>}
        {screen==="gas-book"    && <GasBook     onNav={nav} onBack={()=>nav("gas")} t={t}/>}
        {screen==="gas-subsidy" && <GasSubsidy  onBack={()=>nav("gas")} t={t}/>}
        {screen==="gas-pay"     && <PayGateway  amount="₹850.00" serviceName={t("gPayBill")} deptName={t("sGas")} onSuccess={()=>nav("gas")} onBack={()=>nav("gas")} t={t}/>}
        {screen==="gas-new"     && <CertificateService title="New Gas Connection" icon="🔧" desc="Apply for new domestic LPG connection" onBack={()=>nav("gas")} t={t} fields={[{key:"name",label:"Applicant Name",req:true},{key:"addr",label:"Address",req:true},{key:"aadhaar",label:"Aadhaar Number",req:true},{key:"agency",label:"Preferred Agency",type:"select",options:["HP Gas","Bharat Gas","Indane"]}]}/>}

        {/* Municipal */}
        {screen==="municipal"   && <Municipal   onNav={nav} onBack={()=>nav("dashboard")} t={t}/>}
        {screen==="mun-prop"    && <PropertyTax onNav={(s)=>{ if(s==="pay-prop") goPayment("₹8,200.00","municipal", t("mPropTax"), t("sMun")); else nav(s); }} onBack={()=>nav("municipal")} t={t}/>}
        {screen==="mun-water"   && <WaterBill   onNav={(s)=>{ if(s==="pay-water") goPayment("₹340.00","municipal", t("mWater"), t("sMun")); else nav(s); }} onBack={()=>nav("municipal")} t={t}/>}
        {screen==="mun-trade"   && <CertificateService title="Trade License" icon="📋" desc="Apply for new trade license or renewal" onBack={()=>nav("municipal")} t={t} fields={[{key:"bname",label:"Business Name",req:true},{key:"btype",label:"Business Type",type:"select",options:["Retail","Wholesale","Food","Service","Manufacturing"]},{key:"addr",label:"Business Address",req:true},{key:"owner",label:"Owner Name",req:true},{key:"pan",label:"PAN Number",req:false}]}/>}
        {screen==="mun-build"   && <CertificateService title="Building Plan Approval" icon="🏗️" desc="Submit building plan for municipal approval" onBack={()=>nav("municipal")} t={t} fields={[{key:"owner",label:"Owner Name",req:true},{key:"plot",label:"Plot Number",req:true},{key:"area",label:"Plot Area (sq ft)",req:true},{key:"floors",label:"Number of Floors",type:"select",options:["G","G+1","G+2","G+3","G+4 and above"]},{key:"use",label:"Use Type",type:"select",options:["Residential","Commercial","Mixed Use"]}]}/>}
        {screen==="mun-birth"   && <CertificateService title="Birth Certificate" icon="👶" desc="Apply for birth certificate" onBack={()=>nav("municipal")} t={t} fields={[{key:"cname",label:"Child's Name",req:true},{key:"dob",label:"Date of Birth",type:"date",req:true},{key:"fname",label:"Father's Name",req:true},{key:"mname",label:"Mother's Name",req:true},{key:"hospital",label:"Hospital / Place of Birth",req:true}]}/>}
        {screen==="mun-death"   && <CertificateService title="Death Certificate" icon="📜" desc="Apply for death certificate" onBack={()=>nav("municipal")} t={t} fields={[{key:"dname",label:"Deceased Name",req:true},{key:"dod",label:"Date of Death",type:"date",req:true},{key:"cause",label:"Cause of Death",req:true},{key:"aname",label:"Applicant Name",req:true},{key:"relation",label:"Relation with Deceased",type:"select",options:["Spouse","Son","Daughter","Father","Mother","Sibling","Other"]}]}/>}

        {/* Health */}
        {screen==="health"        && <Health     onNav={nav} onBack={()=>nav("dashboard")} t={t}/>}
        {screen==="health-vacc"   && <Vaccination onBack={()=>nav("health")} t={t}/>}
        {screen==="health-card"   && <AyushmanCard onBack={()=>nav("health")} t={t}/>}
        {screen==="health-lab"    && <LabTest    onBack={()=>nav("health")} t={t}/>}
        {screen==="health-amb"    && <AmbulanceScreen onBack={()=>nav("health")} t={t}/>}
        {screen==="health-mental" && <MentalHealth onBack={()=>nav("health")} t={t}/>}
        {screen==="health-med"    && <MedStoreLocator onBack={()=>nav("health")} t={t}/>}

        {/* Shared */}
        {screen==="complaint"  && <Complaint onBack={()=>nav("electricity")} t={t}/>}
        {screen==="emergency"  && <Emergency onBack={()=>nav("dashboard")} t={t}/>}
        {screen==="admin"      && <Admin     onBack={()=>nav("dashboard")} t={t}/>}
        {screen==="payment"    && <PayGateway amount={payCtx?.amount} serviceName={payCtx?.serviceName} deptName={payCtx?.deptName} onSuccess={()=>nav("dashboard")} onBack={()=>nav(payCtx?.returnTo || "dashboard")} t={t}/>}
      </main>

      {/* Voice active indicator – floating */}
      {voiceNavActive && user && (
        <div className="voice-active-indicator">
          <span style={{ display:"flex",gap:2,alignItems:"center" }}>
            {[...Array(4)].map((_, i) => (
              <span key={i} style={{
                display:"inline-block",width:3,
                background:"#fff",borderRadius:2,
                height: Math.max(4, (voiceLevel * (i+1) / 6) % 14),
                transition:"height 0.1s ease",
              }}/>
            ))}
          </span>
          🎤 Voice Active
        </div>
      )}

      {/* Chatbot FAB */}
      {user && (
        <>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            aria-label={chatOpen ? "Close assistant" : "Open assistant"}
            id="chatbot-fab"
            style={{ 
              position:"fixed",bottom:24,right:24,width:60,height:60,borderRadius:16,
              background: chatOpen 
                ? "linear-gradient(135deg, var(--red), #D32F2F)" 
                : "linear-gradient(135deg, var(--navy-dk), #0D47A1)",
              color:"#fff",fontSize:chatOpen?22:26,
              boxShadow: chatOpen 
                ? "0 4px 20px rgba(198,40,40,.35)" 
                : "0 4px 24px rgba(10,47,90,.4)",
              display:"flex",alignItems:"center",justifyContent:"center",
              zIndex:9999,
              border:"2px solid rgba(255,255,255,.15)",
              transition:"all 0.3s ease",
            }}
          >
            {chatOpen ? "×" : "🤖"}
          </button>
          {chatOpen && <Chatbot onClose={() => setChatOpen(false)} onNavigate={chatNavigate} t={t} lang={lang} />}
        </>
      )}

      {/* Timeout modal */}
      {showTimeout && <TimeoutModal onContinue={() => { setSessTime(900); setShowTO(false); }} onLogout={doLogout} t={t} />}

      {/* Footer */}
      {!noHeader && (
        <footer style={{ background:"var(--navy-dk)",color:"rgba(255,255,255,.4)",padding:"12px 24px",fontSize:10,letterSpacing:.5,display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid rgba(255,255,255,.05)" }}>
          <span>{t("footerL")}</span>
          <span>{t("footerR")}</span>
        </footer>
      )}
    </>
  );
}
