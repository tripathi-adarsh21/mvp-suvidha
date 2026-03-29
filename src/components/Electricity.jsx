/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Spinner, Badge, BBtn, ActionRow } from './ui/Atoms';
import api from '../utils/api';
import { downloadReceipt } from '../utils/receipt';

// Electricity Hub
export const Electricity = ({ onNav, onBack, t }) => {
  const items = [
    { id:"elec-bill",  icon:"📄",label:t("viewBill"), desc:"Check your current electricity bill" },
    { id:"elec-pay",   icon:"💳",label:t("payBill"),  desc:"Make secure online payment" },
    { id:"complaint",  icon:"📝",label:t("regComp"),  desc:"Report issues and outages" },
    { id:"new-conn",   icon:"🔌",label:t("newConn"),  desc:"Apply for new connection" },
  ];
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:700,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:28 }}>
        <div style={{ width:52,height:52,borderRadius:"var(--r-sm)",background:"#E8F5E9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:"1.5px solid #C8E6C9" }}>⚡</div>
        <div>
          <h2 style={{ fontSize:22,fontWeight:700 }}>{t("sElec")}</h2>
          <p style={{ fontSize:13,color:"var(--g400)" }}>UPPCL · State Power Corporation Limited</p>
        </div>
      </div>
      <ActionRow items={items} onNav={onNav}/>
    </div>
  );
};

// Electricity Bill View
export const ElecBill = ({ onNav, onBack, t }) => {
  const [loading,setLoading] = useState(true);
  const [bill,setBill]       = useState(null);
  useEffect(()=>{ api.getBill().then(b=>{ setBill(b); setLoading(false); }); },[]);
  useEffect(() => {
    const handleVoice = (e) => {
      const cmd = e.detail;
      if (cmd.action === 'pay') onNav("pay-elec");
      if (cmd.action === 'back') onBack();
    };
    window.addEventListener('voice-action', handleVoice);
    return () => window.removeEventListener('voice-action', handleVoice);
  }, [onNav, onBack]);
  const handleDownload = () => {
    downloadReceipt({
      title: t("elecBillTitle"),
      citizenName: bill.consumerName,
      department: t("sElec"),
      service: t("viewBill"),
      amount: bill.billAmount,
      details: {
        [t("accNum")]: bill.accountNumber,
        [t("billPeriod")]: bill.period,
        [t("units")]: bill.unit,
        [t("dueDate")]: bill.dueDate
      }
    });
  };

  if(loading) return <div style={{ padding:40,textAlign:"center" }}><Spinner/></div>;
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:640,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("elecBillTitle")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>{t("billPeriod")} {bill.period}</p>
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",overflow:"hidden",marginBottom:20 }}>
        <div style={{ background:"var(--navy)",padding:"20px 24px",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:11,color:"rgba(255,255,255,.6)",letterSpacing:1 }}>{t("elecBillTitle")}</div>
            <div style={{ fontSize:20,fontWeight:700,marginTop:4 }}>{bill.consumerName}</div>
          </div>
          <Badge status={bill.status}/>
        </div>
        <div style={{ padding:24 }}>
          {[[t("accNum"),bill.accountNumber,true],[t("svcAddr"),bill.address,false],[t("units"),bill.unit,false],[t("billAmt"),bill.billAmount,false],[t("dueDate"),bill.dueDate,false]].map(([k,v,mono])=>(
            <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--g100)" }}>
              <span style={{ fontSize:13,color:"var(--g400)",flex:"0 0 160px" }}>{k}</span>
              <span style={{ fontSize:14,fontWeight:600,color:"var(--navy)",textAlign:"right",fontFamily:mono?"'Space Mono',monospace":"inherit" }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop:16,background:"var(--g50)",borderRadius:"var(--r-sm)",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <span style={{ fontWeight:700 }}>{t("totalDue")}</span>
            <span style={{ fontSize:28,fontWeight:800,fontFamily:"'Space Mono',monospace" }}>{bill.billAmount}</span>
          </div>
        </div>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        <button onClick={()=>onNav("pay-elec")} className="btn" style={{ background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700,width:"100%",cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("payNow")} · {bill.billAmount}</button>
        <div style={{ display:"flex",gap:12 }}>
          <button onClick={handleDownload} className="btn" style={{ flex:1,background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("dlPdf")}</button>
          <button onClick={() => window.print()} className="btn" style={{ flex:1,background:"var(--g50)",color:"var(--navy)",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>{t("printRec")}</button>ew
        </div>
      </div>
    </div>
  );
};
