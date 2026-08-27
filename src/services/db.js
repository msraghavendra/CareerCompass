import { db, doc, setDoc, getDoc, collection, getDocs, query, where, auth } from '../utils/firebase';

const USERS_COLLECTION = "users";
const STUDENTS_COLLECTION = "students";
const COMPANIES_COLLECTION = "companies";
const APPLICATIONS_COLLECTION = "applications";
const ANNOUNCEMENTS_COLLECTION = "announcements";

// Get current user ID
export const getCurrentUserId = () => auth.currentUser?.uid;

// Profile Management
export const saveStudentProfile = async (profileData) => {
  const uid = getCurrentUserId();
  if (!uid) throw new Error("User not authenticated");
  
  await setDoc(doc(db, STUDENTS_COLLECTION, uid), profileData, { merge: true });
};

export const getStudentProfile = async (uid) => {
  if (!uid) uid = getCurrentUserId();
  if (!uid) return null;

  const docSnap = await getDoc(doc(db, STUDENTS_COLLECTION, uid));
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

// Application Management
export const saveApplication = async (applicationId, applicationData) => {
  const uid = getCurrentUserId();
  if (!uid) throw new Error("User not authenticated");

  await setDoc(doc(db, APPLICATIONS_COLLECTION, applicationId), {
    ...applicationData,
    studentId: uid,
    lastUpdated: new Date().toISOString()
  }, { merge: true });
};

export const getStudentApplications = async () => {
  const uid = getCurrentUserId();
  if (!uid) return [];

  const q = query(collection(db, APPLICATIONS_COLLECTION), where("studentId", "==", uid));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Companies Management
export const getCompanies = async () => {
  const querySnapshot = await getDocs(collection(db, COMPANIES_COLLECTION));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Setup dummy data (for Admin only, initial setup)
export const setupInitialCompanies = async (dummyCompanies) => {
  for (const company of dummyCompanies) {
    await setDoc(doc(db, COMPANIES_COLLECTION, company.id.toString()), company);
  }
};

// Announcements Management
export const saveAnnouncement = async (announcementData) => {
  const newRef = doc(collection(db, ANNOUNCEMENTS_COLLECTION));
  await setDoc(newRef, announcementData);
};

export const getAnnouncements = async () => {
  const querySnapshot = await getDocs(collection(db, ANNOUNCEMENTS_COLLECTION));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
