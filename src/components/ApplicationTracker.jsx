import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Kanban, PlusCircle, CheckCircle2, XCircle, Clock, Calendar,
  Building2, Trash2, ArrowRight, ArrowLeft, Trophy, DollarSign,
  FileText, ExternalLink, Filter
} from 'lucide-react';

const STAGES = [
  { id: "Applied", label: "Applied", color: "border-sky" },
  { id: "Online Test", label: "Online Test Scheduled", color: "border-amber" },
  { id: "Interview", label: "Interview Round", color: "border-indigo" },
  { id: "Selected", label: "Selected / Offer 🎉", color: "border-emerald" },
  { id: "Rejected", label: "Rejected", color: "border-rose" }
];

export default function ApplicationTracker({
  applications,
  onUpdateApplications
}) {
  const [viewMode, setViewMode] = useState("kanban"); // kanban, list
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApp, setNewApp] = useState({
    companyName: "",
    role: "Software Engineer",
    ctc: "12 LPA",
    status: "Applied",
    appliedDate: new Date().toISOString().split('T')[0],
    eventDate: "TBD",
    location: "Bengaluru",
    notes: "",
    deadline: ""
  });

  const handleStatusChange = (appId, newStatus) => {
    const updated = applications.map(app => {
      if (app.id === appId) {
        return { ...app, status: newStatus };
      }
      return app;
    });

    onUpdateApplications(updated);

    if (newStatus === "Selected") {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleDeleteApp = (appId) => {
    if (window.confirm("Are you sure you want to remove this application record?")) {
      const updated = applications.filter(app => app.id !== appId);
      onUpdateApplications(updated);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const created = {
      ...newApp,
      id: `app-${Date.now()}`
    };
    onUpdateApplications([...applications, created]);
    setShowAddModal(false);
    setNewApp({
      companyName: "",
      role: "Software Engineer",
      ctc: "12 LPA",
      status: "Applied",
      appliedDate: new Date().toISOString().split('T')[0],
      eventDate: "TBD",
      location: "Bengaluru",
      notes: "",
      deadline: ""
    });
  };

  const selectedCount = applications.filter(a => a.status === "Selected").length;
  const interviewCount = applications.filter(a => a.status === "Interview").length;

  return (
    <div className="section-container animate-fade-in">
      {/* Header Banner */}
      <div className="banner-card glass-card flex-between">
        <div>
          <div className="flex-items" style={{ gap: '0.5rem' }}>
            <Kanban className="icon-indigo" size={26} />
            <h2 className="section-title">Placement Application Tracker</h2>
          </div>
          <p className="section-subtitle">
            Manage applied companies across Kanban stages (Applied, Online Test, Interview, Selected, Rejected) with deadline tracking.
          </p>
        </div>

        <div className="flex-items" style={{ gap: '1rem' }}>
          <div className="stat-pill pill-eligible">
            <Trophy size={16} />
            <span><strong>{selectedCount}</strong> Offers Received</span>
          </div>
          <div className="stat-pill pill-total">
            <Clock size={16} />
            <span><strong>{interviewCount}</strong> Active Interviews</span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <PlusCircle size={16} /> Add Application
          </button>
        </div>
      </div>

      {/* View Switcher Bar */}
      <div className="controls-bar flex-between" style={{ margin: '1.25rem 0' }}>
        <div className="filter-buttons-group flex-items">
          <button
            className={`btn-filter ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewMode('kanban')}
          >
            <Kanban size={15} /> Kanban Board View
          </button>
          <button
            className={`btn-filter ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <FileText size={15} /> List View ({applications.length})
          </button>
        </div>
      </div>

      {/* 1. KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="kanban-board-grid">
          {STAGES.map(stage => {
            const stageApps = applications.filter(a => a.status === stage.id);
            return (
              <div key={stage.id} className={`kanban-column glass-card ${stage.color}`}>
                <div className="column-header flex-between">
                  <h3 className="column-title">{stage.label}</h3>
                  <span className="column-count">{stageApps.length}</span>
                </div>

                <div className="column-cards-list">
                  {stageApps.map(app => (
                    <div key={app.id} className="kanban-card glass-card">
                      <div className="flex-between">
                        <h4 className="app-company-name">{app.companyName}</h4>
                        <span className="app-ctc-badge">{app.ctc}</span>
                      </div>

                      <p className="app-role">{app.role}</p>

                      <div className="app-meta flex-items" style={{ margin: '0.5rem 0' }}>
                        <Calendar size={13} />
                        <span>Date: {app.eventDate || app.appliedDate}</span>
                      </div>

                      {app.notes && (
                        <p className="app-notes">{app.notes}</p>
                      )}

                      <div className="kanban-card-actions flex-between" style={{ marginTop: '0.75rem' }}>
                        <button
                          className="btn-icon text-rose"
                          onClick={() => handleDeleteApp(app.id)}
                          title="Delete application"
                        >
                          <Trash2 size={14} />
                        </button>

                        <div className="flex-items" style={{ gap: '0.3rem' }}>
                          {stage.id !== "Applied" && (
                            <button
                              className="btn-stage-shift"
                              onClick={() => {
                                const prevIdx = STAGES.findIndex(s => s.id === stage.id) - 1;
                                if (prevIdx >= 0) handleStatusChange(app.id, STAGES[prevIdx].id);
                              }}
                              title="Move back stage"
                            >
                              <ArrowLeft size={13} />
                            </button>
                          )}

                          {stage.id !== "Selected" && stage.id !== "Rejected" && (
                            <button
                              className="btn-stage-shift btn-stage-next"
                              onClick={() => {
                                const nextIdx = STAGES.findIndex(s => s.id === stage.id) + 1;
                                if (nextIdx < STAGES.length) handleStatusChange(app.id, STAGES[nextIdx].id);
                              }}
                              title="Advance to next stage"
                            >
                              <ArrowRight size={13} /> Next Stage
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. LIST VIEW */}
      {viewMode === 'list' && (
        <div className="list-view-table glass-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Package CTC</th>
                <th>Applied Date</th>
                <th>Stage Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td><strong>{app.companyName}</strong></td>
                  <td>{app.role}</td>
                  <td className="text-gold">{app.ctc}</td>
                  <td>{app.appliedDate}</td>
                  <td>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="glass-card table-select"
                    >
                      {STAGES.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="table-notes">{app.notes || 'No notes'}</td>
                  <td>
                    <button className="btn-icon text-rose" onClick={() => handleDeleteApp(app.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <div className="modal-header">
              <h3>Track New Placement Application</h3>
              <button className="btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    required
                    value={newApp.companyName}
                    onChange={(e) => setNewApp({ ...newApp, companyName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Job Role</label>
                  <input
                    type="text"
                    required
                    value={newApp.role}
                    onChange={(e) => setNewApp({ ...newApp, role: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>CTC Package</label>
                  <input
                    type="text"
                    value={newApp.ctc}
                    onChange={(e) => setNewApp({ ...newApp, ctc: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Current Application Stage</label>
                  <select
                    value={newApp.status}
                    onChange={(e) => setNewApp({ ...newApp, status: e.target.value })}
                  >
                    {STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Personal Notes & Test Schedule</label>
                <textarea
                  rows={3}
                  value={newApp.notes}
                  onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                  placeholder="Add test date, syllabus, or interviewer notes..."
                ></textarea>
              </div>

              <div className="modal-footer" style={{ marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <PlusCircle size={16} /> Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
