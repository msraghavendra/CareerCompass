import React from 'react';
import {
  Sparkles, CheckCircle2, FileText, Mic, Kanban, LineChart, Bell,
  ShieldCheck, User, Moon, Sun, ChevronRight, AlertTriangle, MessageSquare, Code, BarChart3
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  studentProfile,
  onOpenProfileModal,
  unreadCount,
  eligibleCount,
  totalCompaniesCount,
  theme,
  setTheme,
  onLogout
}) {
  const tabs = [
    { id: "analytics", label: "Dashboard", icon: BarChart3, badge: null },
    { id: "eligibility", label: "Eligibility Checker", icon: CheckCircle2, badge: `${eligibleCount}/${totalCompaniesCount}` },
    { id: "resume", label: "AI Resume Analyzer", icon: FileText, badge: "AI Score" },
    { id: "interview", label: "Interview Prep & Mock AI", icon: Mic, badge: "Practice" },
    { id: "coding", label: "Coding & Aptitude", icon: Code, badge: "IDE" },
    { id: "assistant", label: "AI Career Assistant", icon: MessageSquare, badge: "Chat" },
    { id: "tracker", label: "Application Tracker", icon: Kanban, badge: "Kanban" },
    { id: "skillgap", label: "Skill Gap Analysis", icon: LineChart, badge: "Radar" },
    { id: "notifications", label: "Alerts & Drives", icon: Bell, badge: unreadCount > 0 ? `${unreadCount} New` : null }
  ];

  if (userRole === "admin") {
    tabs.push({ id: "admin", label: "Placement Cell Admin", icon: ShieldCheck, badge: "Officer" });
  }

  return (
    <header className="navbar-header glass-header">
      {/* Top Banner Bar */}
      <div className="navbar-top-bar container flex-between">
        <div className="brand flex-items">
          <div className="brand-icon-box gradient-bg">
            <Sparkles size={22} className="icon-white" />
          </div>
          <div>
            <div className="brand-title flex-items">
              <h2>Career Compass</h2>
              <span className="pill-badge version-pill">v2.5 AI Powered</span>
            </div>
            <p className="brand-subtitle">Your Smart Career & Placement Assistant</p>
          </div>
        </div>

        <div className="top-right-controls flex-items">
          {/* Quick Profile Summary Card */}
          <div className="profile-quick-card glass-card flex-items" onClick={onOpenProfileModal} title="Click to edit student profile">
            <div className="profile-avatar">
              {studentProfile.name.charAt(0)}
            </div>
            <div className="profile-info">
              <div className="profile-name flex-items">
                <span>{studentProfile.name}</span>
                <span className="cgpa-tag">CGPA: {studentProfile.cgpa}</span>
              </div>
              <div className="profile-meta">
                <span>{studentProfile.branch} ({studentProfile.passingYear})</span>
                <span className="dot-sep">•</span>
                <span className={studentProfile.arrears > 0 ? "arrears-warn" : "arrears-clean"}>
                  {studentProfile.arrears > 0 ? `${studentProfile.arrears} Arrear(s)` : "No Arrears"}
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted" />
          </div>

          {/* Role Switcher */}
          <div className="role-switcher-box glass-card flex-items">
            <button
              className={`role-btn ${userRole === 'student' ? 'active' : ''}`}
              onClick={() => setUserRole('student')}
            >
              <User size={14} /> Student View
            </button>
            <button
              className={`role-btn ${userRole === 'admin' ? 'active-admin' : ''}`}
              onClick={() => setUserRole('admin')}
            >
              <ShieldCheck size={14} /> Admin Cell
            </button>
          </div>

          {/* Theme Switcher */}
          <button
            className="theme-btn btn-icon glass-card"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber" /> : <Moon size={18} className="icon-indigo" />}
          </button>
          
          {/* Logout Button */}
          <button
            className="btn btn-outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }}
            onClick={onLogout}
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Primary Navigation Bar Tabs */}
      <div className="navbar-tabs-wrapper">
        <div className="container">
          <nav className="nav-tabs">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`nav-tab-btn ${isActive ? 'active-tab' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`tab-badge ${tab.id === 'notifications' && unreadCount > 0 ? 'badge-urgent' : ''}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
