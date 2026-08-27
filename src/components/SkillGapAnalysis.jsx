import React, { useState, useEffect } from 'react';
import {
  LineChart, Sparkles, Award, ExternalLink, BookOpen, AlertTriangle,
  CheckCircle2, Target, Lightbulb, PlayCircle, FolderGit2, Code, RefreshCw
} from 'lucide-react';
import RadarChartCanvas from './RadarChartCanvas';
import { TARGET_ROLES } from '../data/roleSkillBenchmarks';
import apiClient from '../services/apiClient';

export default function SkillGapAnalysis({ studentProfile }) {
  const [selectedRole, setSelectedRole] = useState(TARGET_ROLES[0].name);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gapData, setGapData] = useState(null);

  const analyzeGap = async () => {
    setIsAnalyzing(true);
    try {
      const response = await apiClient.post('/api/ai/skill-gap/analyze', {
        profile: studentProfile,
        targetRole: selectedRole
      });
      
      const roleDef = TARGET_ROLES.find(r => r.name === selectedRole);
      setGapData({
        ...response.data,
        roleDefinition: roleDef
      });
    } catch(err) {
      console.error(err);
      alert("Failed to perform AI Skill Gap analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const activeRoleObj = gapData?.roleDefinition || TARGET_ROLES.find(r => r.name === selectedRole) || TARGET_ROLES[0];
  const benchmarkSkills = activeRoleObj.benchmarkSkills;
  const labels = Object.keys(benchmarkSkills);
  const benchmarkScores = labels.map(k => benchmarkSkills[k]);
  const studentScores = labels.map(k => gapData?.proficiencyScores?.[k] || 30);

  return (
    <div className="section-container animate-fade-in">
      <div className="banner-card glass-card">
        <div>
          <div className="flex-items" style={{ gap: '0.5rem' }}>
            <LineChart className="icon-indigo" size={26} />
            <h2 className="section-title">Skill Gap Analysis & Learning Roadmap</h2>
          </div>
          <p className="section-subtitle">
            Compare your current skill proficiency against industry benchmarks and receive tailored NPTEL/Coursera/YouTube courses & project ideas.
          </p>
        </div>

        <div className="flex-between" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
          <div className="flex-items" style={{ gap: '1rem' }}>
            <label>Target Career Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="glass-card"
              style={{ padding: '0.4rem 0.8rem', minWidth: '250px' }}
            >
              {TARGET_ROLES.map(r => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={analyzeGap} disabled={isAnalyzing}>
            {isAnalyzing ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {isAnalyzing ? " Analyzing..." : " Run AI Skill Gap Analysis"}
          </button>
        </div>
      </div>

      {gapData && (
        <div className="skill-gap-grid" style={{ marginTop: '1.5rem' }}>
          <div className="radar-card glass-card text-center">
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h3 className="flex-items" style={{ gap: '0.4rem' }}>
                <Target size={18} className="icon-indigo" /> Skill Proficiency Radar
              </h3>
              <span className="hint-text">{activeRoleObj.name}</span>
            </div>
            <RadarChartCanvas
              labels={labels}
              datasets={[
                { label: "Industry Benchmark", data: benchmarkScores, backgroundColor: "rgba(99, 102, 241, 0.15)", borderColor: "#6366f1", borderWidth: 2 },
                { label: "Your Current Skill Level", data: studentScores, backgroundColor: "rgba(16, 185, 129, 0.25)", borderColor: "#10b981", borderWidth: 2 }
              ]}
              width={400}
              height={340}
            />
          </div>

          <div className="gap-analysis-card glass-card">
            <div className="report-block">
              <div className="flex-items text-rose" style={{ gap: '0.5rem', marginBottom: '0.75rem' }}>
                <AlertTriangle size={18} />
                <h4>Critical Missing Skills</h4>
              </div>
              {gapData.missingSkills?.length > 0 ? (
                <ul className="alert-list">
                  {gapData.missingSkills.map((sk, idx) => (
                    <li key={idx}><strong>{sk.skill}</strong> ({sk.importance}): {sk.description}</li>
                  ))}
                </ul>
              ) : <p className="text-muted">No major skill gaps detected!</p>}
            </div>

            <div className="report-block" style={{ marginTop: '1.25rem' }}>
              <div className="flex-items text-indigo" style={{ gap: '0.5rem', marginBottom: '0.75rem' }}>
                <BookOpen size={18} />
                <h4>AI Recommended Courses</h4>
              </div>
              <div className="flex-col" style={{ gap: '0.5rem' }}>
                {gapData.courseRecommendations?.map((rec, idx) => (
                  <div key={idx} className="glass-card flex-between" style={{ padding: '0.75rem' }}>
                    <div>
                      <strong>{rec.title}</strong>
                      <div className="hint-text" style={{ marginTop: '0.2rem' }}>{rec.platform}</div>
                    </div>
                    <button className="btn btn-sm btn-outline">View</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="report-block" style={{ marginTop: '1.25rem' }}>
              <div className="flex-items text-emerald" style={{ gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Code size={18} />
                <h4>Project Ideas to Close the Gap</h4>
              </div>
              <ul className="alert-list" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                {gapData.projectIdeas?.map((proj, idx) => (
                  <li key={idx}><strong>{proj.title}</strong>: {proj.description}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
