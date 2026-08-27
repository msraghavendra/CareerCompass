import React, { useState } from 'react';
import {
  CheckCircle2, XCircle, AlertCircle, Building2, MapPin, DollarSign,
  GraduationCap, AlertTriangle, Layers, Filter, Search, ArrowRight,
  ExternalLink, Sparkles, PlusCircle, Check
} from 'lucide-react';
import { checkEligibility } from '../utils/eligibilityEngine';

export default function CompanyEligibility({
  studentProfile,
  companies,
  applications,
  onApplyToCompany,
  onOpenProfile
}) {
  const [filterMode, setFilterMode] = useState("all"); // all, eligible, highCtc, product
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Evaluate eligibility for all companies
  const evaluatedCompanies = companies.map(company => {
    const result = checkEligibility(studentProfile, company);
    const isAlreadyApplied = applications.some(
      app => app.companyName.toLowerCase() === company.name.toLowerCase()
    );
    return {
      ...company,
      eligibility: result,
      isAlreadyApplied
    };
  });

  const eligibleCount = evaluatedCompanies.filter(c => c.eligibility.isEligible).length;

  const filteredCompanies = evaluatedCompanies.filter(company => {
    // Search Filter
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    // Tab Filter
    if (filterMode === "eligible") return company.eligibility.isEligible;
    if (filterMode === "highCtc") return company.ctcValue >= 15;
    if (filterMode === "product") return company.category.includes("Product");
    return true;
  });

  return (
    <div className="section-container animate-fade-in">
      {/* Header Banner */}
      <div className="banner-card glass-card flex-between">
        <div>
          <div className="flex-items" style={{ gap: '0.5rem' }}>
            <Building2 className="icon-indigo" size={26} />
            <h2 className="section-title">Company Eligibility Checker</h2>
          </div>
          <p className="section-subtitle">
            Real-time multi-criteria screening based on CGPA ({studentProfile.cgpa}), Branch ({studentProfile.branch}), Arrears ({studentProfile.arrears}), and Skills matching.
          </p>
        </div>

        <div className="stats-pills-row flex-items">
          <div className="stat-pill pill-eligible">
            <CheckCircle2 size={16} />
            <span><strong>{eligibleCount}</strong> Eligible Drives</span>
          </div>
          <div className="stat-pill pill-total">
            <Building2 size={16} />
            <span><strong>{companies.length}</strong> Total Companies</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onOpenProfile}>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="controls-bar flex-between" style={{ margin: '1.5rem 0' }}>
        <div className="filter-buttons-group flex-items">
          <button
            className={`btn-filter ${filterMode === 'all' ? 'active' : ''}`}
            onClick={() => setFilterMode('all')}
          >
            All Companies ({companies.length})
          </button>
          <button
            className={`btn-filter ${filterMode === 'eligible' ? 'active-green' : ''}`}
            onClick={() => setFilterMode('eligible')}
          >
            <CheckCircle2 size={15} /> Eligible Only ({eligibleCount})
          </button>
          <button
            className={`btn-filter ${filterMode === 'highCtc' ? 'active' : ''}`}
            onClick={() => setFilterMode('highCtc')}
          >
            High CTC (&gt;15 LPA)
          </button>
          <button
            className={`btn-filter ${filterMode === 'product' ? 'active' : ''}`}
            onClick={() => setFilterMode('product')}
          >
            Product & Super Dream
          </button>
        </div>

        <div className="search-box flex-items glass-card">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Search by company, role, skill (e.g. Java, Google, SDE)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Company Cards Grid */}
      <div className="company-grid">
        {filteredCompanies.map(company => {
          const { isEligible, matchScore, reasons, missingSkills } = company.eligibility;

          return (
            <div
              key={company.id}
              className={`company-card glass-card ${isEligible ? 'card-eligible-border' : 'card-ineligible-border'}`}
            >
              {/* Top Card Header */}
              <div className="company-card-header flex-between">
                <div className="flex-items" style={{ gap: '0.75rem' }}>
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="company-logo"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80"; }}
                  />
                  <div>
                    <h3 className="company-name">{company.name}</h3>
                    <p className="company-role">{company.role}</p>
                  </div>
                </div>

                <div className="badge-wrap">
                  {isEligible ? (
                    <span className="badge badge-eligible">
                      <CheckCircle2 size={13} /> Eligible
                    </span>
                  ) : (
                    <span className="badge badge-ineligible">
                      <XCircle size={13} /> Not Eligible
                    </span>
                  )}
                </div>
              </div>

              {/* Company Metrics Row */}
              <div className="company-metrics-grid">
                <div className="metric-item">
                  <span className="metric-label"><DollarSign size={13} /> Package CTC</span>
                  <span className="metric-value text-gold">{company.ctc}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label"><GraduationCap size={13} /> Min CGPA</span>
                  <span className="metric-value">{company.minCgpa}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label"><AlertTriangle size={13} /> Max Arrears</span>
                  <span className="metric-value">{company.maxArrears}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label"><MapPin size={13} /> Location</span>
                  <span className="metric-value">{company.location.split('/')[0]}</span>
                </div>
              </div>

              {/* Required Skills Chips */}
              <div className="company-skills-section">
                <span className="section-micro-title">Required Technical Skills:</span>
                <div className="skills-badge-wrap">
                  {company.requiredSkills.map((skill, idx) => {
                    const isMissing = missingSkills.includes(skill);
                    return (
                      <span
                        key={idx}
                        className={`skill-chip-sm ${isMissing ? 'skill-chip-missing' : 'skill-chip-matched'}`}
                      >
                        {isMissing ? '❌ ' : '✓ '}{skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Reason Accordion Preview */}
              <div className="eligibility-reasons-box">
                <span className="reasons-title">Eligibility Criteria Breakdown:</span>
                <ul className="reasons-list">
                  {reasons.map((reason, rIdx) => (
                    <li key={rIdx} className={`reason-item reason-${reason.type}`}>
                      {reason.type === 'pass' && <CheckCircle2 size={13} className="text-emerald" />}
                      {reason.type === 'fail' && <XCircle size={13} className="text-rose" />}
                      {reason.type === 'warn' && <AlertCircle size={13} className="text-amber" />}
                      <span>{reason.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer Actions */}
              <div className="company-card-footer flex-between">
                <button
                  className="btn btn-ghost btn-sm flex-items"
                  onClick={() => setSelectedCompany(company)}
                >
                  View Details & Rounds <ArrowRight size={14} />
                </button>

                {company.isAlreadyApplied ? (
                  <span className="applied-pill flex-items">
                    <Check size={14} /> Applied
                  </span>
                ) : (
                  <button
                    className={`btn btn-sm ${isEligible ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onApplyToCompany(company)}
                    title={isEligible ? "Add to Application Kanban Tracker" : "Apply anyway"}
                  >
                    <PlusCircle size={14} /> Track Application
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Drawer for Company Details */}
      {selectedCompany && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <div className="modal-header">
              <div className="flex-items" style={{ gap: '0.75rem' }}>
                <img src={selectedCompany.logo} alt={selectedCompany.name} className="company-logo" />
                <div>
                  <h3>{selectedCompany.name} - Placement Drive Details</h3>
                  <p className="subtitle">{selectedCompany.role} • {selectedCompany.ctc}</p>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setSelectedCompany(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h4>Job Description & Role Summary</h4>
                <p>{selectedCompany.description}</p>
              </div>

              <div className="detail-section" style={{ marginTop: '1rem' }}>
                <h4>Hiring Process & Interview Rounds</h4>
                <ol className="rounds-timeline">
                  {selectedCompany.rounds.map((round, index) => (
                    <li key={index} className="timeline-step">
                      <span className="step-num">{index + 1}</span>
                      <span>{round}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="detail-section" style={{ marginTop: '1rem' }}>
                <h4>Eligible Departments & Branches</h4>
                <p>{selectedCompany.allowedBranches.join(", ")}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedCompany(null)}>Close</button>
              {!selectedCompany.isAlreadyApplied && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onApplyToCompany(selectedCompany);
                    setSelectedCompany(null);
                  }}
                >
                  <PlusCircle size={16} /> Track in Applications
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
