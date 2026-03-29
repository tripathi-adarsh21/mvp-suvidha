/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect, useCallback } from 'react';
import { stripTags } from '../utils/security';
import { startListening, stopListening, speak, stopSpeaking, isSpeechRecognitionSupported } from '../utils/voiceAssistant';

// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED AI CHATBOT v3.0
// - Smart intent matching with confidence scoring
// - Typing animation for bot responses
// - Voice input (STT) + voice output (TTS) – no echo
// - Contextual follow-ups
// - Rich message formatting
// - Dark mode aware
// ═══════════════════════════════════════════════════════════════════════════

const INTENTS = [
  // Bill viewing
  { keywords: ['bill','electricity bill','bijli','view bill','show bill','mera bill'], response: 'chatWorkflowBill', action: 'electricity', confidence: 0.9 },
  // Payment
  { keywords: ['pay','payment','bhugtan','pay bill','kaise pay','how to pay'], response: 'chatWorkflowPay', action: 'elec-pay', confidence: 0.9 },
  // Complaints
  { keywords: ['complaint','report','shikayat','problem','issue','samasyaa','broken','not working'], response: 'chatWorkflowComplaint', action: 'complaint', confidence: 0.85 },
  // Gas
  { keywords: ['gas','cylinder','silender','lpg','book cylinder','gas booking','gas book'], response: 'chatWorkflowBill', action: 'gas', confidence: 0.9 },
  // Water
  { keywords: ['water','pani','jal','water bill','paani'], response: 'chatWorkflowPay', action: 'mun-water', confidence: 0.85 },
  // Property tax
  { keywords: ['property','tax','sampatti','property tax','ghar ka tax'], response: 'chatWorkflowPay', action: 'mun-prop', confidence: 0.85 },
  // Health
  { keywords: ['vaccine','vaccination','tika','health','swasthya'], response: 'chatWorkflowBill', action: 'health', confidence: 0.85 },
  { keywords: ['ayushman','card','health card','ayushman card'], response: 'chatWorkflowBill', action: 'health-card', confidence: 0.9 },
  { keywords: ['ambulance','108','emergency medical'], response: 'chatWorkflowBill', action: 'health-amb', confidence: 0.95 },
  { keywords: ['lab test','pathology','blood test','test booking'], response: 'chatWorkflowBill', action: 'health-lab', confidence: 0.85 },
  { keywords: ['mental health','counseling','depression','anxiety','stress'], response: 'chatWorkflowBill', action: 'health-mental', confidence: 0.85 },
  { keywords: ['medicine','pharmacy','dawai','medical store','jan aushadhi'], response: 'chatWorkflowBill', action: 'health-med', confidence: 0.85 },
  // Emergency
  { keywords: ['emergency','fire','police','100','101','112'], response: 'chatWorkflowBill', action: 'emergency', confidence: 0.95 },
  // Certificates
  { keywords: ['birth certificate','janam praman patra','birth'], response: 'chatWorkflowBill', action: 'mun-birth', confidence: 0.85 },
  { keywords: ['death certificate','mrityu praman patra'], response: 'chatWorkflowBill', action: 'mun-death', confidence: 0.85 },
  { keywords: ['trade license','vyapar license','business license'], response: 'chatWorkflowBill', action: 'mun-trade', confidence: 0.85 },
  { keywords: ['building plan','bhavan plan','construction'], response: 'chatWorkflowBill', action: 'mun-build', confidence: 0.85 },
  // Help
  { keywords: ['help','sahayata','what can you do','menu','kya kar sakte ho','features'], response: 'chatHelp', action: null, confidence: 0.7 },
  // Form help
  { keywords: ['aadhaar','what is aadhaar','aadhar number'], response: 'chatFieldHelp', extra: 'Aadhaar is a 12-digit unique identity number issued by UIDAI. You\'ll need it for most government services.', action: null, confidence: 0.9 },
  { keywords: ['otp','one time password','what is otp'], response: 'chatFieldHelp', extra: 'OTP is a 6-digit code sent to your registered mobile for secure verification. It expires in 5 minutes.', action: null, confidence: 0.9 },
  // Greetings
  { keywords: ['hello','hi','hey','namaste','namaskar'], response: null, directResponse: 'Hello! 👋 I\'m your SUVIDHA assistant. How can I help you today? Try asking about bills, payments, or any civic service!', action: null, confidence: 0.6 },
  { keywords: ['thank','thanks','dhanyavaad','shukriya'], response: null, directResponse: 'You\'re welcome! 😊 Happy to help. Feel free to ask anything else!', action: null, confidence: 0.6 },
  { keywords: ['bye','goodbye','alvida'], response: null, directResponse: 'Goodbye! 👋 Have a great day. The kiosk is always here when you need it!', action: null, confidence: 0.6 },
];

const matchIntent = (text) => {
  const lower = text.toLowerCase().trim();
  let best = null;
  let bestScore = 0;
  
  for (const intent of INTENTS) {
    for (const kw of intent.keywords) {
      if (lower.includes(kw)) {
        // Score based on keyword length match and confidence
        const score = (kw.length / lower.length) * intent.confidence;
        if (score > bestScore) {
          bestScore = score;
          best = intent;
        }
      }
    }
  }
  return best;
};

// ─── Typing Animation Component ─────────────────────────────────────────
const TypingIndicator = () => (
  <div style={{ display:"flex",gap:4,padding:"12px 16px",alignItems:"center" }}>
    <div style={{ display:"flex",gap:3 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:7, height:7, borderRadius:"50%",
          background:"var(--teal)",
          animation:`typingBounce 1.2s ${i * 0.2}s infinite ease-in-out`,
        }}/>
      ))}
    </div>
    <span style={{ fontSize:11,color:"var(--g400)",marginLeft:6 }}>Typing...</span>
  </div>
);

const Chatbot = ({ onClose, onNavigate, t, lang }) => {
  const [msgs, setMsgs] = useState([{ role: "bot", text: t("chatWelcome"), timestamp: Date.now() }]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, isTyping]);

  // Cleanup voice on unmount
  useEffect(() => {
    return () => {
      if (listening) stopListening();
      stopSpeaking();
    };
  }, [listening]);

  const addBotMsg = useCallback((text, action = null) => {
    setIsTyping(true);
    // Variable typing delay based on message length
    const delay = Math.min(1200, 400 + text.length * 3);
    
    setTimeout(() => {
      setIsTyping(false);
      setMsgs(m => [...m, { role: "bot", text, action, timestamp: Date.now() }]);
      
      // Auto-speak bot response if enabled
      if (autoSpeak) {
        speak(text, lang);
      }
    }, delay);
  }, [autoSpeak, lang]);

  const processInput = useCallback((text) => {
    const clean = stripTags(text);
    if (!clean.trim()) return;

    setMsgs(m => [...m, { role: "user", text: clean, timestamp: Date.now() }]);
    setInput("");
    setError(null);

    const intent = matchIntent(clean);
    if (intent) {
      if (intent.directResponse) {
        addBotMsg(intent.directResponse, intent.action);
      } else {
        let response = t(intent.response);
        if (intent.extra) response = `${t(intent.response)}\n\n${intent.extra}`;
        addBotMsg(response, intent.action);
      }
    } else {
      addBotMsg(t("chatDefault"));
    }
  }, [t, addBotMsg]);

  const handleNavigate = (screen) => {
    if (onNavigate && screen) {
      setMsgs(m => [...m, { role: "bot", text: t("chatNavigate"), timestamp: Date.now() }]);
      setTimeout(() => onNavigate(screen), 500);
    }
  };

  const handleVoiceToggle = () => {
    if (listening) {
      stopListening();
      setListening(false);
      setLevel(0);
    } else {
      if (!isSpeechRecognitionSupported()) {
        setMsgs(m => [...m, { role: "bot", text: t("voiceNotSupported"), timestamp: Date.now() }]);
        return;
      }
      
      setError(null);
      setListening(true);
      startListening(
        lang,
        (text, isFinal) => {
          setInput(text);
          if (isFinal) {
            processInput(text);
            setListening(false);
            setLevel(0);
          }
        },
        () => {
          setListening(false);
          setLevel(0);
        },
        (err) => {
          console.error("Voice Error:", err);
          if (err === 'offline_partial') {
            setError("Offline mode: limited voice. Try typing.");
          } else {
            setListening(false);
            setLevel(0);
            setError("Voice error. Please try typing.");
          }
        },
        (lvl) => {
          setLevel(lvl);
        }
      );
    }
  };

  const handleSpeak = (text) => {
    speak(text, lang);
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const suggestions = [
    { text: t("viewBill") || "View my bill", icon: "📄" },
    { text: t("regComp") || "Register complaint", icon: "📝" },
    { text: t("payBill") || "Payment help", icon: "💳" },
    { text: t("emergTitle") || "Emergency", icon: "🚨" },
    { text: "Help", icon: "❓" },
  ];

  return (
    <div style={{ 
      position:"fixed",bottom:90,right:20,width:380,
      background:"var(--card-bg, #fff)",
      borderRadius:20,
      boxShadow:"0 16px 64px rgba(10,47,90,.25), 0 0 0 1px rgba(0,0,0,.05)",
      display:"flex",flexDirection:"column",zIndex:10000,
      overflow:"hidden",maxHeight:"75vh",
      backdropFilter:"blur(20px)",
      animation:"chatSlideUp 0.3s ease-out",
    }}>
      {/* Header */}
      <div style={{ 
        background:"linear-gradient(135deg, var(--navy-dk), #0D47A1)",
        padding:"16px 18px",color:"#fff",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        borderBottom:"1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <div style={{
            width:38,height:38,borderRadius:12,
            background:"linear-gradient(135deg, var(--teal), #00ACC1)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:18,boxShadow:"0 2px 8px rgba(0,137,123,0.4)",
          }}>🤖</div>
          <div>
            <div style={{ fontWeight:700,fontSize:14,letterSpacing:0.3 }}>SUVIDHA Assistant</div>
            <div style={{ fontSize:10,color:"rgba(255,255,255,.6)",display:"flex",alignItems:"center",gap:4 }}>
              <span style={{ width:6,height:6,borderRadius:"50%",background:"#66BB6A",display:"inline-block" }}></span>
              Online · AI-Powered
            </div>
          </div>
        </div>
        <div style={{ display:"flex",gap:6,alignItems:"center" }}>
          {/* Auto-speak toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            title={autoSpeak ? "Mute auto-speak" : "Enable auto-speak"}
            style={{
              background: autoSpeak ? "rgba(102,187,106,0.2)" : "rgba(255,255,255,.1)",
              color: "#fff", borderRadius: 8,
              width: 32, height: 32, fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", border: `1px solid ${autoSpeak ? "rgba(102,187,106,0.5)" : "rgba(255,255,255,.15)"}`,
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
          >{autoSpeak ? "🔊" : "🔇"}</button>
          
          <button onClick={onClose} style={{ 
            background:"rgba(255,255,255,.1)",color:"#fff",borderRadius:8,
            width:32,height:32,fontSize:16,cursor:"pointer",
            border:"1px solid rgba(255,255,255,.15)",fontFamily:"inherit",
            display:"flex",alignItems:"center",justifyContent:"center",
            transition:"background 0.2s ease",
          }}>×</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ padding:14,overflowY:"auto",flex:1,maxHeight:320,display:"flex",flexDirection:"column",gap:8 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadeIn 0.3s ease" }}>
            <div style={{ maxWidth:"82%",position:"relative" }}>
              {/* Message bubble */}
              <div style={{ 
                padding:"12px 16px",
                borderRadius: m.role==="user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.role==="user" 
                  ? "linear-gradient(135deg, var(--navy), #0D47A1)" 
                  : "var(--g50)",
                color: m.role==="user" ? "#fff" : "var(--navy)",
                fontSize:13,lineHeight:1.6,
                boxShadow: m.role==="user" ? "0 2px 12px rgba(10,47,90,0.2)" : "0 1px 4px rgba(0,0,0,0.06)",
                whiteSpace:"pre-line",
              }}>
                {m.text}
                
                {m.role==="bot" && (
                  <div style={{ display:"flex",gap:8,marginTop:8,flexWrap:"wrap",borderTop:`1px solid ${m.role==="user"?"rgba(255,255,255,.1)":"var(--g100)"}`,paddingTop:8 }}>
                    <button 
                      onClick={()=>handleSpeak(m.text)} 
                      style={{ 
                        background:"none",color:"var(--teal)",fontSize:11,fontWeight:600,
                        cursor:"pointer",border:"none",padding:"2px 0",fontFamily:"inherit",
                        display:"flex",alignItems:"center",gap:3,
                        transition:"opacity 0.2s",
                      }}
                    >🔊 Listen</button>
                    {m.action && (
                      <button 
                        onClick={()=>handleNavigate(m.action)} 
                        style={{ 
                          background:"linear-gradient(135deg, var(--teal), #00ACC1)",
                          color:"#fff",fontSize:11,fontWeight:600,
                          cursor:"pointer",border:"none",padding:"4px 14px",
                          borderRadius:16,fontFamily:"inherit",
                          boxShadow:"0 2px 8px rgba(0,137,123,0.3)",
                          transition:"transform 0.15s ease",
                        }}
                      >Go there →</button>
                    )}
                  </div>
                )}
              </div>
              {/* Timestamp */}
              <div style={{ 
                fontSize:9,color:"var(--g400)",marginTop:3,
                textAlign:m.role==="user"?"right":"left",
                padding:"0 4px",
              }}>{formatTime(m.timestamp)}</div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display:"flex",justifyContent:"flex-start" }}>
            <div style={{ 
              background:"var(--g50)",borderRadius:"16px 16px 16px 4px",
              boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <TypingIndicator />
            </div>
          </div>
        )}
        
        <div ref={endRef}/>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          padding:"8px 14px",
          background:"var(--red-lt)",color:"var(--red)",
          fontSize:11,borderTop:"1px solid var(--g100)",fontWeight:600,
          display:"flex",alignItems:"center",gap:6,
        }}>
          ⚠️ {error}
          <button onClick={()=>setError(null)} style={{ marginLeft:"auto",background:"none",border:"none",color:"var(--red)",cursor:"pointer",fontSize:14,fontFamily:"inherit" }}>×</button>
        </div>
      )}

      {/* Quick suggestions */}
      {!listening && msgs.length < 4 && (
        <div style={{ padding:"8px 14px",borderTop:"1px solid var(--g100)",display:"flex",gap:6,flexWrap:"wrap" }}>
          {suggestions.map(s => (
            <button 
              key={s.text} 
              onClick={()=>processInput(s.text)} 
              style={{ 
                background:"var(--g50)",
                border:"1px solid var(--g200)",borderRadius:20,
                padding:"5px 12px",fontSize:11,color:"var(--g600)",
                minHeight:30,cursor:"pointer",fontFamily:"inherit",
                display:"flex",alignItems:"center",gap:4,
                transition:"all 0.15s ease",
                whiteSpace:"nowrap",
              }}
            >
              <span style={{ fontSize:12 }}>{s.icon}</span>{s.text}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{ 
        padding:"12px 14px",borderTop:"1px solid var(--g100)",
        display:"flex",gap:8,alignItems:"center",position:"relative",
        background:"var(--card-bg, #fff)",
      }}>
        {/* Level Meter */}
        {listening && (
          <div style={{ 
            position:"absolute",left:14,top:-22,
            display:"flex",gap:2,alignItems:"flex-end",height:18,
            background:"var(--card-bg, #fff)",padding:"2px 8px",borderRadius:10,
            boxShadow:"0 -2px 8px rgba(0,0,0,0.05)",
          }}>
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                style={{
                  width:3,
                  background: `hsl(${170 - i*8}, 70%, 50%)`,
                  height:Math.max(3, (level * (i+1) / 12) % 16),
                  transition:"height 0.1s ease",
                  borderRadius:2
                }}
              />
            ))}
            <span style={{ fontSize:9,color:"var(--teal)",marginLeft:4,fontWeight:600 }}>
              {level > 15 ? "🔴 Recording" : "🟢 Ready"}
            </span>
          </div>
        )}

        <button
          onClick={handleVoiceToggle}
          title={listening ? t("voiceListening") : t("voiceAssist")}
          style={{
            width:40,height:40,borderRadius:"50%",
            background:listening ? "linear-gradient(135deg, var(--red), #D32F2F)" : "var(--g50)",
            border:`1.5px solid ${listening?"var(--red)":"var(--g200)"}`,
            fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",
            color:listening?"#fff":"var(--g400)",
            animation:listening?"pulse 1.2s infinite":"none",
            cursor:"pointer",fontFamily:"inherit",
            boxShadow:listening ? `0 0 ${12 + level/2}px rgba(198,40,40,0.35)` : "none",
            transition:"all 0.2s ease",
          }}
        >🎤</button>
        <input
          ref={inputRef}
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{
            if(e.key==="Enter" && !e.shiftKey) {
              e.preventDefault();
              processInput(input);
            }
          }}
          placeholder={listening ? (level > 10 ? "Listening..." : "Speak now...") : "Ask me anything…"}
          style={{ 
            flex:1,border:"1.5px solid var(--g200)",borderRadius:22,
            padding:"10px 16px",fontSize:13,outline:"none",
            background:"var(--input-bg, #fff)",color:"var(--navy)",
            fontFamily:"inherit",
            transition:"border-color 0.2s ease",
          }}
        />
        <button
          onClick={()=>processInput(input)}
          disabled={!input.trim() && !listening}
          style={{ 
            width:40,height:40,borderRadius:"50%",
            background: input.trim() ? "linear-gradient(135deg, var(--teal), #00ACC1)" : "var(--g100)",
            color: input.trim() ? "#fff" : "var(--g400)",
            fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",
            cursor: input.trim() ? "pointer" : "default",
            border:"none",fontFamily:"inherit",
            boxShadow: input.trim() ? "0 2px 8px rgba(0,137,123,0.3)" : "none",
            transition:"all 0.2s ease",
          }}
        >➤</button>
      </div>
    </div>
  );
};

export default Chatbot;
