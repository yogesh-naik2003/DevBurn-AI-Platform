import React, { useState, useEffect } from "react";
import { Brain, Heart, BookOpen, Clock, Play, Pause, RotateCcw, AlertCircle, CheckCircle } from "lucide-react";

export default function AwarenessPanel() {
  // Pomodoro Timer State
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished
            setIsActive(false);
            if (isBreak) {
              setMinutes(25);
              setIsBreak(false);
              alert("Break's over! Time to focus!");
            } else {
              setMinutes(5);
              setIsBreak(true);
              alert("Great focus session! Take a 5-minute break.");
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, isBreak]);

  function toggleTimer() {
    setIsActive(!isActive);
  }

  function resetTimer() {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
  }

  return (
    <div className="stack animate-fade-in">
      {/* Hero Section - Dark mode gradient */}
      <section className="panel bg-gradient-awareness" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ padding: "16px 8px", position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: "24px", color: "#e2e8f0", fontWeight: 800 }} className="flex-center">
            <Heart size={24} fill="#ec4899" color="#ec4899" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.5))' }} />
            Developer Wellbeing & Burnout Awareness
          </h2>
          <p style={{ color: "#94a3b8", marginTop: "10px", maxWidth: "800px", fontSize: "15px", lineHeight: "1.7" }}>
            Software development requires intense cognitive focus. Recognizing the signs of mental fatigue early and practicing healthy boundaries is key to sustaining long-term creativity and passion for coding.
          </p>
        </div>
      </section>

      {/* Grid: 3 Pillars & Triggers */}
      <div className="grid two">
        <section className="panel">
          <div className="panel-heading">
            <h2 className="flex-center">
              <Brain size={18} style={{ color: '#818cf8', filter: 'drop-shadow(0 0 6px rgba(129, 140, 248, 0.4))' }} />
              The Three Pillars of Burnout
            </h2>
          </div>
          <div className="awareness-pillars">
            <div className="pillar-item">
              <strong>1. Emotional Exhaustion</strong>
              <p>Feeling continuously drained, tired, and lacking the energy to face another coding sprint or debugging loop.</p>
            </div>
            <div className="pillar-item">
              <strong>2. Cynicism & Depersonalization</strong>
              <p>Developing a cold, detached, or negative attitude towards your codebase, team requests, and overall project goals.</p>
            </div>
            <div className="pillar-item">
              <strong>3. Reduced Personal Efficacy</strong>
              <p>A persistent feeling of incompetence or lack of achievement—believing that no matter how much you code, it isn't good enough.</p>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2 className="flex-center">
              <AlertCircle size={18} style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.4))' }} />
              Developer-Specific Triggers
            </h2>
          </div>
          <ul className="awareness-list">
            <li>
              <strong>Endless Debugging Loops:</strong> Spending hours looking for a single missing semicolon or race condition without taking a step back.
            </li>
            <li>
              <strong>High Context Switching:</strong> Being interrupted by Slack messages, emails, and meetings while trying to maintain complex algorithmic logic in your head.
            </li>
            <li>
              <strong>AI Productivity Pressure:</strong> The expectation to produce code faster than ever due to AI-assisted coding tools, leading to longer code reviews and cognitive fatigue.
            </li>
            <li>
              <strong>On-Call Fatigue:</strong> Waking up in the middle of the night to address server issues or production hotfixes.
            </li>
          </ul>
        </section>
      </div>

      {/* Pomodoro Timer and Self Care */}
      <div className="grid two">
        {/* Interactive Pomodoro Timer */}
        <section className="panel timer-panel">
          <div className="panel-heading">
            <h2 className="flex-center">
              <Clock size={18} style={{ color: '#22d3ee', filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.4))' }} />
              Interactive Focus Timer (Pomodoro)
            </h2>
            <span>Sustain focus, prevent fatigue</span>
          </div>
          <div className="timer-box">
            <div className={`timer-circle ${isBreak ? "break-mode" : "focus-mode"} ${isActive ? "timer-ticking" : ""}`}>
              <h3>{isBreak ? "Break Mode" : "Focus Mode"}</h3>
              <span className="timer-digits">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
              <p>{isBreak ? "Relax & Stretch!" : "Stay Focused!"}</p>
            </div>
            <div className="timer-controls">
              <button className="primary" onClick={toggleTimer} style={{
                background: isActive
                  ? 'linear-gradient(135deg, #f472b6, #ec4899)'
                  : 'linear-gradient(135deg, #6366f1, #818cf8)',
                boxShadow: isActive
                  ? '0 4px 20px rgba(236, 72, 153, 0.3)'
                  : '0 4px 20px rgba(99, 102, 241, 0.3)',
              }}>
                {isActive ? <Pause size={16} /> : <Play size={16} />}
                {isActive ? "Pause" : "Start Focus"}
              </button>
              <button className="secondary" onClick={resetTimer}>
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>
        </section>

        {/* Self-Care & Recovery Guide */}
        <section className="panel">
          <div className="panel-heading">
            <h2 className="flex-center">
              <CheckCircle size={18} style={{ color: '#34d399', filter: 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.4))' }} />
              Recovery & Self-Care Playbook
            </h2>
          </div>
          <div className="awareness-pillars">
            <div className="pillar-item" style={{ borderLeftColor: '#34d399' }}>
              <strong>The 50/10 Rule</strong>
              <p>For every 50 minutes of deep coding work, take a mandatory 10-minute break. Step completely away from screens, walk around, or drink water.</p>
            </div>
            <div className="pillar-item" style={{ borderLeftColor: '#22d3ee' }}>
              <strong>Cognitive Offloading</strong>
              <p>Don't try to store everything in your memory. Use notebooks, whiteboards, or simple tasks lists to plan your architecture before coding.</p>
            </div>
            <div className="pillar-item" style={{ borderLeftColor: '#f472b6' }}>
              <strong>Establish "Deep Work" Blocks</strong>
              <p>Dedicate 2 hours of quiet time daily: close slack, close email, and turn off phone notifications to avoid exhausting context-switching.</p>
            </div>
            <div className="pillar-item" style={{ borderLeftColor: '#fbbf24' }}>
              <strong>Establish a "Shutdown Ritual"</strong>
              <p>Write a checklist of what you'll tackle tomorrow, commit your current code, and mentally disconnect when the workday ends. Separate coding from personal life.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
