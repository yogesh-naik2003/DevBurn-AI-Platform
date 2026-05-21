import React, { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, Brain, LogOut, RefreshCw, ShieldCheck, History, Heart } from "lucide-react";
import { api, clearSession, getToken, getUser, setSession } from "./api/client";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());
  const [view, setView] = useState("predict");
  const [modelData, setModelData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navItems = useMemo(
    () => [
      { id: "predict", label: "Prediction", icon: Brain },
      { id: "history", label: "History", icon: History },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "models", label: "Models", icon: Activity },
      { id: "awareness", label: "Awareness", icon: Heart },
    ],
    []
  );

  async function loadData() {
    if (!getToken()) return;
    setLoading(true);
    setError("");
    try {
      const [models, analyticsData] = await Promise.all([api("/models"), api("/analytics")]);
      setModelData(models);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err.message);
      if (err.message.toLowerCase().includes("token")) handleLogout();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [token]);

  function handleAuth(session) {
    setSession(session);
    setToken(session.token);
    setUser(session.user);
  }

  function handleLogout() {
    clearSession();
    setToken(null);
    setUser(null);
    setModelData(null);
    setAnalytics(null);
  }

  async function retrain() {
    setLoading(true);
    setError("");
    try {
      await api("/train", { method: "POST", body: "{}" });
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) return <AuthPage onAuth={handleAuth} />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        {/* Brand with animated gradient */}
        <div className="brand">
          <Heart size={26} fill="#ec4899" color="#ec4899" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.5))' }} />
          <div>
            <strong>DevBurn AI</strong>
            <span>Developer Mental Wellness</span>
          </div>
        </div>

        {/* Navigation with glass hover effect */}
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={view === item.id ? "active" : ""}
                onClick={() => setView(item.id)}
                title={item.label}
              >
                <Icon size={18} style={view === item.id ? { color: '#818cf8', filter: 'drop-shadow(0 0 6px rgba(129, 140, 248, 0.4))' } : {}} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-block">
            <span style={{ fontWeight: 600, fontSize: '14px' }}>{user?.name || "User"}</span>
            <small>{user?.email}</small>
          </div>
          <button className="icon-text" onClick={handleLogout} style={{ color: '#94a3b8' }}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">
        {/* Elegant topbar with glass effect */}
        <header className="topbar">
          <div>
            <h1>DevBurn AI Platform</h1>
            <p>Regression models, risk scoring, overfitting checks, and wellness recommendations.</p>
          </div>
          <button
            className="secondary"
            onClick={retrain}
            disabled={loading}
            style={{
              borderColor: loading ? 'rgba(129, 140, 248, 0.2)' : 'rgba(255,255,255,0.1)',
              gap: '8px',
            }}
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} style={loading ? { color: '#818cf8' } : {}} />
            Retrain
          </button>
        </header>

        {error && (
          <div className="alert" style={{
            background: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid rgba(248, 113, 113, 0.2)',
            color: '#fca5a5',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
          }}>
            {error}
          </div>
        )}
        <Dashboard
          activeView={view}
          modelData={modelData}
          analytics={analytics}
          loading={loading}
          user={user}
        />
      </main>
    </div>
  );
}
