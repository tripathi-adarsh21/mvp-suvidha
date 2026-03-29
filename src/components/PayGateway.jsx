import { useState, useEffect, useCallback } from 'react';
import { Spinner, BBtn } from './ui/Atoms';
import api from '../utils/api';
import { downloadReceipt } from '../utils/receipt';

const PayGateway = ({ amount, serviceName, deptName, onSuccess, onBack, t }) => {
  const [method, setMethod] = useState("upi");
  const [step, setStep]   = useState("choose");
  const [res, setRes]     = useState(null);
  const methods = [{ id:"upi",icon:"📱",label:"UPI / QR Code" },{ id:"net",icon:"🏦",label:"Net Banking" },{ id:"debit",icon:"💳",label:"Debit Card" },{ id:"credit",icon:"💳",label:"Credit Card" }];

  const doPayment = useCallback(async () => { setStep("processing"); const r = await api.pay(amount); setRes(r); setStep("done"); }, [amount]);

  const handleDownload = () => {
    downloadReceipt({
      title: t("paySuccess"),
      citizenName: "Citizen",
      department: deptName || "Service Board",
      service: serviceName || "Bill Payment",
      amount: amount,
      txnId: res.txnId,
      details: {
        [t("payMode")]: method.toUpperCase(),
        [t("dtTime")]: res.datetime,
        "Status": "COMPLETED"
      }
    });
  };

  useEffect(() => {
    const handleVoice = (e) => {
      const cmd = e.detail;
      if (step !== 'choose') return;
      if (cmd.type === 'payment_method') {
        setMethod(cmd.method);
      } else if (cmd.action === 'pay' || cmd.action === 'submit') {
        doPayment();
      } else if (cmd.action === 'back') {
        onBack();
      }
    };
    window.addEventListener('voice-action', handleVoice);
    return () => window.removeEventListener('voice-action', handleVoice);
  }, [step, onBack, doPayment]);

  if(step==="processing") return (
    <div style={{ minHeight:"calc(100vh - 64px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:32 }}>
      <div style={{ width:80,height:80,borderRadius:"50%",background:"var(--card-bg, #fff)",boxShadow:"var(--sh-lg)",display:"flex",alignItems:"center",justifyContent:"center" }}><Spinner/></div>
      <h3 style={{ fontSize:20,fontWeight:700 }}>Processing Payment…</h3>
      <p style={{ color:"var(--g400)",textAlign:"center",fontSize:14 }}>Connecting to secure payment gateway.<br/><small>Do not press Back or close this window.</small></p>
    </div>
  );

  if(step==="done") return (
    <div className="fi" style={{ minHeight:"calc(100vh - 64px)",display:"flex",alignItems:"center",justifyContent:"center",padding:32 }}>
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40,maxWidth:440,width:"100%",textAlign:"center" }}>
        <div style={{ width:80,height:80,borderRadius:"50%",background:"var(--green-lt)",margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,border:"3px solid #4CAF50" }}>✅</div>
        <h2 style={{ fontSize:24,fontWeight:800,color:"var(--green)",marginBottom:8 }}>{t("paySuccess")}</h2>
        <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>{t("billPaid")}</p>
        <div style={{ background:"var(--g50)",borderRadius:"var(--r-sm)",padding:20,textAlign:"left",marginBottom:24 }}>
          {[[t("txnId"),res.txnId,true],[t("amtPaid"),amount,false],[t("payMode"),method.toUpperCase(),false],[t("dtTime"),res.datetime,false]].map(([k,v,mono])=>(
            <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--g100)",fontSize:13 }}>
              <span style={{ color:"var(--g400)" }}>{k}</span>
              <span style={{ fontWeight:600,color:"var(--navy)",fontFamily:mono?"'Space Mono',monospace":"inherit",fontSize:mono?11:13 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",gap:12,marginBottom:14 }}>
          <button onClick={handleDownload} className="btn" style={{ flex:1,background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"12px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("dlPdf")}</button>
          <button onClick={() => window.print()} className="btn" style={{ flex:1,background:"var(--g50)",color:"var(--navy)",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"12px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>{t("printRec")}</button>
        </div>
        <button onClick={onSuccess} className="btn" style={{ width:"100%",background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("retDash")}</button>
      </div>
    </div>
  );

  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:540,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("pgTitle")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:20 }}>{t("pgSubtitle")}</p>
      <div style={{ background:"var(--teal-lt)",border:"1px solid #B2DFDB",borderRadius:"var(--r-sm)",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
        <span style={{ fontSize:14,color:"#004D40" }}>{t("amtToPay")}</span>
        <span style={{ fontSize:24,fontWeight:800,color:"#004D40",fontFamily:"'Space Mono',monospace" }}>{amount}</span>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:24 }}>
        {methods.map(m=>(
          <button key={m.id} onClick={()=>setMethod(m.id)} style={{ background:method===m.id?"var(--navy)":"var(--card-bg, #fff)",color:method===m.id?"#fff":"var(--navy)",border:`2px solid ${method===m.id?"var(--navy)":"var(--g100)"}`,borderRadius:"var(--r-sm)",padding:"16px 20px",display:"flex",alignItems:"center",gap:14,fontSize:15,fontWeight:600,minHeight:60,cursor:"pointer",fontFamily:"inherit" }}>
            <span style={{ fontSize:22 }}>{m.icon}</span>{m.label}
            {method===m.id&&<span style={{ marginLeft:"auto" }}>●</span>}
          </button>
        ))}
      </div>
      <div style={{ background:"var(--red-lt)",borderRadius:"var(--r-sm)",padding:"10px 16px",marginBottom:20,fontSize:12,color:"var(--red)",display:"flex",gap:8 }}>
        <span>🔒</span><span>All payments processed via RBI-approved encrypted gateway.</span>
      </div>
      <button onClick={doPayment} className="btn" style={{ width:"100%",background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"18px",fontSize:17,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>
        {t("paySecure")} {amount}
      </button>
    </div>
  );
};

export default PayGateway;
