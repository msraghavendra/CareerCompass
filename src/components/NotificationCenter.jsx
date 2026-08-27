import React, { useState, useEffect } from 'react';
import {
  Bell, AlertTriangle, Calendar, Building2, Clock, CheckCircle2,
  Sparkles, Megaphone, Info, Filter, ArrowRight
} from 'lucide-react';

export default function NotificationCenter({
  announcements,
  companies,
  onClearUnread,
  onNavigateTab
}) {
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    onClearUnread();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate live countdown for company application deadlines
  const activeDeadlines = companies.map(comp => {
    const dDate = new Date(comp.deadline);
    const diffMs = dDate - currentTime;
    const isPast = diffMs <= 0;

    let timeString = "Closed";
    if (!isPast) {
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      timeString = `${hours}h ${mins}m ${secs}s remaining`;
    }

    return {
      ...comp,
      diffMs,
      isPast,
      timeString
    };
  }).sort((a, b) => a.diffMs - b.diffMs);

  const filteredAnnouncements = announcements.filter(ann => {
    if (filterCategory === "all") return true;
    if (filterCategory === "urgent") return ann.urgent;
    return ann.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  return (
    <div className="section-container animate-fade-in">
      {/* Header Banner */}
      <div className="banner-card glass-card flex-between">
        <div>
          <div className="flex-items" style={{ gap: '0.5rem' }}>
            <Bell className="icon-indigo" size={26} />
            <h2 className="section-title">Notification & Application Deadline Center</h2>
          </div>
          <p className="section-subtitle">
            Stay updated on new campus drive announcements, active test schedules, and live application countdown timers.
          </p>
        </div>

        <div className="stat-pill pill-total">
          <Clock size={16} />
          <span><strong>{activeDeadlines.filter(d => !d.isPast).length}</strong> Active Deadlines</span>
        </div>
      </div>

      {/* Grid: Upcoming Deadlines vs Announcements */}
      <div className="notifications-grid" style={{ marginTop: '1.5rem' }}>
        {/* Left Column: Live Deadline Countdowns */}
        <div className="deadlines-column glass-card">
          <div className="flex-items" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle className="text-amber" size={20} />
            <h3>Urgent Application Deadlines</h3>
          </div>

          <div className="deadlines-list">
            {activeDeadlines.map(d => (
              <div key={d.id} className={`deadline-item-card glass-card ${d.isPast ? 'deadline-closed' : 'deadline-active'}`}>
                <div className="flex-between">
                  <div className="flex-items" style={{ gap: '0.6rem' }}>
                    <img src={d.logo} alt={d.name} className="company-logo-sm" />
                    <div>
                      <strong>{d.name}</strong>
                      <span className="text-xs text-muted" style={{ display: 'block' }}>{d.role}</span>
                    </div>
                  </div>
                  <span className="text-gold font-bold">{d.ctc}</span>
                </div>

                <div className="flex-between" style={{ marginTop: '0.75rem' }}>
                  <span className="deadline-time-badge flex-items">
                    <Clock size={13} /> {d.timeString}
                  </span>

                  <button
                    className="btn btn-primary btn-xs"
                    onClick={() => onNavigateTab("eligibility")}
                  >
                    View Drive <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Campus Announcement Feed */}
        <div className="announcements-column glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <div className="flex-items" style={{ gap: '0.5rem' }}>
              <Megaphone className="icon-indigo" size={20} />
              <h3>Placement Cell Broadcast Feed</h3>
            </div>

            <div className="flex-items" style={{ gap: '0.4rem' }}>
              <button
                className={`btn-filter ${filterCategory === 'all' ? 'active' : ''}`}
                onClick={() => setFilterCategory('all')}
              >
                All
              </button>
              <button
                className={`btn-filter ${filterCategory === 'urgent' ? 'active-green' : ''}`}
                onClick={() => setFilterCategory('urgent')}
              >
                Urgent
              </button>
            </div>
          </div>

          <div className="announcements-feed-list">
            {filteredAnnouncements.map(ann => (
              <div key={ann.id} className={`announcement-feed-card glass-card ${ann.urgent ? 'border-urgent-amber' : ''}`}>
                <div className="flex-between">
                  <span className={`pill-badge ${ann.urgent ? 'badge-urgent' : ''}`}>
                    {ann.category}
                  </span>
                  <span className="hint-text text-xs">
                    {new Date(ann.date).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="ann-title" style={{ margin: '0.5rem 0 0.3rem 0' }}>{ann.title}</h4>
                <p className="ann-content text-sm">{ann.content}</p>

                <div className="ann-author flex-between" style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>
                  <span className="text-muted">Issued by: <strong>{ann.author}</strong></span>
                  {ann.companyId && (
                    <button
                      className="btn-ghost btn-xs text-indigo"
                      onClick={() => onNavigateTab("eligibility")}
                    >
                      Open Related Drive →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
