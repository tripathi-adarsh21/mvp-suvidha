import { useState } from 'react';
import { useT } from '../config/translations';
import { startListening, stopListening, isSpeechRecognitionSupported } from '../utils/voiceAssistant';

const Welcome = ({ onStart }) => {
  const [lang, setLang] = useState("en");
  const [voice, setVoice] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [level, setLevel] = useState(0);
  const t = useT(lang);

  const langs = [
    { code:"en", native:"English",  sub:"English"  },
    { code:"hi", native:"हिंदी",    sub:"Hindi"    },
    { code:"as", native:"অসমীয়া",  sub:"Assamese" },
    { code:"bn", native:"বাংলা",    sub:"Bengali"  },
  ];

  const toggleVoice = () => {
    if (!isSpeechRecognitionSupported()) {
      alert(t("voiceNotSupported") || "Voice recognition is not supported in your browser.");
      return;
    }
    if (voice) {
      stopListening();
      setVoice(false);
      setVoiceText("");
    } else {
      setVoice(true);
      setVoiceText("Listening... Say a language or 'Start'");
      startListening(lang, (text, isFinal) => {
        setVoiceText(text);
        if (isFinal) {
          const lower = text.toLowerCase();
          if (lower.includes('hindi')) { setLang('hi'); setVoiceText("Switched to Hindi. Say 'Shuru' to start."); }
          else if (lower.includes('english')) { setLang('en'); setVoiceText("Switched to English. Say 'Start'."); }
          else if (lower.includes('assamese')) { setLang('as'); }
          else if (lower.includes('bengali') || lower.includes('bangla')) { setLang('bn'); }
          else if (lower.includes('start') || lower.includes('shuru')) {
            stopListening();
            // Use state updater to get latest lang safely
            setLang(currentLang => { onStart(currentLang); return currentLang; });
          }
          else {
            setTimeout(() => setVoiceText("Listening... Say a language or 'Start'"), 2000);
          }
        }
      }, () => { 
        setVoice(false); 
        setVoiceText(""); 
        setLevel(0);
      }, (err) => { 
        setVoice(false); 
        setLevel(0);
        if (err === 'offline' || err === 'network') {
          setVoiceText("Offline: Voice needs internet.");
        } else {
          setVoiceText("Voice error. Please try again.");
        }
      }, (lvl) => {
        setLevel(lvl);
      });
    }
  };

  return (
    <div className="fi" style={{ minHeight:"calc(100vh - 0px)",background:"var(--bg)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32 }}>
      {/* Gov branding */}
      <div style={{ textAlign:"center",marginBottom:32 }}>
        <div style={{ width:80,height:80,borderRadius:"50%",background:"var(--navy)",margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"var(--sh-lg)",fontSize:36 }}>🏛️</div>
        <div style={{ fontSize:11,letterSpacing:3,color:"var(--g400)",textTransform:"uppercase",marginBottom:6 }}>Government of India · Smart City Mission</div>
        <h1 style={{ fontSize:38,fontWeight:800,color:"var(--navy)",letterSpacing:-1 }}>SUVIDHA</h1>
        <p style={{ fontSize:14,color:"var(--g600)",marginTop:4 }}>Unified Touch-Based Civic Services Platform</p>
        <p style={{ fontSize:12,color:"var(--g400)",marginTop:4 }}>सुविधा · সুবিধা · সুবিধা</p>
      </div>

      {/* Language picker */}
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",padding:28,boxShadow:"var(--sh-md)",width:"100%",maxWidth:520,marginBottom:20 }}>
        <div style={{ fontSize:12,fontWeight:600,color:"var(--g400)",marginBottom:16,textTransform:"uppercase",letterSpacing:1 }}>{t("selectLang")}</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          {langs.map(l => (
            <button key={l.code} onClick={()=>setLang(l.code)} style={{ padding:"20px 14px",borderRadius:"var(--r-sm)",border:`2px solid ${lang===l.code?"var(--teal)":"var(--g100)"}`,background:lang===l.code?"var(--teal-lt)":"var(--g50)",color:lang===l.code?"var(--teal)":"var(--g600)",fontWeight:lang===l.code?700:500,fontSize:14,display:"flex",flexDirection:"column",alignItems:"center",gap:6,minHeight:70,transition:"all .15s",cursor:"pointer",fontFamily:"inherit" }}>
              <span style={{ fontSize:18 }}>{l.native}</span>
              <span style={{ fontSize:11,opacity:.7 }}>{l.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice toggle */}
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-md)",padding:"14px 24px",boxShadow:"var(--sh-sm)",width:"100%",maxWidth:520,marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div>
          <div style={{ fontWeight:600,fontSize:14 }}>🎤 {t("voiceAssist")}</div>
          <div style={{ fontSize:12,color:"var(--g400)",marginTop:2 }}>{t("voiceDesc")}</div>
        </div>
        <button onClick={toggleVoice} aria-label={t("voiceAssist")} style={{ width:52,height:28,borderRadius:14,background:voice?"var(--teal)":"var(--g200)",position:"relative",border:"none",transition:"background .2s",cursor:"pointer" }}>
          <span style={{ position:"absolute",top:3,left:voice?27:3,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.2)" }}/>
        </button>
      </div>
      
      {voiceText && (
        <div style={{ 
          marginTop: 24, 
          padding: "12px 20px", 
          background: "rgba(0,0,0,0.8)", 
          color: "#fff", 
          borderRadius: 20, 
          fontSize: 14, 
          fontWeight: 600, 
          animation: "fadeIn 0.3s",
          boxShadow: `0 0 ${10 + level/2}px var(--teal)`,
          transform: `scale(${1 + level/500})`
        }}>
          🎤 "{voiceText}"
        </div>
      )}

      <button onClick={()=>onStart(lang)} className="btn" style={{ background:"var(--navy)",color:"#fff",borderRadius:"var(--r-md)",padding:"18px 60px",fontSize:18,fontWeight:700,boxShadow:"var(--sh-lg)",minHeight:60,width:"100%",maxWidth:520,cursor:"pointer",fontFamily:"inherit",border:"none" }}>
        {t("startBtn")}
      </button>
      <div style={{ marginTop:20,fontSize:11,color:"var(--g400)",textAlign:"center" }}>{t("secured")}</div>
    </div>
  );
};

export default Welcome;
