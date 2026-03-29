// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA – user-specific data based on registered phone numbers
// Each phone number maps to a specific citizen's data
// ═══════════════════════════════════════════════════════════════════════════

// ─── Registered Users ───────────────────────────────────────────────────
export const MOCK_USERS = {
  "9876543210": {
    name: "Rajesh Kumar Sharma",
    elec: { consumerName:"Rajesh Kumar Sharma", accountNumber:"ELEC-UP-2024-00872", billAmount:"₹1,248.00", dueDate:"15 March 2026", status:"Pending", unit:"142 kWh", period:"Feb 2026", address:"H-47, Sector 12, Lucknow Municipal Area" },
    gas:  { consumerName:"Rajesh Kumar Sharma", bookingId:"HP-GAS-UP-00341", cylinderType:"14.2 kg LPG", lastBooking:"22 March 2026", subsidyStatus:"₹195.00 credited on 24 March 2026", distributorName:"Sheetal Gas Agency", distributorPhone:"0522-XXXXXXX" },
    prop: { ownerName:"Rajesh Kumar Sharma", propertyId:"LMC-2024-H47-S12", propertyType:"Residential", area:"1200 sq ft", taxAmount:"₹8,200.00", dueDate:"31 March 2026", status:"Pending" },
    water:{ consumerName:"Rajesh Kumar Sharma", connId:"JJM-LKO-00219", billAmount:"₹340.00", period:"Feb 2026", units:"22 KL", dueDate:"20 March 2026", status:"Pending" },
  },
  "9123456789": {
    name: "Priya Verma",
    elec: { consumerName:"Priya Verma", accountNumber:"ELEC-UP-2024-01456", billAmount:"₹976.00", dueDate:"18 March 2026", status:"Pending", unit:"108 kWh", period:"Feb 2026", address:"D-12, Gomti Nagar, Lucknow" },
    gas:  { consumerName:"Priya Verma", bookingId:"BG-LKO-00892", cylinderType:"14.2 kg LPG", lastBooking:"10 March 2026", subsidyStatus:"₹195.00 credited on 15 March 2026", distributorName:"Lucknow Gas Service", distributorPhone:"0522-XXXXXXX" },
    prop: { ownerName:"Priya Verma", propertyId:"LMC-2024-D12-GN", propertyType:"Residential", area:"950 sq ft", taxAmount:"₹6,800.00", dueDate:"31 March 2026", status:"Pending" },
    water:{ consumerName:"Priya Verma", connId:"JJM-LKO-00534", billAmount:"₹280.00", period:"Feb 2026", units:"18 KL", dueDate:"20 March 2026", status:"Pending" },
  },
  "8765432109": {
    name: "Amit Singh Yadav",
    elec: { consumerName:"Amit Singh Yadav", accountNumber:"ELEC-UP-2024-02789", billAmount:"₹2,180.00", dueDate:"20 March 2026", status:"Pending", unit:"245 kWh", period:"Feb 2026", address:"54-B, Hazratganj, Lucknow" },
    gas:  { consumerName:"Amit Singh Yadav", bookingId:"IN-LKO-01267", cylinderType:"14.2 kg LPG", lastBooking:"5 March 2026", subsidyStatus:"₹195.00 credited on 12 March 2026", distributorName:"Indane Gas Lucknow", distributorPhone:"0522-XXXXXXX" },
    prop: { ownerName:"Amit Singh Yadav", propertyId:"LMC-2024-54B-HG", propertyType:"Commercial", area:"2400 sq ft", taxAmount:"₹18,500.00", dueDate:"31 March 2026", status:"Pending" },
    water:{ consumerName:"Amit Singh Yadav", connId:"JJM-LKO-00891", billAmount:"₹520.00", period:"Feb 2026", units:"38 KL", dueDate:"20 March 2026", status:"Pending" },
  },
};

// Default data for unrecognized numbers (fallback)
export const MOCK_ELEC = MOCK_USERS["9876543210"].elec;
export const MOCK_GAS  = MOCK_USERS["9876543210"].gas;
export const MOCK_PROP = MOCK_USERS["9876543210"].prop;
export const MOCK_WATER= MOCK_USERS["9876543210"].water;

// OTP codes per number (for mock verification)
export const MOCK_OTP_CODES = {
  "9876543210": "123456",
  "9123456789": "654321",
  "8765432109": "111222",
};

export const MOCK_ADMIN_STATS = { sessions:1842, transactions:3291, complaints:214, revenue:"₹42.6L" };
export const MOCK_LOGS = [
  { time:"10:32 AM", kiosk:"KIOSK-LKO-07", event:"Bill Payment Success", user:"98XX XXXX 34" },
  { time:"10:28 AM", kiosk:"KIOSK-LKO-03", event:"OTP Login",            user:"77XX XXXX 91" },
  { time:"10:21 AM", kiosk:"KIOSK-LKO-12", event:"Complaint Filed",      user:"96XX XXXX 58" },
  { time:"10:14 AM", kiosk:"KIOSK-LKO-07", event:"Session Timeout",      user:"81XX XXXX 44" },
  { time:"10:09 AM", kiosk:"KIOSK-LKO-01", event:"Bill Payment Success", user:"70XX XXXX 19" },
];
export const VACC_SLOTS = [
  { id:"v1", name:"COVID-19 Booster", dose:"3rd", centre:"PHC Sector-12", date:"18 Mar 2026", slot:"10:30 AM" },
  { id:"v2", name:"Influenza",        dose:"Annual", centre:"CHC Aliganj",  date:"19 Mar 2026", slot:"11:00 AM" },
  { id:"v3", name:"Hepatitis B",      dose:"2nd",    centre:"DH Lucknow",   date:"20 Mar 2026", slot:"9:00 AM"  },
];
