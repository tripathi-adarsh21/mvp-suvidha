/* eslint-disable react-hooks/exhaustive-deps */
  import { useState, useEffect } from 'react';
import { Spinner, BBtn, ActionRow } from './ui/Atoms';
import api from '../utils/api';
import { downloadReceipt } from '../utils/receipt';

export const Gas = ({ onNav, onBack, t }) => {
  const items = [
    { id:"gas-book",    icon:"🛢️", label:t("gBookCyl"),  desc:t("gBookDesc") },
    { id:"gas-pay",     icon:"💳", label:t("gPayBill"),   desc:t("gPayBillDesc") },
    { id:"gas-subsidy", icon:"💰", label:t("gSubsidy"),   desc:t("gSubsidyDesc") },
    { id:"gas-new",     icon:"🔧", label:t("gNewConn"),   desc:t("gNewConnDesc") },
    { id:"complaint",   icon:"📝", label:t("gComp"),      desc:t("gCompDesc") },
  ];
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:700,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:28 }}>
        <div style={{ width:52,height:52,borderRadius:"var(--r-sm)",background:"#FFF8E1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:"1.5px solid #FFE082" }}>🔥</div>
        <div><h2 style={{ fontSize:22,fontWeight:700 }}>{t("sGas")}</h2><p style={{ fontSize:13,color:"var(--g400)" }}>HP Gas / Bharat Gas / Indane · Ministry of P&NG</p></div>
      </div>
      <ActionRow items={items} onNav={onNav}/>
    </div>
  );
};

export const GasBook = ({ onNav, onBack, t }) => {
  const [loading,setLoading] = useState(true);
  const [gas,setGas]         = useState(null);
  const [booking,setBooking] = useState(false);
  const [done,setDone]       = useState(null);
  useEffect(()=>{ api.getGas().then(g=>{ setGas(g); setLoading(false); }); },[]);

  const book = async () => { setBooking(true); const r = await api.bookCylinder(); setDone(r); setBooking(false); };

  const handleDownload = () => {
    downloadReceipt({
      title: t("bookSuccess"),
      citizenName: gas.consumerName,
      department: t("sGas"),
      service: t("gBookCyl"),
      amount: "₹" + (gas.subsidyAmount ? (850 - parseInt(gas.subsidyAmount)).toString() : "850"),
      txnId: done.ref,
      details: {
        [t("gCylType")]: gas.cylinderType,
        [t("gDist")]: gas.distributorName,
        [t("deliveryEst")]: done.est
      }
    });
  };

  useEffect(() => {
    const handleVoice = (e) => {
      const cmd = e.detail;
      if ((cmd.action === 'book' || cmd.action === 'submit') && !booking && !done) book();
      if (cmd.action === 'back') {
         if (done) setDone(null);
         else onBack();
      }
    };
    window.addEventListener('voice-action', handleVoice);
    return () => window.removeEventListener('voice-action', handleVoice);
  }, [onBack, booking, done]);

  if(loading) return <div style={{ padding:40,textAlign:"center" }}><Spinner/></div>;

  if(done) return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:520,margin:"0 auto" }}>
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40,textAlign:"center" }}>
        <div style={{ fontSize:56,marginBottom:16 }}>🛢️</div>
        <h2 style={{ fontSize:22,fontWeight:800,color:"var(--green)",marginBottom:8 }}>{t("bookSuccess")}</h2>
        <p style={{ fontSize:14,color:"var(--g400)",marginBottom:24 }}>{t("bookSuccessMsg")}</p>
        <div style={{ background:"var(--g50)",borderRadius:"var(--r-sm)",padding:20,marginBottom:24,textAlign:"left" }}>
          {[[t("bookRef"),done.ref,true],[t("gCylType"),gas.cylinderType,false],[t("deliveryEst"),done.est,false],[t("gDist"),gas.distributorName,false]].map(([k,v,mono])=>(
            <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--g100)",fontSize:13 }}>
              <span style={{ color:"var(--g400)" }}>{k}</span>
              <span style={{ fontWeight:600,color:"var(--navy)",fontFamily:mono?"'Space Mono',monospace":"inherit",fontSize:mono?11:13 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",gap:12,marginBottom:12 }}>
          <button onClick={handleDownload} className="btn" style={{ flex:1,background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("dlPdf")}</button>
          <button onClick={() => window.print()} className="btn" style={{ flex:1,background:"var(--g50)",color:"var(--navy)",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer" }}>{t("printRec")}</button>
        </div>
        <button onClick={()=>setDone(null)} className="btn" style={{ width:"100%",background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("back")}</button>
      </div>
    </div>
  );

  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:620,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:24 }}>{t("gBookCyl")}</h2>
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",overflow:"hidden",marginBottom:20 }}>
        <div style={{ background:"var(--navy)",padding:"20px 24px",color:"#fff" }}>
          <div style={{ fontSize:11,color:"rgba(255,255,255,.6)",letterSpacing:1 }}>CONSUMER DETAILS</div>
          <div style={{ fontSize:18,fontWeight:700,marginTop:4 }}>{gas.consumerName}</div>
        </div>
        <div style={{ padding:24 }}>
          {[[t("gBookingId"),gas.bookingId,true],[t("gCylType"),gas.cylinderType,false],[t("gLastBook"),gas.lastBooking,false],[t("gDist"),gas.distributorName,false],[t("gSubAmt"),gas.subsidyStatus,false]].map(([k,v,mono])=>(
            <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--g100)" }}>
              <span style={{ fontSize:13,color:"var(--g400)",flex:"0 0 160px" }}>{k}</span>
              <span style={{ fontSize:13,fontWeight:600,color:"var(--navy)",textAlign:"right",fontFamily:mono?"'Space Mono',monospace":"inherit" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={book} disabled={booking} className="btn" style={{ width:"100%",background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"18px",fontSize:17,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>
        {booking?<Spinner/>:t("bookNow")}
      </button>
    </div>
  );
};

export const GasSubsidy = ({ onBack, t }) => {
  const [loading,setLoading] = useState(true);
  const [gas,setGas]         = useState(null);
  useEffect(()=>{ api.getGas().then(g=>{ setGas(g); setLoading(false); }); },[]);
  if(loading) return <div style={{ padding:40,textAlign:"center" }}><Spinner/></div>;
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:580,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("gSubsidy")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>DBT (Direct Benefit Transfer) Status</p>
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",padding:24 }}>
        <div style={{ background:"var(--green-lt)",borderRadius:"var(--r-sm)",padding:"16px 20px",marginBottom:20,display:"flex",gap:12,alignItems:"center" }}>
          <span style={{ fontSize:28 }}>✅</span>
          <div>
            <div style={{ fontWeight:700,color:"var(--green)",fontSize:15 }}>Subsidy Active</div>
            <div style={{ fontSize:13,color:"var(--g600)",marginTop:2 }}>{gas.subsidyStatus}</div>
          </div>
        </div>
        {[["Consumer Name",gas.consumerName,false],["Booking ID",gas.bookingId,true],["Distributor",gas.distributorName,false],["Contact",gas.distributorPhone,false]].map(([k,v,mono])=>(
          <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--g100)",fontSize:13 }}>
            <span style={{ color:"var(--g400)",flex:"0 0 140px" }}>{k}</span>
            <span style={{ fontWeight:600,color:"var(--navy)",fontFamily:mono?"'Space Mono',monospace":"inherit",fontSize:mono?11:13 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
