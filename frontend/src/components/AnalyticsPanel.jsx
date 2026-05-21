import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Legend
} from "recharts";

// Dark glass tooltip style constant
const darkTooltipStyle = {
  background: 'rgba(15,18,30,0.95)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#e2e8f0',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
};

export default function AnalyticsPanel({ analytics }) {
  const gender = analytics.burn_rate_by_gender || [];
  const company = analytics.burn_rate_by_company_type || [];
  const wfh = analytics.burn_rate_by_wfh || [];
  const designation = analytics.burn_rate_by_designation || [];
  const resource = analytics.burn_rate_by_resource_allocation || [];
  const correlations = analytics.correlations || [];

  return (
    <div className="stack animate-fade-in">
      {/* 1. Real Dataset Overview KPIs */}
      <section className="kpi-grid">
        <div className="kpi" style={{ borderLeft: '3px solid #818cf8' }}>
          <span>Average Burn Rate</span>
          <strong style={{ color: '#818cf8' }}>{(analytics.average_burn_rate * 100).toFixed(1)}%</strong>
          <small style={{ color: "#64748b", marginTop: 4, display: "block" }}>
            22,750 Employee Average
          </small>
        </div>
        <div className="kpi" style={{ borderLeft: '3px solid #22d3ee' }}>
          <span>Median Burn Rate</span>
          <strong style={{ color: '#22d3ee' }}>{(analytics.median_burn_rate * 100).toFixed(1)}%</strong>
          <small style={{ color: "#64748b", marginTop: 4, display: "block" }}>
            Central Tendency
          </small>
        </div>
        <div className="kpi" style={{ borderLeft: '3px solid #f472b6' }}>
          <span>High-Risk Employees</span>
          <strong style={{ color: '#f472b6' }}>{(analytics.high_risk_share * 100).toFixed(1)}%</strong>
          <small style={{ color: "#f87171", marginTop: 4, display: "block", fontWeight: "bold" }}>
            Burn Rate &ge; 65%
          </small>
        </div>
      </section>

      {/* 2. Workload & Job Rank Impact */}
      <div className="grid two">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Burnout by Workload (Resource Allocation)</h2>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Average burn rate vs relative workload (1-10 hours/tasks)</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={resource} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="Resource Allocation" stroke="#475569" fontSize={12} tick={{ fill: '#94a3b8' }} />
              <YAxis
                stroke="#475569"
                fontSize={12}
                tick={{ fill: '#94a3b8' }}
                tickFormatter={(value) => `${Math.round(value * 100)}%`}
              />
              <Tooltip
                formatter={(value) => [`${(value * 100).toFixed(1)}%`, "Average Burn Rate"]}
                labelFormatter={(label) => `Workload: ${label}/10`}
                contentStyle={darkTooltipStyle}
              />
              <Line
                type="monotone"
                dataKey="average_burn_rate"
                stroke="#22d3ee"
                strokeWidth={3}
                activeDot={{ r: 6, fill: '#22d3ee', stroke: 'rgba(34, 211, 238, 0.3)', strokeWidth: 6 }}
                dot={{ r: 4, fill: '#22d3ee', stroke: 'rgba(34, 211, 238, 0.3)', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Burnout by Designation (Job Rank)</h2>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Average burn rate vs employee seniority/job level (0-5)</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={designation} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="Designation" stroke="#475569" fontSize={12} tick={{ fill: '#94a3b8' }} />
              <YAxis
                stroke="#475569"
                fontSize={12}
                tick={{ fill: '#94a3b8' }}
                tickFormatter={(value) => `${Math.round(value * 100)}%`}
              />
              <Tooltip
                formatter={(value) => [`${(value * 100).toFixed(1)}%`, "Average Burn Rate"]}
                labelFormatter={(label) => `Job Designation Level: ${label}`}
                contentStyle={darkTooltipStyle}
              />
              <Bar
                dataKey="average_burn_rate"
                fill="#f472b6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* 3. WFH, Gender & Company Structure */}
      <div className="grid two">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Burnout by WFH Setup</h2>
              <span style={{ fontSize: "12px", color: "#64748b" }}>How WFH availability reduces burnout rates</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={wfh} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="WFH Setup Available" stroke="#475569" fontSize={12} tick={{ fill: '#94a3b8' }} />
              <YAxis
                stroke="#475569"
                fontSize={12}
                tick={{ fill: '#94a3b8' }}
                tickFormatter={(value) => `${Math.round(value * 100)}%`}
              />
              <Tooltip
                formatter={(value) => [`${(value * 100).toFixed(1)}%`, "Average Burn Rate"]}
                contentStyle={darkTooltipStyle}
              />
              <Bar dataKey="average_burn_rate" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Gender & Company Comparison</h2>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Burnout rate distribution across segments</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", height: "200px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center" }}>
              <strong style={{ fontSize: "14px", color: "#94a3b8" }}>By Gender:</strong>
              {gender.map((g) => (
                <div key={g.Gender} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  transition: 'all 0.2s ease',
                }}>
                  <span style={{ fontWeight: 600, color: "#cbd5e1" }}>{g.Gender}</span>
                  <span style={{ color: "#22d3ee", fontWeight: "bold" }}>{(g.average_burn_rate * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center" }}>
              <strong style={{ fontSize: "14px", color: "#94a3b8" }}>By Company:</strong>
              {company.map((c) => (
                <div key={c["Company Type"]} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  transition: 'all 0.2s ease',
                }}>
                  <span style={{ fontWeight: 600, color: "#cbd5e1" }}>{c["Company Type"]}</span>
                  <span style={{ color: "#34d399", fontWeight: "bold" }}>{(c.average_burn_rate * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 4. Pearson Correlation Matrix */}
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2> Pearson Feature Correlations</h2>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Linear relationship strength with employee burn rate (higher = more influence)</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={correlations} layout="vertical" margin={{ left: 50, right: 24, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.06)" />
            <XAxis type="number" stroke="#475569" domain={[0, 1]} tick={{ fill: '#94a3b8' }} />
            <YAxis type="category" dataKey="feature" stroke="#475569" width={140} fontSize={12} tick={{ fill: '#94a3b8' }} />
            <Tooltip
              formatter={(value) => [value.toFixed(3), "Pearson Correlation Coefficient"]}
              contentStyle={darkTooltipStyle}
            />
            <Bar dataKey="correlation" fill="#818cf8" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
