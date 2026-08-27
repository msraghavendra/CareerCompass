import { INITIAL_COMPANIES } from "../data/initialCompanies";
import { INITIAL_APPLICATIONS } from "../data/initialApplications";
import { INITIAL_ANNOUNCEMENTS } from "../data/announcements";

const KEYS = {
  STUDENT_PROFILE: "placement_student_profile",
  COMPANIES: "placement_companies",
  APPLICATIONS: "placement_applications",
  ANNOUNCEMENTS: "placement_announcements",
  RESUME_ANALYSIS: "placement_resume_analysis",
  USER_ROLE: "placement_user_role",
  THEME: "placement_theme",
  IS_LOGGED_IN: "placement_is_logged_in",
  LOGIN_USER: "placement_login_user"
};

export const DEFAULT_STUDENT_PROFILE = {
  name: "Alex Rivera",
  rollNo: "22CS104",
  branch: "CSE",
  cgpa: 8.4,
  arrears: 0,
  passingYear: 2026,
  skills: ["React", "Node.js", "Java", "Data Structures", "SQL", "Git", "Problem Solving"],
  targetRole: "Software Development Engineer (SDE 1)",
  resumeFileName: "Alex_Rivera_SDE_Resume.pdf",
  resumeText: "Alex Rivera | Final Year CSE | 8.4 CGPA | Email: alex@university.edu\nTechnical Skills: Java, C++, React, Node.js, Data Structures, Algorithms, SQL, System Design, Git.\nProjects:\n1. Built an AI Placement Tracker web application using React and Node.js with automated company eligibility matching and PDF resume parser.\n2. Developed a Distributed Rate Limiter service in Java using Redis token bucket algorithm handling 10k requests/sec.\nAchievements: Winner of National Hackathon 2025, 400+ LeetCode problems solved."
};

export const storage = {
  getProfile: () => {
    const data = localStorage.getItem(KEYS.STUDENT_PROFILE);
    return data ? JSON.parse(data) : DEFAULT_STUDENT_PROFILE;
  },
  saveProfile: (profile) => {
    localStorage.setItem(KEYS.STUDENT_PROFILE, JSON.stringify(profile));
  },

  getCompanies: () => {
    const data = localStorage.getItem(KEYS.COMPANIES);
    return data ? JSON.parse(data) : INITIAL_COMPANIES;
  },
  saveCompanies: (companies) => {
    localStorage.setItem(KEYS.COMPANIES, JSON.stringify(companies));
  },

  getApplications: () => {
    const data = localStorage.getItem(KEYS.APPLICATIONS);
    return data ? JSON.parse(data) : INITIAL_APPLICATIONS;
  },
  saveApplications: (apps) => {
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));
  },

  getAnnouncements: () => {
    const data = localStorage.getItem(KEYS.ANNOUNCEMENTS);
    return data ? JSON.parse(data) : INITIAL_ANNOUNCEMENTS;
  },
  saveAnnouncements: (announcements) => {
    localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  },

  getResumeAnalysis: () => {
    const data = localStorage.getItem(KEYS.RESUME_ANALYSIS);
    return data ? JSON.parse(data) : null;
  },
  saveResumeAnalysis: (report) => {
    localStorage.setItem(KEYS.RESUME_ANALYSIS, JSON.stringify(report));
  },

  getUserRole: () => {
    return localStorage.getItem(KEYS.USER_ROLE) || "student";
  },
  setUserRole: (role) => {
    localStorage.setItem(KEYS.USER_ROLE, role);
  },

  getTheme: () => {
    return localStorage.getItem(KEYS.THEME) || "dark";
  },
  setTheme: (theme) => {
    localStorage.setItem(KEYS.THEME, theme);
  },

  getIsLoggedIn: () => {
    return localStorage.getItem(KEYS.IS_LOGGED_IN) === "true";
  },
  setIsLoggedIn: (status) => {
    localStorage.setItem(KEYS.IS_LOGGED_IN, status);
  },

  getLoginUser: () => {
    const data = localStorage.getItem(KEYS.LOGIN_USER);
    return data ? JSON.parse(data) : null;
  },
  setLoginUser: (user) => {
    localStorage.setItem(KEYS.LOGIN_USER, JSON.stringify(user));
  },

  resetAll: () => {
    localStorage.clear();
  }
};
