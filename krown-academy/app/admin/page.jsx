'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

const COLORS = {
  red: "#C41E1E", darkRed: "#8B0000", black: "#000000", gold: "#C8A84E",
  white: "#FFFFFF", offWhite: "#F8F6F0", lightGray: "#E8E6E0", text: "#1A1A1A", textMuted: "#6B6B6B"
};

const MASTER_PASSWORD = "KROWN"; // Simple MVP Password

// STANDARD NC GRADUATION REQUIREMENTS CATALOG
const CORE_CLASSES = [
  "English I", "English II", "English III", "English IV",
  "Algebra I", "Geometry", "Algebra II", "4th Math",
  "Earth Science", "Biology", "Physical Science/Chemistry",
  "World History", "Civics", "US History", "Economics/Personal Finance",
  "Health/PE"
];

export default function AdminPortal() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authentication
  const handleAuth = (e) => {
    e.preventDefault();
    if (password === MASTER_PASSWORD) {
      setAuth(true);
      fetchData();
    } else {
      alert("Invalid Master Password. Access Denied.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const [appRes, stuRes, logRes] = await Promise.all([
      supabase.from('applications').select('*').order('submitted_at', { ascending: false }),
      supabase.from('students').select('*').order('name'),
      supabase.from('mentoring_logs').select('*').order('logged_at', { ascending: false })
    ]);
    
    if (appRes.data) setApplications(appRes.data);
    if (stuRes.data) setStudents(stuRes.data);
    if (logRes.data) setLogs(logRes.data);
    setLoading(false);
  };

  if (!auth) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.black, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <form onSubmit={handleAuth} style={{ background: COLORS.white, padding: 40, borderRadius: 12, width: "100%", maxWidth: 400, textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ width: 60, height: 4, background: COLORS.red, margin: "0 auto 20px" }} />
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 800, color: COLORS.black, marginBottom: 8 }}>KROWN ACADEMY</h1>
          <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 32, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>Secure Admin Portal</p>
          <input 
            type="password" 
            placeholder="Master Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 14, borderRadius: 8, border: `2px solid ${COLORS.lightGray}`, fontSize: 16, marginBottom: 20, textAlign: "center", fontFamily: "inherit" }}
          />
          <button type="submit" style={{ width: "100%", padding: 14, background: COLORS.red, color: COLORS.white, border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }}
            onMouseEnter={e => e.target.style.opacity = 0.9} onMouseLeave={e => e.target.style.opacity = 1}>
            Authenticate &rarr;
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.offWhite, display: "flex", fontFamily: "'Outfit', sans-serif", color: COLORS.text }}>
      {/* SIDEBAR */}
      <div style={{ width: 280, background: COLORS.black, color: COLORS.white, padding: 32, display: "flex", flexDirection: "column", position: "fixed", h: "100vh", top: 0, bottom: 0, overflowY: "auto" }}>
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 800, color: COLORS.gold }}>KROWN ADMIN</h2>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>Command Center</div>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {["Dashboard", "Applications", "Students", "Mentoring", "Emergencies"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ textAlign: "left", background: activeTab === tab ? "rgba(196,30,30,0.15)" : "transparent", color: activeTab === tab ? COLORS.red : "rgba(255,255,255,0.7)", border: "none", padding: "12px 16px", borderRadius: 8, fontSize: 15, fontWeight: activeTab === tab ? 700 : 500, cursor: "pointer", borderLeft: activeTab === tab ? `3px solid ${COLORS.red}` : "3px solid transparent", transition: "all 0.2s" }}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <button onClick={fetchData} style={{ background: "rgba(255,255,255,0.1)", color: COLORS.white, border: "none", padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 20 }}>
          {loading ? "Syncing..." : "Refresh Database"}
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: "40px 60px", marginLeft: 280 }}>
        {activeTab === "Dashboard" && <DashboardView applications={applications} students={students} />}
        {activeTab === "Applications" && <ApplicationsView applications={applications} fetchData={fetchData} />}
        {activeTab === "Students" && <StudentsView students={students} fetchData={fetchData} />}
        {activeTab === "Mentoring" && <MentoringView students={students} logs={logs} fetchData={fetchData} />}
        {activeTab === "Emergencies" && <EmergenciesView students={students} />}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------------
// 1. DASHBOARD VIEW
// --------------------------------------------------------------------------------
function DashboardView({ applications, students }) {
  const pendingApps = applications.filter(a => a.status === 'Pending').length;
  const avgReady = students.length ? Math.round((students.reduce((sum, s) => sum + (s.credits_earned / s.credits_needed), 0) / students.length) * 100) : 0;
  const fullyFunded = students.filter(s => s.funding_status === 'Approved').length;

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: COLORS.black, marginBottom: 24 }}>System Overview</h2>
      <div className="grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 40 }}>
        <StatCard title="Total Enrolled" value={students.length} />
        <StatCard title="Pending Apps" value={pendingApps} color={pendingApps > 0 ? COLORS.red : COLORS.black} />
        <StatCard title="College Readiness" value={`${avgReady}%`} color={avgReady < 80 ? COLORS.gold : "#10b981"} />
        <StatCard title="Fully Funded (OS)" value={fullyFunded} />
      </div>

      <div style={{ background: COLORS.white, borderRadius: 12, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Recent Applications</h3>
        {applications.slice(0, 5).map(app => (
          <div key={app.id} style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${COLORS.lightGray}` }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{app.form_type}</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>{app.data["Student Full Name"] || app.data["Full Name"] || "Unknown Applicant"}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 50, background: app.status === 'Pending' ? '#fef3c7' : '#d1fae5', color: app.status === 'Pending' ? '#b45309' : '#047857', alignSelf: "flex-start" }}>
              {app.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, color = COLORS.black }) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", borderTop: `4px solid ${color}` }}>
      <div style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 36, fontWeight: 800, color: color }}>{value}</div>
    </div>
  );
}

// --------------------------------------------------------------------------------
// 2. APPLICATIONS VIEW (Tinder-Style Review)
// --------------------------------------------------------------------------------
function ApplicationsView({ applications, fetchData }) {
  const [selectedApp, setSelectedApp] = useState(null);

  const updateStatus = async (id, status) => {
    await supabase.from('applications').update({ status }).eq('id', id);
    setSelectedApp(null);
    fetchData();
  };

  const pending = applications.filter(a => a.status === 'Pending');
  const processed = applications.filter(a => a.status !== 'Pending');

  return (
    <div style={{ display: "flex", gap: 32, height: "85vh" }}>
      {/* Left List */}
      <div style={{ width: 350, background: COLORS.white, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: 20, borderBottom: `1px solid ${COLORS.lightGray}`, background: COLORS.black, color: COLORS.white }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Inbox ({pending.length})</h3>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {pending.map(app => (
             <div key={app.id} onClick={() => setSelectedApp(app)} style={{ padding: 20, borderBottom: `1px solid ${COLORS.lightGray}`, cursor: "pointer", background: selectedApp?.id === app.id ? COLORS.offWhite : "transparent", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = COLORS.offWhite} onMouseLeave={e => e.currentTarget.style.background = selectedApp?.id === app.id ? COLORS.offWhite : "transparent"}>
               <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.red, marginBottom: 4 }}>{app.form_type}</div>
               <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.black }}>{app.data["Student Full Name"] || app.data["Full Name"] || "Unknown"}</div>
               <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 8 }}>{new Date(app.submitted_at).toLocaleDateString()}</div>
             </div>
          ))}
          {processed.length > 0 && <div style={{ padding: "12px 20px", background: COLORS.lightGray, fontSize: 12, fontWeight: 700 }}>Processed Forms</div>}
          {processed.map(app => (
             <div key={app.id} onClick={() => setSelectedApp(app)} style={{ padding: 20, borderBottom: `1px solid ${COLORS.lightGray}`, cursor: "pointer", opacity: 0.6 }}>
               <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, marginBottom: 4 }}>{app.form_type} - {app.status}</div>
               <div style={{ fontWeight: 700, fontSize: 15 }}>{app.data["Student Full Name"] || app.data["Full Name"]}</div>
             </div>
          ))}
        </div>
      </div>

      {/* Right Detail Pane */}
      <div style={{ flex: 1, background: COLORS.white, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", padding: 40, overflowY: "auto" }}>
        {selectedApp ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
              <div>
                <div style={{ fontSize: 14, color: COLORS.red, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{selectedApp.form_type}</div>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: COLORS.black }}>{selectedApp.data["Student Full Name"] || selectedApp.data["Full Name"]}</h2>
                <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>Submitted: {new Date(selectedApp.submitted_at).toLocaleString()}</div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {selectedApp.status === "Pending" ? (
                  <>
                    <button onClick={() => updateStatus(selectedApp.id, 'Rejected')} style={{ padding: "10px 20px", background: COLORS.lightGray, color: COLORS.black, border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Reject</button>
                    <button onClick={() => updateStatus(selectedApp.id, 'Waitlisted')} style={{ padding: "10px 20px", background: COLORS.gold, color: COLORS.black, border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Waitlist</button>
                    <button onClick={() => updateStatus(selectedApp.id, 'Accepted')} style={{ padding: "10px 20px", background: COLORS.red, color: COLORS.white, border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Accept Applicant</button>
                  </>
                ) : (
                  <div style={{ fontWeight: 700, fontSize: 16, color: selectedApp.status === 'Accepted' ? '#10b981' : COLORS.textMuted }}>
                    Status: {selectedApp.status}
                  </div>
                )}
              </div>
            </div>

            <div style={{ borderTop: `2px solid ${COLORS.lightGray}`, paddingTop: 32 }}>
              {Object.entries(selectedApp.data).map(([key, val]) => (
                <div key={key} style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 13, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>{key}</label>
                  <div style={{ fontSize: 16, color: COLORS.black, lineHeight: 1.6, background: COLORS.offWhite, padding: 16, borderRadius: 8 }}>{val || "N/A"}</div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: 40, borderTop: `2px solid ${COLORS.lightGray}`, paddingTop: 32, display: "flex", gap: 16 }}>
               <a href={`mailto:${selectedApp.data["Email Address"] || ""}?subject=Krown Academy Application Update`} style={{ textDecoration: "none", padding: "12px 24px", background: COLORS.black, color: COLORS.white, borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
                 Send Email to Parent
               </a>
               <button onClick={() => window.print()} style={{ padding: "12px 24px", background: "transparent", border: `2px solid ${COLORS.lightGray}`, color: COLORS.black, borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                 Print to PDF
               </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: COLORS.textMuted, fontSize: 16, fontWeight: 500 }}>
            Select an application from the inbox to review.
          </div>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------------
// 3. STUDENTS VIEW (Degree Audit Builder)
// --------------------------------------------------------------------------------
function StudentsView({ students, fetchData }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const toggleClass = async (className) => {
    if (!selectedStudent) return;
    const taken = selectedStudent.taken || [];
    const needed = selectedStudent.needed || [];
    
    let newTaken, newNeeded;
    if (taken.includes(className)) {
      // Move from taken -> needed
      newTaken = taken.filter(c => c !== className);
      newNeeded = [...needed, className];
    } else {
      // Move from needed -> taken
      newTaken = [...taken, className];
      newNeeded = needed.filter(c => c !== className);
    }
    
    const earned = newTaken.length;
    // Fast optimistic UI update
    setSelectedStudent({...selectedStudent, taken: newTaken, needed: newNeeded, credits_earned: earned});
    
    await supabase.from('students').update({
      taken: newTaken, needed: newNeeded, credits_earned: earned
    }).eq('id', selectedStudent.id);
    
    fetchData(); // Silent background sync
  };

  return (
    <div style={{ display: "flex", gap: 32 }}>
       <div style={{ width: 300, display: "flex", flexDirection: "column", gap: 12 }}>
         <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Roster</h3>
         {students.map(s => (
           <div key={s.id} onClick={() => setSelectedStudent(s)} style={{ padding: 16, borderRadius: 8, background: selectedStudent?.id === s.id ? COLORS.red : COLORS.white, color: selectedStudent?.id === s.id ? COLORS.white : COLORS.black, cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", transition: "all 0.2s" }}>
             <div style={{ fontWeight: 700, fontSize: 16 }}>{s.name}</div>
             <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>ID: {s.id} &bull; {s.grade}</div>
           </div>
         ))}
       </div>

       <div style={{ flex: 1, background: COLORS.white, borderRadius: 12, padding: 40, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          {selectedStudent ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `2px solid ${COLORS.lightGray}`, paddingBottom: 24, marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: 32, fontWeight: 800, color: COLORS.black }}>{selectedStudent.name}</h2>
                  <div style={{ fontSize: 15, color: COLORS.textMuted, marginTop: 4 }}>Degree Tracker &bull; Requires 22 Credits</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: COLORS.gold, lineHeight: 1 }}>{selectedStudent.credits_earned}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Credits Earned</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Core Requirements Tracker</h3>
                  {CORE_CLASSES.map(cls => {
                    const isTaken = (selectedStudent.taken || []).includes(cls);
                    return (
                      <label key={cls} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: isTaken ? '#f0fdf4' : COLORS.offWhite, borderRadius: 8, marginBottom: 8, cursor: "pointer", border: `1px solid ${isTaken ? '#10b981' : COLORS.lightGray}` }}>
                        <input type="checkbox" checked={isTaken} onChange={() => toggleClass(cls)} style={{ width: 18, height: 18, accentColor: COLORS.red, cursor: "pointer" }} />
                        <span style={{ fontSize: 14, fontWeight: isTaken ? 700 : 500, color: isTaken ? COLORS.black : COLORS.textMuted, textDecoration: isTaken ? "line-through" : "none" }}>{cls}</span>
                      </label>
                    )
                  })}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Electives & Other Passed</h3>
                  <div style={{ background: COLORS.offWhite, padding: 24, borderRadius: 12, minHeight: 150 }}>
                     {(selectedStudent.taken || []).filter(c => !CORE_CLASSES.includes(c)).map(cls => (
                       <div key={cls} style={{ fontSize: 14, fontWeight: 600, padding: "8px 12px", background: COLORS.white, borderRadius: 6, marginBottom: 8, display: "inline-block", marginRight: 8, border: `1px solid ${COLORS.lightGray}` }}>
                         {cls} <button onClick={() => toggleClass(cls)} style={{ background: "none", border: "none", color: COLORS.red, marginLeft: 8, cursor: "pointer", fontWeight: 800 }}>&times;</button>
                       </div>
                     ))}
                     <div style={{ marginTop: 16 }}>
                       <input type="text" placeholder="Add custom elective..." onKeyDown={e => { if (e.key === 'Enter' && e.target.value) { toggleClass(e.target.value); e.target.value = ''; } }} style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, fontSize: 14 }} />
                     </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: COLORS.textMuted, textAlign: "center", paddingTop: 100 }}>Select a student to manage their Degree Audit.</div>
          )}
       </div>
    </div>
  );
}

// --------------------------------------------------------------------------------
// 4. MENTORING LOGS
// --------------------------------------------------------------------------------
function MentoringView({ students, logs, fetchData }) {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [logText, setLogText] = useState("");
  const [saving, setSaving] = useState(false);

  const saveLog = async () => {
    if (!selectedStudentId || !logText) return;
    setSaving(true);
    await supabase.from('mentoring_logs').insert({
      student_id: selectedStudentId,
      log_text: logText
    });
    setLogText("");
    fetchData();
    setSaving(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
      <div style={{ background: COLORS.white, padding: 32, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>New Mentoring Log</h2>
        <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} style={{ width: "100%", padding: 14, borderRadius: 8, border: `2px solid ${COLORS.lightGray}`, marginBottom: 20, fontSize: 15 }}>
          <option value="">Select Student...</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
        </select>
        <textarea 
          value={logText}
          onChange={e => setLogText(e.target.value)}
          placeholder="Notes from Friday 1-on-1 session: Psychological state, academic goals, behavioral updates..."
          style={{ width: "100%", padding: 16, borderRadius: 8, border: `2px solid ${COLORS.lightGray}`, height: 200, resize: "vertical", fontSize: 15, fontFamily: "inherit", marginBottom: 20, lineHeight: 1.6 }}
        />
        <button onClick={saveLog} disabled={saving} style={{ width: "100%", padding: 14, background: COLORS.black, color: COLORS.gold, fontWeight: 700, borderRadius: 8, border: "none", cursor: "pointer", fontSize: 16 }}>
          {saving ? "Saving to Secure Vault..." : "Save Secure Log"}
        </button>
      </div>

      <div style={{ background: COLORS.white, padding: 32, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Recent Logs</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: "70vh", overflowY: "auto" }}>
          {logs.map(log => {
            const stu = students.find(s => s.id === log.student_id);
            return (
              <div key={log.id} style={{ padding: 20, background: COLORS.offWhite, borderRadius: 8, borderLeft: `4px solid ${COLORS.darkRed}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: 15 }}>{stu ? stu.name : log.student_id}</span>
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>{new Date(log.logged_at).toLocaleString()}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: COLORS.text, margin: 0 }}>{log.log_text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------------
// 5. EMERGENCIES (Quick Search)
// --------------------------------------------------------------------------------
function EmergenciesView({ students }) {
  const [search, setSearch] = useState("");
  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || (s.medical_alerts && s.medical_alerts.toLowerCase().includes(search.toLowerCase())));

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontSize: 32, fontWeight: 800, color: COLORS.red, textAlign: "center", marginBottom: 8 }}>EMERGENCY CONTACTS</h2>
      <p style={{ textAlign: "center", color: COLORS.textMuted, marginBottom: 32 }}>Optimized for immediate retrieval during sports or campus emergencies.</p>
      
      <input type="text" placeholder="Search by student name or medical condition (e.g. Asthma)..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: 20, borderRadius: 12, border: `2px solid ${COLORS.red}`, fontSize: 18, marginBottom: 40, outline: "none", boxShadow: "0 4px 20px rgba(196,30,30,0.1)" }} />
      
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {filtered.map(s => (
          <div key={s.id} style={{ background: COLORS.white, padding: 24, borderRadius: 12, borderLeft: `6px solid ${s.medical_alerts !== 'None' ? COLORS.red : COLORS.black}`, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: 24, fontWeight: 800 }}>{s.name}</h3>
              <div style={{ fontWeight: 700, fontSize: 14, padding: "6px 12px", background: COLORS.offWhite, borderRadius: 6 }}>ID: {s.id}</div>
            </div>
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, textTransform: "uppercase", fontWeight: 700, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 4 }}>Medical Alerts / Conditions</div>
                <div style={{ fontSize: 16, color: s.medical_alerts !== 'None' ? COLORS.red : COLORS.black, fontWeight: s.medical_alerts !== 'None' ? 800 : 500 }}>{s.medical_alerts || 'None'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, textTransform: "uppercase", fontWeight: 700, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 4 }}>Emergency Actions</div>
                <a href={`/admin`} onClick={e => { e.preventDefault(); alert("In a full build, this would fetch guardian info from the applications table!"); }} style={{ color: COLORS.gold, fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>View Parent Forms</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
