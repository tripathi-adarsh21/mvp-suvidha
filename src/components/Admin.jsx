import { useState, useEffect } from 'react';
import { BBtn } from './ui/Atoms';
import { MOCK_ADMIN_STATS, MOCK_LOGS } from '../config/mockData';
import { sanitizeInput } from '../utils/security';

const Admin = ({ onBack, t }) => {
  const [ann,setAnn]   = useState("");
  const [alert,setAlert] = useState("Scheduled maintenance: Sector 12 water supply off on 16 Mar 2026, 10AM–2PM");
  const stats = [
    { lk:"statSessions",  val:MOCK_ADMIN_STATS.sessions,     icon:"🖥️", color:"var(--navy)" },
    { lk:"statTxns",      val:MOCK_ADMIN_STATS.transactions,  icon:"💳", color:"var(--teal)" },
    { lk:"statComps",     val:MOCK_ADMIN_STATS.complaints,    icon:"📋", color:"#E65100"    },
    { lk:"statRev",       val:MOCK_ADMIN_STATS.revenue,       icon:"💰", color:"var(--green)"},
  ];

  useEffect(() => {
    const handleVoice = (e) => {
      const cmd = e.detail;
      if (cmd.action === 'submit' || cmd.action === 'broadcast') {
         if (ann) { setAlert(sanitizeInput(ann)); setAnn(""); }
      }
      if (cmd.action === 'back') onBack();
    };
    window.addEventListener('voice-action', handleVoice);
    return () => window.removeEventListener('voice-action', handleVoice);
  }, [onBack, ann]);
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:900,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:28 }}>
        <div style={{ background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"8px 14px",fontSize:11,fontWeight:700,letterSpacing:1 }}>{t("adminBadge")}</div>
        <h2 style={{ fontSize:22,fontWeight:700 }}>{t("adminTitle")}</h2>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28 }}>
        {stats.map(s=>(
          <div key={s.lk} style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-md)",padding:20,boxShadow:"var(--sh-sm)",borderLeft:`4px solid ${s.color}` }}>
            <div style={{ fontSize:24,marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:24,fontWeight:800,color:s.color,fontFamily:"'Space Mono',monospace" }}>{s.val}</div>
            <div style={{ fontSize:11,color:"var(--g400)",marginTop:4 }}>{t(s.lk)}</div>
          </div>
        ))}
      </div>
      {/* Emergency control */}
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-md)",boxShadow:"var(--sh-sm)",padding:24,marginBottom:24 }}>
        <h3 style={{ fontSize:15,fontWeight:700,marginBottom:4 }}>🚨 {t("emergCtrl")}</h3>
        <p style={{ fontSize:12,color:"var(--g400)",marginBottom:14 }}>{t("curAlert")} <strong style={{ color:"var(--red)" }}>{alert||t("noneActive")}</strong></p>
        <div style={{ display:"flex",gap:12 }}>
          <input value={ann} onChange={e=>setAnn(sanitizeInput(e.target.value))} placeholder={t("announcePh")} style={{ flex:1,padding:"12px 16px",borderRadius:"var(--r-sm)",border:"1.5px solid var(--g200)",fontSize:14,background:"var(--input-bg, #fff)",color:"var(--navy)",outline:"none",fontFamily:"inherit" }}/>
          <button onClick={()=>{ setAlert(sanitizeInput(ann)); setAnn(""); }} className="btn" style={{ background:"var(--red)",color:"#fff",borderRadius:"var(--r-sm)",padding:"12px 20px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("broadcast")}</button>
          <button onClick={()=>setAlert("")} className="btn" style={{ background:"var(--g50)",color:"var(--g600)",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"12px 20px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>{t("clearAlert")}</button>
        </div>
      </div>
      {/* Log table */}
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-md)",boxShadow:"var(--sh-sm)",overflow:"hidden" }}>
        <div style={{ padding:"16px 20px",borderBottom:"1px solid var(--g100)",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <h3 style={{ fontSize:15,fontWeight:700 }}>{t("liveLog")}</h3>
          <span style={{ width:8,height:8,borderRadius:"50%",background:"#4CAF50",display:"inline-block",animation:"pulse 2s infinite" }}/>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
            <thead>
              <tr style={{ background:"var(--g50)" }}>
                {["Time","Kiosk","Event","User"].map(h=>(
                  <th key={h} style={{ padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:"var(--g400)",letterSpacing:.5,textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_LOGS.map((l,i)=>(
                <tr key={i} style={{ borderBottom:"1px solid var(--g100)" }}>
                  <td style={{ padding:"12px 16px",fontFamily:"'Space Mono',monospace",fontSize:12,color:"var(--g600)" }}>{l.time}</td>
                  <td style={{ padding:"12px 16px",color:"var(--teal)",fontWeight:600 }}>{l.kiosk}</td>
                  <td style={{ padding:"12px 16px",color:"var(--navy)" }}>{l.event}</td>
                  <td style={{ padding:"12px 16px",fontFamily:"'Space Mono',monospace",fontSize:12,color:"var(--g400)" }}>{l.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
