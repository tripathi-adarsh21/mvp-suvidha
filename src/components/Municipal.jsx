/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Spinner, Badge, BBtn, ActionRow } from './ui/Atoms';
import api from '../utils/api';
import { downloadReceipt } from '../utils/receipt';

export const Municipal = ({ onNav, onBack, t }) => {
  const items = [
    { id:"mun-prop",  icon:"🏠", label:t("mPropTax"), desc:t("mPropDesc") },
    { id:"mun-water", icon:"💧", label:t("mWater"),   desc:t("mWaterDesc") },
    { id:"mun-trade", icon:"📋", label:t("mTrade"),   desc:t("mTradeDesc") },
    { id:"mun-build", icon:"🏗️", label:t("mBuild"),   desc:t("mBuildDesc") },
    { id:"mun-birth", icon:"👶", label:t("mBirth"),   desc:t("mBirthDesc") },
    { id:"mun-death", icon:"📜", label:t("mDeath"),   desc:t("mDeathDesc") },
  ];
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:700,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:28 }}>
        <div style={{ width:52,height:52,borderRadius:"var(--r-sm)",background:"#E3F2FD",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:"1.5px solid #90CAF9" }}>🏙️</div>
        <div><h2 style={{ fontSize:22,fontWeight:700 }}>{t("sMun")}</h2><p style={{ fontSize:13,color:"var(--g400)" }}>Lucknow Municipal Corporation · Nagar Nigam</p></div>
      </div>
      <ActionRow items={items} onNav={onNav}/>
    </div>
  );
};

export const PropertyTax = ({ onNav, onBack, t }) => {
  const [loading,setLoading] = useState(true);
  const [prop,setProp]       = useState(null);
  useEffect(()=>{ api.getPropTax().then(p=>{ setProp(p); setLoading(false); }); },[]);

  const handleDownload = () => {
    downloadReceipt({
      title: t("mPropTax"),
      citizenName: prop.ownerName,
      department: t("sMun"),
      service: t("mPropTax"),
      amount: prop.taxAmount,
      details: {
        [t("propId")]: prop.propertyId,
        [t("propType")]: prop.propertyType,
        [t("area")]: prop.area,
        [t("dueDate")]: prop.dueDate
      }
    });
  };

  useEffect(() => {
    const handleVoice = (e) => {
      const cmd = e.detail;
      if (cmd.action === 'pay') onNav("pay-prop");
      if (cmd.action === 'back') onBack();
    };
    window.addEventListener('voice-action', handleVoice);
    return () => window.removeEventListener('voice-action', handleVoice);
  }, [onNav, onBack]);
  if(loading) return <div style={{ padding:40,textAlign:"center" }}><Spinner/></div>;
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:640,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("mPropTax")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>Assessment Year 2024-25</p>
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",overflow:"hidden",marginBottom:20 }}>
        <div style={{ background:"var(--navy)",padding:"20px 24px",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
          <div><div style={{ fontSize:11,color:"rgba(255,255,255,.6)",letterSpacing:1 }}>PROPERTY TAX NOTICE</div><div style={{ fontSize:18,fontWeight:700,marginTop:4 }}>{prop.ownerName}</div></div>
          <Badge status={prop.status}/>
        </div>
        <div style={{ padding:24 }}>
          {[[t("propId"),prop.propertyId,true],[t("propType"),prop.propertyType,false],[t("area"),prop.area,false],[t("taxAmt"),prop.taxAmount,false],[t("dueDate"),prop.dueDate,false]].map(([k,v,mono])=>(
            <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--g100)" }}>
              <span style={{ fontSize:13,color:"var(--g400)",flex:"0 0 160px" }}>{k}</span>
              <span style={{ fontSize:14,fontWeight:600,color:"var(--navy)",fontFamily:mono?"'Space Mono',monospace":"inherit" }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop:16,background:"var(--g50)",borderRadius:"var(--r-sm)",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <span style={{ fontWeight:700 }}>{t("totalDue")}</span>
            <span style={{ fontSize:26,fontWeight:800,fontFamily:"'Space Mono',monospace" }}>{prop.taxAmount}</span>
          </div>
        </div>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <button onClick={()=>onNav("pay-prop")} className="btn" style={{ width:"100%",background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("payNow")} · {prop.taxAmount}</button>
        <div style={{ display:"flex",gap:12 }}>
          <button onClick={handleDownload} className="btn" style={{ flex:1,background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("dlPdf")}</button>
          <button onClick={() => window.print()} className="btn" style={{ flex:1,background:"var(--g50)",color:"var(--navy)",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:600,cursor:"pointer" }}>{t("printRec")}</button>
        </div>
      </div>
    </div>
  );
};

export const WaterBill = ({ onNav, onBack, t }) => {
  const [loading,setLoading] = useState(true);
  const [water,setWater]     = useState(null);
  useEffect(()=>{ api.getWater().then(w=>{ setWater(w); setLoading(false); }); },[]);

  const handleDownload = () => {
    downloadReceipt({
      title: t("mWater"),
      citizenName: water.consumerName,
      department: t("sMun"),
      service: t("mWater"),
      amount: water.billAmount,
      details: {
        [t("connId")]: water.connId,
        [t("waterUnits")]: water.units,
        [t("billPeriod")]: water.period,
        [t("dueDate")]: water.dueDate
      }
    });
  };

  useEffect(() => {
    const handleVoice = (e) => {
      const cmd = e.detail;
      if (cmd.action === 'pay') onNav("pay-water");
      if (cmd.action === 'back') onBack();
    };
    window.addEventListener('voice-action', handleVoice);
    return () => window.removeEventListener('voice-action', handleVoice);
  }, [onNav, onBack]);
  if(loading) return <div style={{ padding:40,textAlign:"center" }}><Spinner/></div>;
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:640,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("mWater")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>{t("billPeriod")} {water.period}</p>
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",overflow:"hidden",marginBottom:20 }}>
        <div style={{ background:"#0277BD",padding:"20px 24px",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
          <div><div style={{ fontSize:11,color:"rgba(255,255,255,.6)",letterSpacing:1 }}>WATER BILL · Jal Jeevan Mission</div><div style={{ fontSize:18,fontWeight:700,marginTop:4 }}>{water.consumerName}</div></div>
          <Badge status={water.status}/>
        </div>
        <div style={{ padding:24 }}>
          {[[t("connId"),water.connId,true],[t("waterUnits"),water.units,false],[t("billAmt"),water.billAmount,false],[t("dueDate"),water.dueDate,false]].map(([k,v,mono])=>(
            <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--g100)" }}>
              <span style={{ fontSize:13,color:"var(--g400)",flex:"0 0 160px" }}>{k}</span>
              <span style={{ fontSize:14,fontWeight:600,color:"var(--navy)",fontFamily:mono?"'Space Mono',monospace":"inherit" }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop:16,background:"var(--g50)",borderRadius:"var(--r-sm)",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <span style={{ fontWeight:700 }}>{t("totalDue")}</span>
            <span style={{ fontSize:26,fontWeight:800,fontFamily:"'Space Mono',monospace" }}>{water.billAmount}</span>
          </div>
        </div>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <button onClick={()=>onNav("pay-water")} className="btn" style={{ width:"100%",background:"#0277BD",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("payNow")} · {water.billAmount}</button>
        <div style={{ display:"flex",gap:12 }}>
          <button onClick={handleDownload} className="btn" style={{ flex:1,background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("dlPdf")}</button>
          <button onClick={() => window.print()} className="btn" style={{ flex:1,background:"var(--g50)",color:"var(--navy)",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:600,cursor:"pointer" }}>{t("printRec")}</button>
        </div>
      </div>
    </div>
  );
};

export const CertificateService = ({ title, icon, desc, fields, onBack, t }) => {
  const [form,setForm] = useState({});
  const [submitted,setSubmitted] = useState(false);
  const [loading,setLoading] = useState(false);
  const [refId,setRefId] = useState("");

  const submit = () => {
    setLoading(true);
    setTimeout(()=>{
      setRefId(`CERT-2025-${~~(Math.random()*90000)+10000}`);
      setLoading(false); setSubmitted(true);
    },1400);
  };

  const handleDownload = () => {
    downloadReceipt({
      title: "APPLICATION SUBMITTED",
      citizenName: form.owner || form.name || form.cname || "Citizen",
      department: t("sMun"),
      service: title,
      amount: "₹0.00",
      txnId: refId,
      details: {
        "Status": "Application Received",
        ...form
      }
    });
  };

  useEffect(() => {
    const handleVoice = (e) => {
      const cmd = e.detail;
      if ((cmd.action === 'submit' || cmd.action === 'book') && !loading && !submitted) submit();
      if (cmd.action === 'back') {
         if (submitted) setSubmitted(false);
         else onBack();
      }
    };
    window.addEventListener('voice-action', handleVoice);
    return () => window.removeEventListener('voice-action', handleVoice);
  }, [onBack, loading, submitted]);

  if(submitted) return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:500,margin:"0 auto",textAlign:"center" }}>
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40 }}>
        <div style={{ fontSize:56,marginBottom:16 }}>{icon}</div>
        <h2 style={{ fontSize:22,fontWeight:800,color:"var(--navy)",marginBottom:8 }}>Application Submitted!</h2>
        <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>Your application has been received and is under review.</p>
        <div style={{ background:"var(--g50)",borderRadius:"var(--r-sm)",padding:20,marginBottom:24 }}>
          <div style={{ fontSize:12,color:"var(--g400)",marginBottom:6 }}>APPLICATION REFERENCE</div>
          <div style={{ fontSize:22,fontWeight:800,fontFamily:"'Space Mono',monospace",color:"var(--navy)" }}>{refId}</div>
          <div style={{ fontSize:12,color:"var(--g400)",marginTop:8 }}>Processing time: 5–7 working days</div>
        </div>
        <div style={{ display:"flex",gap:12,marginBottom:12 }}>
          <button onClick={handleDownload} className="btn" style={{ flex:1,background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("dlPdf")}</button>
          <button onClick={() => window.print()} className="btn" style={{ flex:1,background:"var(--g50)",color:"var(--navy)",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer" }}>{t("printRec")}</button>
        </div>
        <button onClick={()=>setSubmitted(false)} className="btn" style={{ width:"100%",background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("back")}</button>
      </div>
    </div>
  );

  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:600,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:24 }}>
        <span style={{ fontSize:36 }}>{icon}</span>
        <div><h2 style={{ fontSize:22,fontWeight:700 }}>{title}</h2><p style={{ fontSize:13,color:"var(--g400)" }}>{desc}</p></div>
      </div>
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",padding:28,display:"flex",flexDirection:"column",gap:18 }}>
        {fields.map(f=>(
          <div key={f.key}>
            <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5,display:"block",marginBottom:6 }}>{f.label.toUpperCase()} {f.req?"*":""}</label>
            {f.type==="select"?(
              <select value={form[f.key]||""} onChange={e=>setForm({...form,[f.key]:e.target.value})} style={{ width:"100%",padding:"13px 16px",borderRadius:"var(--r-sm)",border:"1.5px solid var(--g200)",fontSize:14,color:"var(--navy)",background:"var(--input-bg, #fff)",minHeight:50 }}>
                <option value="">Select…</option>
                {f.options.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            ):(
              <input type={f.type||"text"} value={form[f.key]||""} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.placeholder||""} style={{ width:"100%",padding:"13px 16px",borderRadius:"var(--r-sm)",border:"1.5px solid var(--g200)",fontSize:14,color:"var(--navy)",outline:"none",minHeight:50,background:"var(--input-bg, #fff)" }}/>
            )}
          </div>
        ))}
        <button onClick={submit} disabled={loading} className="btn" style={{ background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>
          {loading?<Spinner/>:"Submit Application →"}
        </button>
      </div>
    </div>
  );
};
