```
███████╗██╗   ██╗██╗   ██╗██╗██████╗ ██╗  ██╗ █████╗
██╔════╝██║   ██║██║   ██║██║██╔══██╗██║  ██║██╔══██╗
███████╗██║   ██║██║   ██║██║██║  ██║███████║███████║
╚════██║██║   ██║╚██╗ ██╔╝██║██║  ██║██╔══██║██╔══██║
███████║╚██████╔╝ ╚████╔╝ ██║██████╔╝██║  ██║██║  ██║
╚══════╝ ╚═════╝   ╚═══╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
```

# SUVIDHA KIOSK v2.0
### Smart Urban Virtual Interactive Digital Helpdesk Assistant

**Unified Touch-Based Civic Services Kiosk Platform**
*C-DAC SUVIDHA Challenge 2026*

*सुविधा · সুবিধা · সুবিধা*

---

## 🎯 Problem Statement

Citizens across India face a fragmented, confusing, and often inaccessible civic services experience — long queues, language barriers, multiple offices for different utilities, and zero digital guidance at the point of need.

> **SUVIDHA solves this** by putting every civic service — electricity, gas, municipal, health, and emergency — into a single, multilingual, touch-optimised kiosk interface that any citizen can use, regardless of technical literacy or language.

---

## 🌟 What Makes SUVIDHA Different

| Problem in Existing Systems | SUVIDHA's Solution |
|---|---|
| Separate portals for each utility | **One unified dashboard** for all 6 civic services |
| Hindi/English only | **4 languages** — English, Hindi, Assamese, Bengali(we can add more regional languages in future update) |
| Not accessible for differently-abled users | **WCAG 2.1 AA compliant** — high contrast, large text, touch targets |
| No guidance for first-time users | **AI Chatbot assistant** with voice guidance toggle |
| Unsecured public kiosks | **OTP login + JWT session + 3-min auto-logout(just for prototype but we can increase time upto 20-25 minutes in the main kiosk)** |
| No emergency visibility | **Live emergency broadcast banner** from Admin portal |

---

## ✨ Features

### 🔐 Secure Authentication
- Mobile OTP-based login — NIC / Aadhaar-ready architecture
- JWT session token stored securely
- **3-minute inactivity auto-logout** with 30-second warning modal
- Session resets on any user interaction (touch / keypress)

### 🏛️ Civic Services — All in One Place

| Service | What Citizens Can Do |
|---|---|
| ⚡ **Electricity** | View bill, pay bill, register complaint, apply for new connection |
| 🔥 **Gas Services** | Book LPG cylinder, check subsidy (DBT), pay gas bill, new connection |
| 🏙️ **Municipal** | Property tax, water bill, trade license, building plan, birth/death certificates |
| 🏥 **Public Health** | Vaccination booking, Ayushman Card application, lab test booking, 108 ambulance, mental health helpline, Jan Aushadhi locator |
| 🚨 **Emergency** | Fire, Police, Ambulance, Disaster — direct numbers + admin-controlled alerts |
| ⚙️ **Admin Portal** | Live stats, activity logs, emergency announcement broadcast |

### 🌐 Multilingual Support (i18n)
- **English** — National
- **हिंदी (Hindi)** — National language
- **অসমীয়া (Assamese)** — North-East India focus
- **বাংলা (Bengali)** — East India coverage

Every single UI string — labels, errors, confirmations, descriptions — is fully translated in all 4 languages. Language selected at the Welcome screen persists across the entire session.

### ♿ Accessibility (WCAG 2.1 AA)
- **High Contrast Mode** — overrides colour scheme for low-vision users
- **Large Text Mode** — 118% font scale toggled globally
- Minimum **52×52px touch targets** on all buttons (kiosk-ready)
- `-webkit-tap-highlight-color: transparent` for clean kiosk UX
- Screen reader and audio guidance toggle on Welcome screen

### 💳 Payment Gateway (RBI-Ready Architecture)
- Supports **UPI / QR Code, Net Banking, Debit Card, Credit Card**
- Processing spinner with "do not press back" guidance
- Full receipt with Transaction ID, timestamp, download PDF + print options
- Encrypted gateway notice on every payment screen

### 🤖 AI Chatbot Assistant
- Floating chatbot (FAB) available on all logged-in screens
- Quick suggestion chips: View bill, Register complaint, Payment help, Emergency numbers
- Keyword-based intent matching
- Voice/mic input toggle (speech-recognition ready)
- Auto-scrolls to latest message

---

## 🛠️ Tech Stack

```
Frontend Framework    →   React 19.2 (Single-file JSX architecture)
Styling               →   CSS3 Custom Properties + Inline JSX styles
Fonts                 →   DM Sans (UI) + Space Mono (IDs, OTP, amounts)
Authentication        →   OTP simulation → JWT token (NIC/OAuth2-ready)
State Management      →   React Hooks (useState, useEffect, useCallback, useRef)
i18n                  →   Custom useT() hook — zero external dependencies
Accessibility         →   WCAG 2.1 AA, ARIA-ready, touch-optimised
Build Tool            →   Create React App (react-scripts 5.0.1)
```

**Zero external UI libraries. Zero CSS frameworks. Pure React.**

---

## 🏗️ Architecture

```
App (Root)
├── Emergency Banner          ← Admin-controlled live alerts
├── Header                    ← Logo · Accessibility toggles · Logout
├── <main> Screen Router      ← Single-page navigation via screen state
│   ├── Welcome               ← Language selector + voice toggle
│   ├── Login                 ← 2-step OTP flow (mobile → OTP)
│   ├── Dashboard             ← 6-service grid + session countdown
│   ├── Electricity           ← Bill · Pay · Complaint · New Connection
│   ├── Gas                   ← Cylinder · Subsidy · Pay · Complaint
│   ├── Municipal             ← Tax · Water · License · Building · Certificates
│   ├── Health                ← Vaccination · Ayushman · Lab · Ambulance · Mental · Med
│   ├── Emergency             ← Direct emergency numbers
│   ├── Admin Portal          ← Stats · Logs · Broadcast control
│   └── PayGateway            ← Shared payment flow (Elec + Gas + Municipal)
├── Chatbot FAB + Panel       ← Floating AI assistant
├── TimeoutModal              ← Session expiry warning
└── Footer                    ← NIC · ISO 27001 · STQC certified display
```

**Shared Reusable Components:** `Spinner` · `Badge` · `BBtn` · `ActionRow` · `PayGateway` · `CertificateService`

---

### Test Login
```
Mobile Number  →  Any valid 10-digit number (e.g. 9876543210)
OTP            →  Any 6 digits (e.g. 123456)
```
*The auth system is mock/simulation — ready to connect to real NIC OTP API.*

---

## 🔐 Security Features

- **JWT simulation** — architecture is NIC/OAuth2-ready for production
- **Session timeout** — 3 minutes of inactivity triggers auto-logout
- **OTP flow** — 2-step verification aligned with Aadhaar OTP pattern
- **No sensitive data persistence** — only session token in localStorage, cleared on logout
- **RBI-compliant payment notice** on every transaction screen
- **STQC Certified** UI display with NIC security notice

---

## 🗺️ Production Integration Points

| Current (Prototype) | Production Ready |
|---|---|
| Mock OTP (any 6 digits) | NIC / Aadhaar OTP API integration |
| Hard-coded mock bill data | Live UPPCL / DISCOMS API |
| Simulated payment (2s delay) | Razorpay / PayU / CCAvenue RBI gateway |
| In-memory complaint ticket | CRM + SLA tracking database |
| Static admin stats | Real-time analytics dashboard |
| Voice toggle (UI stub) | Web Speech API / IVRS integration |

---

## 📋 Compliance & Standards

| Standard | Status |
|---|---|
| WCAG 2.1 AA | ✅ Implemented |
| IT Act 2000 | ✅ Architecture compliant |
| ISO 27001 | ✅ Security design aligned |
| STQC Testing Guidelines | ✅ UI follows guidelines |
| NIC Security Framework | ✅ Auth architecture ready |
| BIS Touch Kiosk Standards | ✅ 52px minimum touch targets |

---

## 👥 Team

| Name | Role | Institution |
|---|---|---|
| [Team Member 1] | Frontend Lead | [Your College/University] |
| [Team Member 2] | UI/UX Designer | [Your College/University] |
| [Team Member 3] | Integration & Testing | [Your College/University] |
| [Team Member 4] | Documentation & QA | [Your College/University] |

**Mentor:** [Mentor Name] — [Department, Institution]

---

## 🏆 Hackathon

**C-DAC SUVIDHA Challenge 2026**
Smart Urban Virtual Interactive Digital Helpdesk Assistant

- **Organised by:** Centre for Development of Advanced Computing (C-DAC), India
- **Under:** Ministry of Electronics & Information Technology (MeitY), Government of India
- **Category:** Smart City · Civic Tech · Digital India

---

## 📄 License

This project was developed exclusively for the **C-DAC SUVIDHA Challenge 2026**.
© 2026 [NeoCortex] — All rights reserved.

---

**Built with ❤️ for Digital India · Smart City Mission**

*"Technology in the hands of every citizen — in their own language."*