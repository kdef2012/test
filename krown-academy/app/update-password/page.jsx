'use client';

import React, { useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const COLORS = {
  red: "#C41E1E", black: "#000000", gold: "#C8A84E",
  white: "#FFFFFF", lightGray: "#E8E6E0", textMuted: "#6B6B6B", green: "#1D9E75"
};

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { role } = useAuth(); // If they clicked the email link, they are authenticated but need a password

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    // Attempt to update the user's password securely
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) {
      setErrorMsg(error.message);
      setIsSubmitting(false);
    } else {
      setSuccess(true);
      // Auto-route them to their correct portal
      setTimeout(() => {
        if (role === 'admin') router.push('/admin');
        else if (role === 'teacher') router.push('/kcu/teacher');
        else if (['student', 'parent'].includes(role)) router.push('/kcu');
        else router.push('/login');
      }, 2000);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.black, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <form onSubmit={handleUpdate} style={{ background: COLORS.white, padding: 48, borderRadius: 16, width: "100%", maxWidth: 420, textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ width: 60, height: 4, background: COLORS.gold, margin: "0 auto 24px", borderRadius: 2 }} />
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 900, color: COLORS.black, marginBottom: 8, letterSpacing: 1 }}>WELCOME TO KROWN</h1>
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 32, letterSpacing: 1, fontWeight: 600 }}>Please set your permanent password to activate your account.</p>
        
        {errorMsg && (
          <div style={{ background: "rgba(196,30,30,0.1)", color: COLORS.red, padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
            {errorMsg}
          </div>
        )}

        {success ? (
          <div style={{ color: COLORS.green, fontWeight: 800, fontSize: 18, marginBottom: 20 }}>
            Password set successfully! Redirecting you into the portal...
          </div>
        ) : (
          <>
            <input 
              type="password" 
              placeholder="New Secure Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ width: "100%", padding: 14, borderRadius: 8, border: `2px solid ${COLORS.lightGray}`, fontSize: 16, marginBottom: 24, textAlign: "center", boxSizing: "border-box", fontFamily: "inherit" }}
            />
            
            <button type="submit" disabled={isSubmitting} style={{ width: "100%", padding: 14, background: COLORS.gold, color: COLORS.black, border: "none", borderRadius: 8, fontSize: 16, fontWeight: 800, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? "Saving..." : "Set Password & Enter →"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
