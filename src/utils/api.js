// ═══════════════════════════════════════════════════════════════════════════
// API SERVICE (mock – swap for axios + JWT in production)
// ═══════════════════════════════════════════════════════════════════════════
import { MOCK_ELEC, MOCK_GAS, MOCK_PROP, MOCK_WATER } from '../config/mockData';

const api = {
  currentUserData: null,
  login:        ()  => new Promise(r => setTimeout(() => r({ success:true, token:"eyJhbGci.mock", user:{ name:"Rajesh Kumar Sharma" } }), 1500)),
  getBill:      ()  => new Promise(r => setTimeout(() => r(api.currentUserData?.elec || MOCK_ELEC), 700)),
  getGas:       ()  => new Promise(r => setTimeout(() => r(api.currentUserData?.gas || MOCK_GAS),  700)),
  getPropTax:   ()  => new Promise(r => setTimeout(() => r(api.currentUserData?.prop || MOCK_PROP), 700)),
  getWater:     ()  => new Promise(r => setTimeout(() => r(api.currentUserData?.water || MOCK_WATER),700)),
  pay:          (a) => new Promise(r => setTimeout(() => r({ success:true, txnId:`TXN-2026-${~~(Math.random()*9000)+1000}`, datetime:new Date().toLocaleString("en-IN"), amount:a }), 2000)),
  complaint:    ()  => new Promise(r => setTimeout(() => r({ success:true, ticketId:`CMP-2026-${~~(Math.random()*900)+100}` }), 1200)),
  bookCylinder: ()  => new Promise(r => setTimeout(() => r({ success:true, ref:`BOOK-HP-2026-${~~(Math.random()*9000)+1000}`, est:"5–7 business days" }), 1400)),
  bookVacc:     (s) => new Promise(r => setTimeout(() => r({ success:true, apptId:`VAC-2026-${~~(Math.random()*9000)+1000}`, date:s.date, slot:s.slot }), 1200)),
  applyCard:    ()  => new Promise(r => setTimeout(() => r({ success:true, appId:`AYUSH-2026-${~~(Math.random()*90000)+10000}` }), 1300)),
};

export default api;
