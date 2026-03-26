'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const COLORS = {
  red: "#C41E1E", black: "#000000", gold: "#C8A84E",
  white: "#FFFFFF", lightGray: "#E8E6E0", textMuted: "#6B6B6B"
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Role-based redirect logic
    if (user && role) {
      if (role === 'admin') router.push('/admin');
      else if (role === 'teacher') router.push('/kcu/teacher');
      else if (['student', 'parent'].includes(role)) router.push('/kcu');
      else router.push('/');
    }
  }, [user, role, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setErrorMsg(error.message);
      setIsSubmitting(false);
    }
    // On success, AuthContext triggers the useEffect redirect automatically.
  };

  if (loading || (user && role)) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.black, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: COLORS.gold, fontWeight: 800, letterSpacing: 2 }}>AUTHENTICATING...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.black, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <form onSubmit={handleLogin} style={{ background: COLORS.white, padding: 48, borderRadius: 16, width: "100%", maxWidth: 420, textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ width: 60, height: 4, background: COLORS.red, margin: "0 auto 24px", borderRadius: 2 }} />
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 28, fontWeight: 900, color: COLORS.black, marginBottom: 8, letterSpacing: 1 }}>SECURE PORTAL</h1>
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 32, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>Staff & Student Login</p>
        
        {errorMsg && (
          <div style={{ background: "rgba(196,30,30,0.1)", color: COLORS.red, padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
            {errorMsg}
          </div>
        )}

        <input 
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: 14, borderRadius: 8, border: `2px solid ${COLORS.lightGray}`, fontSize: 16, marginBottom: 12, textAlign: "center", boxSizing: "border-box", fontFamily: "inherit" }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: 14, borderRadius: 8, border: `2px solid ${COLORS.lightGray}`, fontSize: 16, marginBottom: 24, textAlign: "center", boxSizing: "border-box", fontFamily: "inherit" }}
        />
        
        <button type="submit" disabled={isSubmitting} style={{ width: "100%", padding: 14, background: COLORS.red, color: COLORS.white, border: "none", borderRadius: 8, fontSize: 16, fontWeight: 800, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}>
          {isSubmitting ? "Authenticating..." : "Enter Portal →"}
        </button>
        
        <div style={{ marginTop: 24 }}>
          <a href="/" style={{ color: COLORS.textMuted, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            ← Back to Home
          </a>
        </div>
      </form>
    </div>
  );
}
