import { useEffect } from 'react';
import { BBtn } from './ui/Atoms';

const Emergency = ({ onBack, t }) => {
  useEffect(() => {
    const handleVoice = (e) => {
      if (e.detail?.action === 'back') onBack();
    };
    window.addEventListener('voice-action', handleVoice);
    return () => window.removeEventListener('voice-action', handleVoice);
  }, [onBack]);

  const contacts = [
    { icon:"🚒", name:"Fire Brigade",        number:"101", color:"#FF5722" },
    { icon:"🚔", name:"Police",              number:"100", color:"#1565C0" },
    { icon:"🚑", name:"Ambulance (EMRI)",    number:"108", color:"#C62828" },
    { icon:"⚡", name:"Power Emergency",     number:"1912",color:"#F57C00" },
    { icon:"💧", name:"Water Emergency",     number:"1916",color:"#0277BD" },
    { icon:"☎️", name:"Civic Helpline",      number:"155304",color:"#2E7D32" },
    { icon:"👩‍👧", name:"Women Helpline",     number:"1091",color:"#AD1457" },
    { icon:"🌊", name:"Disaster Mgmt",       number:"1077",color:"#37474F" },
  ];
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:700,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <div style={{ background:"var(--red)",borderRadius:"var(--r-md)",padding:"20px 24px",marginBottom:24,color:"#fff" }}>
        <h2 style={{ fontSize:22,fontWeight:800,marginBottom:4 }}>🚨 {t("emergTitle")}</h2>
        <p style={{ fontSize:13,opacity:.85 }}>{t("emergWarn")}</p>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        {contacts.map(c=>(
          <div key={c.name} style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-md)",boxShadow:"var(--sh-sm)",padding:20,borderLeft:`4px solid ${c.color}` }}>
            <div style={{ fontSize:32,marginBottom:8 }}>{c.icon}</div>
            <div style={{ fontWeight:700,fontSize:14,color:"var(--navy)" }}>{c.name}</div>
            <div style={{ fontFamily:"'Space Mono',monospace",fontSize:22,fontWeight:800,color:c.color,marginTop:6 }}>{c.number}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Emergency;
