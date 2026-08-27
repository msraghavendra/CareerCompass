import React from 'react';
import { BarChart3, Users, Briefcase, FileText, TrendingUp, CheckCircle2 } from 'lucide-react';
import RadarChartCanvas from './RadarChartCanvas';

export default function AnalyticsDashboard({ companies, applications, studentProfile }) {
  // Simple Mock KPIs
  const totalApplied = applications?.length || 0;
  const interviewCalls = applications?.filter(a => a.status === 'Interview').length || 0;
  const offers = applications?.filter(a => a.status === 'Selected').length || 0;
  const activeDrives = companies?.length || 0;

  return (
    <div className="section-container animate-fade-in">
      <div className="banner-card glass-card flex-between" style={{ marginBottom: '1.5rem' }}>
        <div className="flex-items" style={{ gap: '0.5rem' }}>
          <BarChart3 size={28} className="icon-indigo" />
          <h2 className="section-title">Placement Analytics Dashboard</h2>
        </div>
        <p className="section-subtitle">
          Track your placement journey, conversion rates, and overall readiness.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary-color)' }}>
          <div className="flex-items text-muted" style={{ gap: '0.5rem' }}><Briefcase size={16} /> Total Applied</div>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{totalApplied}</h2>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <div className="flex-items text-muted" style={{ gap: '0.5rem' }}><Users size={16} /> Interview Calls</div>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{interviewCalls}</h2>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div className="flex-items text-muted" style={{ gap: '0.5rem' }}><CheckCircle2 size={16} /> Offers Received</div>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{offers}</h2>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
          <div className="flex-items text-muted" style={{ gap: '0.5rem' }}><TrendingUp size={16} /> Active Drives</div>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{activeDrives}</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }} className="flex-items"><FileText size={18} className="icon-indigo" style={{ marginRight: '0.5rem' }}/> Application Pipeline</h3>
          <div style={{ height: '300px', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
            {/* Simple CSS bars for pipeline */}
            <div>
              <div className="flex-between hint-text mb-1"><span>Applied</span> <span>{totalApplied}</span></div>
              <div style={{ height: '12px', background: 'var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--primary-color)' }}></div>
              </div>
            </div>
            <div>
              <div className="flex-between hint-text mb-1"><span>Online Assessment</span> <span>{Math.floor(totalApplied * 0.7)}</span></div>
              <div style={{ height: '12px', background: 'var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '70%', height: '100%', background: '#3b82f6' }}></div>
              </div>
            </div>
            <div>
              <div className="flex-between hint-text mb-1"><span>Interview</span> <span>{interviewCalls}</span></div>
              <div style={{ height: '12px', background: 'var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '40%', height: '100%', background: '#f59e0b' }}></div>
              </div>
            </div>
            <div>
              <div className="flex-between hint-text mb-1"><span>Selected</span> <span>{offers}</span></div>
              <div style={{ height: '12px', background: 'var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '15%', height: '100%', background: '#10b981' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card text-center">
          <h3 style={{ marginBottom: '1rem' }}>Overall Placement Readiness</h3>
          <RadarChartCanvas 
            labels={["DSA", "System Design", "Core CS", "Soft Skills", "Project Quality", "Resume Strength"]}
            datasets={[{
              label: "Your Score",
              data: [85, 60, 75, 90, 80, 88],
              backgroundColor: "rgba(99, 102, 241, 0.25)",
              borderColor: "#6366f1",
              borderWidth: 2
            }]}
            width={400}
            height={300}
          />
        </div>
      </div>
    </div>
  );
}
