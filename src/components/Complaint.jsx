/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Spinner, BBtn } from './ui/Atoms';
import api from '../utils/api';
import { sanitizeInput } from '../utils/security';

const Complaint = ({ onBack, t }) => {
  const [form,setForm]   = useState({ dept:"",type:"",desc:"",file:null });
  const [loading,setLoading] = useState(false);
  const [ticketId,setTicketId] = useState(null);

  const depts = ["Electricity","Water Supply","Sanitation","Roads & Transport","Municipal","Public Health","Gas"];
  const types = {
    Electricity:["No Power Supply","Voltage Fluctuation","Meter Issues","Billing Error","Transformer Fault"],
    "Water Supply":["No Water","Leakage","Water Quality Issue","Connection Problem","Meter Fault"],
    Gas:["Gas Leakage","No Supply","Meter Issue","Billing Error","New Connection Delay"],
    default:["Service Delay","Staff Misconduct","Infrastructure Damage","Billing Error","Other"],
  };
  const typeList = types[form.dept]||types.default;

  const submit = async () => {
    if(!form.dept||!form.type||!form.desc) return;
    setLoading(true);
    const r = await api.complaint();
    setTicketId(r.ticketId); setLoading(false);
  };

  useEffect(() => {
    const handleVoice = (e) => {
      const cmd = e.detail;
      if ((cmd.action === 'submit' || cmd.action === 'file') && form.dept && form.type && form.desc && !loading && !ticketId) submit();
      if (cmd.action === 'back') {
         if (ticketId) setTicketId(null);
         else onBack();
      }
    };
    window.addEventListener('voice-action', handleVoice);
    return () => window.removeEventListener('voice-action', handleVoice);
  }, [onBack, form, loading, ticketId]);

  if(ticketId) return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:500,margin:"0 auto",textAlign:"center" }}>
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40 }}>
        <div style={{ fontSize:56,marginBottom:16 }}>📋</div>
        <h2 style={{ fontSize:22,fontWeight:800,color:"var(--navy)",marginBottom:8 }}>{t("compDone")}</h2>
        <p style={{ fontSize:14,color:"var(--g400)",marginBottom:24 }}>{t("compDoneMsg")}</p>
        <div style={{ background:"var(--g50)",borderRadius:"var(--r-sm)",padding:20,marginBottom:24 }}>
          <div style={{ fontSize:12,color:"var(--g400)",marginBottom:6 }}>{t("ticketId")}</div>
          <div style={{ fontSize:24,fontWeight:800,fontFamily:"'Space Mono',monospace",color:"var(--navy)" }}>{ticketId}</div>
          <div style={{ fontSize:12,color:"var(--g400)",marginTop:8 }}>{t("resolution")}</div>
        </div>
        <button onClick={()=>setTicketId(null)} className="btn" style={{ width:"100%",background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:"none" }}>{t("fileAnother")}</button>
      </div>
    </div>
  );

  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:640,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("compTitle")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:28 }}>{t("compSubtitle")}</p>
      <div style={{ background:"var(--card-bg, #fff)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",padding:28,display:"flex",flexDirection:"column",gap:20 }}>
        <div>
          <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5,display:"block",marginBottom:8 }}>{t("deptLbl")}</label>
          <select value={form.dept} onChange={e=>setForm({...form,dept:e.target.value,type:""})} style={{ width:"100%",padding:"13px 16px",borderRadius:"var(--r-sm)",border:"1.5px solid var(--g200)",fontSize:14,color:"var(--navy)",background:"var(--input-bg, #fff)",minHeight:50 }}>
            <option value="">{t("selDept")}</option>
            {depts.map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5,display:"block",marginBottom:8 }}>{t("compTypeLbl")}</label>
          <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} disabled={!form.dept} style={{ width:"100%",padding:"13px 16px",borderRadius:"var(--r-sm)",border:"1.5px solid var(--g200)",fontSize:14,color:"var(--navy)",background:!form.dept?"var(--g50)":"var(--input-bg, #fff)",minHeight:50 }}>
            <option value="">{t("selType")}</option>
            {typeList.map(tp=><option key={tp} value={tp}>{tp}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5,display:"block",marginBottom:8 }}>{t("descLbl")}</label>
          <textarea value={form.desc} onChange={e=>setForm({...form,desc:sanitizeInput(e.target.value)})} placeholder={t("descPh")} rows={4} style={{ width:"100%",padding:"13px 16px",borderRadius:"var(--r-sm)",border:"1.5px solid var(--g200)",fontSize:14,color:"var(--navy)",resize:"vertical",minHeight:100,background:"var(--input-bg, #fff)",fontFamily:"inherit" }}/>
        </div>
        <div>
          <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5,display:"block",marginBottom:8 }}>{t("attachLbl")}</label>
          <label style={{ display:"flex",alignItems:"center",gap:12,border:"2px dashed var(--g200)",borderRadius:"var(--r-sm)",padding:18,cursor:"pointer",background:"var(--g50)" }}>
            <span style={{ fontSize:24 }}>📎</span>
            <div>
              <div style={{ fontSize:14,fontWeight:600,color:"var(--navy)" }}>{form.file?form.file.name:t("uploadPh")}</div>
              <div style={{ fontSize:11,color:"var(--g400)" }}>{t("uploadHint")}</div>
            </div>
            <input type="file" style={{ display:"none" }} onChange={e=>setForm({...form,file:e.target.files[0]})}/>
          </label>
        </div>
        <button onClick={submit} disabled={loading||!form.dept||!form.type||!form.desc} className="btn" style={{ background:(!form.dept||!form.type||!form.desc)?"var(--g200)":"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700,cursor:form.dept&&form.type&&form.desc?"pointer":"default",fontFamily:"inherit",border:"none" }}>
          {loading?<Spinner/>:t("submitComp")}
        </button>
      </div>
    </div>
  );
};

export default Complaint;
