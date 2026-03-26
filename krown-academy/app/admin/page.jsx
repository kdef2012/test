'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const COLORS = {
  red: "#C41E1E", darkRed: "#8B0000", black: "#000000", gold: "#C8A84E",
  white: "#FFFFFF", offWhite: "#F8F6F0", lightGray: "#E8E6E0", text: "#1A1A1A", textMuted: "#6B6B6B"
};

// STANDARD NC GRADUATION REQUIREMENTS CATALOG
const CORE_CLASSES = [
  "English I", "English II", "English III", "English IV",
  "Algebra I", "Geometry", "Algebra II", "4th Math",
  "Earth Science", "Biology", "Physical Science/Chemistry",
  "World History", "Civics", "US History", "Economics/Personal Finance",
  "Health/PE"
];

export default function AdminPortal() {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || role !== 'admin') {
        router.push('/login');
      } else {
        fetchData();
      }
    }
  }, [user, role, authLoading, router]);

  const fetchData = async () => {
    setLoading(true);
    const [appRes, stuRes, logRes, profRes] = await Promise.all([
      supabase.from('applications').select('*').order('submitted_at', { ascending: false }),
      supabase.from('students').select('*').order('name'),
      supabase.from('mentoring_logs').select('*').order('logged_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false })
    ]);
    
    if (appRes.data) setApplications(appRes.data);
    if (stuRes.data) setStudents(stuRes.data);
    if (logRes.data) setLogs(logRes.data);
    if (profRes.data) setProfiles(profRes.data);
    setLoading(false);
  };

  if (authLoading || !user || role !== 'admin') {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.black, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <p style={{ color: COLORS.gold, fontWeight: 800, letterSpacing: 2 }}>AUTHENTICATING COMMAND CENTER...</p>
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
          {["Dashboard", "Applications", "Students", "Mentoring", "Emergencies", "Staff & Identities"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ textAlign: "left", background: activeTab === tab ? "rgba(196,30,30,0.15)" : "transparent", color: activeTab === tab ? COLORS.red : "rgba(255,255,255,0.7)", border: "none", padding: "12px 16px", borderRadius: 8, fontSize: 15, fontWeight: activeTab === tab ? 700 : 500, cursor: "pointer", borderLeft: activeTab === tab ? `3px solid ${COLORS.red}` : "3px solid transparent", transition: "all 0.2s" }}
            >
              {tab}
            </button>
          ))}
          <a href="/admin/knightbooks" style={{ textAlign: "left", background: "transparent", color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "12px 16px", borderRadius: 8, fontSize: 15, fontWeight: 500, borderLeft: "3px solid transparent" }}>Knight-Books</a>
          <a href="/admin/kcu" style={{ textAlign: "left", background: "transparent", color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "12px 16px", borderRadius: 8, fontSize: 15, fontWeight: 500, borderLeft: "3px solid transparent" }}>KCU Admin</a>
        </div>
        
        <button onClick={fetchData} style={{ background: "rgba(255,255,255,0.1)", color: COLORS.white, border: "none", padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 20 }}>
          {loading ? "Syncing..." : "Refresh Database"}
        </button>
        <a href="/" style={{ marginTop: 12, textAlign: "center", display: "block", background: "transparent", border: `1px solid rgba(255,255,255,0.2)`, color: "rgba(255,255,255,0.7)", padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = COLORS.white; e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}>
          &larr; Back to Home Screen
        </a>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: "40px 60px", marginLeft: 280 }}>
        {activeTab === "Dashboard" && <DashboardView applications={applications} students={students} />}
        {activeTab === "Applications" && <ApplicationsView applications={applications} fetchData={fetchData} />}
        {activeTab === "Students" && <StudentsView students={students} applications={applications} fetchData={fetchData} />}
        {activeTab === "Mentoring" && <MentoringView students={students} logs={logs} fetchData={fetchData} />}
        {activeTab === "Emergencies" && <EmergenciesView students={students} applications={applications} />}
        {activeTab === "Staff & Identities" && <StaffIdentitiesView profiles={profiles} fetchData={fetchData} />}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------------
// 1. DASHBOARD VIEW
// --------------------------------------------------------------------------------
function DashboardView({ applications, students }) {
  const pendingApps = applications.filter(a => !a.status || a.status === 'Pending').length;
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
    let reason = "";
    if (status === 'Rejected') {
      reason = window.prompt("What is the reason for rejection? (Included in email)");
      if (reason === null) return; // Cancelled
    }

    await supabase.from('applications').update({ status }).eq('id', id);
    
    const appData = applications.find(a => a.id === id);
    if (appData) {
      const studentName = appData.data["Student Full Name"] || appData.data["Full Name"] || "Unknown";
      
      // Auto-Provision Student on Acceptance
      if (status === 'Accepted' && appData.form_type === 'Enrollment Application') {
        const genId = 'KNDL' + Math.floor(100 + Math.random() * 900); // KNDL + 3 digits
        const genPin = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits
        const gradeLevel = appData.data["Grade Level Entering (6-12)"] || "9th";
        
        await supabase.from('students').insert({
          id: genId,
          name: studentName,
          grade: gradeLevel,
          pin: genPin,
          credits_earned: 0,
          credits_needed: 22,
          taken: [],
          needed: []
        });
        
        alert(`Student Profile Auto-Created!\n\nID: ${genId}\nPIN: ${genPin}\nName: ${studentName}\n\nThey have been instantly added to your Student Roster and Degree Tracker.`);
      }

      fetch('/api/emails/applications/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reason,
          formType: appData.form_type,
          parentEmail: appData.data["Email Address"],
          studentName
        })
      }).catch(err => console.error("Email failed:", err));
    }

    setSelectedApp(null);
    fetchData();
  };

  const pending = applications.filter(a => !a.status || a.status === 'Pending');
  const processed = applications.filter(a => a.status && a.status !== 'Pending');

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
                {!selectedApp.status || selectedApp.status === "Pending" ? (
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
// 3. STUDENTS VIEW (Degree Audit Builder & Digital File)
// --------------------------------------------------------------------------------
function StudentsView({ students, applications, fetchData }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [gradeFilter, setGradeFilter] = useState("All");
  const [viewingForm, setViewingForm] = useState(null);

  const filteredStudents = students.filter(s => gradeFilter === "All" || s.grade === gradeFilter);
  
  // Find applications assigned to this student name (fuzzy matching)
  const studentForms = selectedStudent ? applications.filter(a => {
     const n = (a.data["Student Full Name"] || a.data["Full Name"] || "").toLowerCase();
     return n && selectedStudent.name.toLowerCase().includes(n);
  }) : [];
  
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
    setSelectedStudent({...selectedStudent, taken: newTaken, needed: newNeeded, credits_earned: earned});
    
    await supabase.from('students').update({
      taken: newTaken, needed: newNeeded, credits_earned: earned
    }).eq('id', selectedStudent.id);
    
    fetchData(); // Silent background sync
  };

  return (
    <div style={{ display: "flex", gap: 32 }}>
       {/* Roster with Grade Filter */}
       <div style={{ width: 300, display: "flex", flexDirection: "column", gap: 12 }}>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
           <h3 style={{ fontSize: 20, fontWeight: 800 }}>Roster</h3>
           <select value={gradeFilter} onChange={e => { setGradeFilter(e.target.value); setSelectedStudent(null); }} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${COLORS.lightGray}`, fontSize: 12, fontWeight: 700, outline: "none", cursor: "pointer" }}>
             <option value="All">All Grades</option>
             {Array.from(new Set(students.map(s => s.grade))).sort().map(g => <option key={g} value={g}>{g}</option>)}
           </select>
         </div>
         <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "80vh", overflowY: "auto", paddingRight: 8 }}>
           {filteredStudents.map(s => (
             <div key={s.id} onClick={() => setSelectedStudent(s)} style={{ padding: 16, borderRadius: 8, background: selectedStudent?.id === s.id ? COLORS.red : COLORS.white, color: selectedStudent?.id === s.id ? COLORS.white : COLORS.black, cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", transition: "all 0.2s" }}>
               <div style={{ fontWeight: 700, fontSize: 16 }}>{s.name}</div>
               <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>ID: {s.id} &bull; {s.grade}</div>
             </div>
           ))}
           {filteredStudents.length === 0 && <div style={{ fontSize: 13, color: COLORS.textMuted, textAlign: "center", padding: 20 }}>No students in this grade.</div>}
          </div>
         <button onClick={async () => {
           const name = window.prompt("Enter the student's full name:");
           if (!name) return;
           const grade = window.prompt("Enter their grade level (e.g. '9th', '10th'):", "9th");
           if (!grade) return;
           const genId = 'KNDL' + Math.floor(100 + Math.random() * 900);
           const genPin = Math.floor(1000 + Math.random() * 9000).toString();
           await supabase.from('students').insert({ id: genId, name, grade, pin: genPin, credits_earned: 0, credits_needed: 22, taken: [], needed: [] });
           alert(`Student Created!\n\nID: ${genId}\nPIN: ${genPin}\nName: ${name}`);
           fetchData();
         }} style={{ background: COLORS.black, color: COLORS.white, border: "none", padding: "12px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 8, transition: "opacity 0.2s" }} onMouseEnter={e => e.target.style.opacity = 0.8} onMouseLeave={e => e.target.style.opacity = 1}>
           + Add Missing Student
         </button>
       </div>

       <div style={{ flex: 1, background: COLORS.white, borderRadius: 12, padding: 40, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", maxHeight: "90vh", overflowY: "auto" }}>
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

              {/* Digital File: Past Forms */}
              <div style={{ marginBottom: 32, background: COLORS.offWhite, padding: 24, borderRadius: 12, border: `1px solid ${COLORS.lightGray}` }}>
                 <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Student Digital File (Submitted Forms)</h3>
                 {studentForms.length > 0 ? (
                   <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                     {studentForms.map(form => (
                       <button key={form.id} onClick={() => setViewingForm(form)} style={{ padding: "8px 16px", background: COLORS.white, border: `1px solid ${COLORS.red}`, color: COLORS.red, borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                         📄 {form.form_type}
                       </button>
                     ))}
                   </div>
                 ) : (
                   <div style={{ fontSize: 13, color: COLORS.textMuted }}>No submitted applications firmly matching this student's name found in the database.</div>
                 )}
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

       {/* PDF Print Modal Overlay */}
       {viewingForm && (
         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
           <div style={{ background: COLORS.white, width: "100%", maxWidth: 700, borderRadius: 12, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
             <div style={{ padding: "20px 32px", background: COLORS.black, color: COLORS.white, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{viewingForm.form_type} - PDF View</h2>
               <button onClick={() => setViewingForm(null)} style={{ background: "none", border: "none", color: COLORS.white, fontSize: 24, cursor: "pointer" }}>&times;</button>
             </div>
             <div style={{ flex: 1, padding: 40, overflowY: "auto", background: COLORS.white }} id="printable-form-area">
               <div style={{ textAlign: "center", marginBottom: 32, borderBottom: `2px solid ${COLORS.lightGray}`, paddingBottom: 24 }}>
                 <div style={{ fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 800, letterSpacing: 2 }}>KROWN ACADEMY</div>
                 <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>Official Digital Record</div>
               </div>
               <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: COLORS.black }}>{viewingForm.form_type}</h1>
               <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 32 }}>Submitted on: {new Date(viewingForm.submitted_at).toLocaleString()}</div>
               {Object.entries(viewingForm.data).map(([k, v]) => (
                 <div key={k} style={{ marginBottom: 20 }}>
                   <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{k}</div>
                   <div style={{ fontSize: 16, fontWeight: 500, color: COLORS.black, paddingBottom: 8, borderBottom: `1px solid ${COLORS.lightGray}` }}>{v || "N/A"}</div>
                 </div>
               ))}
             </div>
             <div style={{ borderTop: `1px solid ${COLORS.lightGray}`, padding: 24, background: COLORS.offWhite, display: "flex", justifyContent: "flex-end", gap: 16 }}>
               <button onClick={() => setViewingForm(null)} style={{ padding: "10px 20px", fontWeight: 600, background: "transparent", border: `2px solid ${COLORS.lightGray}`, borderRadius: 8, cursor: "pointer" }}>Close</button>
               <button onClick={() => {
                 const printWindow = window.open('', '_blank');
                 printWindow.document.write('<html><head><title>Print Form</title><style>body { font-family: sans-serif; padding: 40px; color: #000; } .line { border-bottom: 1px solid #ccc; margin-bottom: 20px; padding-bottom: 8px; } .label { font-size: 11px; text-transform: uppercase; color: #666; margin-bottom: 4px; font-weight: bold; } .value { font-size: 15px; }</style></head><body>');
                 printWindow.document.write('<div style="text-align:center;margin-bottom:40px;border-bottom:2px solid #000;padding-bottom:20px;"><div style="font-family:serif;font-size:24px;font-weight:bold;letter-spacing:2px;">KROWN ACADEMY</div><div style="font-size:12px;color:#666;margin-top:4px;">OFFICIAL DIGITAL RECORD</div></div>');
                 printWindow.document.write('<h2 style="margin-bottom:8px;">' + viewingForm.form_type + '</h2>');
                 printWindow.document.write('<p style="color:#666;font-size:13px;margin-bottom:32px;">Submitted: ' + new Date(viewingForm.submitted_at).toLocaleString() + '</p>');
                 Object.entries(viewingForm.data).forEach(([k,v]) => {
                   printWindow.document.write('<div class="line"><div class="label">' + k + '</div><div class="value">' + (v || "N/A") + '</div></div>');
                 });
                 printWindow.document.write('</body></html>');
                 printWindow.document.close();
                 printWindow.focus();
                 setTimeout(() => { printWindow.print(); }, 250);
               }} style={{ padding: "10px 20px", fontWeight: 700, background: COLORS.black, color: COLORS.white, border: "none", borderRadius: 8, cursor: "pointer" }}>🖨️ Print Document to PDF</button>
             </div>
           </div>
         </div>
       )}
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
function EmergenciesView({ students, applications }) {
  const [search, setSearch] = useState("");
  const [viewingForm, setViewingForm] = useState(null);

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || (s.medical_alerts && s.medical_alerts.toLowerCase().includes(search.toLowerCase())));

  // Fuzzy match applications for emergency view
  const findMedicalForm = (studentName) => {
     return applications.find(a => a.form_type.includes("Medical") && (a.data["Student Full Name"] || a.data["Full Name"] || "").toLowerCase().includes(studentName.toLowerCase()));
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontSize: 32, fontWeight: 800, color: COLORS.red, textAlign: "center", marginBottom: 8 }}>EMERGENCY CONTACTS</h2>
      <p style={{ textAlign: "center", color: COLORS.textMuted, marginBottom: 32 }}>Optimized for immediate retrieval during sports or campus emergencies.</p>
      
      <input type="text" placeholder="Search by student name or medical condition (e.g. Asthma)..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: 20, borderRadius: 12, border: `2px solid ${COLORS.red}`, fontSize: 18, marginBottom: 40, outline: "none", boxShadow: "0 4px 20px rgba(196,30,30,0.1)" }} />
      
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {filtered.map(s => {
          const medForm = findMedicalForm(s.name);
          return (
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
                  {medForm ? (
                     <button onClick={() => setViewingForm(medForm)} style={{ background: "none", border: "none", color: COLORS.gold, fontWeight: 800, textDecoration: "underline", cursor: "pointer", fontSize: 15, padding: 0 }}>
                       📄 View Parent Medical Form
                     </button>
                  ) : (
                     <div style={{ fontSize: 13, color: COLORS.textMuted }}>No Medical Record mapped to this name.</div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

       {/* PDF Print Modal Overlay */}
       {viewingForm && (
         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
           <div style={{ background: COLORS.white, width: "100%", maxWidth: 700, borderRadius: 12, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
             <div style={{ padding: "20px 32px", background: COLORS.black, color: COLORS.white, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{viewingForm.form_type} - PDF View</h2>
               <button onClick={() => setViewingForm(null)} style={{ background: "none", border: "none", color: COLORS.white, fontSize: 24, cursor: "pointer" }}>&times;</button>
             </div>
             <div style={{ flex: 1, padding: 40, overflowY: "auto", background: COLORS.white }} id="printable-form-area-emerg">
               <div style={{ textAlign: "center", marginBottom: 32, borderBottom: `2px solid ${COLORS.lightGray}`, paddingBottom: 24 }}>
                 <div style={{ fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 800, letterSpacing: 2 }}>KROWN ACADEMY</div>
               </div>
               <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: COLORS.black }}>{viewingForm.form_type}</h1>
               {Object.entries(viewingForm.data).map(([k, v]) => (
                 <div key={k} style={{ marginBottom: 20 }}>
                   <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{k}</div>
                   <div style={{ fontSize: 16, fontWeight: 500, color: COLORS.black, paddingBottom: 8, borderBottom: `1px solid ${COLORS.lightGray}` }}>{v || "N/A"}</div>
                 </div>
               ))}
             </div>
             <div style={{ borderTop: `1px solid ${COLORS.lightGray}`, padding: 24, background: COLORS.offWhite, display: "flex", justifyContent: "flex-end" }}>
               <button onClick={() => setViewingForm(null)} style={{ padding: "10px 20px", fontWeight: 600, background: "transparent", border: `2px solid ${COLORS.lightGray}`, borderRadius: 8, cursor: "pointer" }}>Close Document</button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}

// --------------------------------------------------------------------------------
// 5. STAFF & IDENTITIES VIEW
// --------------------------------------------------------------------------------
function StaffIdentitiesView({ profiles, fetchData }) {
  const [formType, setFormType] = useState('invite'); // 'invite' or 'manual'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('teacher');
  const [status, setStatus] = useState('');

  const renderRoleBadge = (r) => {
    let bg = COLORS.lightGray, color = COLORS.textMuted;
    if (r === 'admin') { bg = '#fef3c7'; color = '#b45309'; }
    if (r === 'teacher') { bg = '#d1fae5'; color = '#047857'; }
    if (r === 'student') { bg = '#e0e7ff'; color = '#4338ca'; }
    return <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", background: bg, color }}>{r}</span>;
  };

  const handleAction = async (e) => {
    e.preventDefault();
    setStatus("Processing...");
    try {
      const endpoint = formType === 'invite' ? '/api/admin/invite-user' : '/api/admin/create-user';
      const body = formType === 'invite' ? { email, role: userRole } : { email, password, role: userRole };
      const res = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus(`Success! ${formType === 'invite' ? 'Invitation sent.' : 'User created.'}`);
      setEmail(''); setPassword(''); fetchData();
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: COLORS.black, marginBottom: 24 }}>Staff & Identities</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        {/* Provisioning Form */}
        <div style={{ background: COLORS.white, padding: 32, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${COLORS.lightGray}` }}>
            <button onClick={() => setFormType('invite')} style={{ flex: 1, padding: 12, background: formType === 'invite' ? COLORS.black : 'transparent', color: formType === 'invite' ? COLORS.white : COLORS.textMuted, border: `1px solid ${COLORS.black}`, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>📨 Send Email Invite</button>
            <button onClick={() => setFormType('manual')} style={{ flex: 1, padding: 12, background: formType === 'manual' ? COLORS.black : 'transparent', color: formType === 'manual' ? COLORS.white : COLORS.textMuted, border: `1px solid ${COLORS.black}`, borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>🔐 Set Manually</button>
          </div>
          
          <form onSubmit={handleAction}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4, display: "block", textTransform: "uppercase" }}>Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, fontSize: 15 }} />
            </div>
            
            {formType === 'manual' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4, display: "block", textTransform: "uppercase" }}>Assign Password</label>
                <input type="text" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, fontSize: 15 }} />
              </div>
            )}
            
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 4, display: "block", textTransform: "uppercase" }}>System Role</label>
              <select value={userRole} onChange={e => setUserRole(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, fontSize: 15, background: "transparent" }}>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>
            
            <button type="submit" style={{ width: "100%", padding: 16, background: COLORS.gold, color: COLORS.black, border: "none", borderRadius: 8, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
              {formType === 'invite' ? 'Send Invitation →' : 'Provision Account →'}
            </button>
            {status && <div style={{ marginTop: 16, fontSize: 13, fontWeight: 600, color: status.includes('Error') ? COLORS.red : COLORS.text }}>{status}</div>}
          </form>
        </div>

        {/* Directory List */}
        <div style={{ background: COLORS.white, padding: 32, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>System Directory</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {profiles && profiles.length > 0 ? profiles.map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${COLORS.lightGray}` }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{p.email}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>Auth ID: {p.id.substring(0,8)}...</div>
                </div>
                {renderRoleBadge(p.role)}
              </div>
            )) : <p style={{ fontSize: 13, color: COLORS.textMuted }}>No profiles fetched. (Ensure RLS policies allow admin read access)</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
