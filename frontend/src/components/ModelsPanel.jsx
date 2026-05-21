import React, { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, ScatterChart, Scatter, ReferenceLine } from "recharts";

// Dark glass tooltip style
const darkTooltipStyle = {
  background: 'rgba(15,18,30,0.95)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#e2e8f0',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
};

export default function ModelsPanel({ modelData }) {
  const [selectedModel, setSelectedModel] = useState(modelData.best_model);

  const metricRows = Object.entries(modelData.metrics).map(([name, data]) => ({
    name,
    train_rmse: data.train.rmse,
    test_rmse: data.test.rmse,
    test_r2: data.test.r2,
    status: data.overfitting.status,
  }));

  const r2Rows = Object.entries(modelData.metrics).map(([name, data]) => ({
    name,
    train_r2: data.train.r2,
    test_r2: data.test.r2,
  }));

  const currentImportance = modelData.metrics[selectedModel]?.feature_importance || [];
  const scatterData = modelData.metrics[selectedModel]?.scatter_points || [];

  return (
    <div className="stack">
      {/* 1. Model Evaluation Overview */}
      <section className="panel">
        <div className="panel-heading">
          <h2>Model Evaluation Overview</h2>
          <span>{modelData.row_count} rows, target: {modelData.target}</span>
        </div>
        <div className="model-table">
          <div className="table-head">
            <span>Model</span><span>MAE</span><span>MSE</span><span>RMSE</span><span>R²</span><span>Overfit</span>
          </div>
          {Object.entries(modelData.metrics).map(([name, data]) => (
            <div 
              className="table-row" 
              key={name} 
              style={{
                cursor: "pointer",
                background: selectedModel === name ? "rgba(99, 102, 241, 0.08)" : "transparent",
                borderLeft: selectedModel === name ? '2px solid #818cf8' : '2px solid transparent',
              }} 
              onClick={() => setSelectedModel(name)}
            >
              <strong style={{ color: selectedModel === name ? '#818cf8' : '#e2e8f0' }}>
                {name} {name === modelData.best_model && "⭐"}
              </strong>
              <span>{data.test.mae.toFixed(4)}</span>
              <span>{data.test.mse.toFixed(4)}</span>
              <span>{data.test.rmse.toFixed(4)}</span>
              <span>{data.test.r2.toFixed(4)}</span>
              <span className={`badge ${data.overfitting.status}`}>{data.overfitting.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Global Metric Comparisons */}
      <div className="grid two">
        <section className="panel">
          <div className="panel-heading">
            <h2>Train vs Test RMSE</h2>
            <span>Lower is better (Overfitting detection)</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={metricRows}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#475569" />
              <YAxis stroke="#475569" tick={{ fill: '#94a3b8' }} />
              <Tooltip contentStyle={darkTooltipStyle} />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              <Bar dataKey="train_rmse" name="Train RMSE" fill="#818cf8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="test_rmse" name="Test RMSE" fill="#f472b6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2>Train vs Test R²</h2>
            <span>Higher is better (Variance explained)</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={r2Rows}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#475569" />
              <YAxis domain={[0.6, 1.0]} stroke="#475569" tick={{ fill: '#94a3b8' }} />
              <Tooltip contentStyle={darkTooltipStyle} />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              <Bar dataKey="train_r2" name="Train R²" fill="#818cf8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="test_r2" name="Test R²" fill="#22d3ee" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* 3. Deep-Dive Section Selector */}
      <div className="panel" style={{
        borderLeft: "3px solid #818cf8",
        background: 'rgba(15, 18, 30, 0.7)',
      }}>
        <div className="panel-heading" style={{ marginBottom: "12px" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#e2e8f0" }}>Model Inspector & Diagnostics</h2>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "13px" }}>Select a trained regression model to view its specific diagnostics, feature importances, actual vs predicted fits, and residual spreads.</p>
          </div>
        </div>

        {/* Model Selection Pills - Glowing */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "22px", marginTop: "12px" }}>
          {Object.keys(modelData.metrics).map((name) => (
            <button
              key={name}
              onClick={() => setSelectedModel(name)}
              className="flex-center"
              style={{
                padding: "8px 18px",
                minHeight: "38px",
                fontSize: "13px",
                borderRadius: "20px",
                background: selectedModel === name
                  ? "linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(129, 140, 248, 0.15))"
                  : "rgba(255, 255, 255, 0.03)",
                color: selectedModel === name ? "#c4b5fd" : "#94a3b8",
                border: selectedModel === name
                  ? "1px solid rgba(129, 140, 248, 0.3)"
                  : "1px solid rgba(255, 255, 255, 0.06)",
                fontWeight: "700",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: selectedModel === name
                  ? "0 0 20px rgba(99, 102, 241, 0.15), inset 0 0 20px rgba(99, 102, 241, 0.05)"
                  : "none",
                backdropFilter: 'blur(12px)',
              }}
            >
              {name}
              {name === modelData.best_model && (
                <span style={{
                  marginLeft: "6px",
                  fontSize: "9px",
                  background: selectedModel === name ? "rgba(129, 140, 248, 0.3)" : "rgba(99, 102, 241, 0.12)",
                  color: selectedModel === name ? "#e0e7ff" : "#818cf8",
                  padding: "2px 7px",
                  borderRadius: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em"
                }}>
                  Best
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Diagnostics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          {/* Card A: Feature Importance */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "14px",
            padding: "18px",
            transition: 'all 0.3s ease',
          }}>
            <h3 style={{ fontSize: "14px", fontWeight: "800", color: "#e2e8f0", margin: "0 0 14px" }}>
              Feature Importance ({selectedModel})
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={currentImportance.slice(0, 10)} layout="vertical" margin={{ left: 100, right: 10, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" stroke="#475569" tick={{ fill: '#94a3b8' }} />
                <YAxis dataKey="feature" type="category" width={110} tick={{ fontSize: 10, fill: "#94a3b8" }} stroke="#475569" />
                <Tooltip contentStyle={darkTooltipStyle} />
                <Bar dataKey="importance" name="Importance" fill="#a78bfa" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Card B: Actual vs Predicted Scatter */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "14px",
            padding: "18px",
            transition: 'all 0.3s ease',
          }}>
            <h3 style={{ fontSize: "14px", fontWeight: "800", color: "#e2e8f0", margin: "0 0 14px" }}>
              Actual vs. Predicted Plot
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" dataKey="actual" name="Actual Burn Rate" domain={[0.1, 0.9]} tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#475569" />
                <YAxis type="number" dataKey="predicted" name="Predicted Burn Rate" domain={[0.1, 0.9]} tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#475569" />
                <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#475569' }} contentStyle={darkTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Scatter name={`${selectedModel} Fit`} data={scatterData} fill="#22d3ee" opacity={0.8} />
                <ReferenceLine
                  segment={[{ x: 0.1, y: 0.1 }, { x: 0.9, y: 0.9 }]}
                  stroke="#f472b6"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{ value: 'y=x (Ideal)', position: 'insideTopLeft', fill: '#f472b6', fontSize: 10, fontWeight: "bold" }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Card C: Residual Plot */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "14px",
            padding: "18px",
            transition: 'all 0.3s ease',
          }}>
            <h3 style={{ fontSize: "14px", fontWeight: "800", color: "#e2e8f0", margin: "0 0 14px" }}>
              Residuals Plot (Errors vs. Predicted)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" dataKey="predicted" name="Predicted Value" domain={[0.1, 0.9]} tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#475569" />
                <YAxis type="number" dataKey="residual" name="Residual (Actual - Pred)" domain={[-0.2, 0.2]} tick={{ fontSize: 10, fill: '#94a3b8' }} stroke="#475569" />
                <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#475569' }} contentStyle={darkTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Scatter name="Residuals Spread" data={scatterData} fill="#34d399" opacity={0.8} />
                <ReferenceLine
                  y={0}
                  stroke="#64748b"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{ value: 'Zero Residual', position: 'insideBottomRight', fill: '#64748b', fontSize: 10, fontWeight: "bold" }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
