import React, { useState } from 'react';
import { Code, Terminal, Play, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import apiClient from '../services/apiClient';

export default function CodingAptitude() {
  const [code, setCode] = useState("def solve():\n    # Write your code here\n    pass");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunCode = async () => {
    setIsEvaluating(true);
    try {
      const response = await apiClient.post('/api/ai/coding/evaluate', {
        code: code,
        language: "python"
      });
      setResult(response);
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate code.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="section-container animate-fade-in">
      <div className="banner-card glass-card flex-between">
        <div className="flex-items" style={{ gap: '0.5rem' }}>
          <Code className="icon-indigo" size={26} />
          <h2 className="section-title">Coding & Aptitude Prep</h2>
        </div>
        <p className="section-subtitle">
          Practice data structures and algorithmic challenges. Get AI-powered feedback on your code's time/space complexity and bugs.
        </p>
      </div>

      <div className="skill-gap-grid" style={{ marginTop: '1.5rem' }}>
        {/* Left Side: Code Editor */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex-between" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex-items" style={{ gap: '0.5rem' }}>
              <Terminal size={18} />
              <span className="font-semibold">Python 3 Workspace</span>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleRunCode} disabled={isEvaluating}>
              {isEvaluating ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              {isEvaluating ? " Analyzing..." : " Run & Analyze Code"}
            </button>
          </div>
          <textarea
            className="mock-textarea"
            style={{ flex: 1, minHeight: '300px', marginTop: '1rem', fontFamily: 'monospace', fontSize: '14px', background: '#1e1e1e', color: '#d4d4d4' }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Right Side: Evaluation Result */}
        <div className="glass-card">
          <h3 className="font-semibold" style={{ marginBottom: '1rem' }}>AI Code Evaluation</h3>
          {isEvaluating ? (
            <div className="flex-center flex-col text-muted" style={{ minHeight: '200px', gap: '1rem' }}>
              <Loader2 size={32} className="animate-spin text-primary" />
              <p>Analyzing time/space complexity and checking for bugs...</p>
            </div>
          ) : result ? (
            <div className="animate-fade-in">
              <div className="report-block">
                <h4 className="flex-items text-emerald" style={{ gap: '0.5rem' }}><CheckCircle2 size={16} /> Status: {result.status}</h4>
                <div style={{ marginTop: '1rem' }}>
                  <strong>Time Complexity:</strong> <span className="pill-badge">{result.timeComplexity}</span>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Space Complexity:</strong> <span className="pill-badge">{result.spaceComplexity}</span>
                </div>
              </div>

              <div className="report-block" style={{ marginTop: '1rem' }}>
                <h4 className="flex-items text-indigo" style={{ gap: '0.5rem' }}><Code size={16} /> Feedback & Optimization</h4>
                <p style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>{result.feedback}</p>
              </div>

              {result.bugs.length > 0 && (
                <div className="report-block alert-box-warn" style={{ marginTop: '1rem' }}>
                  <h4 className="flex-items text-amber" style={{ gap: '0.5rem' }}><AlertTriangle size={16} /> Detected Issues</h4>
                  <ul className="alert-list" style={{ marginTop: '0.5rem' }}>
                    {result.bugs.map((bug, i) => (
                      <li key={i}>{bug}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-center text-muted" style={{ minHeight: '200px' }}>
              <p>Write your code and click "Run & Analyze Code" to get AI feedback.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
