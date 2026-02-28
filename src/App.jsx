
// ═══════════════════════════════════════════════════════════════════════════
// SUVIDHA – Unified Touch-Based Civic Services KIOSK Platform  v2.0
// Government Smart City Hackathon Prototype
// NEW in v2: Hindi + Assamese + Bengali live translation, Gas/Municipal/
//            Health full features, updated language list
// WCAG 2.1 | JWT simulation | OAuth2-ready | Touch-optimised
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from "react";

// ───────────────────────────────────────────────────────────────────────────
// 1.  TRANSLATIONS  (i18n – mirrors react-i18next namespace pattern)
//     Add any new key in the "en" block first, then copy to hi / as / bn
// ───────────────────────────────────────────────────────────────────────────
const T = {
  en: {
    appName:"SUVIDHA KIOSK", appSub:"SMART CITY PLATFORM · GOI INITIATIVE",
    selectLang:"Select Language", voiceAssist:"Voice Assistance",
    voiceDesc:"Screen reader & audio guidance", startBtn:"Start →",
    secured:"🔒 Secured by NIC · STQC Certified",
    secureLogin:"Secure Login", mobilePrompt:"Enter your registered mobile number",
    mobileLbl:"MOBILE NUMBER", sendOtp:"Send OTP →", verifyOtp:"Verify & Login →",
    otpLbl:"ONE-TIME PASSWORD", otpSent:"OTP sent to +91 ", changeNum:"← Change number",
    badMobile:"Please enter a valid 10-digit mobile number.",
    badOtp:"Invalid OTP. Please try again.",
    secNote:"Security Notice:", secMsg:"Session expires after 3 min of inactivity. Never share OTP.",
    welcomeBack:"WELCOME BACK", sessionExp:"SESSION EXPIRES IN",
    available:"Available Services",
    sElec:"Electricity Services", dElec:"Bills, Payments, Complaints",
    sGas:"Gas Services",          dGas:"Cylinder Booking, Subsidy",
    sMun:"Municipal Services",    dMun:"Property Tax, Water Bill",
    sHealth:"Public Health",      dHealth:"Vaccination, Ayushman Card",
    sEmerg:"Emergency Alerts",    dEmerg:"Fire, Police, Ambulance",
    sAdmin:"Admin Portal",        dAdmin:"System Management",
    back:"← Back", payNow:"💳 Pay Now", dlPdf:"⬇️ Download PDF",
    printRec:"🖨️ Print Receipt", logout:"Logout",
    timeoutTitle:"Session Expiring", timeoutMsg:"Your session will expire. Continue?",
    continueSess:"Continue Session",
    // Electricity
    viewBill:"View Bill", payBill:"Pay Bill", regComp:"Register Complaint", newConn:"New Connection",
    billPeriod:"Billing Period:", elecBillTitle:"ELECTRICITY BILL",
    accNum:"Account Number", svcAddr:"Service Address", units:"Units Consumed",
    billAmt:"Bill Amount", dueDate:"Due Date", totalDue:"Total Amount Due",
    // Payment
    pgTitle:"Payment Gateway", pgSubtitle:"Select payment method to proceed",
    amtToPay:"Amount to Pay", paySecure:"Pay Securely →",
    paySuccess:"Payment Successful!", billPaid:"Payment confirmed and recorded.",
    txnId:"Transaction ID", amtPaid:"Amount Paid", payMode:"Payment Mode",
    dtTime:"Date & Time", txnStatus:"Status", retDash:"← Return to Dashboard",
    // Complaint
    compTitle:"Register Complaint", compSubtitle:"All complaints resolved within SLA timelines",
    deptLbl:"DEPARTMENT *", selDept:"Select Department",
    compTypeLbl:"COMPLAINT TYPE *", selType:"Select Type",
    descLbl:"DESCRIPTION *", descPh:"Describe your complaint in detail...",
    attachLbl:"ATTACH EVIDENCE (optional)", uploadPh:"Click to upload photo/document",
    uploadHint:"JPG, PNG, PDF up to 5MB", submitComp:"Submit Complaint →",
    compDone:"Complaint Registered!", compDoneMsg:"Submitted and assigned to the relevant department.",
    ticketId:"TICKET ID", resolution:"Estimated resolution: 3–5 business days",
    fileAnother:"← File Another Complaint",
    // Gas
    gBookCyl:"Book Gas Cylinder", gBookDesc:"LPG 14.2kg refill online",
    gNewConn:"New Gas Connection",  gNewConnDesc:"Apply for domestic connection",
    gSubsidy:"Subsidy Status",      gSubsidyDesc:"Check DBT transfer status",
    gComp:"Gas Complaint",          gCompDesc:"Report leakage or service issue",
    gPayBill:"Pay Gas Bill",        gPayBillDesc:"Clear outstanding dues",
    gBookingId:"Booking Reference", gCylType:"Cylinder Type",
    gLastBook:"Last Booking", gDist:"Distributor", gSubAmt:"Subsidy Received",
    bookNow:"Book Now →", bookSuccess:"Cylinder Booked!", bookSuccessMsg:"Your LPG cylinder has been booked successfully.",
    deliveryEst:"Estimated Delivery", bookRef:"Booking Reference",
    // Municipal
    mPropTax:"Property Tax",        mPropDesc:"View & pay property tax",
    mWater:"Water Bill",            mWaterDesc:"Pay water charges",
    mTrade:"Trade License",         mTradeDesc:"Apply or renew license",
    mBuild:"Building Plan",         mBuildDesc:"Submit or track approval",
    mBirth:"Birth Certificate",     mBirthDesc:"Apply or download",
    mDeath:"Death Certificate",     mDeathDesc:"Apply or download",
    propId:"Property ID", propType:"Property Type", area:"Area",
    taxAmt:"Tax Amount", connId:"Connection ID", waterUnits:"Units (KL)",
    // Health
    hVacc:"Vaccination",            hVaccDesc:"Book appointment / check status",
    hCard:"Ayushman Card",          hCardDesc:"Apply for health cover",
    hLab:"Lab Test Booking",        hLabDesc:"Book govt. lab diagnostics",
    hAmb:"Ambulance Service",       hAmbDesc:"Request 108 ambulance",
    hMental:"Mental Health",        hMentalDesc:"Helpline & resources",
    hMed:"Medicine Store Locator",  hMedDesc:"Find Jan Aushadhi stores",
    vaccSlot:"Select Vaccine Slot", vaccName:"Vaccine Name", vaccDose:"Dose",
    vaccCenter:"Centre", bookSlot:"Book Slot →",
    vaccBooked:"Appointment Confirmed!", vaccMsg:"Your vaccination appointment is booked.",
    apptId:"Appointment ID", apptDate:"Date", apptSlot:"Slot",
    cardApply:"Apply for Ayushman Card", cardApplyDesc:"Upload Aadhaar & income proof",
    applyNow:"Apply Now →", cardSuccess:"Application Submitted!",
    cardMsg:"Your Ayushman Bharat card application is under review.",
    appRefId:"Application Reference",
    // Emergency
    emergTitle:"Emergency Services",
    emergWarn:"Life-threatening? Dial immediately.",
    // Admin
    adminBadge:"ADMIN ACCESS", adminTitle:"System Dashboard",
    statSessions:"Total Sessions Today", statTxns:"Total Transactions",
    statComps:"Complaints Filed", statRev:"Revenue Processed",
    emergCtrl:"Emergency Announcement Control", curAlert:"Current Active Alert:",
    noneActive:"None", broadcast:"Broadcast", clearAlert:"Clear",
    liveLog:"Live Activity Log", announcePh:"Enter new emergency announcement...",
    noteLabel:"Note:", noteMsg:"All transactions are encrypted and secured by NIC.",
    footerL:"SUVIDHA v2.0 · NIC Certified · ISO 27001 · STQC Tested",
    footerR:"WCAG 2.1 AA · IT Act 2000 · © 2025 Govt. of India",
  },

  hi: {
    appName:"सुविधा किओस्क", appSub:"स्मार्ट सिटी प्लेटफॉर्म · भारत सरकार",
    selectLang:"भाषा चुनें", voiceAssist:"वॉयस सहायता",
    voiceDesc:"स्क्रीन रीडर और ऑडियो गाइडेंस", startBtn:"शुरू करें →",
    secured:"🔒 NIC द्वारा सुरक्षित · STQC प्रमाणित",
    secureLogin:"सुरक्षित लॉगिन", mobilePrompt:"OTP के लिए पंजीकृत मोबाइल नंबर दर्ज करें",
    mobileLbl:"मोबाइल नंबर", sendOtp:"OTP भेजें →", verifyOtp:"सत्यापित करें →",
    otpLbl:"एकमुश्त पासवर्ड", otpSent:"OTP भेजा: +91 ", changeNum:"← नंबर बदलें",
    badMobile:"कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।",
    badOtp:"गलत OTP। पुनः प्रयास करें।",
    secNote:"सुरक्षा नोट:", secMsg:"3 मिनट निष्क्रियता पर सत्र समाप्त। OTP साझा न करें।",
    welcomeBack:"वापसी पर स्वागत", sessionExp:"सत्र समाप्त होगा",
    available:"उपलब्ध सेवाएं",
    sElec:"बिजली सेवाएं",   dElec:"बिल, भुगतान, शिकायत",
    sGas:"गैस सेवाएं",      dGas:"सिलेंडर बुकिंग, सब्सिडी",
    sMun:"नगर पालिका",      dMun:"संपत्ति कर, जल बिल",
    sHealth:"स्वास्थ्य",    dHealth:"टीकाकरण, आयुष्मान कार्ड",
    sEmerg:"आपातकाल",       dEmerg:"अग्नि, पुलिस, एम्बुलेंस",
    sAdmin:"व्यवस्थापक",    dAdmin:"सिस्टम प्रबंधन",
    back:"← वापस", payNow:"💳 अभी भुगतान करें", dlPdf:"⬇️ PDF डाउनलोड",
    printRec:"🖨️ रसीद प्रिंट", logout:"लॉग आउट",
    timeoutTitle:"सत्र समाप्त हो रहा है", timeoutMsg:"निष्क्रियता से सत्र समाप्त होगा। जारी रखें?",
    continueSess:"सत्र जारी रखें",
    viewBill:"बिल देखें", payBill:"बिल भुगतान", regComp:"शिकायत दर्ज करें", newConn:"नया कनेक्शन",
    billPeriod:"बिलिंग अवधि:", elecBillTitle:"बिजली बिल",
    accNum:"खाता संख्या", svcAddr:"सेवा पता", units:"खपत इकाइयां",
    billAmt:"बिल राशि", dueDate:"नियत तिथि", totalDue:"कुल देय राशि",
    pgTitle:"भुगतान गेटवे", pgSubtitle:"भुगतान विधि चुनें",
    amtToPay:"भुगतान राशि", paySecure:"सुरक्षित भुगतान करें →",
    paySuccess:"भुगतान सफल!", billPaid:"भुगतान की पुष्टि और दर्ज।",
    txnId:"लेनदेन आईडी", amtPaid:"भुगतान राशि", payMode:"भुगतान विधि",
    dtTime:"दिनांक और समय", txnStatus:"स्थिति", retDash:"← डैशबोर्ड पर वापस",
    compTitle:"शिकायत दर्ज करें", compSubtitle:"सभी शिकायतें SLA के भीतर हल होती हैं",
    deptLbl:"विभाग *", selDept:"विभाग चुनें",
    compTypeLbl:"शिकायत प्रकार *", selType:"प्रकार चुनें",
    descLbl:"विवरण *", descPh:"शिकायत का विस्तार से वर्णन करें...",
    attachLbl:"साक्ष्य संलग्न (वैकल्पिक)", uploadPh:"फ़ोटो/दस्तावेज़ अपलोड करें",
    uploadHint:"JPG, PNG, PDF 5MB तक", submitComp:"शिकायत दर्ज करें →",
    compDone:"शिकायत दर्ज!", compDoneMsg:"संबंधित विभाग को भेज दी गई।",
    ticketId:"टिकट आईडी", resolution:"अनुमानित समाधान: 3-5 कार्यदिवस",
    fileAnother:"← और शिकायत दर्ज करें",
    gBookCyl:"सिलेंडर बुक करें", gBookDesc:"LPG 14.2 kg ऑनलाइन बुकिंग",
    gNewConn:"नया गैस कनेक्शन", gNewConnDesc:"घरेलू कनेक्शन के लिए आवेदन",
    gSubsidy:"सब्सिडी स्थिति", gSubsidyDesc:"DBT ट्रांसफर स्थिति जांचें",
    gComp:"गैस शिकायत", gCompDesc:"लीकेज या सेवा समस्या रिपोर्ट",
    gPayBill:"गैस बिल भुगतान", gPayBillDesc:"बकाया राशि भुगतान",
    gBookingId:"बुकिंग संदर्भ", gCylType:"सिलेंडर प्रकार",
    gLastBook:"अंतिम बुकिंग", gDist:"वितरक", gSubAmt:"प्राप्त सब्सिडी",
    bookNow:"अभी बुक करें →", bookSuccess:"सिलेंडर बुक हो गया!", bookSuccessMsg:"LPG सिलेंडर सफलतापूर्वक बुक।",
    deliveryEst:"अनुमानित डिलीवरी", bookRef:"बुकिंग संदर्भ",
    mPropTax:"संपत्ति कर", mPropDesc:"संपत्ति कर देखें और भुगतान करें",
    mWater:"जल बिल", mWaterDesc:"जल शुल्क भुगतान",
    mTrade:"व्यापार लाइसेंस", mTradeDesc:"आवेदन या नवीनीकरण",
    mBuild:"भवन योजना", mBuildDesc:"अनुमोदन जमा या ट्रैक करें",
    mBirth:"जन्म प्रमाणपत्र", mBirthDesc:"आवेदन या डाउनलोड",
    mDeath:"मृत्यु प्रमाणपत्र", mDeathDesc:"आवेदन या डाउनलोड",
    propId:"संपत्ति आईडी", propType:"संपत्ति प्रकार", area:"क्षेत्रफल",
    taxAmt:"कर राशि", connId:"कनेक्शन आईडी", waterUnits:"इकाइयां (KL)",
    hVacc:"टीकाकरण", hVaccDesc:"अपॉइंटमेंट बुक / स्थिति देखें",
    hCard:"आयुष्मान कार्ड", hCardDesc:"स्वास्थ्य बीमा के लिए आवेदन",
    hLab:"लैब टेस्ट बुकिंग", hLabDesc:"सरकारी लैब बुक करें",
    hAmb:"एम्बुलेंस सेवा", hAmbDesc:"108 एम्बुलेंस",
    hMental:"मानसिक स्वास्थ्य", hMentalDesc:"हेल्पलाइन और संसाधन",
    hMed:"दवा केंद्र खोजें", hMedDesc:"जन औषधि केंद्र",
    vaccSlot:"टीका स्लॉट चुनें", vaccName:"टीका नाम", vaccDose:"डोज़",
    vaccCenter:"केंद्र", bookSlot:"स्लॉट बुक करें →",
    vaccBooked:"अपॉइंटमेंट पक्का!", vaccMsg:"आपका टीकाकरण अपॉइंटमेंट बुक हो गया।",
    apptId:"अपॉइंटमेंट आईडी", apptDate:"तिथि", apptSlot:"स्लॉट",
    cardApply:"आयुष्मान कार्ड आवेदन", cardApplyDesc:"आधार और आय प्रमाण अपलोड करें",
    applyNow:"अभी आवेदन करें →", cardSuccess:"आवेदन जमा!", cardMsg:"आपका आयुष्मान भारत कार्ड आवेदन समीक्षाधीन है।",
    appRefId:"आवेदन संदर्भ",
    emergTitle:"आपातकालीन सेवाएं", emergWarn:"जीवन खतरे में? तुरंत डायल करें।",
    adminBadge:"व्यवस्थापक पहुंच", adminTitle:"सिस्टम डैशबोर्ड",
    statSessions:"आज कुल सत्र", statTxns:"कुल लेनदेन",
    statComps:"दर्ज शिकायतें", statRev:"प्रसंस्कृत राजस्व",
    emergCtrl:"आपातकालीन घोषणा", curAlert:"सक्रिय अलर्ट:",
    noneActive:"कोई नहीं", broadcast:"प्रसारित करें", clearAlert:"साफ करें",
    liveLog:"लाइव गतिविधि लॉग", announcePh:"नई आपातकालीन घोषणा...",
    noteLabel:"नोट:", noteMsg:"सभी लेनदेन NIC द्वारा एन्क्रिप्टेड और सुरक्षित।",
    footerL:"SUVIDHA v2.0 · NIC प्रमाणित · ISO 27001 · STQC",
    footerR:"WCAG 2.1 AA · IT अधिनियम 2000 · © 2025 भारत सरकार",
  },

  as: {
    appName:"সুবিধা কিঅ'স্ক", appSub:"স্মাৰ্ট চিটি প্লেটফৰ্ম · ভাৰত চৰকাৰ",
    selectLang:"ভাষা বাছক", voiceAssist:"ভয়েছ সহায়তা",
    voiceDesc:"স্ক্ৰীন ৰিডাৰ আৰু অডিঅ' গাইডেন্স", startBtn:"আৰম্ভ কৰক →",
    secured:"🔒 NIC দ্বাৰা সুৰক্ষিত · STQC প্ৰমাণিত",
    secureLogin:"সুৰক্ষিত লগিন", mobilePrompt:"OTP পাবলৈ মোবাইল নম্বৰ দিয়ক",
    mobileLbl:"মোবাইল নম্বৰ", sendOtp:"OTP পঠিয়াওক →", verifyOtp:"যাচাই কৰক →",
    otpLbl:"এককালীন পাছৱৰ্ড", otpSent:"OTP পঠোৱা হ'ল +91 ", changeNum:"← নম্বৰ সলনি কৰক",
    badMobile:"১০ অংকৰ বৈধ মোবাইল নম্বৰ দিয়ক।",
    badOtp:"ভুল OTP। পুনৰ চেষ্টা কৰক।",
    secNote:"সুৰক্ষা জাননী:", secMsg:"৩ মিনিট নিষ্ক্ৰিয়তাত অধিবেশন শেষ। OTP শ্বেয়াৰ নকৰিব।",
    welcomeBack:"পুনৰ স্বাগতম", sessionExp:"অধিবেশন শেষ হ'ব",
    available:"উপলব্ধ সেৱাসমূহ",
    sElec:"বিদ্যুৎ সেৱা",  dElec:"বিল, পেমেণ্ট, অভিযোগ",
    sGas:"গেছ সেৱা",       dGas:"চিলিণ্ডাৰ বুকিং, ছাবছিডি",
    sMun:"পৌৰ সেৱা",       dMun:"সম্পত্তি কৰ, পানী বিল",
    sHealth:"ৰাজহুৱা স্বাস্থ্য", dHealth:"টিকাকৰণ, আয়ুষ্মান কাৰ্ড",
    sEmerg:"জৰুৰীকালীন",   dEmerg:"অগ্নিশমন, আৰক্ষী, এম্বুলেন্স",
    sAdmin:"প্ৰশাসক",      dAdmin:"চিস্টেম ব্যৱস্থাপনা",
    back:"← পিছলৈ", payNow:"💳 এতিয়াই পৰিশোধ", dlPdf:"⬇️ PDF ডাউনলোড",
    printRec:"🖨️ ৰচিদ প্ৰিণ্ট", logout:"লগ আউট",
    timeoutTitle:"অধিবেশন শেষ হৈছে", timeoutMsg:"নিষ্ক্ৰিয়তাৰ বাবে অধিবেশন শেষ হ'ব। অব্যাহত ৰাখিব?",
    continueSess:"অধিবেশন অব্যাহত ৰাখক",
    viewBill:"বিল চাওক", payBill:"বিল পৰিশোধ", regComp:"অভিযোগ দাখিল", newConn:"নতুন সংযোগ",
    billPeriod:"বিলিং সময়কাল:", elecBillTitle:"বিদ্যুৎ বিল",
    accNum:"একাউণ্ট নম্বৰ", svcAddr:"সেৱাৰ ঠিকনা", units:"ব্যৱহৃত ইউনিট",
    billAmt:"বিলৰ পৰিমাণ", dueDate:"নিৰ্ধাৰিত তাৰিখ", totalDue:"মুঠ পৰিশোধযোগ্য",
    pgTitle:"পেমেণ্ট গেটৱে", pgSubtitle:"পেমেণ্ট পদ্ধতি বাছক",
    amtToPay:"পৰিশোধৰ পৰিমাণ", paySecure:"সুৰক্ষিতভাৱে পৰিশোধ →",
    paySuccess:"পেমেণ্ট সফল!", billPaid:"পেমেণ্ট নিশ্চিত আৰু দাখিল।",
    txnId:"লেনদেন আইডি", amtPaid:"পৰিশোধিত পৰিমাণ", payMode:"পেমেণ্টৰ পদ্ধতি",
    dtTime:"তাৰিখ আৰু সময়", txnStatus:"স্থিতি", retDash:"← ডেশ্বব'ৰ্ডলৈ উভতক",
    compTitle:"অভিযোগ দাখিল", compSubtitle:"সকলো অভিযোগ SLA সময়ত সমাধান",
    deptLbl:"বিভাগ *", selDept:"বিভাগ বাছক",
    compTypeLbl:"অভিযোগৰ ধৰণ *", selType:"ধৰণ বাছক",
    descLbl:"বিৱৰণ *", descPh:"অভিযোগৰ বিতং বৰ্ণনা দিয়ক...",
    attachLbl:"প্ৰমাণ সংলগ্ন (ঐচ্ছিক)", uploadPh:"ফটো/দস্তাবেজ আপলোড কৰক",
    uploadHint:"JPG, PNG, PDF ৫MB পৰ্যন্ত", submitComp:"অভিযোগ দাখিল কৰক →",
    compDone:"অভিযোগ দাখিল হ'ল!", compDoneMsg:"সংশ্লিষ্ট বিভাগক অৰ্পণ কৰা হ'ল।",
    ticketId:"টিকেট আইডি", resolution:"অনুমানিত সমাধান: ৩-৫ কাৰ্যদিৱস",
    fileAnother:"← আন এটা অভিযোগ",
    gBookCyl:"গেছ চিলিণ্ডাৰ বুক", gBookDesc:"LPG 14.2kg অনলাইন বুকিং",
    gNewConn:"নতুন গেছ সংযোগ", gNewConnDesc:"ঘৰুৱা সংযোগৰ আবেদন",
    gSubsidy:"ছাবছিডি স্থিতি", gSubsidyDesc:"DBT ট্ৰেন্সফাৰ পৰীক্ষা",
    gComp:"গেছ অভিযোগ", gCompDesc:"লিকেজ বা সেৱা সমস্যা",
    gPayBill:"গেছ বিল পৰিশোধ", gPayBillDesc:"বকেয়া পৰিমাণ পৰিশোধ",
    gBookingId:"বুকিং তথ্যসূত্ৰ", gCylType:"চিলিণ্ডাৰৰ ধৰণ",
    gLastBook:"শেষ বুকিং", gDist:"বিতৰক", gSubAmt:"প্ৰাপ্ত ছাবছিডি",
    bookNow:"এতিয়াই বুক কৰক →", bookSuccess:"চিলিণ্ডাৰ বুক হ'ল!", bookSuccessMsg:"LPG চিলিণ্ডাৰ সফলভাৱে বুক হ'ল।",
    deliveryEst:"অনুমানিত ডেলিভেৰী", bookRef:"বুকিং তথ্যসূত্ৰ",
    mPropTax:"সম্পত্তি কৰ", mPropDesc:"সম্পত্তি কৰ চাওক আৰু পৰিশোধ কৰক",
    mWater:"পানী বিল", mWaterDesc:"পানী মাচুল পৰিশোধ",
    mTrade:"ব্যৱসায় অনুজ্ঞাপত্ৰ", mTradeDesc:"আবেদন বা নবীকৰণ",
    mBuild:"ভৱন পৰিকল্পনা", mBuildDesc:"অনুমোদন দাখিল বা ট্ৰেক",
    mBirth:"জন্ম প্ৰমাণপত্ৰ", mBirthDesc:"আবেদন বা ডাউনলোড",
    mDeath:"মৃত্যু প্ৰমাণপত্ৰ", mDeathDesc:"আবেদন বা ডাউনলোড",
    propId:"সম্পত্তি আইডি", propType:"সম্পত্তিৰ ধৰণ", area:"মাটিকালি",
    taxAmt:"কৰৰ পৰিমাণ", connId:"সংযোগ আইডি", waterUnits:"ইউনিট (KL)",
    hVacc:"টিকাকৰণ", hVaccDesc:"অ্যাপইণ্টমেণ্ট বুক / স্থিতি",
    hCard:"আয়ুষ্মান কাৰ্ড", hCardDesc:"স্বাস্থ্য বীমাৰ বাবে আবেদন",
    hLab:"লেব টেষ্ট বুকিং", hLabDesc:"চৰকাৰী লেব বুক কৰক",
    hAmb:"এম্বুলেন্স সেৱা", hAmbDesc:"108 এম্বুলেন্স",
    hMental:"মানসিক স্বাস্থ্য", hMentalDesc:"হেল্পলাইন আৰু সম্পদ",
    hMed:"দৰব ষ্টোৰ বিচাৰক", hMedDesc:"জন ঔষধি কেন্দ্ৰ",
    vaccSlot:"টিকা স্লট বাছক", vaccName:"টিকাৰ নাম", vaccDose:"ডোজ",
    vaccCenter:"কেন্দ্ৰ", bookSlot:"স্লট বুক কৰক →",
    vaccBooked:"অ্যাপইণ্টমেণ্ট নিশ্চিত!", vaccMsg:"আপোনাৰ টিকাকৰণ অ্যাপইণ্টমেণ্ট বুক হ'ল।",
    apptId:"অ্যাপইণ্টমেণ্ট আইডি", apptDate:"তাৰিখ", apptSlot:"স্লট",
    cardApply:"আয়ুষ্মান কাৰ্ড আবেদন", cardApplyDesc:"আধাৰ আৰু আয় প্ৰমাণ আপলোড কৰক",
    applyNow:"এতিয়াই আবেদন কৰক →", cardSuccess:"আবেদন দাখিল হ'ল!", cardMsg:"আপোনাৰ আয়ুষ্মান ভাৰত কাৰ্ড আবেদন পৰ্যালোচনাধীন।",
    appRefId:"আবেদন তথ্যসূত্ৰ",
    emergTitle:"জৰুৰীকালীন সেৱা", emergWarn:"জীৱন-ভাবুকি? তৎক্ষণাৎ ডায়েল কৰক।",
    adminBadge:"প্ৰশাসক প্ৰৱেশ", adminTitle:"চিস্টেম ডেশ্বব'ৰ্ড",
    statSessions:"আজিৰ মুঠ অধিবেশন", statTxns:"মুঠ লেনদেন",
    statComps:"দাখিল অভিযোগ", statRev:"প্ৰক্ৰিয়াকৃত ৰাজহ",
    emergCtrl:"জৰুৰীকালীন ঘোষণা", curAlert:"সক্ৰিয় সতৰ্কতা:",
    noneActive:"কোনো নাই", broadcast:"সম্প্ৰচাৰ কৰক", clearAlert:"পৰিষ্কাৰ",
    liveLog:"লাইভ কাৰ্যকলাপ লগ", announcePh:"নতুন জৰুৰীকালীন ঘোষণা...",
    noteLabel:"টোকা:", noteMsg:"সকলো লেনদেন NIC দ্বাৰা এনক্ৰিপ্টেড আৰু সুৰক্ষিত।",
    footerL:"SUVIDHA v2.0 · NIC প্ৰমাণিত · ISO 27001 · STQC",
    footerR:"WCAG 2.1 AA · IT আইন 2000 · © 2025 ভাৰত চৰকাৰ",
  },

  bn: {
    appName:"সুবিধা কিওস্ক", appSub:"স্মার্ট সিটি প্ল্যাটফর্ম · ভারত সরকার",
    selectLang:"ভাষা বাছুন", voiceAssist:"ভয়েস সহায়তা",
    voiceDesc:"স্ক্রিন রিডার ও অডিও গাইডেন্স", startBtn:"শুরু করুন →",
    secured:"🔒 NIC দ্বারা সুরক্ষিত · STQC প্রত্যয়িত",
    secureLogin:"নিরাপদ লগইন", mobilePrompt:"OTP পেতে মোবাইল নম্বর দিন",
    mobileLbl:"মোবাইল নম্বর", sendOtp:"OTP পাঠান →", verifyOtp:"যাচাই করুন →",
    otpLbl:"এককালীন পাসওয়ার্ড", otpSent:"OTP পাঠানো হয়েছে +91 ", changeNum:"← নম্বর পরিবর্তন",
    badMobile:"১০ সংখ্যার বৈধ মোবাইল নম্বর দিন।",
    badOtp:"ভুল OTP। আবার চেষ্টা করুন।",
    secNote:"নিরাপত্তা বিজ্ঞপ্তি:", secMsg:"৩ মিনিট নিষ্ক্রিয়তায় সেশন শেষ। OTP শেয়ার করবেন না।",
    welcomeBack:"ফিরে স্বাগতম", sessionExp:"সেশন শেষ হবে",
    available:"উপলব্ধ সেবাসমূহ",
    sElec:"বিদ্যুৎ সেবা",  dElec:"বিল, পেমেন্ট, অভিযোগ",
    sGas:"গ্যাস সেবা",     dGas:"সিলিন্ডার বুকিং, ভর্তুকি",
    sMun:"পৌর সেবা",       dMun:"সম্পত্তি কর, জল বিল",
    sHealth:"জন স্বাস্থ্য", dHealth:"টিকাদান, আয়ুষ্মান কার্ড",
    sEmerg:"জরুরি সতর্কতা", dEmerg:"দমকল, পুলিশ, অ্যাম্বুলেন্স",
    sAdmin:"প্রশাসক পোর্টাল", dAdmin:"সিস্টেম ব্যবস্থাপনা",
    back:"← পিছনে", payNow:"💳 এখনই পরিশোধ", dlPdf:"⬇️ PDF ডাউনলোড",
    printRec:"🖨️ রসিদ প্রিন্ট", logout:"লগ আউট",
    timeoutTitle:"সেশন শেষ হচ্ছে", timeoutMsg:"নিষ্ক্রিয়তায় সেশন শেষ হবে। চালিয়ে যাবেন?",
    continueSess:"সেশন চালিয়ে যান",
    viewBill:"বিল দেখুন", payBill:"বিল পরিশোধ", regComp:"অভিযোগ দাখিল", newConn:"নতুন সংযোগ",
    billPeriod:"বিলিং সময়কাল:", elecBillTitle:"বিদ্যুৎ বিল",
    accNum:"হিসাব নম্বর", svcAddr:"সেবার ঠিকানা", units:"ব্যবহৃত ইউনিট",
    billAmt:"বিলের পরিমাণ", dueDate:"নির্ধারিত তারিখ", totalDue:"মোট প্রদেয়",
    pgTitle:"পেমেন্ট গেটওয়ে", pgSubtitle:"পেমেন্ট পদ্ধতি বেছে নিন",
    amtToPay:"পরিশোধের পরিমাণ", paySecure:"নিরাপদে পরিশোধ করুন →",
    paySuccess:"পেমেন্ট সফল!", billPaid:"পেমেন্ট নিশ্চিত ও নিবন্ধিত।",
    txnId:"লেনদেন আইডি", amtPaid:"পরিশোধিত পরিমাণ", payMode:"পেমেন্ট পদ্ধতি",
    dtTime:"তারিখ ও সময়", txnStatus:"অবস্থা", retDash:"← ড্যাশবোর্ডে ফিরুন",
    compTitle:"অভিযোগ দাখিল", compSubtitle:"সকল অভিযোগ SLA সময়ে সমাধান",
    deptLbl:"বিভাগ *", selDept:"বিভাগ বেছে নিন",
    compTypeLbl:"অভিযোগের ধরন *", selType:"ধরন বেছে নিন",
    descLbl:"বিবরণ *", descPh:"অভিযোগ বিস্তারিত বর্ণনা করুন...",
    attachLbl:"প্রমাণ সংযুক্ত (ঐচ্ছিক)", uploadPh:"ছবি/নথি আপলোড করুন",
    uploadHint:"JPG, PNG, PDF ৫MB পর্যন্ত", submitComp:"অভিযোগ জমা দিন →",
    compDone:"অভিযোগ নিবন্ধিত!", compDoneMsg:"সংশ্লিষ্ট বিভাগে প্রেরিত।",
    ticketId:"টিকেট আইডি", resolution:"আনুমানিক সমাধান: ৩-৫ কার্যদিবস",
    fileAnother:"← আরো একটি অভিযোগ",
    gBookCyl:"গ্যাস সিলিন্ডার বুক", gBookDesc:"LPG 14.2kg অনলাইন বুকিং",
    gNewConn:"নতুন গ্যাস সংযোগ", gNewConnDesc:"গার্হস্থ্য সংযোগের আবেদন",
    gSubsidy:"ভর্তুকি অবস্থা", gSubsidyDesc:"DBT ট্রান্সফার পরীক্ষা",
    gComp:"গ্যাস অভিযোগ", gCompDesc:"লিকেজ বা সমস্যা রিপোর্ট",
    gPayBill:"গ্যাস বিল পরিশোধ", gPayBillDesc:"বকেয়া পরিমাণ পরিশোধ",
    gBookingId:"বুকিং তথ্যসূত্র", gCylType:"সিলিন্ডারের ধরন",
    gLastBook:"শেষ বুকিং", gDist:"পরিবেশক", gSubAmt:"প্রাপ্ত ভর্তুকি",
    bookNow:"এখনই বুক করুন →", bookSuccess:"সিলিন্ডার বুক হয়েছে!", bookSuccessMsg:"LPG সিলিন্ডার সফলভাবে বুক।",
    deliveryEst:"আনুমানিক ডেলিভারি", bookRef:"বুকিং তথ্যসূত্র",
    mPropTax:"সম্পত্তি কর", mPropDesc:"সম্পত্তি কর দেখুন ও পরিশোধ",
    mWater:"জল বিল", mWaterDesc:"জল চার্জ পরিশোধ",
    mTrade:"ট্রেড লাইসেন্স", mTradeDesc:"আবেদন বা নবায়ন",
    mBuild:"ভবন পরিকল্পনা", mBuildDesc:"অনুমোদন জমা বা ট্র্যাক",
    mBirth:"জন্ম সনদ", mBirthDesc:"আবেদন বা ডাউনলোড",
    mDeath:"মৃত্যু সনদ", mDeathDesc:"আবেদন বা ডাউনলোড",
    propId:"সম্পত্তি আইডি", propType:"সম্পত্তির ধরন", area:"আয়তন",
    taxAmt:"করের পরিমাণ", connId:"সংযোগ আইডি", waterUnits:"ইউনিট (KL)",
    hVacc:"টিকাদান", hVaccDesc:"অ্যাপয়েন্টমেন্ট বুক / অবস্থা",
    hCard:"আয়ুষ্মান কার্ড", hCardDesc:"স্বাস্থ্য বীমার আবেদন",
    hLab:"ল্যাব টেস্ট বুকিং", hLabDesc:"সরকারি ল্যাব বুক করুন",
    hAmb:"অ্যাম্বুলেন্স সেবা", hAmbDesc:"108 অ্যাম্বুলেন্স",
    hMental:"মানসিক স্বাস্থ্য", hMentalDesc:"হেল্পলাইন ও সম্পদ",
    hMed:"ওষুধের দোকান", hMedDesc:"জন ঔষধি কেন্দ্র",
    vaccSlot:"টিকা স্লট বেছে নিন", vaccName:"টিকার নাম", vaccDose:"ডোজ",
    vaccCenter:"কেন্দ্র", bookSlot:"স্লট বুক করুন →",
    vaccBooked:"অ্যাপয়েন্টমেন্ট নিশ্চিত!", vaccMsg:"আপনার টিকাদান অ্যাপয়েন্টমেন্ট বুক হয়েছে।",
    apptId:"অ্যাপয়েন্টমেন্ট আইডি", apptDate:"তারিখ", apptSlot:"স্লট",
    cardApply:"আয়ুষ্মান কার্ড আবেদন", cardApplyDesc:"আধার ও আয় প্রমাণ আপলোড",
    applyNow:"এখনই আবেদন করুন →", cardSuccess:"আবেদন জমা!", cardMsg:"আপনার আয়ুষ্মান ভারত কার্ড আবেদন পর্যালোচনাধীন।",
    appRefId:"আবেদন তথ্যসূত্র",
    emergTitle:"জরুরি সেবা", emergWarn:"জীবন বিপন্ন? তাৎক্ষণিক ডায়াল করুন।",
    adminBadge:"প্রশাসক অ্যাক্সেস", adminTitle:"সিস্টেম ড্যাশবোর্ড",
    statSessions:"আজকের মোট সেশন", statTxns:"মোট লেনদেন",
    statComps:"দাখিলকৃত অভিযোগ", statRev:"প্রক্রিয়াকৃত রাজস্ব",
    emergCtrl:"জরুরি ঘোষণা নিয়ন্ত্রণ", curAlert:"সক্রিয় সতর্কতা:",
    noneActive:"কোনো নেই", broadcast:"সম্প্রচার করুন", clearAlert:"মুছুন",
    liveLog:"লাইভ কার্যকলাপ লগ", announcePh:"নতুন জরুরি ঘোষণা...",
    noteLabel:"নোট:", noteMsg:"সকল লেনদেন NIC দ্বারা এনক্রিপ্টেড।",
    footerL:"SUVIDHA v2.0 · NIC প্রত্যয়িত · ISO 27001 · STQC",
    footerR:"WCAG 2.1 AA · IT আইন 2000 · © 2025 ভারত সরকার",
  },
};

// Translation hook
const useT = (lang) => (key) => T[lang]?.[key] ?? T.en[key] ?? key;

// ───────────────────────────────────────────────────────────────────────────
// 2.  MOCK DATA  (simulates PostgreSQL responses via Node/Express API)
// ───────────────────────────────────────────────────────────────────────────
const MOCK_ELEC = { consumerName:"Virat Sharma", accountNumber:"ELEC-UP-2024-00872", billAmount:"₹1,248.00", dueDate:"15 March 2026", status:"Pending", unit:"142 kWh", period:"Feb 2026", address:"H-47, Sector 12, Lucknow Municipal Area" };
const MOCK_GAS  = { consumerName:"Rajesh Kumar Sharma", bookingId:"HP-GAS-UP-00341", cylinderType:"14.2 kg LPG", lastBooking:"22 March 2026", subsidyStatus:"₹195.00 credited on 24 March 2026", distributorName:"Sheetal Gas Agency", distributorPhone:"0522-XXXXXXX" };
const MOCK_PROP = { ownerName:"Rajesh Kumar Sharma", propertyId:"LMC-2024-H47-S12", propertyType:"Residential", area:"1200 sq ft", taxAmount:"₹8,200.00", dueDate:"31 March 2026", status:"Pending" };
const MOCK_WATER= { consumerName:"Rajesh Kumar Sharma", connId:"JJM-LKO-00219", billAmount:"₹340.00", period:"Feb 2026", units:"22 KL", dueDate:"20 March 2026", status:"Pending" };
const MOCK_ADMIN_STATS = { sessions:1842, transactions:3291, complaints:214, revenue:"₹42.6L" };
const MOCK_LOGS = [
  { time:"10:32 AM", kiosk:"KIOSK-LKO-07", event:"Bill Payment Success", user:"98XX XXXX 34" },
  { time:"10:28 AM", kiosk:"KIOSK-LKO-03", event:"OTP Login",            user:"77XX XXXX 91" },
  { time:"10:21 AM", kiosk:"KIOSK-LKO-12", event:"Complaint Filed",      user:"96XX XXXX 58" },
  { time:"10:14 AM", kiosk:"KIOSK-LKO-07", event:"Session Timeout",      user:"81XX XXXX 44" },
  { time:"10:09 AM", kiosk:"KIOSK-LKO-01", event:"Bill Payment Success", user:"70XX XXXX 19" },
];
const VACC_SLOTS = [
  { id:"v1", name:"COVID-19 Booster", dose:"3rd", centre:"PHC Sector-12", date:"18 Mar 2026", slot:"10:30 AM" },
  { id:"v2", name:"Influenza",        dose:"Annual", centre:"CHC Aliganj",  date:"19 Mar 2026", slot:"11:00 AM" },
  { id:"v3", name:"Hepatitis B",      dose:"2nd",    centre:"DH Lucknow",   date:"20 Mar 2026", slot:"9:00 AM"  },
];

// ───────────────────────────────────────────────────────────────────────────
// 3.  API SERVICE  (mock – swap for axios + JWT in production)
// ───────────────────────────────────────────────────────────────────────────
const api = {
  login:        ()  => new Promise(r => setTimeout(() => r({ success:true, token:"eyJhbGci.mock", user:{ name:"Rajesh Kumar Sharma" } }), 1500)),
  getBill:      ()  => new Promise(r => setTimeout(() => r(MOCK_ELEC), 700)),
  getGas:       ()  => new Promise(r => setTimeout(() => r(MOCK_GAS),  700)),
  getPropTax:   ()  => new Promise(r => setTimeout(() => r(MOCK_PROP), 700)),
  getWater:     ()  => new Promise(r => setTimeout(() => r(MOCK_WATER),700)),
  pay:          (a) => new Promise(r => setTimeout(() => r({ success:true, txnId:`TXN-2025-${~~(Math.random()*9000)+1000}`, datetime:new Date().toLocaleString("en-IN"), amount:a }), 2000)),
  complaint:    ()  => new Promise(r => setTimeout(() => r({ success:true, ticketId:`CMP-2025-${~~(Math.random()*900)+100}` }), 1200)),
  bookCylinder: ()  => new Promise(r => setTimeout(() => r({ success:true, ref:`BOOK-HP-2025-${~~(Math.random()*9000)+1000}`, est:"5–7 business days" }), 1400)),
  bookVacc:     (s) => new Promise(r => setTimeout(() => r({ success:true, apptId:`VAC-2025-${~~(Math.random()*9000)+1000}`, date:s.date, slot:s.slot }), 1200)),
  applyCard:    ()  => new Promise(r => setTimeout(() => r({ success:true, appId:`AYUSH-2025-${~~(Math.random()*90000)+10000}` }), 1300)),
};

// ───────────────────────────────────────────────────────────────────────────
// 4.  GLOBAL CSS
// ───────────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --navy:#0A2F5A;--navy-dk:#071E3D;--teal:#00897B;--teal-lt:#E0F2F1;
    --bg:#F7F9FC;--g50:#F3F6F9;--g100:#E8EDF4;--g200:#C8D3E4;
    --g400:#7A8CA8;--g600:#4A5C74;
    --red:#C62828;--red-lt:#FFEBEE;--amber:#E65100;
    --green:#1B5E20;--green-lt:#E8F5E9;
    --sh-sm:0 2px 8px rgba(10,47,90,.08);--sh-md:0 4px 20px rgba(10,47,90,.12);--sh-lg:0 8px 40px rgba(10,47,90,.18);
    --r-sm:8px;--r-md:14px;--r-lg:20px;
  }
  html,body,#root{height:100%;font-family:'DM Sans',sans-serif}
  body{background:var(--bg);color:var(--navy);-webkit-tap-highlight-color:transparent}
  button{cursor:pointer;font-family:inherit;border:none;outline:none}
  input,select,textarea{font-family:inherit}
  body.hc{--navy:#000;--teal:#00f;filter:contrast(1.35)}
  body.lg{font-size:118%}
  .btn{min-height:52px;min-width:52px}
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:var(--g50)}
  ::-webkit-scrollbar-thumb{background:var(--g200);border-radius:3px}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
  .fi{animation:fadeIn .28s ease forwards}
`;

// ───────────────────────────────────────────────────────────────────────────
// 5.  SHARED UI ATOMS
// ───────────────────────────────────────────────────────────────────────────
const Spinner = () => <div style={{ width:32,height:32,borderRadius:"50%",border:"3px solid var(--g100)",borderTopColor:"var(--teal)",animation:"spin .8s linear infinite",margin:"0 auto" }}/>;

const Badge = ({ status }) => {
  const map = { Success:{bg:"#E8F5E9",c:"#1B5E20"}, Pending:{bg:"#FFF8E1",c:"#E65100"}, "In Progress":{bg:"#E3F2FD",c:"#0D47A1"}, Resolved:{bg:"#E8F5E9",c:"#1B5E20"} };
  const s = map[status]||{bg:"var(--g100)",c:"var(--g600)"};
  return <span style={{ background:s.bg,color:s.c,padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600 }}>{status}</span>;
};

const BBtn = ({ onBack, t }) => (
  <button onClick={onBack} style={{ display:"flex",alignItems:"center",gap:6,background:"var(--g50)",border:"1.5px solid var(--g100)",borderRadius:"var(--r-sm)",padding:"10px 18px",fontSize:14,fontWeight:600,color:"var(--g600)",minHeight:48,marginBottom:20 }}>
    {t("back")}
  </button>
);

const ActionRow = ({ items, onNav }) => (
  <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
    {items.map(a => (
      <button key={a.id} onClick={() => onNav(a.id)} style={{ background:"#fff",border:"1.5px solid var(--g100)",borderRadius:"var(--r-md)",padding:"20px 24px",display:"flex",alignItems:"center",gap:16,textAlign:"left",boxShadow:"var(--sh-sm)",minHeight:72 }}>
        <span style={{ fontSize:26,width:48,height:48,borderRadius:"var(--r-sm)",background:"var(--g50)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{a.icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700,fontSize:16,color:"var(--navy)" }}>{a.label}</div>
          <div style={{ fontSize:13,color:"var(--g400)",marginTop:3 }}>{a.desc}</div>
        </div>
        <span style={{ color:"var(--g200)",fontSize:20 }}>›</span>
      </button>
    ))}
  </div>
);

// Shared payment gateway UI
const PayGateway = ({ amount, onSuccess, onBack, t }) => {
  const [method, setMethod] = useState("upi");
  const [step, setStep]   = useState("choose"); // choose | processing | done
  const [res, setRes]     = useState(null);
  const methods = [{ id:"upi",icon:"📱",label:"UPI / QR Code" },{ id:"net",icon:"🏦",label:"Net Banking" },{ id:"debit",icon:"💳",label:"Debit Card" },{ id:"credit",icon:"💳",label:"Credit Card" }];

  const doPayment = async () => {
    setStep("processing");
    const r = await api.pay(amount);
    setRes(r); setStep("done");
  };

  if(step==="processing") return (
    <div style={{ minHeight:"calc(100vh - 64px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:32 }}>
      <div style={{ width:80,height:80,borderRadius:"50%",background:"#fff",boxShadow:"var(--sh-lg)",display:"flex",alignItems:"center",justifyContent:"center" }}><Spinner/></div>
      <h3 style={{ fontSize:20,fontWeight:700 }}>Processing Payment…</h3>
      <p style={{ color:"var(--g400)",textAlign:"center",fontSize:14 }}>Connecting to secure payment gateway.<br/><small>Do not press Back or close this window.</small></p>
    </div>
  );

  if(step==="done") return (
    <div className="fi" style={{ minHeight:"calc(100vh - 64px)",display:"flex",alignItems:"center",justifyContent:"center",padding:32 }}>
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40,maxWidth:440,width:"100%",textAlign:"center" }}>
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
          <button className="btn" style={{ flex:1,background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"12px",fontSize:14,fontWeight:600 }}>{t("dlPdf")}</button>
          <button className="btn" style={{ flex:1,background:"var(--g50)",color:"var(--navy)",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"12px",fontSize:14,fontWeight:600 }}>{t("printRec")}</button>
        </div>
        <button onClick={onSuccess} className="btn" style={{ width:"100%",background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:15,fontWeight:700 }}>{t("retDash")}</button>
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
          <button key={m.id} onClick={()=>setMethod(m.id)} style={{ background:method===m.id?"var(--navy)":"#fff",color:method===m.id?"#fff":"var(--navy)",border:`2px solid ${method===m.id?"var(--navy)":"var(--g100)"}`,borderRadius:"var(--r-sm)",padding:"16px 20px",display:"flex",alignItems:"center",gap:14,fontSize:15,fontWeight:600,minHeight:60 }}>
            <span style={{ fontSize:22 }}>{m.icon}</span>{m.label}
            {method===m.id&&<span style={{ marginLeft:"auto" }}>●</span>}
          </button>
        ))}
      </div>
      <div style={{ background:"var(--red-lt)",borderRadius:"var(--r-sm)",padding:"10px 16px",marginBottom:20,fontSize:12,color:"var(--red)",display:"flex",gap:8 }}>
        <span>🔒</span><span>All payments processed via RBI-approved encrypted gateway.</span>
      </div>
      <button onClick={doPayment} className="btn" style={{ width:"100%",background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"18px",fontSize:17,fontWeight:700 }}>
        {t("paySecure")} {amount}
      </button>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// 6.  SCREEN: WELCOME
// ───────────────────────────────────────────────────────────────────────────
const Welcome = ({ onStart }) => {
  const [lang, setLang] = useState("en");
  const [voice, setVoice] = useState(false);
  const t = useT(lang);

  const langs = [
    { code:"en", native:"English",  sub:"English"  },
    { code:"hi", native:"हिंदी",    sub:"Hindi"    },
    { code:"as", native:"অসমীয়া",  sub:"Assamese" },
    { code:"bn", native:"বাংলা",    sub:"Bengali"  },
  ];

  return (
    <div className="fi" style={{ minHeight:"calc(100vh - 0px)",background:"var(--bg)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32 }}>
      {/* Gov branding */}
      <div style={{ textAlign:"center",marginBottom:32 }}>
        <div style={{ width:80,height:80,borderRadius:"50%",background:"var(--navy)",margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"var(--sh-lg)",fontSize:36 }}>🏛️</div>
        <div style={{ fontSize:11,letterSpacing:3,color:"var(--g400)",textTransform:"uppercase",marginBottom:6 }}>Government of India · Smart City Mission</div>
        <h1 style={{ fontSize:38,fontWeight:800,color:"var(--navy)",letterSpacing:-1 }}>SUVIDHA</h1>
        <p style={{ fontSize:14,color:"var(--g600)",marginTop:4 }}>Unified Touch-Based Civic Services Platform</p>
        <p style={{ fontSize:12,color:"var(--g400)",marginTop:4 }}>सुविधा · সুবিধা · সুবিধা</p>
      </div>

      {/* Language picker */}
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",padding:28,boxShadow:"var(--sh-md)",width:"100%",maxWidth:520,marginBottom:20 }}>
        <div style={{ fontSize:12,fontWeight:600,color:"var(--g400)",marginBottom:16,textTransform:"uppercase",letterSpacing:1 }}>{t("selectLang")}</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          {langs.map(l => (
            <button key={l.code} onClick={()=>setLang(l.code)} style={{ padding:"20px 14px",borderRadius:"var(--r-sm)",border:`2px solid ${lang===l.code?"var(--teal)":"var(--g100)"}`,background:lang===l.code?"var(--teal-lt)":"var(--g50)",color:lang===l.code?"var(--teal)":"var(--g600)",fontWeight:lang===l.code?700:500,fontSize:14,display:"flex",flexDirection:"column",alignItems:"center",gap:6,minHeight:70,transition:"all .15s" }}>
              <span style={{ fontSize:18 }}>{l.native}</span>
              <span style={{ fontSize:11,opacity:.7 }}>{l.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice toggle */}
      <div style={{ background:"#fff",borderRadius:"var(--r-md)",padding:"14px 24px",boxShadow:"var(--sh-sm)",width:"100%",maxWidth:520,marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div>
          <div style={{ fontWeight:600,fontSize:14 }}>🎤 {t("voiceAssist")}</div>
          <div style={{ fontSize:12,color:"var(--g400)",marginTop:2 }}>{t("voiceDesc")}</div>
        </div>
        <button onClick={()=>setVoice(!voice)} style={{ width:52,height:28,borderRadius:14,background:voice?"var(--teal)":"var(--g200)",position:"relative",border:"none",transition:"background .2s" }}>
          <span style={{ position:"absolute",top:3,left:voice?27:3,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.2)" }}/>
        </button>
      </div>

      <button onClick={()=>onStart(lang)} className="btn" style={{ background:"var(--navy)",color:"#fff",borderRadius:"var(--r-md)",padding:"18px 60px",fontSize:18,fontWeight:700,boxShadow:"var(--sh-lg)",minHeight:60,width:"100%",maxWidth:520 }}>
        {t("startBtn")}
      </button>
      <div style={{ marginTop:20,fontSize:11,color:"var(--g400)",textAlign:"center" }}>{t("secured")}</div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// 7.  SCREEN: LOGIN
// ───────────────────────────────────────────────────────────────────────────
const Login = ({ onLogin, onBack, t }) => {
  const [mobile,setMobile] = useState("");
  const [otp,setOtp]       = useState("");
  const [step,setStep]     = useState("mob");
  const [loading,setLoading]= useState(false);
  const [err,setErr]       = useState("");

  const sendOtp = () => {
    if(mobile.length!==10){ setErr(t("badMobile")); return; }
    setErr(""); setLoading(true);
    setTimeout(()=>{ setLoading(false); setStep("otp"); }, 1200);
  };
  const verify = async () => {
    if(otp.length!==6){ setErr(t("badOtp")); return; }
    setErr(""); setLoading(true);
    const r = await api.login();
    setLoading(false);
    if(r.success) onLogin(r);
    else setErr(t("badOtp"));
  };

  return (
    <div className="fi" style={{ minHeight:"calc(100vh - 64px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,background:"var(--bg)" }}>
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40,width:"100%",maxWidth:440 }}>
        <BBtn onBack={onBack} t={t}/>
        <div style={{ width:56,height:56,borderRadius:"50%",background:"var(--navy)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,fontSize:26 }}>🔐</div>
        <h2 style={{ fontSize:24,fontWeight:700,marginBottom:4 }}>{t("secureLogin")}</h2>
        <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>
          {step==="mob"? t("mobilePrompt") : `${t("otpSent")}${mobile.slice(0,4)}XXXXXX`}
        </p>
        {/* Progress bar */}
        <div style={{ display:"flex",gap:8,marginBottom:28 }}>
          {[0,1].map(i=><div key={i} style={{ flex:1,height:4,borderRadius:2,background:i===0||step==="otp"?"var(--teal)":"var(--g100)" }}/>)}
        </div>

        {step==="mob" ? <>
          <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5 }}>{t("mobileLbl")}</label>
          <div style={{ display:"flex",alignItems:"center",marginTop:6,marginBottom:20 }}>
            <span style={{ background:"var(--g50)",border:"1.5px solid var(--g200)",borderRight:"none",borderRadius:"var(--r-sm) 0 0 var(--r-sm)",padding:"14px 12px",fontSize:14,color:"var(--g600)",fontWeight:600 }}>+91</span>
            <input type="tel" maxLength={10} value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,""))} placeholder="Enter 10-digit number" style={{ flex:1,border:"1.5px solid var(--g200)",borderRadius:"0 var(--r-sm) var(--r-sm) 0",padding:"14px 16px",fontSize:16,outline:"none",color:"var(--navy)",fontFamily:"'Space Mono',monospace",letterSpacing:2 }}/>
          </div>
          {err&&<p style={{ color:"var(--red)",fontSize:12,marginBottom:12 }}>{err}</p>}
          <button onClick={sendOtp} disabled={loading} className="btn" style={{ width:"100%",background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700 }}>
            {loading?<Spinner/>:t("sendOtp")}
          </button>
        </> : <>
          <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5 }}>{t("otpLbl")}</label>
          <input type="tel" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,""))} placeholder="••••••" style={{ width:"100%",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"16px",fontSize:28,textAlign:"center",letterSpacing:14,marginTop:6,marginBottom:20,outline:"none",fontFamily:"'Space Mono',monospace",color:"var(--navy)" }}/>
          {err&&<p style={{ color:"var(--red)",fontSize:12,marginBottom:12 }}>{err}</p>}
          <button onClick={verify} disabled={loading} className="btn" style={{ width:"100%",background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700,marginBottom:12 }}>
            {loading?<Spinner/>:t("verifyOtp")}
          </button>
          <button onClick={()=>setStep("mob")} style={{ width:"100%",background:"none",color:"var(--g400)",fontSize:13,minHeight:40 }}>{t("changeNum")}</button>
        </>}

        <div style={{ marginTop:24,padding:"12px 16px",background:"var(--g50)",borderRadius:"var(--r-sm)",display:"flex",gap:8,alignItems:"flex-start" }}>
          <span>🛡️</span>
          <p style={{ fontSize:11,color:"var(--g600)",lineHeight:1.6 }}><strong>{t("secNote")}</strong> {t("secMsg")}</p>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// 8.  SCREEN: DASHBOARD
// ───────────────────────────────────────────────────────────────────────────
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
          <button key={s.id} onClick={()=>onNav(s.id)} style={{ background:s.bg,border:`1.5px solid ${s.ac}20`,borderRadius:"var(--r-md)",padding:"24px 20px",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:10,minHeight:130,boxShadow:"var(--sh-sm)",textAlign:"left" }}>
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

// ───────────────────────────────────────────────────────────────────────────
// 9.  ELECTRICITY SERVICES
// ───────────────────────────────────────────────────────────────────────────
const Electricity = ({ onNav, onBack, t }) => {
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
const ElecBill = ({ onNav, onBack, t }) => {
  const [loading,setLoading] = useState(true);
  const [bill,setBill]       = useState(null);
  useEffect(()=>{ api.getBill().then(b=>{ setBill(b); setLoading(false); }); },[]);
  if(loading) return <div style={{ padding:40,textAlign:"center" }}><Spinner/></div>;
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:640,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("elecBillTitle")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>{t("billPeriod")} {bill.period}</p>
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",overflow:"hidden",marginBottom:20 }}>
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
        <button onClick={()=>onNav("pay-elec")} className="btn" style={{ background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700,width:"100%" }}>{t("payNow")} · {bill.billAmount}</button>
        <div style={{ display:"flex",gap:12 }}>
          <button className="btn" style={{ flex:1,background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:600 }}>{t("dlPdf")}</button>
          <button className="btn" style={{ flex:1,background:"var(--g50)",color:"var(--navy)",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:600 }}>{t("printRec")}</button>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// 10. GAS SERVICES  (full features)
// ───────────────────────────────────────────────────────────────────────────
const Gas = ({ onNav, onBack, t }) => {
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

const GasBook = ({ onNav, onBack, t }) => {
  const [loading,setLoading] = useState(true);
  const [gas,setGas]         = useState(null);
  const [booking,setBooking] = useState(false);
  const [done,setDone]       = useState(null);
  useEffect(()=>{ api.getGas().then(g=>{ setGas(g); setLoading(false); }); },[]);

  const book = async () => {
    setBooking(true);
    const r = await api.bookCylinder();
    setDone(r); setBooking(false);
  };

  if(loading) return <div style={{ padding:40,textAlign:"center" }}><Spinner/></div>;

  if(done) return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:520,margin:"0 auto" }}>
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40,textAlign:"center" }}>
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
        <button onClick={()=>setDone(null)} className="btn" style={{ width:"100%",background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:15,fontWeight:700 }}>{t("back")}</button>
      </div>
    </div>
  );

  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:620,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:24 }}>{t("gBookCyl")}</h2>
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",overflow:"hidden",marginBottom:20 }}>
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
      <button onClick={book} disabled={booking} className="btn" style={{ width:"100%",background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"18px",fontSize:17,fontWeight:700 }}>
        {booking?<Spinner/>:t("bookNow")}
      </button>
    </div>
  );
};

const GasSubsidy = ({ onBack, t }) => {
  const [loading,setLoading] = useState(true);
  const [gas,setGas]         = useState(null);
  useEffect(()=>{ api.getGas().then(g=>{ setGas(g); setLoading(false); }); },[]);
  if(loading) return <div style={{ padding:40,textAlign:"center" }}><Spinner/></div>;
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:580,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("gSubsidy")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>DBT (Direct Benefit Transfer) Status</p>
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",padding:24 }}>
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

// ───────────────────────────────────────────────────────────────────────────
// 11. MUNICIPAL SERVICES  (full features)
// ───────────────────────────────────────────────────────────────────────────
const Municipal = ({ onNav, onBack, t }) => {
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

const PropertyTax = ({ onNav, onBack, t }) => {
  const [loading,setLoading] = useState(true);
  const [prop,setProp]       = useState(null);
  useEffect(()=>{ api.getPropTax().then(p=>{ setProp(p); setLoading(false); }); },[]);
  if(loading) return <div style={{ padding:40,textAlign:"center" }}><Spinner/></div>;
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:640,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("mPropTax")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>Assessment Year 2024-25</p>
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",overflow:"hidden",marginBottom:20 }}>
        <div style={{ background:"var(--navy)",padding:"20px 24px",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:11,color:"rgba(255,255,255,.6)",letterSpacing:1 }}>PROPERTY TAX NOTICE</div>
            <div style={{ fontSize:18,fontWeight:700,marginTop:4 }}>{prop.ownerName}</div>
          </div>
          <Badge status={prop.status}/>
        </div>
        <div style={{ padding:24 }}>
          {[[t("propId"),prop.propertyId,true],[t("propType"),prop.propertyType,false],[t("area"),prop.area,false],[t("taxAmt"),prop.taxAmount,false],[t("dueDate"),prop.dueDate,false]].map(([k,v,mono])=>(
            <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--g100)" }}>
              <span style={{ fontSize:13,color:"var(--g400)",flex:"0 0 160px" }}>{k}</span>
              <span style={{ fontSize:14,fontWeight:600,color:"var(--navy)",fontFamily:mono?"'Space Mono',monospace":"inherit",fontSize:mono?11:14 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop:16,background:"var(--g50)",borderRadius:"var(--r-sm)",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <span style={{ fontWeight:700 }}>{t("totalDue")}</span>
            <span style={{ fontSize:26,fontWeight:800,fontFamily:"'Space Mono',monospace" }}>{prop.taxAmount}</span>
          </div>
        </div>
      </div>
      <button onClick={()=>onNav("pay-prop")} className="btn" style={{ width:"100%",background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700 }}>{t("payNow")} · {prop.taxAmount}</button>
    </div>
  );
};

const WaterBill = ({ onNav, onBack, t }) => {
  const [loading,setLoading] = useState(true);
  const [water,setWater]     = useState(null);
  useEffect(()=>{ api.getWater().then(w=>{ setWater(w); setLoading(false); }); },[]);
  if(loading) return <div style={{ padding:40,textAlign:"center" }}><Spinner/></div>;
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:640,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("mWater")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>{t("billPeriod")} {water.period}</p>
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",overflow:"hidden",marginBottom:20 }}>
        <div style={{ background:"#0277BD",padding:"20px 24px",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:11,color:"rgba(255,255,255,.6)",letterSpacing:1 }}>WATER BILL · Jal Jeevan Mission</div>
            <div style={{ fontSize:18,fontWeight:700,marginTop:4 }}>{water.consumerName}</div>
          </div>
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
      <button onClick={()=>onNav("pay-water")} className="btn" style={{ width:"100%",background:"#0277BD",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700 }}>{t("payNow")} · {water.billAmount}</button>
    </div>
  );
};

const CertificateService = ({ title, icon, desc, fields, onBack, t }) => {
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

  if(submitted) return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:500,margin:"0 auto",textAlign:"center" }}>
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40 }}>
        <div style={{ fontSize:56,marginBottom:16 }}>{icon}</div>
        <h2 style={{ fontSize:22,fontWeight:800,color:"var(--navy)",marginBottom:8 }}>Application Submitted!</h2>
        <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>Your application has been received and is under review.</p>
        <div style={{ background:"var(--g50)",borderRadius:"var(--r-sm)",padding:20,marginBottom:24 }}>
          <div style={{ fontSize:12,color:"var(--g400)",marginBottom:6 }}>APPLICATION REFERENCE</div>
          <div style={{ fontSize:22,fontWeight:800,fontFamily:"'Space Mono',monospace",color:"var(--navy)" }}>{refId}</div>
          <div style={{ fontSize:12,color:"var(--g400)",marginTop:8 }}>Processing time: 5–7 working days</div>
        </div>
        <button onClick={()=>setSubmitted(false)} className="btn" style={{ width:"100%",background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:15,fontWeight:700 }}>{t("back")}</button>
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
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",padding:28,display:"flex",flexDirection:"column",gap:18 }}>
        {fields.map(f=>(
          <div key={f.key}>
            <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5,display:"block",marginBottom:6 }}>{f.label.toUpperCase()} {f.req?"*":""}</label>
            {f.type==="select"?(
              <select value={form[f.key]||""} onChange={e=>setForm({...form,[f.key]:e.target.value})} style={{ width:"100%",padding:"13px 16px",borderRadius:"var(--r-sm)",border:"1.5px solid var(--g200)",fontSize:14,color:"var(--navy)",background:"#fff",minHeight:50 }}>
                <option value="">Select…</option>
                {f.options.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            ):(
              <input type={f.type||"text"} value={form[f.key]||""} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.placeholder||""} style={{ width:"100%",padding:"13px 16px",borderRadius:"var(--r-sm)",border:"1.5px solid var(--g200)",fontSize:14,color:"var(--navy)",outline:"none",minHeight:50 }}/>
            )}
          </div>
        ))}
        <button onClick={submit} disabled={loading} className="btn" style={{ background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700 }}>
          {loading?<Spinner/>:"Submit Application →"}
        </button>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// 12. HEALTH SERVICES  (full features)
// ───────────────────────────────────────────────────────────────────────────
const Health = ({ onNav, onBack, t }) => {
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

const Vaccination = ({ onBack, t }) => {
  const [selected,setSelected] = useState(null);
  const [loading,setLoading]   = useState(false);
  const [done,setDone]         = useState(null);

  const book = async () => {
    if(!selected) return;
    setLoading(true);
    const r = await api.bookVacc(selected);
    setDone(r); setLoading(false);
  };

  if(done) return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:500,margin:"0 auto",textAlign:"center" }}>
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40 }}>
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
        <div style={{ display:"flex",gap:12 }}>
          <button className="btn" style={{ flex:1,background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"12px",fontSize:14,fontWeight:600 }}>{t("dlPdf")}</button>
          <button className="btn" style={{ flex:1,background:"var(--g50)",color:"var(--navy)",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"12px",fontSize:14,fontWeight:600 }}>{t("printRec")}</button>
        </div>
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
          <button key={s.id} onClick={()=>setSelected(s)} style={{ background:selected?.id===s.id?"var(--navy)":"#fff",color:selected?.id===s.id?"#fff":"var(--navy)",border:`2px solid ${selected?.id===s.id?"var(--navy)":"var(--g100)"}`,borderRadius:"var(--r-md)",padding:"18px 22px",textAlign:"left",boxShadow:"var(--sh-sm)",minHeight:80 }}>
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
      <button onClick={book} disabled={loading||!selected} className="btn" style={{ width:"100%",background:!selected?"var(--g200)":"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"18px",fontSize:17,fontWeight:700 }}>
        {loading?<Spinner/>:t("bookSlot")}
      </button>
    </div>
  );
};

const AyushmanCard = ({ onBack, t }) => {
  const [form,setForm] = useState({ name:"",aadhaar:"",income:"",file:null });
  const [loading,setLoading] = useState(false);
  const [done,setDone] = useState(null);

  const submit = async () => {
    if(!form.name||!form.aadhaar) return;
    setLoading(true);
    const r = await api.applyCard();
    setDone(r); setLoading(false);
  };

  if(done) return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:500,margin:"0 auto",textAlign:"center" }}>
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40 }}>
        <div style={{ fontSize:56,marginBottom:16 }}>🏥</div>
        <h2 style={{ fontSize:22,fontWeight:800,color:"var(--green)",marginBottom:8 }}>{t("cardSuccess")}</h2>
        <p style={{ fontSize:14,color:"var(--g400)",marginBottom:24 }}>{t("cardMsg")}</p>
        <div style={{ background:"var(--g50)",borderRadius:"var(--r-sm)",padding:20,marginBottom:24 }}>
          <div style={{ fontSize:12,color:"var(--g400)",marginBottom:6 }}>{t("appRefId")}</div>
          <div style={{ fontSize:22,fontWeight:800,fontFamily:"'Space Mono',monospace",color:"var(--navy)" }}>{done.appId}</div>
        </div>
        <button onClick={()=>setDone(null)} className="btn" style={{ width:"100%",background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:15,fontWeight:700 }}>{t("back")}</button>
      </div>
    </div>
  );

  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:600,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("cardApply")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:24 }}>{t("cardApplyDesc")}</p>
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",padding:28,display:"flex",flexDirection:"column",gap:18 }}>
        {[["Full Name","name","text","Enter full name as in Aadhaar"],["Aadhaar Number","aadhaar","tel","12-digit Aadhaar number"],["Annual Income","income","text","Annual household income"]].map(([lbl,key,type,ph])=>(
          <div key={key}>
            <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5,display:"block",marginBottom:6 }}>{lbl.toUpperCase()} *</label>
            <input type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={ph} maxLength={key==="aadhaar"?12:100} style={{ width:"100%",padding:"13px 16px",borderRadius:"var(--r-sm)",border:"1.5px solid var(--g200)",fontSize:14,color:"var(--navy)",outline:"none",minHeight:50,fontFamily:key==="aadhaar"?"'Space Mono',monospace":"inherit",letterSpacing:key==="aadhaar"?3:0 }}/>
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
        <button onClick={submit} disabled={loading||!form.name||!form.aadhaar} className="btn" style={{ background:(!form.name||!form.aadhaar)?"var(--g200)":"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700 }}>
          {loading?<Spinner/>:t("applyNow")}
        </button>
      </div>
    </div>
  );
};

const MentalHealth = ({ onBack, t }) => (
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
        <div key={c.title} style={{ background:"#fff",borderRadius:"var(--r-md)",boxShadow:"var(--sh-sm)",padding:"20px 24px",display:"flex",alignItems:"center",gap:16,borderLeft:"4px solid #6A1B9A" }}>
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

const MedStoreLocator = ({ onBack, t }) => {
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
          <div key={s.name} style={{ background:"#fff",borderRadius:"var(--r-md)",boxShadow:"var(--sh-sm)",padding:"20px 24px",borderLeft:"4px solid var(--teal)" }}>
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

const AmbulanceScreen = ({ onBack, t }) => (
  <div className="fi" style={{ padding:"24px 20px",maxWidth:580,margin:"0 auto" }}>
    <BBtn onBack={onBack} t={t}/>
    <div style={{ background:"var(--red)",borderRadius:"var(--r-md)",padding:"20px 24px",color:"#fff",marginBottom:24 }}>
      <h2 style={{ fontSize:22,fontWeight:800,marginBottom:4 }}>🚑 {t("hAmb")}</h2>
      <p style={{ fontSize:13,opacity:.85 }}>EMRI 108 – Free emergency ambulance service for all</p>
    </div>
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
      {[["108","Free Ambulance (EMRI)","#C62828"],["102","Janani Shishu Raksha (Maternal)","#AD1457"],["1099","Road Accident","#E65100"],["112","National Emergency","#1565C0"]].map(([num,desc,color])=>(
        <div key={num} style={{ background:"#fff",borderRadius:"var(--r-md)",boxShadow:"var(--sh-sm)",padding:20,borderLeft:`4px solid ${color}` }}>
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

const LabTest = ({ onBack, t }) => {
  const labs = [
    { dept:"Pathology",    tests:["CBC","Blood Sugar","Lipid Profile","LFT","KFT"],wait:"24 hours" },
    { dept:"Radiology",    tests:["X-Ray","Ultrasound","ECG","Echocardiography"],wait:"Same day" },
    { dept:"Microbiology", tests:["Urine Routine","Sputum Culture","Widal Test"],wait:"48–72 hours" },
  ];
  const [sel,setSel] = useState(null);
  const [done,setDone] = useState(false);
  const [loading,setLoading] = useState(false);

  const book = () => { if(!sel) return; setLoading(true); setTimeout(()=>{ setLoading(false); setDone(true); },1200); };

  if(done) return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:480,margin:"0 auto",textAlign:"center" }}>
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40 }}>
        <div style={{ fontSize:56,marginBottom:16 }}>🔬</div>
        <h2 style={{ fontSize:22,fontWeight:800,color:"var(--green)",marginBottom:8 }}>Lab Test Booked!</h2>
        <p style={{ fontSize:14,color:"var(--g400)",marginBottom:24 }}>Visit the lab counter with this slip. Report with Aadhaar card.</p>
        <div style={{ background:"var(--g50)",borderRadius:"var(--r-sm)",padding:20,marginBottom:24 }}>
          <div style={{ fontSize:12,color:"var(--g400)",marginBottom:6 }}>BOOKING REFERENCE</div>
          <div style={{ fontSize:22,fontWeight:800,fontFamily:"'Space Mono',monospace",color:"var(--navy)" }}>LAB-2025-{~~(Math.random()*9000)+1000}</div>
          <div style={{ fontSize:12,color:"var(--g400)",marginTop:8 }}>Report available in: {sel?.wait}</div>
        </div>
        <button onClick={()=>{ setSel(null); setDone(false); }} className="btn" style={{ width:"100%",background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:15,fontWeight:700 }}>{t("back")}</button>
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
          <button key={l.dept} onClick={()=>setSel(l)} style={{ background:sel?.dept===l.dept?"var(--navy)":"#fff",color:sel?.dept===l.dept?"#fff":"var(--navy)",border:`2px solid ${sel?.dept===l.dept?"var(--navy)":"var(--g100)"}`,borderRadius:"var(--r-md)",padding:"18px 22px",textAlign:"left",boxShadow:"var(--sh-sm)",minHeight:80 }}>
            <div style={{ fontWeight:700,fontSize:15,marginBottom:6 }}>🔬 {l.dept}</div>
            <div style={{ fontSize:13,opacity:.75 }}>{l.tests.join(" · ")}</div>
            <div style={{ fontSize:12,marginTop:6,opacity:.65 }}>Report: {l.wait}</div>
          </button>
        ))}
      </div>
      <button onClick={book} disabled={loading||!sel} className="btn" style={{ width:"100%",background:!sel?"var(--g200)":"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"18px",fontSize:17,fontWeight:700 }}>
        {loading?<Spinner/>:"Book Lab Test →"}
      </button>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// 13. COMPLAINT  (generic – reused across departments)
// ───────────────────────────────────────────────────────────────────────────
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

  if(ticketId) return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:500,margin:"0 auto",textAlign:"center" }}>
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-lg)",padding:40 }}>
        <div style={{ fontSize:56,marginBottom:16 }}>📋</div>
        <h2 style={{ fontSize:22,fontWeight:800,color:"var(--navy)",marginBottom:8 }}>{t("compDone")}</h2>
        <p style={{ fontSize:14,color:"var(--g400)",marginBottom:24 }}>{t("compDoneMsg")}</p>
        <div style={{ background:"var(--g50)",borderRadius:"var(--r-sm)",padding:20,marginBottom:24 }}>
          <div style={{ fontSize:12,color:"var(--g400)",marginBottom:6 }}>{t("ticketId")}</div>
          <div style={{ fontSize:24,fontWeight:800,fontFamily:"'Space Mono',monospace",color:"var(--navy)" }}>{ticketId}</div>
          <div style={{ fontSize:12,color:"var(--g400)",marginTop:8 }}>{t("resolution")}</div>
        </div>
        <button onClick={()=>setTicketId(null)} className="btn" style={{ width:"100%",background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:15,fontWeight:700 }}>{t("fileAnother")}</button>
      </div>
    </div>
  );

  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:640,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <h2 style={{ fontSize:22,fontWeight:700,marginBottom:4 }}>{t("compTitle")}</h2>
      <p style={{ fontSize:13,color:"var(--g400)",marginBottom:28 }}>{t("compSubtitle")}</p>
      <div style={{ background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-md)",padding:28,display:"flex",flexDirection:"column",gap:20 }}>
        <div>
          <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5,display:"block",marginBottom:8 }}>{t("deptLbl")}</label>
          <select value={form.dept} onChange={e=>setForm({...form,dept:e.target.value,type:""})} style={{ width:"100%",padding:"13px 16px",borderRadius:"var(--r-sm)",border:"1.5px solid var(--g200)",fontSize:14,color:"var(--navy)",background:"#fff",minHeight:50 }}>
            <option value="">{t("selDept")}</option>
            {depts.map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5,display:"block",marginBottom:8 }}>{t("compTypeLbl")}</label>
          <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} disabled={!form.dept} style={{ width:"100%",padding:"13px 16px",borderRadius:"var(--r-sm)",border:"1.5px solid var(--g200)",fontSize:14,color:"var(--navy)",background:!form.dept?"var(--g50)":"#fff",minHeight:50 }}>
            <option value="">{t("selType")}</option>
            {typeList.map(tp=><option key={tp} value={tp}>{tp}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize:12,fontWeight:600,color:"var(--g600)",letterSpacing:.5,display:"block",marginBottom:8 }}>{t("descLbl")}</label>
          <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder={t("descPh")} rows={4} style={{ width:"100%",padding:"13px 16px",borderRadius:"var(--r-sm)",border:"1.5px solid var(--g200)",fontSize:14,color:"var(--navy)",resize:"vertical",minHeight:100 }}/>
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
        <button onClick={submit} disabled={loading||!form.dept||!form.type||!form.desc} className="btn" style={{ background:(!form.dept||!form.type||!form.desc)?"var(--g200)":"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"16px",fontSize:16,fontWeight:700 }}>
          {loading?<Spinner/>:t("submitComp")}
        </button>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// 14. EMERGENCY SERVICES
// ───────────────────────────────────────────────────────────────────────────
const Emergency = ({ onBack, t }) => {
  const contacts = [
    { icon:"🚒", name:"Fire Brigade",        number:"101", color:"#FF5722" },
    { icon:"🚔", name:"Police",              number:"100", color:"#1565C0" },
    { icon:"🚑", name:"Ambulance (EMRI)",    number:"108", color:"#C62828" },
    { icon:"⚡", name:"Power Emergency",     number:"1912",color:"#F57C00" },
    { icon:"💧", name:"Water Emergency",     number:"1916",color:"#0277BD" },
    { icon:"☎️", name:"Civic Helpline",      number:"155304",color:"#2E7D32" },
    { icon:"👩‍👧", name:"Women Helpline",     number:"1091",color:"#AD1457" },
    { icon:"🌊", name:"Disaster Mgmt",       number:"1077",color:"#37474F" },
  ];
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:700,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <div style={{ background:"var(--red)",borderRadius:"var(--r-md)",padding:"20px 24px",marginBottom:24,color:"#fff" }}>
        <h2 style={{ fontSize:22,fontWeight:800,marginBottom:4 }}>🚨 {t("emergTitle")}</h2>
        <p style={{ fontSize:13,opacity:.85 }}>{t("emergWarn")}</p>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        {contacts.map(c=>(
          <div key={c.name} style={{ background:"#fff",borderRadius:"var(--r-md)",boxShadow:"var(--sh-sm)",padding:20,borderLeft:`4px solid ${c.color}` }}>
            <div style={{ fontSize:32,marginBottom:8 }}>{c.icon}</div>
            <div style={{ fontWeight:700,fontSize:14,color:"var(--navy)" }}>{c.name}</div>
            <div style={{ fontFamily:"'Space Mono',monospace",fontSize:22,fontWeight:800,color:c.color,marginTop:6 }}>{c.number}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// 15. ADMIN DASHBOARD
// ───────────────────────────────────────────────────────────────────────────
const Admin = ({ onBack, t }) => {
  const [ann,setAnn]   = useState("");
  const [alert,setAlert] = useState("Scheduled maintenance: Sector 12 water supply off on 16 Mar 2025, 10AM–2PM");
  const stats = [
    { lk:"statSessions",  val:MOCK_ADMIN_STATS.sessions,     icon:"🖥️", color:"var(--navy)" },
    { lk:"statTxns",      val:MOCK_ADMIN_STATS.transactions,  icon:"💳", color:"var(--teal)" },
    { lk:"statComps",     val:MOCK_ADMIN_STATS.complaints,    icon:"📋", color:"#E65100"    },
    { lk:"statRev",       val:MOCK_ADMIN_STATS.revenue,       icon:"💰", color:"var(--green)"},
  ];
  return (
    <div className="fi" style={{ padding:"24px 20px",maxWidth:900,margin:"0 auto" }}>
      <BBtn onBack={onBack} t={t}/>
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:28 }}>
        <div style={{ background:"var(--navy)",color:"#fff",borderRadius:"var(--r-sm)",padding:"8px 14px",fontSize:11,fontWeight:700,letterSpacing:1 }}>{t("adminBadge")}</div>
        <h2 style={{ fontSize:22,fontWeight:700 }}>{t("adminTitle")}</h2>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28 }}>
        {stats.map(s=>(
          <div key={s.lk} style={{ background:"#fff",borderRadius:"var(--r-md)",padding:20,boxShadow:"var(--sh-sm)",borderLeft:`4px solid ${s.color}` }}>
            <div style={{ fontSize:24,marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:24,fontWeight:800,color:s.color,fontFamily:"'Space Mono',monospace" }}>{s.val}</div>
            <div style={{ fontSize:11,color:"var(--g400)",marginTop:4 }}>{t(s.lk)}</div>
          </div>
        ))}
      </div>
      {/* Emergency control */}
      <div style={{ background:"#fff",borderRadius:"var(--r-md)",boxShadow:"var(--sh-sm)",padding:24,marginBottom:24 }}>
        <h3 style={{ fontSize:15,fontWeight:700,marginBottom:4 }}>🚨 {t("emergCtrl")}</h3>
        <p style={{ fontSize:12,color:"var(--g400)",marginBottom:14 }}>{t("curAlert")} <strong style={{ color:"var(--red)" }}>{alert||t("noneActive")}</strong></p>
        <div style={{ display:"flex",gap:12 }}>
          <input value={ann} onChange={e=>setAnn(e.target.value)} placeholder={t("announcePh")} style={{ flex:1,padding:"12px 16px",borderRadius:"var(--r-sm)",border:"1.5px solid var(--g200)",fontSize:14 }}/>
          <button onClick={()=>{ setAlert(ann); setAnn(""); }} className="btn" style={{ background:"var(--red)",color:"#fff",borderRadius:"var(--r-sm)",padding:"12px 20px",fontSize:14,fontWeight:700 }}>{t("broadcast")}</button>
          <button onClick={()=>setAlert("")} className="btn" style={{ background:"var(--g50)",color:"var(--g600)",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"12px 20px",fontSize:14,fontWeight:600 }}>{t("clearAlert")}</button>
        </div>
      </div>
      {/* Log table */}
      <div style={{ background:"#fff",borderRadius:"var(--r-md)",boxShadow:"var(--sh-sm)",overflow:"hidden" }}>
        <div style={{ padding:"16px 20px",borderBottom:"1px solid var(--g100)",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <h3 style={{ fontSize:15,fontWeight:700 }}>{t("liveLog")}</h3>
          <span style={{ width:8,height:8,borderRadius:"50%",background:"#4CAF50",display:"inline-block",animation:"pulse 2s infinite" }}/>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
            <thead>
              <tr style={{ background:"var(--g50)" }}>
                {["Time","Kiosk","Event","User"].map(h=>(
                  <th key={h} style={{ padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:"var(--g400)",letterSpacing:.5,textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_LOGS.map((l,i)=>(
                <tr key={i} style={{ borderBottom:"1px solid var(--g100)" }}>
                  <td style={{ padding:"12px 16px",fontFamily:"'Space Mono',monospace",fontSize:12,color:"var(--g600)" }}>{l.time}</td>
                  <td style={{ padding:"12px 16px",color:"var(--teal)",fontWeight:600 }}>{l.kiosk}</td>
                  <td style={{ padding:"12px 16px",color:"var(--navy)" }}>{l.event}</td>
                  <td style={{ padding:"12px 16px",fontFamily:"'Space Mono',monospace",fontSize:12,color:"var(--g400)" }}>{l.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// 16. AI CHATBOT
// ───────────────────────────────────────────────────────────────────────────
const Chatbot = ({ onClose, t }) => {
  const [msgs,setMsgs]     = useState([{ role:"bot",text:"Namaste! 🙏 I'm SUVIDHA Assistant. How can I help you today?" }]);
  const [input,setInput]   = useState("");
  const [listening,setLis] = useState(false);
  const endRef             = useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs]);

  const get = (text) => {
    const t2 = text.toLowerCase();
    if(t2.includes("bill")||t2.includes("electric")) return BOT_RESPONSES.bill;
    if(t2.includes("complaint")||t2.includes("report")) return BOT_RESPONSES.complaint;
    if(t2.includes("pay")) return BOT_RESPONSES.payment;
    if(t2.includes("help")) return BOT_RESPONSES.help;
    return BOT_RESPONSES.default;
  };
  const send = (text) => {
    if(!text.trim()) return;
    setMsgs(m=>[...m,{role:"user",text}]); setInput("");
    setTimeout(()=>setMsgs(m=>[...m,{role:"bot",text:get(text)}]),800);
  };

  const BOT_RESPONSES = { bill:"Please select Electricity Services → View Bill.", complaint:"Go to the relevant department and choose 'Register Complaint'.", payment:"Your payment is processed through an RBI-approved encrypted gateway.", help:"I can help with: Bills, Payments, Complaints, and Service Info.", default:"I'm here to assist. Please type or select a service from the dashboard." };
  const suggestions = ["View my bill","Register complaint","Payment help","Emergency numbers"];

  return (
    <div style={{ position:"fixed",bottom:90,right:20,width:360,background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"0 12px 48px rgba(10,47,90,.22)",display:"flex",flexDirection:"column",zIndex:10000,border:"1.5px solid var(--g100)",overflow:"hidden" }}>
      <div style={{ background:"var(--navy)",padding:"14px 18px",color:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:20 }}>🤖</span>
          <div><div style={{ fontWeight:700,fontSize:14 }}>SUVIDHA Assistant</div><div style={{ fontSize:10,color:"rgba(255,255,255,.6)" }}>AI-Powered Civic Guide</div></div>
        </div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,.1)",color:"#fff",borderRadius:6,width:30,height:30,fontSize:16 }}>×</button>
      </div>
      <div style={{ padding:14,overflowY:"auto",flex:1,maxHeight:290,display:"flex",flexDirection:"column",gap:10 }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"80%",padding:"10px 14px",borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.role==="user"?"var(--navy)":"var(--g50)",color:m.role==="user"?"#fff":"var(--navy)",fontSize:13,lineHeight:1.5,boxShadow:"var(--sh-sm)" }}>
              {m.text}
              {m.role==="bot"&&<button style={{ display:"block",marginTop:6,background:"none",color:"var(--teal)",fontSize:11,fontWeight:600 }}>🔊 Play</button>}
            </div>
          </div>
        ))}
        <div ref={endRef}/>
      </div>
      <div style={{ padding:"8px 14px",borderTop:"1px solid var(--g100)",display:"flex",gap:6,flexWrap:"wrap" }}>
        {suggestions.map(s=><button key={s} onClick={()=>send(s)} style={{ background:"var(--g50)",border:"1px solid var(--g200)",borderRadius:20,padding:"4px 10px",fontSize:11,color:"var(--g600)",minHeight:28 }}>{s}</button>)}
      </div>
      <div style={{ padding:"10px 14px",borderTop:"1px solid var(--g100)",display:"flex",gap:8,alignItems:"center" }}>
        <button onClick={()=>setLis(!listening)} style={{ width:38,height:38,borderRadius:"50%",background:listening?"var(--red)":"var(--g50)",border:`1.5px solid ${listening?"var(--red)":"var(--g200)"}`,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",color:listening?"#fff":"var(--g400)",animation:listening?"pulse 1s infinite":"none" }}>🎤</button>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)} placeholder="Type your query…" style={{ flex:1,border:"1.5px solid var(--g200)",borderRadius:20,padding:"9px 14px",fontSize:13,outline:"none" }}/>
        <button onClick={()=>send(input)} style={{ width:38,height:38,borderRadius:"50%",background:"var(--teal)",color:"#fff",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>→</button>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// 17. SESSION TIMEOUT MODAL
// ───────────────────────────────────────────────────────────────────────────
const TimeoutModal = ({ onContinue, onLogout, t }) => (
  <div style={{ position:"fixed",inset:0,background:"rgba(10,47,90,.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99999 }}>
    <div style={{ background:"#fff",borderRadius:"var(--r-lg)",padding:40,maxWidth:400,textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,.3)" }}>
      <div style={{ fontSize:48,marginBottom:16 }}>⏱️</div>
      <h3 style={{ fontSize:20,fontWeight:700,marginBottom:8 }}>{t("timeoutTitle")}</h3>
      <p style={{ fontSize:14,color:"var(--g400)",marginBottom:28 }}>{t("timeoutMsg")}</p>
      <div style={{ display:"flex",gap:12 }}>
        <button onClick={onLogout} className="btn" style={{ flex:1,background:"var(--g50)",color:"var(--g600)",border:"1.5px solid var(--g200)",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:600 }}>{t("logout")}</button>
        <button onClick={onContinue} className="btn" style={{ flex:1,background:"var(--teal)",color:"#fff",borderRadius:"var(--r-sm)",padding:"14px",fontSize:14,fontWeight:700 }}>{t("continueSess")}</button>
      </div>
    </div>
  </div>
);

// ───────────────────────────────────────────────────────────────────────────
// 18. ROOT APP
// ───────────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]       = useState("welcome");
  const [user,setUser]           = useState(null);
  const [lang,setLang]           = useState("en");
  const [chatOpen,setChatOpen]   = useState(false);
  const [hc,setHc]               = useState(false);
  const [lg,setLg]               = useState(false);
  const [sessionTime,setSessTime]= useState(180);
  const [showTimeout,setShowTO]  = useState(false);
  const [emergMsg,setEmergMsg]   = useState("Scheduled maintenance: Sector 12 water supply off on 16 Mar 2025, 10AM–2PM");
  const [payCtx,setPayCtx]       = useState({ amount:"₹0.00", returnTo:"dashboard" });

  const t = useT(lang);

  // Session timer
  useEffect(()=>{
    if(!user) return;
    if(sessionTime<=0){ doLogout(); return; }
    if(sessionTime===30) setShowTO(true);
    const id = setTimeout(()=>setSessTime(s=>s-1),1000);
    return ()=>clearTimeout(id);
  },[sessionTime,user]);

  const resetSess = useCallback(()=>{ if(user){ setSessTime(180); setShowTO(false); } },[user]);
  useEffect(()=>{
    window.addEventListener("click",resetSess);
    window.addEventListener("keydown",resetSess);
    return ()=>{ window.removeEventListener("click",resetSess); window.removeEventListener("keydown",resetSess); };
  },[resetSess]);

  useEffect(()=>{ document.body.classList.toggle("hc",hc); document.body.classList.toggle("lg",lg); },[hc,lg]);

  const doLogout = () => { localStorage.removeItem("suvidha_jwt"); setUser(null); setScreen("welcome"); setSessTime(180); setShowTO(false); };
  const doLogin  = (r) => { localStorage.setItem("suvidha_jwt",r.token); setUser(r); setScreen("dashboard"); };
  const nav      = (s) => setScreen(s);

  // Pay helper – sets amount & return screen, then navigates to gateway
  const goPayment = (amount, returnTo) => { setPayCtx({ amount, returnTo }); nav("payment"); };

  const noHeader = ["welcome"].includes(screen);

  return (
    <>
      <style>{CSS}</style>
      {/* Emergency banner – driven by Admin dashboard */}
      {emergMsg&&<div style={{ background:"#C62828",color:"#fff",padding:"10px 20px",display:"flex",alignItems:"center",gap:10,fontSize:14,fontWeight:600,borderBottom:"2px solid #B71C1C",zIndex:9999 }}>⚠️ EMERGENCY ALERT: {emergMsg}</div>}

      {/* Header */}
      {!noHeader&&(
        <header style={{ background:"var(--navy)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",height:64,boxShadow:"0 2px 12px rgba(0,0,0,.2)",position:"sticky",top:0,zIndex:1000 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:40,height:40,borderRadius:8,background:"linear-gradient(135deg,#00897B,#00ACC1)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,color:"#fff" }}>S</div>
            <div>
              <div style={{ fontWeight:700,fontSize:15,letterSpacing:.5 }}>{t("appName")}</div>
              <div style={{ fontSize:10,color:"rgba(255,255,255,.6)",letterSpacing:.5 }}>{t("appSub")}</div>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            {user&&<div style={{ fontSize:12,color:"rgba(255,255,255,.7)",marginRight:8 }}>👤 {user.user?.name?.split(" ")[0]}</div>}
            <button onClick={()=>setLg(!lg)} style={{ background:lg?"var(--teal)":"rgba(255,255,255,.1)",color:"#fff",border:"1px solid rgba(255,255,255,.2)",borderRadius:6,padding:"6px 10px",fontSize:12,minHeight:34 }}>Aₐ</button>
            <button onClick={()=>setHc(!hc)} style={{ background:hc?"var(--teal)":"rgba(255,255,255,.1)",color:"#fff",border:"1px solid rgba(255,255,255,.2)",borderRadius:6,padding:"6px 10px",fontSize:12,minHeight:34 }}>◑</button>
            {user&&<button onClick={doLogout} style={{ background:"rgba(198,40,40,.8)",color:"#fff",borderRadius:6,padding:"6px 14px",fontSize:12,fontWeight:600,minHeight:34 }}>{t("logout")}</button>}
          </div>
        </header>
      )}

      {/* SCREENS */}
      <main>
        {screen==="welcome"    && <Welcome onStart={(l)=>{ setLang(l); nav("login"); }}/>}
        {screen==="login"      && <Login   onLogin={doLogin} onBack={()=>nav("welcome")} t={t}/>}
        {screen==="dashboard"  && user && <Dashboard user={user} onNav={nav} sessionTime={sessionTime} t={t}/>}

        {/* Electricity */}
        {screen==="electricity" && <Electricity onNav={nav} onBack={()=>nav("dashboard")} t={t}/>}
        {screen==="elec-bill"   && <ElecBill    onNav={(s)=>{ if(s==="pay-elec") goPayment("₹1,248.00","electricity"); else nav(s); }} onBack={()=>nav("electricity")} t={t}/>}
        {screen==="elec-pay"    && <ElecBill    onNav={(s)=>{ if(s==="pay-elec") goPayment("₹1,248.00","electricity"); else nav(s); }} onBack={()=>nav("electricity")} t={t}/>}
        {screen==="new-conn"    && <CertificateService title="New Electricity Connection" icon="🔌" desc="Apply for new domestic/commercial connection" onBack={()=>nav("electricity")} t={t} fields={[{key:"name",label:"Applicant Name",req:true},{key:"addr",label:"Service Address",req:true},{key:"load",label:"Required Load (kW)",req:true},{key:"type",label:"Connection Type",type:"select",options:["Domestic","Commercial","Agricultural","Industrial"]}]}/>}

        {/* Gas */}
        {screen==="gas"         && <Gas         onNav={nav} onBack={()=>nav("dashboard")} t={t}/>}
        {screen==="gas-book"    && <GasBook     onNav={nav} onBack={()=>nav("gas")} t={t}/>}
        {screen==="gas-subsidy" && <GasSubsidy  onBack={()=>nav("gas")} t={t}/>}
        {screen==="gas-pay"     && <PayGateway  amount="₹850.00" onSuccess={()=>nav("gas")} onBack={()=>nav("gas")} t={t}/>}
        {screen==="gas-new"     && <CertificateService title="New Gas Connection" icon="🔧" desc="Apply for new domestic LPG connection" onBack={()=>nav("gas")} t={t} fields={[{key:"name",label:"Applicant Name",req:true},{key:"addr",label:"Address",req:true},{key:"aadhaar",label:"Aadhaar Number",req:true},{key:"agency",label:"Preferred Agency",type:"select",options:["HP Gas","Bharat Gas","Indane"]}]}/>}

        {/* Municipal */}
        {screen==="municipal"   && <Municipal   onNav={nav} onBack={()=>nav("dashboard")} t={t}/>}
        {screen==="mun-prop"    && <PropertyTax onNav={(s)=>{ if(s==="pay-prop") goPayment("₹8,200.00","municipal"); else nav(s); }} onBack={()=>nav("municipal")} t={t}/>}
        {screen==="mun-water"   && <WaterBill   onNav={(s)=>{ if(s==="pay-water") goPayment("₹340.00","municipal"); else nav(s); }} onBack={()=>nav("municipal")} t={t}/>}
        {screen==="mun-trade"   && <CertificateService title="Trade License" icon="📋" desc="Apply for new trade license or renewal" onBack={()=>nav("municipal")} t={t} fields={[{key:"bname",label:"Business Name",req:true},{key:"btype",label:"Business Type",type:"select",options:["Retail","Wholesale","Food","Service","Manufacturing"]},{key:"addr",label:"Business Address",req:true},{key:"owner",label:"Owner Name",req:true},{key:"pan",label:"PAN Number",req:false}]}/>}
        {screen==="mun-build"   && <CertificateService title="Building Plan Approval" icon="🏗️" desc="Submit building plan for municipal approval" onBack={()=>nav("municipal")} t={t} fields={[{key:"owner",label:"Owner Name",req:true},{key:"plot",label:"Plot Number",req:true},{key:"area",label:"Plot Area (sq ft)",req:true},{key:"floors",label:"Number of Floors",type:"select",options:["G","G+1","G+2","G+3","G+4 and above"]},{key:"use",label:"Use Type",type:"select",options:["Residential","Commercial","Mixed Use"]}]}/>}
        {screen==="mun-birth"   && <CertificateService title="Birth Certificate" icon="👶" desc="Apply for birth certificate" onBack={()=>nav("municipal")} t={t} fields={[{key:"cname",label:"Child's Name",req:true},{key:"dob",label:"Date of Birth",type:"date",req:true},{key:"fname",label:"Father's Name",req:true},{key:"mname",label:"Mother's Name",req:true},{key:"hospital",label:"Hospital / Place of Birth",req:true}]}/>}
        {screen==="mun-death"   && <CertificateService title="Death Certificate" icon="📜" desc="Apply for death certificate" onBack={()=>nav("municipal")} t={t} fields={[{key:"dname",label:"Deceased Name",req:true},{key:"dod",label:"Date of Death",type:"date",req:true},{key:"cause",label:"Cause of Death",req:true},{key:"aname",label:"Applicant Name",req:true},{key:"relation",label:"Relation with Deceased",type:"select",options:["Spouse","Son","Daughter","Father","Mother","Sibling","Other"]}]}/>}

        {/* Health */}
        {screen==="health"        && <Health     onNav={nav} onBack={()=>nav("dashboard")} t={t}/>}
        {screen==="health-vacc"   && <Vaccination onBack={()=>nav("health")} t={t}/>}
        {screen==="health-card"   && <AyushmanCard onBack={()=>nav("health")} t={t}/>}
        {screen==="health-lab"    && <LabTest    onBack={()=>nav("health")} t={t}/>}
        {screen==="health-amb"    && <AmbulanceScreen onBack={()=>nav("health")} t={t}/>}
        {screen==="health-mental" && <MentalHealth onBack={()=>nav("health")} t={t}/>}
        {screen==="health-med"    && <MedStoreLocator onBack={()=>nav("health")} t={t}/>}

        {/* Shared */}
        {screen==="complaint"  && <Complaint onBack={()=>nav("electricity")} t={t}/>}
        {screen==="emergency"  && <Emergency onBack={()=>nav("dashboard")} t={t}/>}
        {screen==="admin"      && <Admin     onBack={()=>nav("dashboard")} t={t}/>}
        {screen==="payment"    && <PayGateway amount={payCtx.amount} onSuccess={()=>nav("dashboard")} onBack={()=>nav(payCtx.returnTo)} t={t}/>}
      </main>

      {/* Chatbot FAB */}
      {user&&(
        <>
          <button onClick={()=>setChatOpen(!chatOpen)} style={{ position:"fixed",bottom:24,right:24,width:60,height:60,borderRadius:"50%",background:chatOpen?"var(--red)":"var(--navy)",color:"#fff",fontSize:chatOpen?24:28,boxShadow:"0 4px 20px rgba(10,47,90,.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,border:"3px solid rgba(255,255,255,.2)" }}>
            {chatOpen?"×":"🤖"}
          </button>
          {chatOpen&&<Chatbot onClose={()=>setChatOpen(false)} t={t}/>}
        </>
      )}

      {/* Timeout modal */}
      {showTimeout&&<TimeoutModal onContinue={()=>{ setSessTime(180); setShowTO(false); }} onLogout={doLogout} t={t}/>}

      {/* Footer */}
      {!noHeader&&(
        <footer style={{ background:"var(--navy-dk)",color:"rgba(255,255,255,.4)",padding:"12px 24px",fontSize:10,letterSpacing:.5,display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid rgba(255,255,255,.05)" }}>
          <span>{t("footerL")}</span>
          <span>{t("footerR")}</span>
        </footer>
      )}
    </>
  );
}

