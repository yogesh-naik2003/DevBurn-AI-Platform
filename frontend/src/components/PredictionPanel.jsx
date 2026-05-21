import React, { useState } from "react";
import { Gauge, Send, AlertTriangle } from "lucide-react";
import { api } from "../api/client";

export default function PredictionPanel({ modelData, analytics, user }) {
  // Define states for our rich PRD developer inputs
  const [form, setForm] = useState({
    Gender: "Male",
    "Company Type": "Product",
    work_mode: "Hybrid", // maps to WFH Setup Available (Hybrid/Remote -> Yes, On-site -> No)
    Designation: 2, // Designation/Job Level (0 to 5)
    coding_hours: 6, // maps to Resource Allocation (clamped 1 to 10)
    stress_level: 5, // used to compute Mental Fatigue Score
    frustration_score: 4, // used to compute Mental Fatigue Score
    experience_years: 2, // maps to Tenure Days (years * 365)
    sleep_hours: 7, // informative, also adjusts stress
    caffeine_cups: 2, // informative
    meetings_day: 3 // informative
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper to map PRD inputs to Model features
  function mapInputsToFeatures(inputs) {
    const wfh_setup = inputs.work_mode === "On-site" ? "No" : "Yes";
    const resource_alloc = Math.min(10, Math.max(1, inputs.coding_hours));
    
    // Calculate Mental Fatigue Score from Stress & Frustration, with sleep adjustment
    let fatigue = (Number(inputs.stress_level) + Number(inputs.frustration_score)) / 2;
    if (inputs.sleep_hours < 6) {
      fatigue = Math.min(10, fatigue + 1.0); // lack of sleep increases fatigue
    } else if (inputs.sleep_hours >= 8) {
      fatigue = Math.max(0, fatigue - 0.5); // good sleep reduces fatigue
    }
    
    const tenure_days = Math.max(30, inputs.experience_years * 365);

    // Return the exact 7 features the pipeline expects
    return {
      Gender: inputs.Gender,
      "Company Type": inputs["Company Type"] || "Product",
      "WFH Setup Available": wfh_setup,
      Designation: Number(inputs.Designation),
      "Resource Allocation": Number(resource_alloc),
      "Mental Fatigue Score": Number(fatigue),
      "Tenure Days": Number(tenure_days)
    };
  }

  // Helper to determine the risk level and recommendation as per PRD
  function getRiskAndRecommendation(burnRate) {
    const score = Math.round(burnRate * 100);
    let risk = "Low";
    let rec = "Maintain healthy work balance.";
    
    if (score >= 81) {
      risk = "Critical";
      rec = "Seek professional wellness support.";
    } else if (score >= 61) {
      risk = "High";
      rec = "Take structured breaks and reduce workload.";
    } else if (score >= 31) {
      risk = "Moderate";
      rec = "Reduce overtime and improve sleep.";
    }
    
    return { score, risk, rec };
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setPrediction(null);
    setLoading(true);
    try {
      // Map inputs to model features
      const mappedPayload = mapInputsToFeatures(form);
      
      // Request prediction from Flask API
      const result = await api("/predict", { 
        method: "POST", 
        body: JSON.stringify(mappedPayload) 
      });
      
      // Parse risk and recommendations based on PRD
      const { score, risk, rec } = getRiskAndRecommendation(result.burn_rate);
      
      const predictionResult = {
        burn_rate: result.burn_rate,
        percentage_score: score,
        risk_level: risk,
        recommendation: rec,
        model: result.model || modelData.best_model,
        all_predictions: result.all_predictions || {}
      };

      setPrediction(predictionResult);

      // Save prediction to local history for this specific user
      if (user && user.email) {
        const historyKey = `devburn_history_${user.email}`;
        const existingHistory = JSON.parse(localStorage.getItem(historyKey) || "[]");
        const newRecord = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          score: score,
          risk_level: risk,
          recommendation: rec,
          inputs: { ...form }
        };
        localStorage.setItem(historyKey, JSON.stringify([newRecord, ...existingHistory]));
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Color feedback for sliders
  function getSliderColor(value) {
    if (value <= 3) return '#34d399';
    if (value <= 6) return '#fbbf24';
    if (value <= 8) return '#f472b6';
    return '#f87171';
  }

  function getSliderGlow(value) {
    if (value <= 3) return 'rgba(52, 211, 153, 0.4)';
    if (value <= 6) return 'rgba(251, 191, 36, 0.4)';
    if (value <= 8) return 'rgba(244, 114, 182, 0.4)';
    return 'rgba(248, 113, 113, 0.4)';
  }

  return (
    <div className="grid two animate-fade-in">
      {/* Prediction Form Panel */}
      <section className="panel" style={{
        background: 'rgba(15, 18, 30, 0.6)',
        backdropFilter: 'blur(20px)',
      }}>
        <div className="panel-heading">
          <h2 style={{ color: '#e2e8f0' }}>Prediction Dashboard</h2>
          <span style={{
            color: '#818cf8',
            background: 'rgba(99, 102, 241, 0.1)',
            padding: '4px 10px',
            borderRadius: '8px',
            border: '1px solid rgba(129, 140, 248, 0.15)',
            fontSize: '12px',
            fontWeight: 700,
          }}>Best model: {modelData.best_model}</span>
        </div>
        <form className="prediction-form" onSubmit={submit}>
          <label>
            Gender
            <select 
              value={form.Gender} 
              onChange={(e) => setForm({ ...form, Gender: e.target.value })}
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </label>

          <label>
            Company Type
            <select 
              value={form["Company Type"]} 
              onChange={(e) => setForm({ ...form, "Company Type": e.target.value })}
            >
              <option>Product</option>
              <option>Service</option>
            </select>
          </label>

          <label>
            Work Mode
            <select 
              value={form.work_mode} 
              onChange={(e) => setForm({ ...form, work_mode: e.target.value })}
            >
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>
          </label>

          <label>
            Job Designation (0 - 5)
            <input
              type="number"
              min="0"
              max="5"
              value={form.Designation}
              onChange={(e) => setForm({ ...form, Designation: Number(e.target.value) })}
            />
          </label>

          <label>
            Daily Coding Hours (1 - 12)
            <input
              type="number"
              min="1"
              max="12"
              value={form.coding_hours}
              onChange={(e) => setForm({ ...form, coding_hours: Number(e.target.value) })}
            />
          </label>

          <label>
            Experience (Years)
            <input
              type="number"
              min="0"
              max="40"
              value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: Number(e.target.value) })}
            />
          </label>

          <label>
            Sleep Hours (1 - 12)
            <input
              type="number"
              min="1"
              max="12"
              value={form.sleep_hours}
              onChange={(e) => setForm({ ...form, sleep_hours: Number(e.target.value) })}
            />
          </label>

          <label>
            Caffeine Intake (Cups/day)
            <input
              type="number"
              min="0"
              max="10"
              value={form.caffeine_cups}
              onChange={(e) => setForm({ ...form, caffeine_cups: Number(e.target.value) })}
            />
          </label>

          <label>
            Daily Meetings
            <input
              type="number"
              min="0"
              max="20"
              value={form.meetings_day}
              onChange={(e) => setForm({ ...form, meetings_day: Number(e.target.value) })}
            />
          </label>

          <label>
            Mental Stress Level (0 - 10)
            <input
              type="range"
              min="0"
              max="10"
              value={form.stress_level}
              onChange={(e) => setForm({ ...form, stress_level: Number(e.target.value) })}
              className="slider"
              style={{
                background: `linear-gradient(90deg, ${getSliderColor(form.stress_level)} ${form.stress_level * 10}%, rgba(255,255,255,0.06) ${form.stress_level * 10}%)`,
              }}
            />
            <span className="slider-value" style={{ color: getSliderColor(form.stress_level) }}>
              Value: {form.stress_level}/10
            </span>
          </label>

          <label>
            Frustration Score (0 - 10)
            <input
              type="range"
              min="0"
              max="10"
              value={form.frustration_score}
              onChange={(e) => setForm({ ...form, frustration_score: Number(e.target.value) })}
              className="slider"
              style={{
                background: `linear-gradient(90deg, ${getSliderColor(form.frustration_score)} ${form.frustration_score * 10}%, rgba(255,255,255,0.06) ${form.frustration_score * 10}%)`,
              }}
            />
            <span className="slider-value" style={{ color: getSliderColor(form.frustration_score) }}>
              Value: {form.frustration_score}/10
            </span>
          </label>

          {error && <div className="alert compact">{error}</div>}
          <button className="primary" disabled={loading}>
            <Send size={16} />
            {loading ? "Calculating Risk..." : "Predict Burnout"}
          </button>
        </form>
      </section>

      {/* Risk Score Result Panel */}
      <section className="panel result-panel" style={{
        background: 'rgba(15, 18, 30, 0.6)',
        backdropFilter: 'blur(20px)',
      }}>
        <div className="panel-heading">
          <h2 style={{ color: '#e2e8f0' }}>Risk Score</h2>
          <Gauge size={22} style={{ color: '#64748b' }} />
        </div>
        {prediction ? (
          <>
            <div className={`risk-meter ${prediction.risk_level.toLowerCase()}`}>
              <strong>{prediction.percentage_score}%</strong>
              <span>{prediction.risk_level} Risk</span>
            </div>
            <div className={`recommendations border-${prediction.risk_level.toLowerCase()}`}>
              <h3 className="flex-center" style={{ color: '#e2e8f0' }}>
                <AlertTriangle size={16} style={{ color: '#fbbf24' }} />
                Recommended Intervention
              </h3>
              <p>{prediction.recommendation}</p>
            </div>
            
            {prediction.all_predictions && Object.keys(prediction.all_predictions).length > 0 && (
              <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                <span style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>
                  All Model Predictions
                </span>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {Object.entries(prediction.all_predictions).map(([name, val]) => (
                    <div key={name} style={{
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      fontSize: '13px',
                      border: '1px solid rgba(255, 255, 255, 0.04)'
                    }}>
                      <span style={{ color: '#cbd5e1' }}>{name} {name === prediction.model && "⭐ (Selected)"}</span>
                      <strong style={{ color: name === prediction.model ? '#818cf8' : '#e2e8f0' }}>{Math.round(val * 100)}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state" style={{
            background: 'rgba(15, 18, 30, 0.4)',
            borderColor: 'rgba(255, 255, 255, 0.06)',
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}>
              <Gauge size={22} style={{ color: '#818cf8' }} />
            </div>
            <span style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
              Submit developer work signals to generate an accurate burnout risk estimate and get wellness recommendations.
            </span>
          </div>
        )}
        <div className="kpi-row">
          <div>
            <span>Dataset Average</span>
            <strong style={{ color: '#22d3ee' }}>{Math.round(analytics.average_burn_rate * 100)}%</strong>
          </div>
          <div>
            <span>High-Risk Share</span>
            <strong style={{ color: '#f472b6' }}>{Math.round(analytics.high_risk_share * 100)}%</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
