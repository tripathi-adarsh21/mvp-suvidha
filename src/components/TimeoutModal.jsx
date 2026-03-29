const TimeoutModal = ({ onContinue, onLogout, t }) => (
  <div style={{ position:"fixed",inset:0,background:"rgba(10,47,90,.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99999 }} role="dialog" aria-modal="true" aria-labelledby="timeout-title">
    <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",padding:40,maxWidth:400,textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,.3)" }}>
      <div style={{ fontSize:48,marginBottom:16 }}>⏱️</div>
      <h3 id="timeout-title" style={{ fontSize:20,fontWeight:700,marginBottom:8 }}>{t("timeoutTitle")}</h3>
      <p style={{ fontSize:14,color:"var(--g400)",marginBottom:28 }}>{t("timeoutMsg")}</p>
      <div style={{ display:"flex",gap:12 }}>
        <button onClick={onLogout} className="btn" style={{ flex:1,background:"var(--g50)",color:"var(--g600)",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>{t("logout")}</button>
        <button onClick={onContinue} className="btn" style={{ flex:1,background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("continueSess")}</button>
      </div>
    </div>
  </div>
);

export default TimeoutModal;
