const Dashboard = ({ user, onNav, sessionTime, t }) => {
  const mins=Math.floor(sessionTime/60), secs=sessionTime%60;
  const tiles = [
    { id:"electricity",icon:"⚡",lk:"sElec",dk:"dElec",bg:"#E8F5E9",ac:"#1B5E20" },
    { id:"gas",        icon:"🔥",lk:"sGas", dk:"dGas", bg:"#FFF8E1",ac:"#E65100" },
    { id:"municipal",  icon:"🏙️",lk:"sMun", dk:"dMun", bg:"#E3F2FD",ac:"#0D47A1" },
    { id:"health",     icon:"🏥",lk:"sHealth",dk:"dHealth",bg:"#F3E5F5",ac:"#6A1B9A" },
    { id:"emergency",  icon:"🚨",lk:"sEmerg",dk:"dEmerg",bg:"#FFEBEE",ac:"#C62828" },
    { id:"admin",      icon:"⚙️",lk:"sAdmin",dk:"dAdmin",bg:"#ECEFF1",ac:"#37474F" },
  ];
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:900,margin:"0 auto" }}>
      <div style={{ background:"var(--navy)",borderRadius:"var(--r-md)",padding:"20px 24px",marginBottom:24,display:"flex",alignItems:"center",justifyContent:"space-between",color:"#fff" }}>
        <div>
          <div style={{ fontSize:11,color:"rgba(255,255,255,.6)",letterSpacing:1,marginBottom:4 }}>{t("welcomeBack")}</div>
          <div style={{ fontSize:20,fontWeight:700 }}>{user?.user?.name}</div>
          <div style={{ fontSize:12,color:"rgba(255,255,255,.6)",marginTop:2 }}>
            📅 {new Date().toLocaleDateString("en-IN",{ weekday:"long",year:"numeric",month:"long",day:"numeric" })}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:11,color:"rgba(255,255,255,.6)",marginBottom:4 }}>{t("sessionExp")}</div>
          <div style={{ fontFamily:"'Space Mono',monospace",fontSize:22,fontWeight:700,color:sessionTime<60?"#EF5350":"#fff" }}>
            {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
          </div>
        </div>
      </div>

      <div style={{ fontSize:12,fontWeight:600,color:"var(--g400)",letterSpacing:1,textTransform:"uppercase",marginBottom:16 }}>{t("available")}</div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
        {tiles.map(s=>(
          <button key={s.id} onClick={()=>onNav(s.id)} style={{ background:s.bg,border:`1.5px solid ${s.ac}20`,borderRadius:"var(--r-md)",padding:"24px 20px",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:10,minHeight:130,boxShadow:"var(--sh-sm)",textAlign:"left",cursor:"pointer",fontFamily:"inherit" }}>
            <span style={{ fontSize:32 }}>{s.icon}</span>
            <div>
              <div style={{ fontWeight:700,fontSize:15,color:s.ac }}>{t(s.lk)}</div>
              <div style={{ fontSize:12,color:"var(--g600)",marginTop:3 }}>{t(s.dk)}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ marginTop:24,padding:"12px 20px",background:"var(--teal-lt)",borderRadius:"var(--r-sm)",border:"1px solid #B2DFDB",display:"flex",gap:10,alignItems:"center" }}>
        <span>ℹ️</span>
        <p style={{ fontSize:12,color:"#004D40" }}><strong>{t("noteLabel")}</strong> {t("noteMsg")}</p>
      </div>
    </div>
  );
};

export default Dashboard;