import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StudentProfileModal from './components/StudentProfileModal';
import CompanyEligibility from './components/CompanyEligibility';
import AIResumeAnalyzer from './components/AIResumeAnalyzer';
import InterviewPrep from './components/InterviewPrep';
import ApplicationTracker from './components/ApplicationTracker';
import SkillGapAnalysis from './components/SkillGapAnalysis';
import NotificationCenter from './components/NotificationCenter';
import PlacementAdmin from './components/PlacementAdmin';
import Login from './components/Login';
import AICareerAssistant from './components/AICareerAssistant';
import CodingAptitude from './components/CodingAptitude';

import { auth, onAuthStateChanged, signOut } from './utils/firebase';
import { getStudentProfile, saveStudentProfile, getCompanies, getStudentApplications, saveApplication, setupInitialCompanies, getAnnouncements, saveAnnouncement } from './services/db';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './utils/firebase';
import { checkEligibility } from './utils/eligibilityEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState("eligibility");
  const [userRole, setUserRole] = useState(() => storage.getUserRole());
  const [theme, setTheme] = useState(() => storage.getTheme());

  const [studentProfile, setStudentProfile] = useState({});
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [savedResumeAnalysis, setSavedResumeAnalysis] = useState(null);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(2);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync theme attribute to HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Auth listener & Data Fetching
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        try {
          const profileData = await getStudentProfile(user.uid);
          if (profileData) setStudentProfile(prev => ({ ...prev, ...profileData }));
          
          const dbCompanies = await getCompanies();
          setCompanies(dbCompanies);
          
          const dbApps = await getStudentApplications();
          setApplications(dbApps);
          
          const dbAnnouncements = await getAnnouncements();
          setAnnouncements(dbAnnouncements);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Persist state updates to Firestore
  const handleSaveProfile = async (updatedProfile) => {
    setStudentProfile(updatedProfile);
    try {
      await saveStudentProfile(updatedProfile);
    } catch (err) {
      console.error("Failed to save profile to DB:", err);
    }
  };

  const handleUpdateApplications = async (updatedApps) => {
    setApplications(updatedApps);
    // Push updates to Firestore for each changed app (in a real app we'd track deltas, but here we can just update all or just update them individually in the component)
    for (const app of updatedApps) {
      try {
        await saveApplication(app.id, app);
      } catch(err) { console.error(err); }
    }
  };

  const handleAddCompany = async (newCompany) => {
    const updated = [newCompany, ...companies];
    setCompanies(updated);
    try {
      await setDoc(doc(db, "companies", newCompany.id.toString()), newCompany);
    } catch(err) { console.error(err); }
  };

  const handleDeleteCompany = async (companyId) => {
    const updated = companies.filter(c => c.id !== companyId);
    setCompanies(updated);
    try {
      await deleteDoc(doc(db, "companies", companyId.toString()));
    } catch(err) { console.error(err); }
  };

  const handleAddAnnouncement = async (newAnn) => {
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    setUnreadNotificationsCount(prev => prev + 1);
    try {
      await saveAnnouncement(newAnn);
    } catch(err) { console.error(err); }
  };

  const handleApplyToCompany = (company) => {
    const isAlreadyTracked = applications.some(
      a => a.companyName.toLowerCase() === company.name.toLowerCase()
    );

    if (isAlreadyTracked) {
      alert(`${company.name} is already tracked in your applications!`);
      return;
    }

    const newApp = {
      id: `app-${Date.now()}`,
      companyName: company.name,
      role: company.role,
      ctc: company.ctc,
      status: "Applied",
      appliedDate: new Date().toISOString().split('T')[0],
      eventDate: `Deadline: ${new Date(company.deadline).toLocaleDateString()}`,
      location: company.location,
      notes: `Added from Company Eligibility Checker. ${company.description.slice(0, 80)}...`,
      deadline: company.deadline
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    
    saveApplication(newApp.id, newApp).catch(err => console.error("Failed to save application to db", err));

    alert(`Added ${company.name} (${company.role}) to your Placement Application Kanban Tracker!`);
    setActiveTab("tracker");
  };

  const eligibleCompaniesCount = companies.filter(
    c => checkEligibility(studentProfile, c).isEligible
  ).length;

  if (loading) {
    return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app-main-layout">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={(role) => {
          setUserRole(role);
          storage.setUserRole(role);
        }}
        studentProfile={studentProfile}
        onOpenProfileModal={() => setShowProfileModal(true)}
        unreadCount={unreadNotificationsCount}
        eligibleCount={eligibleCompaniesCount}
        totalCompaniesCount={companies.length}
        theme={theme}
        setTheme={setTheme}
        onLogout={handleLogout}
      />

      {/* Main Active Tab Content View */}
      <main className="container">
        {activeTab === "eligibility" && (
          <CompanyEligibility
            studentProfile={studentProfile}
            companies={companies}
            applications={applications}
            onApplyToCompany={handleApplyToCompany}
            onOpenProfile={() => setShowProfileModal(true)}
          />
        )}

        {activeTab === "resume" && (
          <AIResumeAnalyzer
            studentProfile={studentProfile}
            onUpdateResumeText={(text) => handleSaveProfile({ ...studentProfile, resumeText: text })}
            savedAnalysis={savedResumeAnalysis}
            onSaveAnalysis={(rep) => {
              setSavedResumeAnalysis(rep);
              storage.saveResumeAnalysis(rep);
            }}
          />
        )}

        {activeTab === "interview" && (
          <InterviewPrep />
        )}

        {activeTab === "coding" && (
          <CodingAptitude />
        )}

        {activeTab === "assistant" && (
          <AICareerAssistant studentProfile={studentProfile} />
        )}

        {activeTab === "tracker" && (
          <ApplicationTracker
            applications={applications}
            onUpdateApplications={handleUpdateApplications}
          />
        )}

        {activeTab === "skillgap" && (
          <SkillGapAnalysis
            studentProfile={studentProfile}
          />
        )}

        {activeTab === "notifications" && (
          <NotificationCenter
            announcements={announcements}
            companies={companies}
            onClearUnread={() => setUnreadNotificationsCount(0)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === "admin" && userRole === "admin" && (
          <PlacementAdmin
            companies={companies}
            studentProfile={studentProfile}
            onAddCompany={handleAddCompany}
            onDeleteCompany={handleDeleteCompany}
            onAddAnnouncement={handleAddAnnouncement}
          />
        )}
      </main>

      {/* Student Profile Editor Modal */}
      {showProfileModal && (
        <StudentProfileModal
          profile={studentProfile}
          onSave={handleSaveProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}
