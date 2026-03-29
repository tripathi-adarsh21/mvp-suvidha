/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { getStorage, setStorage } from '../../utils/storage';

// ═══════════════════════════════════════════════════════════════════════════
// ACCESSIBILITY CONTROLS v3.0
// Enhanced Design: Visual text size slider + Premium dark mode toggle
// Persisted in localStorage, dark mode auto-detects system preference
// ═══════════════════════════════════════════════════════════════════════════

const FONT_STEPS = [
  { value: 85,  label: 'S',  desc: 'Small' },
  { value: 100, label: 'M',  desc: 'Medium' },
  { value: 118, label: 'L',  desc: 'Large' },
  { value: 135, label: 'XL', desc: 'Extra Large' },
];

const AccessibilityControls = ({ t }) => {
  const [dark, setDark] = useState(() => {
    const saved = getStorage('dark_mode');
    if (saved !== null) return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  });

  const [fontIdx, setFontIdx] = useState(() => {
    const saved = getStorage('font_scale_idx');
    return saved !== null ? saved : 1; // default 100% (Medium)
  });

  const [showPanel, setShowPanel] = useState(false);

  // Apply dark mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    setStorage('dark_mode', dark);
  }, [dark]);

  // Apply font scale
  useEffect(() => {
    const scale = FONT_STEPS[fontIdx]?.value || 100;
    document.documentElement.style.setProperty('--font-scale', `${scale}%`);
    document.body.style.zoom = `${scale}%`;
    setStorage('font_scale_idx', fontIdx);
  }, [fontIdx]);

  // Listen for system preference changes
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const handler = (e) => {
      const saved = getStorage('dark_mode');
      if (saved === null) setDark(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Close panel on outside click
  useEffect(() => {
    if (!showPanel) return;
    const handler = (e) => {
      if (!e.target.closest('[data-accessibility-panel]')) {
        setShowPanel(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showPanel]);

  const containerBtn = {
    background: "rgba(255,255,255,.1)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,.2)",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 13,
    minHeight: 36,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all .2s ease",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontWeight: 600,
  };

  return (
    <div style={{ position: "relative" }} data-accessibility-panel>
      {/* Trigger button */}
      <button
        onClick={(e) => { e.stopPropagation(); setShowPanel(!showPanel); }}
        style={{
          ...containerBtn,
          background: showPanel ? "var(--teal)" : "rgba(255,255,255,.1)",
          boxShadow: showPanel ? "0 2px 12px rgba(0,137,123,0.3)" : "none",
        }}
        title="Accessibility Settings"
        aria-label="Accessibility Settings"
        aria-expanded={showPanel}
      >
        <span style={{ fontSize: 15 }}>⚙️</span>
        <span style={{ fontSize: 11 }}>Aa</span>
      </button>

      {/* Dropdown Panel */}
      {showPanel && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "var(--card-bg, #fff)",
            borderRadius: 16,
            boxShadow: "0 12px 48px rgba(10,47,90,.25), 0 0 0 1px rgba(0,0,0,.06)",
            padding: 20,
            width: 280,
            zIndex: 10001,
            animation: "fadeIn 0.2s ease",
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ 
            fontSize: 13, fontWeight: 700, color: "var(--navy)", 
            marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
            paddingBottom: 12, borderBottom: "1px solid var(--g100)",
          }}>
            <span style={{ fontSize: 16 }}>♿</span>
            Accessibility
          </div>

          {/* ── Text Size Section ── */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ 
              fontSize: 11, fontWeight: 600, color: "var(--g400)", 
              letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10,
            }}>
              {t("textSizeIncrease")?.replace("Increase ", "") || "Text Size"}
            </div>
            
            {/* Size selector buttons */}
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {FONT_STEPS.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setFontIdx(i)}
                  title={step.desc}
                  aria-label={`${step.desc} text size`}
                  style={{
                    flex: 1,
                    padding: "10px 4px",
                    borderRadius: 10,
                    border: `2px solid ${fontIdx === i ? "var(--teal)" : "var(--g100)"}`,
                    background: fontIdx === i ? "var(--teal-lt)" : "var(--g50)",
                    color: fontIdx === i ? "var(--teal)" : "var(--g600)",
                    fontWeight: fontIdx === i ? 700 : 500,
                    fontSize: 10 + i * 3,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all .15s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{step.label}</span>
                  <span style={{ fontSize: 9, opacity: 0.7 }}>{step.value}%</span>
                </button>
              ))}
            </div>

            {/* Visual progress bar */}
            <div style={{ 
              display: "flex", gap: 3, alignItems: "center",
              padding: "6px 0",
            }}>
              <span style={{ fontSize: 11, color: "var(--g400)" }}>A</span>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: "var(--g100)", position: "relative", overflow: "hidden" }}>
                <div style={{ 
                  height: "100%", borderRadius: 2, 
                  background: "linear-gradient(90deg, var(--teal), #00ACC1)",
                  width: `${((fontIdx + 1) / FONT_STEPS.length) * 100}%`,
                  transition: "width 0.2s ease",
                }} />
              </div>
              <span style={{ fontSize: 15, color: "var(--g400)", fontWeight: 700 }}>A</span>
            </div>
          </div>

          {/* ── Dark Mode Section ── */}
          <div>
            <div style={{ 
              fontSize: 11, fontWeight: 600, color: "var(--g400)", 
              letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10,
            }}>
              {t("darkMode") || "Display Mode"}
            </div>
            
            <button
              onClick={() => setDark(d => !d)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "2px solid var(--g100)",
                background: dark 
                  ? "linear-gradient(135deg, #1a1a2e, #16213e)" 
                  : "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all .2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ 
                  fontSize: 22,
                  filter: dark ? "none" : "grayscale(0.3)",
                  transition: "all 0.3s ease",
                }}>
                  {dark ? "🌙" : "☀️"}
                </span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ 
                    fontSize: 13, fontWeight: 700, 
                    color: dark ? "#e0e0e0" : "#333",
                  }}>
                    {dark ? (t("darkMode") || "Dark Mode") : (t("lightMode") || "Light Mode")}
                  </div>
                  <div style={{ 
                    fontSize: 10, 
                    color: dark ? "#888" : "#888",
                    marginTop: 1,
                  }}>
                    {dark ? "Easy on the eyes" : "Bright & clear"}
                  </div>
                </div>
              </div>
              
              {/* Toggle switch */}
              <div style={{ 
                width: 46, height: 24, borderRadius: 12, 
                background: dark ? "var(--teal)" : "var(--g200)",
                position: "relative", transition: "background .2s ease",
                boxShadow: dark ? "0 0 8px rgba(0,137,123,0.4)" : "inset 0 1px 3px rgba(0,0,0,0.1)",
              }}>
                <span style={{ 
                  position: "absolute", top: 2, 
                  left: dark ? 24 : 2, 
                  width: 20, height: 20, borderRadius: "50%", 
                  background: "#fff", transition: "left .2s ease",
                  boxShadow: "0 1px 4px rgba(0,0,0,.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10,
                }}>
                  {dark ? "🌙" : "☀️"}
                </span>
              </div>
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={() => { setFontIdx(1); setDark(false); }}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: 14,
              borderRadius: 8,
              border: "1px solid var(--g100)",
              background: "transparent",
              color: "var(--g400)",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all .15s ease",
            }}
          >
            ↺ Reset to defaults
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessibilityControls;
