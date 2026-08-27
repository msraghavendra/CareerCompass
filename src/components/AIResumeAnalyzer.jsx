import React, { useState } from 'react';
import {
  FileText, Upload, Sparkles, AlertTriangle, CheckCircle2, XCircle,
  RefreshCw, Loader2
} from 'lucide-react';
import { storage as firebaseStorage, ref, uploadBytesResumable, getDownloadURL, auth } from '../utils/firebase';
import apiClient from '../services/apiClient';
import { TARGET_ROLES } from '../data/roleSkillBenchmarks';

export default function AIResumeAnalyzer({
  studentProfile,
  onUpdateResumeText,
  savedAnalysis,
  onSaveAnalysis
}) {
  const [targetRole, setTargetRole] = useState(studentProfile.targetRole || "Software Development Engineer (SDE 1)");
  const [resumeText, setResumeText] = useState(studentProfile.resumeText || "");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(savedAnalysis);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to upload a resume.");
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(0);

    try {
      const storageRef = ref(firebaseStorage, `resumes/${user.uid}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, 
        (error) => {
          console.error("Upload error:", error);
          alert("Failed to upload file.");
          setIsAnalyzing(false);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          const formData = new FormData();
          formData.append('fileUrl', downloadURL);
          formData.append('targetRole', targetRole);

          const response = await apiClient.post('/api/ai/resume/analyze', formData);
          const results = response.data;
          
          setReport(results);
          onSaveAnalysis(results);
          onUpdateResumeText("File uploaded and analyzed via backend.");
          setIsAnalyzing(false);
        }
      );
    } catch (error) {
      console.error("Resume analysis error:", error);
      alert("Failed to analyze resume.");
      setIsAnalyzing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "score-high";
    if (score >= 60) return "score-med";
    return "score-low";
  };

  return (
    <div className="section-container animate-fade-in">
      <div className="banner-card glass-card flex-between">
        <div>
          <div className="flex-items" style={{ gap: '0.5rem' }}>
            <FileText className="icon-indigo" size={26} />
            <h2 className="section-title">AI Resume Analyzer & ATS Audit</h2>
          </div>
          <p className="section-subtitle">
            Upload your resume PDF for instant ATS keyword matching, formatting audits, weak section detection, and AI bullet point rewrite suggestions.
          </p>
        </div>

        <div className="target-role-selector glass-card flex-items">
          <label>Target Role:</label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          >
            {TARGET_ROLES.map(role => (
              <option key={role.id} value={role.name}>{role.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="resume-grid" style={{ marginTop: '1.5rem' }}>
        <div className="uploader-column glass-card">
          <h3>1. Upload Resume PDF</h3>
          
          <div
            className={`dropzone ${dragActive ? 'dropzone-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload size={32} className="icon-indigo" />
            <p className="dropzone-text">
              <strong>Drag & Drop PDF</strong> or click to browse
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="file-input-hidden"
              id="resume-file-input"
            />
            <label htmlFor="resume-file-input" className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>
              Select File
            </label>
          </div>
        </div>

        {report && !isAnalyzing && (
          <div className="report-column glass-card animate-fade-in">
            <div className="score-hero-box flex-between glass-card">
              <div>
                <span className="score-hero-label">Overall ATS Resume Score</span>
                <h2 className="score-hero-val">
                  <span className={getScoreColor(report.overallScore)}>{report.overallScore}</span>
                  <span className="max-score">/ 100</span>
                </h2>
              </div>
              <div className="score-circle-visual">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={report.overallScore >= 80 ? '#10b981' : report.overallScore >= 60 ? '#f59e0b' : '#f43f5e'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * report.overallScore) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="score-circle-center">{report.overallScore}%</div>
              </div>
            </div>

            <div className="report-block" style={{ marginTop: '1.25rem' }}>
              <h4>Section Completeness Checklist</h4>
              <div className="checklist-grid" style={{ marginTop: '0.5rem' }}>
                {report.sectionsCheck.map((sec, idx) => (
                  <div key={idx} className={`checklist-item ${sec.found ? 'item-pass' : 'item-fail'}`}>
                    {sec.found ? <CheckCircle2 size={16} className="text-emerald" /> : <XCircle size={16} className="text-rose" />}
                    <span>{sec.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="report-block" style={{ marginTop: '1.25rem' }}>
              <div className="flex-items">
                <Sparkles size={18} className="icon-indigo" />
                <h4>AI Recommended Fixes</h4>
              </div>
              <div className="recommendations-list" style={{ marginTop: '0.5rem' }}>
                {report.aiRecommendations.map((rec, idx) => (
                  <div key={idx} className="rec-card glass-card flex-items">
                    <Sparkles size={16} className="text-amber" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
