import React, { useState } from 'react';
import { Compass, User, KeyRound, ArrowRight } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../utils/firebase';
import { saveStudentProfile } from '../services/db';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || (isRegister && !name.trim())) {
      setError("Please fill all required fields.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      let userCredential;
      if (isRegister) {
        userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
        // Save initial profile data
        await saveStudentProfile({
          name: name.trim(),
          email: email.trim(),
          role: "student",
          createdAt: new Date().toISOString()
        });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      }
      onLoginSuccess(userCredential.user);
    } catch (err) {
      console.error(err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Attempt to save profile (will merge if exists)
      await saveStudentProfile({
        name: result.user.displayName || "Student",
        email: result.user.email,
        role: "student",
        lastLogin: new Date().toISOString()
      });
      
      onLoginSuccess(result.user);
    } catch (err) {
      console.error(err);
      setError(err.message || "Google Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card glass-card animate-fade-in">
        <div className="brand flex-center" style={{ marginBottom: '2rem', flexDirection: 'column' }}>
          <div className="brand-icon-box gradient-bg" style={{ width: '64px', height: '64px', marginBottom: '1rem' }}>
            <Compass size={36} className="icon-white" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', textAlign: 'center' }}>Career Compass</h2>
          <p className="text-muted" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            Your Smart Placement & Career Assistant
          </p>
        </div>

        {error && (
          <div className="alert-box-warn" style={{ marginBottom: '1.25rem', padding: '0.75rem', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="login-form">
          {isRegister && (
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="flex-items" style={{ gap: '0.4rem' }}><User size={16} /> Full Name</label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="flex-items" style={{ gap: '0.4rem' }}><User size={16} /> Email Address</label>
            <input
              type="email"
              placeholder="e.g. student@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="flex-items" style={{ gap: '0.4rem' }}><KeyRound size={16} /> Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 flex-center" style={{ padding: '0.8rem', fontSize: '1rem', marginBottom: '1rem' }} disabled={loading}>
            {loading ? "Processing..." : (isRegister ? "Create Account" : "Login")} <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
          </button>
          
          <button type="button" onClick={handleGoogleAuth} className="btn btn-outline w-100 flex-center" style={{ padding: '0.8rem', fontSize: '1rem' }} disabled={loading}>
            Continue with Google
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <button type="button" onClick={() => setIsRegister(!isRegister)} className="btn-link" style={{ marginLeft: '0.5rem', color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            {isRegister ? "Login here" : "Register here"}
          </button>
        </p>
      </div>

      <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background-image: 
            radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 2.5rem 2rem;
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </div>
  );
}
