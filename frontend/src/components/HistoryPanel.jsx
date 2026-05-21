import React, { useState, useEffect } from "react";
import { History, Trash2, Calendar, AlertTriangle } from "lucide-react";

export default function HistoryPanel({ modelData, user }) {
  const [history, setHistory] = useState([]);
  
  const historyKey = user && user.email ? `devburn_history_${user.email}` : "";

  // Load history records from localStorage on mount or user change
  useEffect(() => {
    if (historyKey) {
      const records = JSON.parse(localStorage.getItem(historyKey) || "[]");
      setHistory(records);
    }
  }, [historyKey]);

  function clearHistory() {
    if (window.confirm("Are you sure you want to permanently clear your assessment history?")) {
      localStorage.removeItem(historyKey);
      setHistory([]);
    }
  }

  function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (!user) {
    return (
      <div className="empty-state" style={{
        background: 'rgba(15, 18, 30, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'rgba(248, 113, 113, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px',
        }}>
          <AlertTriangle size={20} style={{ color: '#f87171' }} />
        </div>
        <span style={{ color: '#94a3b8' }}>Authentication required to view prediction history.</span>
      </div>
    );
  }

  return (
    <div className="stack animate-fade-in">
      <section className="panel" style={{
        background: 'rgba(15, 18, 30, 0.6)',
        backdropFilter: 'blur(20px)',
      }}>
        <div className="panel-heading">
          <div>
            <h2 style={{ color: '#e2e8f0' }}>Assessment History</h2>
            <span style={{ color: '#64748b' }}>Logged in as: {user.email}</span>
          </div>
          {history.length > 0 && (
            <button
              className="secondary"
              onClick={clearHistory}
              style={{
                color: '#f87171',
                borderColor: 'rgba(248, 113, 113, 0.2)',
                background: 'rgba(248, 113, 113, 0.06)',
              }}
            >
              <Trash2 size={15} />
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-state" style={{
            background: 'rgba(15, 18, 30, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              border: '1px solid rgba(129, 140, 248, 0.1)',
            }}>
              <History size={26} style={{ color: '#818cf8' }} />
            </div>
            <h3 style={{ margin: '0 0 6px', color: '#e2e8f0', fontSize: '16px' }}>No past assessments found</h3>
            <p style={{ marginTop: 4, color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>
              Take your first burnout risk assessment in the Prediction tab to start tracking your mental wellbeing.
            </p>
          </div>
        ) : (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Risk Score</th>
                  <th>Risk Level</th>
                  <th>Daily Coding</th>
                  <th>Stress/Frustration</th>
                  <th>Work Mode</th>
                  <th>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <span className="flex-center" style={{ fontSize: "12px", color: "#94a3b8" }}>
                        <Calendar size={13} style={{ color: "#64748b" }} />
                        {formatDate(record.timestamp)}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: "16px", color: '#e2e8f0' }}>{record.score}%</strong>
                    </td>
                    <td>
                      <span className={`badge ${record.risk_level.toLowerCase()}`}>
                        {record.risk_level}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "13px", color: "#cbd5e1" }}>{record.inputs?.coding_hours || 0} hrs/day</span>
                    </td>
                    <td>
                      <span style={{ fontSize: "13px", color: "#cbd5e1" }}>
                        {record.inputs?.stress_level || 0} / {record.inputs?.frustration_score || 0}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "13px", color: "#cbd5e1" }}>{record.inputs?.work_mode || "Hybrid"}</span>
                    </td>
                    <td style={{ maxWidth: "250px" }}>
                      <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: "1.4" }}>
                        {record.recommendation}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
