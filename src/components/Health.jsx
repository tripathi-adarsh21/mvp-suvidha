import { useState, useEffect } from 'react';
import { Spinner, BBtn, ActionRow } from './ui/Atoms';
import api from '../utils/api';
import { downloadReceipt } from '../utils/receipt';
import { VACC_SLOTS } from '../config/mockData';

export const Health = ({ onNav, onBack, t }) => {
  const items = [
    { id:"health-vacc",   icon:"💉", label:t("hVacc"),    desc:t("hVaccDesc") },
    { id:"health-card",   icon:"🏥", label:t("hCard"),    desc:t("hCardDesc") },
    { id:"health-lab",    icon:"🔬", label:t("hLab"),     desc:t("hLabDesc") },
    { id:"health-amb",    icon:"🚑", label:t("hAmb"),     desc:t("hAmbDesc") },
    { id:"health-mental", icon:"🧠", label:t("hMental"),  desc:t("hMentalDesc") },
    { id:"health-med",    icon:"💊", label:t("hMed"),     desc:t("hMedDesc") },
  ];
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:700,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:28 }}>
        <div style={{ width:52,height:52,borderRadius:"var(--r-sm)",background:"#F3E5F5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:"1.5px solid #CE93D8" }}>🏥</div>
        <div><h2 style={{ fontSize:22,fontWeight:700 }}>{t("sHealth")}</h2><p style={{ fontSize:13,color:"var(--g400)" }}>National Health Mission · Ministry of Health & FW</p></div>
      </div>
      <ActionRow items={items} onNav={onNav}/>
    </div>
  );
};

export const Vaccination = ({ onBack, t }) => {
  const [selected,setSelected] = useState(null);
  const [loading,setLoading]   = useState(false);
  const [done,setDone]         = useState(null);

  const book = async () => {
    if(!selected) return;
    setLoading(true);
    const r = await api.bookVacc(selected);
    setDone(r); setLoading(false);
  };

  const handleDownload = () => {
    downloadReceipt({
      title: t("vaccBooked"),
      citizenName: "Citizen",
      department: t("sHealth"),
      service: t("hVacc"),
      amount: "₹0.00",
      txnId: done.apptId,
      details: {
        [t("vaccName")]: selected.name,
        [t("vaccDose")]: selected.dose,
        [t("vaccCenter")]: selected.centre,
        [t("apptDate")]: done.date,
        [t("apptSlot")]: done.slot
      }
    });
  };

  useEffect(() => {
    const handleVoice = (e) => {
      const cmd = e.detail;
      if ((cmd.action === 'book' || cmd.action === 'submit') && selected && !loading && !done) book();
      if (cmd.action === 'back') onBack();
    };
    window.addEventListener('voice-action', handleVoice);
    return () => window.removeEventListener('voice-action', handleVoice);
  }, [onBack, selected, loading, done]);

  if(done) return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:500,margin:"0 auto",textAlign:"center" }}>
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40 }}>
        <div style={{ fontSize:56,marginBottom:16 }}>💉</div>
        <h2 style={{ fontSize:22,fontWeight:800,color:"var(--green)",marginBottom:8 }}>{t("vaccBooked")}</h2>
        <p style={{ fontSize:14,color:"var(--g400)",marginBottom:24 }}>{t("vaccMsg")}</p>
        <div style={{ background:"var(--g50)",borderRadius:"var(--r-sm)",padding:20,marginBottom:24,textAlign:"left" }}>
          {[[t("apptId"),done.apptId,true],[t("vaccName"),selected.name,false],[t("vaccDose"),selected.dose,false],[t("vaccCenter"),selected.centre,false],[t("apptDate"),done.date,false],[t("apptSlot"),done.slot,false]].map(([k,v,mono])=>(
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
        <button onClick={()=>onBack()} className="btn" style={{ width:"100%",background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("back")}</button>
      </div>
    </div>
  );

  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:660,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("hVacc")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>{t("vaccSlot")}</p>
      <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:24 }}>
        {VACC_SLOTS.map(s=>(
          <button key={s.id} onClick={()=>setSelected(s)} style={{ background:selected?.id===s.id?"var(--navy)":"var(--card-bg, #fff)",color:selected?.id===s.id?"#fff":"var(--navy)",border:`2px solid ${selected?.id===s.id?"var(--navy)":"var(--g100)"}`,borderRadius:"var(--r-md)",padding:"18px 22px",textAlign:"left",boxShadow:"var(--sh-sm)",minHeight:80,cursor:"pointer",fontFamily:"inherit" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
              <div>
                <div style={{ fontWeight:700,fontSize:16,marginBottom:4 }}>{s.name}</div>
                <div style={{ fontSize:13,opacity:.75 }}>{s.dose} Dose · {s.centre}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontWeight:700,fontSize:14 }}>{s.date}</div>
                <div style={{ fontSize:13,opacity:.75 }}>{s.slot}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <button onClick={book} disabled={loading||!selected} className="btn" style={{ width:"100%",background:!selected?"var(--g200)":"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"18px",fontSize:17,fontWeight:700,cursor:selected?"pointer":"default",fontFamily:"inherit",border:"none" }}>
        {loading?<Spinner/>:t("bookSlot")}
      </button>
    </div>
  );
};

export const AyushmanCard = ({ onBack, t }) => {
  const [form,setForm] = useState({ name:"",aadhaar:"",income:"",file:null });
  const [loading,setLoading] = useState(false);
  const [done,setDone] = useState(null);

  const submit = async () => {
    if(!form.name||!form.aadhaar) return;
    setLoading(true);
    const r = await api.applyCard();
    setDone(r); setLoading(false);
  };

  const handleDownload = () => {
    downloadReceipt({
      title: t("cardSuccess"),
      citizenName: form.name,
      department: t("sHealth"),
      service: t("hCard"),
      amount: "₹0.00",
      txnId: done.appId,
      details: {
        "Aadhaar": form.aadhaar,
        "Income": form.income,
        "Status": "Under Review"
      }
    });
  };

  useEffect(() => {
    const handleVoice = (e) => {
      const cmd = e.detail;
      if (cmd.action === 'submit' && form.name && form.aadhaar && !loading && !done) submit();
      if (cmd.action === 'back') {
         if (done) setDone(null);
         else onBack();
      }
    };
    window.addEventListener('voice-action', handleVoice);
    return () => window.removeEventListener('voice-action', handleVoice);
  }, [onBack, form, loading, done]);

  if(done) return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:500,margin:"0 auto",textAlign:"center" }}>
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40 }}>
        <div style={{ fontSize:56,marginBottom:16 }}>🏥</div>
        <h2 style={{ fontSize:22,fontWeight:800,color:"var(--green)",marginBottom:8 }}>{t("cardSuccess")}</h2>
        <p style={{ fontSize:14,color:"var(--g400)",marginBottom:24 }}>{t("cardMsg")}</p>
        <div style={{ background:"var(--g50)",borderRadius:"var(--r-sm)",padding:20,marginBottom:24 }}>
          <div style={{ fontSize:12,color:"var(--g400)",marginBottom:6 }}>{t("appRefId")}</div>
          <div style={{ fontSize:22,fontWeight:800,fontFamily:"'Space Mono',monospace",color:"var(--navy)" }}>{done.appId}</div>
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
    <div className="fi" style={{ padding:"24px 20px",maxWidth:600,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("cardApply")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>{t("cardApplyDesc")}</p>
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",padding:28,display:"flex",flexDirection:"column",gap:18 }}>
        {[["Full Name","name","text","Enter full name as in Aadhaar"],["Aadhaar Number","aadhaar","tel","12-digit Aadhaar number"],["Annual Income","income","text","Annual household income"]].map(([lbl,key,type,ph])=>(
          <div key={key}>
            <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5,display:"block",marginBottom:6 }}>{lbl.toUpperCase()} *</label>
            <input type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={ph} maxLength={key==="aadhaar"?12:100} style={{ width:"100%",padding:"13px 16px",borderRadius:"var(--r-sm)",border:"1.5px solid var(--g200)",fontSize:14,color:"var(--navy)",outline:"none",minHeight:50,fontFamily:key==="aadhaar"?"'Space Mono',monospace":"inherit",letterSpacing:key==="aadhaar"?3:0,background:"var(--input-bg, #fff)" }}/>
          </div>
        ))}
        <div>
          <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5,display:"block",marginBottom:6 }}>UPLOAD DOCUMENTS *</label>
          <label style={{ display:"flex",alignItems:"center",gap:12,border:"2px dashed var(--g200)",borderRadius:"var(--r-sm)",padding:18,cursor:"pointer",background:"var(--g50)" }}>
            <span style={{ fontSize:24 }}>📎</span>
            <div>
              <div style={{ fontSize:14,fontWeight:600,color:"var(--navy)" }}>{form.file?form.file.name:"Aadhaar + Income Certificate"}</div>
              <div style={{ fontSize:11,color:"var(--g400)" }}>PDF, JPG up to 5MB each</div>
            </div>
            <input type="file" style={{ display:"none" }} onChange={e=>setForm({...form,file:e.target.files[0]})}/>
          </label>
        </div>
        <button onClick={submit} disabled={loading||!form.name||!form.aadhaar} className="btn" style={{ background:(!form.name||!form.aadhaar)?"var(--g200)":"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700,cursor:form.name&&form.aadhaar?"pointer":"default",fontFamily:"inherit",border:"none" }}>
          {loading?<Spinner/>:t("applyNow")}
        </button>
      </div>
    </div>
  );
};

export const MentalHealth = ({ onBack, t }) => (
  <div className="fi" style={{ padding:"24px 20px",maxWidth:640,margin:"0 auto" }}>
    <BBtn onBack={onBack} t={t}/>
    <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("hMental")}</h2>
    <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>National Mental Health Programme · Ministry of Health</p>
    <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
      {[
        { icon:"📞", title:"iCall Helpline", number:"9152987821", desc:"Mon–Sat 8AM–10PM · Free counselling" },
        { icon:"💬", title:"Vandrevala Foundation", number:"1860-2662-345", desc:"24/7 Mental health support" },
        { icon:"🏥", title:"NIMHANS Helpline", number:"080-46110007", desc:"National Institute of Mental Health" },
        { icon:"👶", title:"iCall for Youth", number:"9152987821", desc:"Dedicated youth mental wellness" },
      ].map(c=>(
        <div key={c.title} style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-md)",boxShadow:"var(--sh-sm)",padding:"20px 24px",display:"flex",alignItems:"center",gap:16,borderLeft:"4px solid #6A1B9A" }}>
          <span style={{ fontSize:28 }}>{c.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700,fontSize:15,color:"var(--navy)" }}>{c.title}</div>
            <div style={{ fontSize:13,color:"var(--g400)",marginTop:2 }}>{c.desc}</div>
          </div>
          <div style={{ fontFamily:"'Space Mono',monospace",fontSize:16,fontWeight:800,color:"#6A1B9A" }}>{c.number}</div>
        </div>
      ))}
    </div>
  </div>
);

export const MedStoreLocator = ({ onBack, t }) => {
  const stores = [
    { name:"Jan Aushadhi Kendra – Sector 12", dist:"0.3 km", open:"8AM–9PM", phone:"0522-XXXXXX" },
    { name:"Jan Aushadhi Kendra – Gomti Nagar", dist:"1.2 km", open:"7AM–10PM", phone:"0522-XXXXXX" },
    { name:"Jan Aushadhi Kendra – Hazratganj", dist:"2.4 km", open:"8AM–8PM", phone:"0522-XXXXXX" },
  ];
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:640,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("hMed")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>Pradhan Mantri Bhartiya Janaushadhi Pariyojana · Nearby Stores</p>
      <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
        {stores.map(s=>(
          <div key={s.name} style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-md)",boxShadow:"var(--sh-sm)",padding:"20px 24px",borderLeft:"4px solid var(--teal)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
              <div style={{ fontWeight:700,fontSize:15,color:"var(--navy)" }}>💊 {s.name}</div>
              <span style={{ background:"var(--teal-lt)",color:"var(--teal)",padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600 }}>{s.dist}</span>
            </div>
            <div style={{ display:"flex",gap:20,fontSize:13,color:"var(--g600)" }}>
              <span>🕐 {s.open}</span><span>📞 {s.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AmbulanceScreen = ({ onBack, t }) => (
  <div className="fi" style={{ padding:"24px 20px",maxWidth:580,margin:"0 auto" }}>
    <BBtn onBack={onBack} t={t}/>
    <div style={{ background:"var(--red)",borderRadius:"var(--r-md)",padding:"20px 24px",color:"#fff",marginBottom:24 }}>
      <h2 style={{ fontSize:22,fontWeight:800,marginBottom:4 }}>🚑 {t("hAmb")}</h2>
      <p style={{ fontSize:13,opacity:.85 }}>EMRI 108 – Free emergency ambulance service for all</p>
    </div>
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
      {[["108","Free Ambulance (EMRI)","#C62828"],["102","Janani Shishu Raksha (Maternal)","#AD1457"],["1099","Road Accident","#E65100"],["112","National Emergency","#1565C0"]].map(([num,desc,color])=>(
        <div key={num} style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-md)",boxShadow:"var(--sh-sm)",padding:20,borderLeft:`4px solid ${color}` }}>
          <div style={{ fontFamily:"'Space Mono',monospace",fontSize:28,fontWeight:800,color,marginBottom:6 }}>{num}</div>
          <div style={{ fontSize:13,color:"var(--g600)" }}>{desc}</div>
        </div>
      ))}
    </div>
    <div style={{ marginTop:20,background:"var(--red-lt)",borderRadius:"var(--r-sm)",padding:"14px 20px",fontSize:13,color:"var(--red)" }}>
      ⚠️ All 108 calls are <strong>free of charge</strong>. Available 24/7. Do not misuse emergency services.
    </div>
  </div>
);

export const LabTest = ({ onBack, t }) => {
  const labs = [
    { dept:"Pathology",    tests:["CBC","Blood Sugar","Lipid Profile","LFT","KFT"],wait:"24 hours" },
    { dept:"Radiology",    tests:["X-Ray","Ultrasound","ECG","Echocardiography"],wait:"Same day" },
    { dept:"Microbiology", tests:["Urine Routine","Sputum Culture","Widal Test"],wait:"48–72 hours" },
  ];
  const [sel,setSel] = useState(null);
  const [done,setDone] = useState(false);
  const [loading,setLoading] = useState(false);
  const [refId] = useState(`LAB-2025-${~~(Math.random()*9000)+1000}`);

  const book = () => { if(!sel) return; setLoading(true); setTimeout(()=>{ setLoading(false); setDone(true); },1200); };

  const handleDownload = () => {
    downloadReceipt({
      title: "LAB TEST BOOKED",
      citizenName: "Citizen",
      department: t("sHealth"),
      service: t("hLab"),
      amount: "₹0.00",
      txnId: refId,
      details: {
        "Lab Department": sel.dept,
        "Tests": sel.tests.join(", "),
        "Report Expected": sel.wait
      }
    });
  };

  useEffect(() => {
    const handleVoice = (e) => {
      const cmd = e.detail;
      if ((cmd.action === 'book' || cmd.action === 'submit') && sel && !loading && !done) book();
      if (cmd.action === 'back') {
         if (done) { setSel(null); setDone(false); }
         else onBack();
      }
    };
    window.addEventListener('voice-action', handleVoice);
    return () => window.removeEventListener('voice-action', handleVoice);
  }, [onBack, sel, loading, done]);

  if(done) return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:480,margin:"0 auto",textAlign:"center" }}>
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40 }}>
        <div style={{ fontSize:56,marginBottom:16 }}>🔬</div>
        <h2 style={{ fontSize:22,fontWeight:800,color:"var(--green)",marginBottom:8 }}>Lab Test Booked!</h2>
        <p style={{ fontSize:14,color:"var(--g400)",marginBottom:24 }}>Visit the lab counter with this slip. Report with Aadhaar card.</p>
        <div style={{ background:"var(--g50)",borderRadius:"var(--r-sm)",padding:20,marginBottom:24 }}>
          <div style={{ fontSize:12,color:"var(--g400)",marginBottom:6 }}>BOOKING REFERENCE</div>
          <div style={{ fontSize:22,fontWeight:800,fontFamily:"'Space Mono',monospace",color:"var(--navy)" }}>{refId}</div>
          <div style={{ fontSize:12,color:"var(--g400)",marginTop:8 }}>Report available in: {sel?.wait}</div>
        </div>
        <div style={{ display:"flex",gap:12,marginBottom:12 }}>
          <button onClick={handleDownload} className="btn" style={{ flex:1,background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("dlPdf")}</button>
          <button onClick={() => window.print()} className="btn" style={{ flex:1,background:"var(--g50)",color:"var(--navy)",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:700,cursor:"pointer" }}>{t("printRec")}</button>
        </div>
        <button onClick={()=>{ setSel(null); setDone(false); }} className="btn" style={{ width:"100%",background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("back")}</button>
      </div>
    </div>
  );

  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:660,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("hLab")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>Government Hospital Diagnostic Services – Free / subsidised</p>
      <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:24 }}>
        {labs.map(l=>(
          <button key={l.dept} onClick={()=>setSel(l)} style={{ background:sel?.dept===l.dept?"var(--navy)":"var(--card-bg, #fff)",color:sel?.dept===l.dept?"#fff":"var(--navy)",border:`2px solid ${sel?.dept===l.dept?"var(--navy)":"var(--g100)"}`,borderRadius:"var(--r-md)",padding:"18px 22px",textAlign:"left",boxShadow:"var(--sh-sm)",minHeight:80,cursor:"pointer",fontFamily:"inherit" }}>
            <div style={{ fontWeight:700,fontSize:15,marginBottom:6 }}>🔬 {l.dept}</div>
            <div style={{ fontSize:13,opacity:.75 }}>{l.tests.join(" · ")}</div>
            <div style={{ fontSize:12,marginTop:6,opacity:.65 }}>Report: {l.wait}</div>
          </button>
        ))}
      </div>
      <button onClick={book} disabled={loading||!sel} className="btn" style={{ width:"100%",background:!sel?"var(--g200)":"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"18px",fontSize:17,fontWeight:700,cursor:sel?"pointer":"default",fontFamily:"inherit",border:"none" }}>
        {loading?<Spinner/>:"Book Lab Test →"}
      </button>
    </div>
  );
};
