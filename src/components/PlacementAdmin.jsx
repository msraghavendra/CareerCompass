import React, { useState } from 'react';
import {
  ShieldCheck, PlusCircle, Building2, Users, CheckCircle2,
  Megaphone, Award, AlertCircle, Trash2, Calendar
} from 'lucide-react';
import { checkEligibility } from '../utils/eligibilityEngine';

export default function PlacementAdmin({
  companies,
  studentProfile,
  onAddCompany,
  onDeleteCompany,
  onAddAnnouncement
}) {
  const [activeAdminTab, setActiveAdminTab] = useState("drives"); // drives, create, broadcast
  const [newCompany, setNewCompany] = useState({
    name: "",
    role: "Software Development Engineer",
    ctc: "12 LPA",
    ctcValue: 12,
    location: "Bengaluru",
    minCgpa: 7.5,
    maxArrears: 0,
    allowedBranches: ["CSE", "IT", "ECE"],
    requiredSkills: ["Java", "Data Structures", "SQL"],
    deadline: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
    description: "Campus drive for software engineering position.",
    rounds: ["Online Assessment", "Technical Interview Round 1", "HR Round"],
    category: "Product Dream"
  });

  const [skillsInput, setSkillsInput] = useState("Java, Data Structures, SQL");
  const [branchesInput, setBranchesInput] = useState("CSE, IT, ECE");

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    category: "Drive Alert",
    urgent: false,
    content: ""
  });

  const handleCreateCompany = (e) => {
    e.preventDefault();
    const created = {
      ...newCompany,
      id: `comp-${Date.now()}`,
      logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=120&q=80",
      ctcValue: parseFloat(newCompany.ctc) || 10,
      requiredSkills: skillsInput.split(',').map(s => s.trim()).filter(Boolean),
      allowedBranches: branchesInput.split(',').map(b => b.trim()).filter(Boolean)
    };
    onAddCompany(created);

    // Also auto-broadcast an announcement
    onAddAnnouncement({
      id: `ann-${Date.now()}`,
      title: `New Placement Drive: ${created.name} (${created.ctc})`,
      category: "Drive Alert",
      urgent: true,
      date: new Date().toISOString(),
      author: "Placement Officer",
      content: `Registration open for ${created.name} - ${created.role}. Min CGPA ${created.minCgpa}. Deadline: ${new Date(created.deadline).toLocaleDateString()}`
    });

    alert(`Placement drive for ${created.name} successfully published!`);
    setActiveAdminTab("drives");
  };

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    onAddAnnouncement({
      id: `ann-${Date.now()}`,
      ...newAnnouncement,
      date: new Date().toISOString(),
      author: "Placement Cell Admin"
    });
    alert("Announcement broadcasted to student portals!");
    setNewAnnouncement({ title: "", category: "Drive Alert", urgent: false, content: "" });
  };

  return (
    <div className="section-container animate-fade-in">
      {/* Header */}
      <div className="banner-card glass-card flex-between">
        <div>
          <div className="flex-items" style={{ gap: '0.5rem' }}>
            <ShieldCheck className="icon-indigo" size={26} />
            <h2 className="section-title">Placement Cell Admin Control Panel</h2>
          </div>
          <p className="section-subtitle">
            Publish new campus placement drives, set CGPA & skill criteria, track batch eligibility metrics, and send official broadcasts.
          </p>
        </div>

        <div className="admin-tabs-group flex-items">
          <button
            className={`btn-filter ${activeAdminTab === 'drives' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('drives')}
          >
            <Building2 size={15} /> Active Drives ({companies.length})
          </button>
          <button
            className={`btn-filter ${activeAdminTab === 'create' ? 'active-green' : ''}`}
            onClick={() => setActiveAdminTab('create')}
          >
            <PlusCircle size={15} /> Post New Drive
          </button>
          <button
            className={`btn-filter ${activeAdminTab === 'broadcast' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('broadcast')}
          >
            <Megaphone size={15} /> Send Broadcast
          </button>
        </div>
      </div>

      {/* 1. ACTIVE DRIVES MANAGEMENT TAB */}
      {activeAdminTab === 'drives' && (
        <div className="admin-drives-list" style={{ marginTop: '1.5rem' }}>
          <div className="company-grid">
            {companies.map(comp => {
              const testEligibility = checkEligibility(studentProfile, comp);
              return (
                <div key={comp.id} className="company-card glass-card">
                  <div className="flex-between">
                    <div className="flex-items" style={{ gap: '0.6rem' }}>
                      <img src={comp.logo} alt={comp.name} className="company-logo" />
                      <div>
                        <h3>{comp.name}</h3>
                        <p className="company-role">{comp.role}</p>
                      </div>
                    </div>

                    <button className="btn-icon text-rose" onClick={() => onDeleteCompany(comp.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="admin-stat-row flex-between" style={{ margin: '0.75rem 0', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '8px' }}>
                    <span>Package: <strong className="text-gold">{comp.ctc}</strong></span>
                    <span>Min CGPA: <strong>{comp.minCgpa}</strong></span>
                    <span>Max Arrears: <strong>{comp.maxArrears}</strong></span>
                  </div>

                  <p className="text-xs text-muted">Allowed Branches: {comp.allowedBranches.join(", ")}</p>

                  <div className="flex-between" style={{ marginTop: '0.75rem' }}>
                    <span className="hint-text text-xs">
                      Deadline: {new Date(comp.deadline).toLocaleDateString()}
                    </span>
                    <span className={`badge ${testEligibility.isEligible ? 'badge-eligible' : 'badge-ineligible'}`}>
                      {testEligibility.isEligible ? 'Sample Student Eligible' : 'Sample Student Ineligible'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. POST NEW DRIVE TAB */}
      {activeAdminTab === 'create' && (
        <div className="create-drive-card glass-card" style={{ marginTop: '1.5rem', maxWidth: '800px', margin: '1.5rem auto' }}>
          <h3>Publish New Campus Placement Drive</h3>
          
          <form onSubmit={handleCreateCompany} style={{ marginTop: '1rem' }}>
            <div className="form-grid">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  placeholder="e.g. Google, Microsoft, Infosys"
                />
              </div>

              <div className="form-group">
                <label>Designation / Role</label>
                <input
                  type="text"
                  required
                  value={newCompany.role}
                  onChange={(e) => setNewCompany({ ...newCompany, role: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Package CTC (e.g. 14 LPA)</label>
                <input
                  type="text"
                  required
                  value={newCompany.ctc}
                  onChange={(e) => setNewCompany({ ...newCompany, ctc: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newCompany.location}
                  onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Minimum Required CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={newCompany.minCgpa}
                  onChange={(e) => setNewCompany({ ...newCompany, minCgpa: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Maximum Allowed Arrears</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={newCompany.maxArrears}
                  onChange={(e) => setNewCompany({ ...newCompany, maxArrears: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Allowed Branches (comma separated)</label>
              <input
                type="text"
                value={branchesInput}
                onChange={(e) => setBranchesInput(e.target.value)}
                placeholder="CSE, IT, ECE, AI & DS"
              />
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Required Technical Skills (comma separated)</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Java, React, SQL, Data Structures"
              />
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Application Deadline Date & Time</label>
              <input
                type="datetime-local"
                value={newCompany.deadline}
                onChange={(e) => setNewCompany({ ...newCompany, deadline: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Job Description & Details</label>
              <textarea
                rows={4}
                value={newCompany.description}
                onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
              ></textarea>
            </div>

            <div className="flex-end" style={{ marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-primary btn-lg">
                <PlusCircle size={18} /> Publish Drive & Notify Students
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. SEND BROADCAST TAB */}
      {activeAdminTab === 'broadcast' && (
        <div className="broadcast-card glass-card" style={{ marginTop: '1.5rem', maxWidth: '700px', margin: '1.5rem auto' }}>
          <h3>Send Campus Announcement Broadcast</h3>
          
          <form onSubmit={handleBroadcastSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>Announcement Title</label>
              <input
                type="text"
                required
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                placeholder="e.g. Schedule Change for TCS Digital Round"
              />
            </div>

            <div className="form-grid" style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newAnnouncement.category}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                >
                  <option value="Drive Alert">Drive Alert</option>
                  <option value="Deadline Alert">Deadline Alert</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Policy Update">Policy Update</option>
                </select>
              </div>

              <div className="form-group flex-items" style={{ paddingTop: '1.8rem' }}>
                <input
                  type="checkbox"
                  id="urgent-check"
                  checked={newAnnouncement.urgent}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, urgent: e.target.checked })}
                />
                <label htmlFor="urgent-check" style={{ cursor: 'pointer' }}>Mark as High-Priority Urgent</label>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Announcement Body Text</label>
              <textarea
                rows={5}
                required
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                placeholder="Type official notification instructions..."
              ></textarea>
            </div>

            <div className="flex-end" style={{ marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-primary">
                <Megaphone size={16} /> Broadcast Notification
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
