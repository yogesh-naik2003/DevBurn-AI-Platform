import React, { useState } from "react";
import { Heart, Activity, ShieldCheck, Brain, LockKeyhole, UserPlus, Mail, KeyRound, User } from "lucide-react";
import { api } from "../api/client";

/* ── Inline keyframes & premium dark-mode styles ── */
const styleSheet = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

@keyframes auth-float-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}
@keyframes auth-float-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 30px) scale(1.15); }
  66% { transform: translate(25px, -40px) scale(0.85); }
}
@keyframes auth-float-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, 40px) scale(1.08); }
}
@keyframes auth-gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes auth-slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes auth-slide-right {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes auth-glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3), 0 0 60px rgba(99, 102, 241, 0.1); }
  50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.5), 0 0 80px rgba(99, 102, 241, 0.2); }
}
@keyframes auth-icon-glow {
  0%, 100% { filter: drop-shadow(0 0 6px currentColor); }
  50% { filter: drop-shadow(0 0 14px currentColor); }
}
@keyframes auth-border-rotate {
  0% { --angle: 0deg; }
  100% { --angle: 360deg; }
}
@keyframes auth-spin {
  to { transform: rotate(360deg); }
}
@keyframes auth-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
`;

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "admin@example.com", password: "admin123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const session = await api(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      onAuth(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ── Shared style tokens ── */
  const c = {
    bg: "#0a0e1a",
    surface: "rgba(255,255,255,0.04)",
    surfaceHover: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.08)",
    borderHover: "rgba(255,255,255,0.14)",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    textDim: "#64748b",
    accent: "#818cf8",
    accentPink: "#ec4899",
    accentCyan: "#22d3ee",
    gradientPrimary: "linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #06b6d4 100%)",
    gradientButton: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
    gradientBorder: "linear-gradient(135deg, rgba(99,102,241,0.5), rgba(236,72,153,0.3), rgba(6,182,212,0.5))",
    glass: "rgba(15, 23, 42, 0.6)",
    glassCard: "rgba(15, 23, 42, 0.45)",
    radius: "16px",
    radiusSm: "12px",
    radiusXs: "8px",
    font: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
  };

  /* ── Styles ── */
  const styles = {
    pageRoot: {
      position: "relative",
      display: "grid",
      placeItems: "center",
      minHeight: "100vh",
      padding: "24px",
      background: `radial-gradient(ellipse 80% 60% at 20% 40%, rgba(99,102,241,0.15), transparent),
                    radial-gradient(ellipse 60% 50% at 80% 20%, rgba(236,72,153,0.12), transparent),
                    radial-gradient(ellipse 50% 40% at 60% 80%, rgba(6,182,212,0.08), transparent),
                    ${c.bg}`,
      fontFamily: c.font,
      color: c.text,
      overflow: "hidden",
    },

    /* Floating orbs (background decoration) */
    orb: (size, color, top, left, animName, duration) => ({
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      top,
      left,
      filter: "blur(60px)",
      opacity: 0.5,
      animation: `${animName} ${duration}s ease-in-out infinite`,
      pointerEvents: "none",
      zIndex: 0,
    }),

    panel: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) 420px",
      gap: "48px",
      alignItems: "center",
      width: "min(1060px, 100%)",
      zIndex: 1,
    },

    /* ─── LEFT SIDE ─── */
    copySection: {
      animation: "auth-slide-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
    },

    brand: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
    },

    brandIcon: {
      animation: "auth-icon-glow 3s ease-in-out infinite",
      color: "#ec4899",
      filter: "drop-shadow(0 0 8px rgba(236,72,153,0.5))",
    },

    brandName: {
      display: "block",
      fontSize: "24px",
      fontWeight: 900,
      background: c.gradientPrimary,
      backgroundSize: "200% 200%",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: "auth-gradient-shift 4s ease infinite",
      lineHeight: 1.1,
    },

    brandSub: {
      display: "block",
      marginTop: "4px",
      color: c.textMuted,
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: "0.02em",
    },

    headline: {
      marginTop: "40px",
      maxWidth: "560px",
      fontSize: "42px",
      fontWeight: 900,
      lineHeight: 1.08,
      letterSpacing: "-0.02em",
      background: "linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 40%, #818cf8 100%)",
      backgroundSize: "200% 200%",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: "auth-gradient-shift 6s ease infinite",
    },

    subtitle: {
      marginTop: "16px",
      maxWidth: "520px",
      fontSize: "16px",
      lineHeight: 1.7,
      color: c.textMuted,
      fontWeight: 400,
    },

    features: {
      display: "grid",
      gap: "12px",
      marginTop: "36px",
    },

    featureCard: (delay) => ({
      display: "flex",
      alignItems: "flex-start",
      gap: "16px",
      padding: "16px 18px",
      background: c.surface,
      border: `1px solid ${c.border}`,
      borderRadius: c.radiusSm,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "default",
      animation: `auth-slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`,
    }),

    featureCardHover: {
      background: c.surfaceHover,
      borderColor: c.borderHover,
      transform: "translateY(-2px)",
    },

    iconWrap: (bg, glow) => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "42px",
      height: "42px",
      borderRadius: "12px",
      background: bg,
      flexShrink: 0,
      boxShadow: `0 0 20px ${glow}`,
      transition: "box-shadow 0.3s ease",
    }),

    featureTitle: {
      margin: "0 0 4px",
      fontSize: "14px",
      fontWeight: 800,
      color: "#f1f5f9",
    },

    featureDesc: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.55,
      color: c.textDim,
    },

    /* ─── RIGHT SIDE (CARD) ─── */
    cardOuter: {
      position: "relative",
      padding: "1px",
      borderRadius: "20px",
      background: c.gradientBorder,
      animation: "auth-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both",
    },

    cardInner: {
      display: "grid",
      gap: "18px",
      padding: "32px 28px",
      borderRadius: "19px",
      background: `linear-gradient(145deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.85) 100%)`,
      backdropFilter: "blur(40px) saturate(1.5)",
      WebkitBackdropFilter: "blur(40px) saturate(1.5)",
      boxShadow: `0 25px 60px rgba(0,0,0,0.4),
                   0 0 80px rgba(99,102,241,0.08),
                   inset 0 1px 0 rgba(255,255,255,0.05)`,
    },

    cardHeader: {
      textAlign: "center",
      marginBottom: "4px",
    },

    cardTitle: {
      margin: "0 0 6px",
      fontSize: "22px",
      fontWeight: 900,
      color: "#f8fafc",
      letterSpacing: "-0.01em",
    },

    cardSubtitle: {
      margin: 0,
      fontSize: "13px",
      color: c.textDim,
      fontWeight: 500,
    },

    /* Segmented toggle */
    segmented: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "4px",
      padding: "4px",
      background: "rgba(255,255,255,0.05)",
      borderRadius: c.radiusXs,
      border: `1px solid ${c.border}`,
    },

    segBtn: (active) => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      minHeight: "42px",
      border: "none",
      borderRadius: "6px",
      background: active
        ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))"
        : "transparent",
      color: active ? "#c7d2fe" : c.textDim,
      fontWeight: 700,
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: active
        ? "0 2px 12px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.08)"
        : "none",
      letterSpacing: "0.01em",
    }),

    /* Input group */
    inputGroup: {
      display: "grid",
      gap: "6px",
    },

    inputLabel: {
      fontSize: "12px",
      fontWeight: 700,
      color: c.textMuted,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
    },

    inputWrap: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },

    inputIcon: {
      position: "absolute",
      left: "14px",
      color: c.textDim,
      pointerEvents: "none",
      transition: "color 0.2s ease",
      zIndex: 2,
    },

    input: {
      width: "100%",
      minHeight: "46px",
      padding: "0 14px 0 44px",
      border: `1px solid ${c.border}`,
      borderRadius: c.radiusXs,
      background: "rgba(255,255,255,0.04)",
      color: "#f1f5f9",
      fontSize: "14px",
      fontWeight: 500,
      fontFamily: c.font,
      transition: "all 0.25s ease",
      outline: "none",
    },

    inputFocus: {
      borderColor: "rgba(99,102,241,0.5)",
      background: "rgba(255,255,255,0.06)",
      boxShadow: "0 0 0 3px rgba(99,102,241,0.12), 0 0 20px rgba(99,102,241,0.08)",
    },

    /* Error */
    errorBox: {
      padding: "12px 16px",
      borderRadius: c.radiusXs,
      background: "rgba(239,68,68,0.12)",
      border: "1px solid rgba(239,68,68,0.25)",
      color: "#fca5a5",
      fontSize: "13px",
      fontWeight: 600,
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      animation: "auth-slide-up 0.35s ease both",
    },

    /* Submit button */
    submitBtn: (disabled) => ({
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      minHeight: "48px",
      padding: "0 24px",
      border: "none",
      borderRadius: c.radiusXs,
      background: disabled
        ? "rgba(99,102,241,0.3)"
        : c.gradientButton,
      backgroundSize: "200% 200%",
      color: "#ffffff",
      fontSize: "15px",
      fontWeight: 800,
      fontFamily: c.font,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      opacity: disabled ? 0.7 : 1,
      boxShadow: disabled
        ? "none"
        : "0 4px 20px rgba(99,102,241,0.35), 0 0 40px rgba(99,102,241,0.1)",
      animation: disabled ? "none" : "auth-gradient-shift 3s ease infinite",
      letterSpacing: "0.01em",
    }),

    submitBtnHover: {
      transform: "translateY(-1px)",
      boxShadow: "0 6px 30px rgba(99,102,241,0.5), 0 0 60px rgba(99,102,241,0.15)",
    },

    spinIcon: {
      animation: "auth-spin 1s linear infinite",
    },
  };

  /* ── Hover state helpers ── */
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredSubmit, setHoveredSubmit] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <>
      <style>{styleSheet}</style>
      <main style={styles.pageRoot}>

        {/* ── Animated floating orbs ── */}
        <div style={styles.orb("320px", "rgba(99,102,241,0.35)", "-5%", "-8%", "auth-float-1", 18)} />
        <div style={styles.orb("250px", "rgba(236,72,153,0.25)", "60%", "75%", "auth-float-2", 22)} />
        <div style={styles.orb("200px", "rgba(6,182,212,0.2)", "30%", "50%", "auth-float-3", 15)} />
        <div style={styles.orb("180px", "rgba(139,92,246,0.2)", "80%", "10%", "auth-float-2", 20)} />
        <div style={styles.orb("140px", "rgba(236,72,153,0.15)", "10%", "60%", "auth-float-1", 25)} />

        <section style={styles.panel}>

          {/* ═══════════ LEFT COPY ═══════════ */}
          <div style={styles.copySection}>
            <div style={styles.brand}>
              <Heart size={36} fill="#ec4899" color="#ec4899" style={styles.brandIcon} />
              <div>
                <strong style={styles.brandName}>DevBurn AI</strong>
                <span style={styles.brandSub}>Developer Mental Health Analytics</span>
              </div>
            </div>

            <h1 style={styles.headline}>
              Predict developer burnout before it becomes attrition.
            </h1>

            <p style={styles.subtitle}>
              An advanced machine learning suite comparing <strong style={{ color: "#c7d2fe" }}>Linear Regression</strong>,{" "}
              <strong style={{ color: "#c7d2fe" }}>Random Forest</strong>, and <strong style={{ color: "#c7d2fe" }}>XGBoost</strong> to model employee mental fatigue,
              detect overfitting, and recommend wellness interventions.
            </p>

            <div style={styles.features}>
              {[
                {
                  icon: <Brain size={20} color="#818cf8" />,
                  bg: "rgba(99,102,241,0.12)",
                  glow: "rgba(99,102,241,0.2)",
                  title: "Multi-Model Regression",
                  desc: "Compares baseline linear models with complex non-linear boosted tree ensembles.",
                  delay: 0.3,
                },
                {
                  icon: <Activity size={20} color="#34d399" />,
                  bg: "rgba(16,185,129,0.12)",
                  glow: "rgba(16,185,129,0.2)",
                  title: "Overfitting Analysis",
                  desc: "Rigorous comparisons of Train vs Test metrics to identify generalization loss.",
                  delay: 0.45,
                },
                {
                  icon: <ShieldCheck size={20} color="#fbbf24" />,
                  bg: "rgba(245,158,11,0.12)",
                  glow: "rgba(245,158,11,0.2)",
                  title: "Cognitive Recommendations",
                  desc: "Automated wellness interventions mapped directly to fatigue and workload metrics.",
                  delay: 0.6,
                },
              ].map((f, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.featureCard(f.delay),
                    ...(hoveredFeature === i ? styles.featureCardHover : {}),
                  }}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div style={styles.iconWrap(f.bg, f.glow)}>
                    {f.icon}
                  </div>
                  <div>
                    <h4 style={styles.featureTitle}>{f.title}</h4>
                    <p style={styles.featureDesc}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════ RIGHT CARD ═══════════ */}
          <div style={styles.cardOuter}>
            <form style={styles.cardInner} onSubmit={submit}>

              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Welcome to DevBurn AI</h3>
                <p style={styles.cardSubtitle}>Access your secure analytics workspace</p>
              </div>

              {/* Segmented toggle */}
              <div style={styles.segmented}>
                <button
                  type="button"
                  style={styles.segBtn(mode === "login")}
                  onClick={() => setMode("login")}
                >
                  <LockKeyhole size={15} />
                  Login
                </button>
                <button
                  type="button"
                  style={styles.segBtn(mode === "register")}
                  onClick={() => setMode("register")}
                >
                  <UserPlus size={15} />
                  Register
                </button>
              </div>

              {/* Name field (register only) */}
              {mode === "register" && (
                <div style={{
                  ...styles.inputGroup,
                  animation: "auth-slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
                }}>
                  <span style={styles.inputLabel}>Name</span>
                  <div style={styles.inputWrap}>
                    <User size={16} style={styles.inputIcon} />
                    <input
                      placeholder="Developer Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={{
                        ...styles.input,
                        ...(focusedInput === "name" ? styles.inputFocus : {}),
                      }}
                      onFocus={() => setFocusedInput("name")}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div style={styles.inputGroup}>
                <span style={styles.inputLabel}>Email</span>
                <div style={styles.inputWrap}>
                  <Mail size={16} style={styles.inputIcon} />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    style={{
                      ...styles.input,
                      ...(focusedInput === "email" ? styles.inputFocus : {}),
                    }}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput(null)}
                  />
                </div>
              </div>

              {/* Password field */}
              <div style={styles.inputGroup}>
                <span style={styles.inputLabel}>Password</span>
                <div style={styles.inputWrap}>
                  <KeyRound size={16} style={styles.inputIcon} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    style={{
                      ...styles.input,
                      ...(focusedInput === "password" ? styles.inputFocus : {}),
                    }}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                  />
                </div>
              </div>

              {/* Error display */}
              {error && <div style={styles.errorBox}>{error}</div>}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn(loading),
                  ...(hoveredSubmit && !loading ? styles.submitBtnHover : {}),
                }}
                onMouseEnter={() => setHoveredSubmit(true)}
                onMouseLeave={() => setHoveredSubmit(false)}
              >
                {loading ? (
                  <>
                    <UserPlus size={17} style={styles.spinIcon} />
                    <span>Authenticating…</span>
                  </>
                ) : (
                  <>
                    <LockKeyhole size={17} />
                    <span>{mode === "login" ? "Sign In" : "Register Workspace"}</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </section>
      </main>

      {/* ── Responsive overrides ── */}
      <style>{`
        @media (max-width: 980px) {
          main > section {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 640px) {
          main {
            padding: 16px !important;
          }
          main h1 {
            font-size: 28px !important;
            margin-top: 28px !important;
          }
        }
      `}</style>
    </>
  );
}
