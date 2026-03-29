// Shared UI Atoms – Spinner, Badge, BBtn, ActionRow

export const Spinner = () => <div style={{ width:32,height:32,borderRadius:"50%",border:"3px solid var(--g100)",borderTopColor:"var(--teal)",animation:"spin .8s linear infinite",margin:"0 auto" }}/>;

export const Badge = ({ status }) => {
  const map = { Success:{bg:"#E8F5E9",c:"#1B5E20"}, Pending:{bg:"#FFF8E1",c:"#E65100"}, "In Progress":{bg:"#E3F2FD",c:"#0D47A1"}, Resolved:{bg:"#E8F5E9",c:"#1B5E20"} };
  const s = map[status]||{bg:"var(--g100)",c:"var(--g600)"};
  return <span style={{ background:s.bg,color:s.c,padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600 }}>{status}</span>;
};

export const BBtn = ({ onBack, t }) => (
  <button onClick={onBack} style={{ display:"flex",alignItems:"center",gap:6,background:"var(--g50)",border:"1.5px solid var(--g100)",borderRadius:"var(--r-sm)",padding:"10px 18px",fontSize:14,fontWeight:600,color:"var(--g600)",minHeight:48,marginBottom:20,cursor:"pointer",fontFamily:"inherit" }}>
    {t("back")}
  </button>
);

export const ActionRow = ({ items, onNav }) => (
  <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
    {items.map(a => (
      <button key={a.id} onClick={() => onNav(a.id)} style={{ background:"var(--card-bg, #fff)",border:"1.5px solid var(--g100)",borderRadius:"var(--r-md)",padding:"20px 24px",display:"flex",alignItems:"center",gap:16,textAlign:"left",boxShadow:"var(--sh-sm)",minHeight:72,cursor:"pointer",fontFamily:"inherit" }}>
        <span style={{ fontSize:26,width:48,height:48,borderRadius:"var(--r-sm)",background:"var(--g50)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{a.icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700,fontSize:16,color:"var(--navy)" }}>{a.label}</div>
          <div style={{ fontSize:13,color:"var(--g400)",marginTop:3 }}>{a.desc}</div>
        </div>
        <span style={{ color:"var(--g200)",fontSize:20 }}>›</span>
      </button>
    ))}
  </div>
);
