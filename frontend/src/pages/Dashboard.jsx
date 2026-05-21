import React from "react";
import PredictionPanel from "../components/PredictionPanel";
import AnalyticsPanel from "../components/AnalyticsPanel";
import ModelsPanel from "../components/ModelsPanel";
import HistoryPanel from "../components/HistoryPanel";
import AwarenessPanel from "../components/AwarenessPanel";

export default function Dashboard({ activeView, modelData, analytics, loading, user }) {
  if (loading && !modelData) return (
    <div className="loading" style={{
      minHeight: '340px',
      background: 'rgba(15, 18, 30, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '16px',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(236, 72, 153, 0.1))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'pulse 2s ease-in-out infinite',
        boxShadow: '0 0 30px rgba(99, 102, 241, 0.15)',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 2s linear infinite' }}>
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
      <span style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 600 }}>Training models and loading dashboards...</span>
      <div style={{
        display: 'flex',
        gap: '6px',
        marginTop: '4px',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#818cf8',
            opacity: 0.4,
            animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );

  if (!modelData || !analytics) return (
    <div className="loading" style={{
      minHeight: '340px',
      background: 'rgba(15, 18, 30, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '16px',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '14px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <span style={{ color: '#64748b', fontSize: '15px', fontWeight: 600 }}>No model artifacts available yet.</span>
      <span style={{ color: '#475569', fontSize: '13px' }}>Run a training session to generate predictions.</span>
    </div>
  );

  if (activeView === "analytics") return <AnalyticsPanel analytics={analytics} />;
  if (activeView === "models") return <ModelsPanel modelData={modelData} />;
  if (activeView === "history") return <HistoryPanel modelData={modelData} user={user} />;
  if (activeView === "awareness") return <AwarenessPanel />;
  return <PredictionPanel modelData={modelData} analytics={analytics} user={user} />;
}
