import React, { useState } from 'react';
import { X, User, Award, BookOpen, Sparkles, Check, Plus, Trash2 } from 'lucide-react';
import { TARGET_ROLES } from '../data/roleSkillBenchmarks';

export default function StudentProfileModal({ profile, onSave, onClose }) {
  const [formData, setFormData] = useState({ ...profile });
  const [newSkill, setNewSkill] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "cgpa" || name === "arrears" || name === "passingYear" ? Number(value) : value
    }));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card">
        <div className="modal-header">
          <div className="modal-title flex-items">
            <User className="icon-indigo" size={24} />
            <div>
              <h3>Student Placement Profile</h3>
              <p className="subtitle">Update CGPA, Branch, Arrears, and Skills for real-time eligibility evaluation</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Roll / Register Number</label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Branch / Department</label>
              <select name="branch" value={formData.branch} onChange={handleChange}>
                <option value="CSE">CSE - Computer Science & Engg</option>
                <option value="IT">IT - Information Technology</option>
                <option value="AI & DS">AI & DS - Artificial Intelligence & Data Science</option>
                <option value="ECE">ECE - Electronics & Comm Engg</option>
                <option value="EEE">EEE - Electrical & Electronics Engg</option>
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="Civil">Civil Engineering</option>
              </select>
            </div>

            <div className="form-group">
              <label>Current CGPA (0 - 10.0)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Active Backlogs / Arrears</label>
              <input
                type="number"
                min="0"
                max="10"
                name="arrears"
                value={formData.arrears}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Target Career Profile</label>
              <select name="targetRole" value={formData.targetRole} onChange={handleChange}>
                {TARGET_ROLES.map(role => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1.25rem' }}>
            <label className="flex-between">
              <span>Technical Skills Inventory ({formData.skills.length})</span>
              <span className="hint-text">Used for company eligibility and skill gap matching</span>
            </label>
            <div className="add-skill-row">
              <input
                type="text"
                placeholder="e.g. Docker, Python, React, AWS, C++"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
              />
              <button type="button" className="btn btn-secondary" onClick={handleAddSkill}>
                <Plus size={16} /> Add Skill
              </button>
            </div>

            <div className="skills-badge-wrap" style={{ marginTop: '0.75rem' }}>
              {formData.skills.map((skill, index) => (
                <span key={index} className="skill-chip">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} aria-label={`Remove ${skill}`}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1.25rem' }}>
            <label>Raw Resume Text (Used by AI Resume Analyzer)</label>
            <textarea
              name="resumeText"
              rows={4}
              value={formData.resumeText}
              onChange={handleChange}
              placeholder="Paste text from your resume here or upload via Resume Analyzer..."
            ></textarea>
          </div>

          <div className="modal-footer" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Check size={18} /> Save Student Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
