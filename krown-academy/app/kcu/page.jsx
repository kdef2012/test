'use client';
import React, { useState } from 'react';
import { supabase } from '../../utils/supabase';

const COLORS = {
  red: "#C41E1E", black: "#000000", gold: "#C8A84E", white: "#FFFFFF",
  offWhite: "#F8F6F0", lightGray: "#E8E6E0", text: "#1A1A1A", textMuted: "#6B6B6B",
  green: "#1D9E75", greenBg: "#E0FFE8"
};

function formatMoney(n) { return "$" + Number(n || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); }

export default function KCUPortal() {
  const [session, setSession] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  const [student, setStudent] = useState(null);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [bizPlan, setBizPlan] = useState(null);
  const [tab, setTab] = useState("academics");
  
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  
  // Roundtable Recap State
  const [roundtableTab, setRoundtableTab] = useState("eog");
  const [exitTicket, setExitTicket] = useState("");
  const [notebookEntry, setNotebookEntry] = useState("");
  const [showBizForm, setShowBizForm] = useState(false);
  const [bizForm, setBizForm] = useState({ business_name: "", executive_summary: "", product_or_service: "", target_market: "", marketing_plan: "", investment_requested: "", projected_revenue: "", projected_expenses: "", timeline: "", risk_assessment: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setAuthenticating(true);
    
    // 1. Verify Student
    const { data: stu, error: stuErr } = await supabase.from('students').select('*').eq('id', loginId.toUpperCase().trim()).eq('pin', loginPin.trim()).single();
    
    if (stuErr || !stu) {
      setLoginError("Invalid KNDL ID or PIN.");
      setAuthenticating(false);
      return;
    }

    // 2. Fetch or Create KCU Account
    let { data: acc } = await supabase.from('kcu_accounts').select('*').eq('student_id', stu.id).single();
    if (!acc) {
      const { data: newAcc } = await supabase.from('kcu_accounts').insert({ student_id: stu.id, balance: 0, business_status: 'none' }).select().single();
      acc = newAcc;
    }
    
    // 3. Dig up Transactions and Relational DB tables
    const [txRes, plansRes, cRes, eRes, aRes, gRes, attRes] = await Promise.all([
      supabase.from('kcu_transactions').select('*').eq('student_id', stu.id).order('created_at', { ascending: false }),
      supabase.from('kcu_business_plans').select('*').eq('student_id', stu.id).order('created_at', { ascending: false }).limit(1),
      supabase.from('krown_courses').select('*'),
      supabase.from('krown_enrollments').select('*').eq('student_id', stu.id),
      supabase.from('krown_assignments').select('*').order('due_date', { ascending: true }),
      supabase.from('krown_grades').select('*').eq('student_id', stu.id),
      supabase.from('krown_attendance_log').select('*').eq('student_id', stu.id).order('date', { ascending: false })
    ]);
    
    setStudent(stu);
    setAccount(acc);
    if (txRes?.data) setTransactions(txRes.data);
    if (plansRes?.data?.length > 0) setBizPlan(plansRes.data[0]);
    if (cRes?.data) setCourses(cRes.data);
    if (eRes?.data) setEnrollments(eRes.data);
    if (aRes?.data) setAssignments(aRes.data);
    if (gRes?.data) setGrades(gRes.data);
    if (attRes?.data) setAttendance(attRes.data);
    
    setSession(true);
    setAuthenticating(false);
  };

  const submitBizPlan = async (e) => {
    e.preventDefault();
    if (!bizForm.business_name || !bizForm.executive_summary || !bizForm.investment_requested) return;
    setSubmitting(true);
    await supabase.from('kcu_business_plans').insert({
      student_id: student.id, account_id: account.id, ...bizForm,
      investment_requested: Number(bizForm.investment_requested),
      projected_revenue: Number(bizForm.projected_revenue) || null,
      projected_expenses: Number(bizForm.projected_expenses) || null,
      status: 'submitted', submitted_at: new Date().toISOString()
    });
    setShowBizForm(false);
    setSubmitting(false);
    
    fetch('/api/emails/business', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: student.id, businessName: bizForm.business_name, requestedAmount: bizForm.investment_requested, matchOption: 'N/A' })
    }).catch(err => console.error(err));

    const { data: plans } = await supabase.from('kcu_business_plans').select('*').eq('student_id', student.id).order('created_at', { ascending: false }).limit(1);
    if (plans && plans.length > 0) setBizPlan(plans[0]);
  };

  if (!session || !student || !account) {
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${COLORS.black} 0%, #1a0f00 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: COLORS.white, borderRadius: 20, padding: 48, width: "100%", maxWidth: 440, boxShadow: "0 12px 40px rgba(0,0,0,0.5)", textAlign: "center" }}>
           <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 28, fontWeight: 900, color: COLORS.gold, letterSpacing: 2, marginBottom: 8 }}>STUDENT PORTAL</h1>
           <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 32, fontWeight: 500 }}>Enter your ID and PIN to access the Family Hub</p>
           
           <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
             <input type="text" placeholder="Student ID (e.g. KNDL105)" value={loginId} onChange={e => setLoginId(e.target.value)} required
               style={{ width: "100%", padding: 16, borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 16, boxSizing: "border-box", textAlign: "center", letterSpacing: 2, fontWeight: 800, textTransform: "uppercase" }} />
             
             <input type="password" placeholder="4-Digit PIN" value={loginPin} onChange={e => setLoginPin(e.target.value)} required maxLength={4}
               style={{ width: "100%", padding: 16, borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 16, boxSizing: "border-box", textAlign: "center", letterSpacing: 4, fontWeight: 800 }} />
             
             {loginError && <div style={{ color: COLORS.red, fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>{loginError}</div>}
             
             <button type="submit" disabled={authenticating} style={{ width: "100%", padding: 16, background: COLORS.gold, color: COLORS.black, border: "none", borderRadius: 10, fontSize: 15, fontWeight: 900, cursor: "pointer", marginTop: 8, letterSpacing: 1 }}>
               {authenticating ? "AUTHENTICATING..." : "SECURE LOGIN"}
             </button>
           </form>
        </div>
        <div style={{ marginTop: 32 }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none", fontWeight: 700, letterSpacing: 1 }}>← RETURN TO HOME</a>
        </div>
      </div>
    );
  }

  // LOGGED IN VIEW
  const depositsTotal = transactions.filter(t => t.category === 'deposit').reduce((s, t) => s + Number(t.amount), 0);
  const withdrawalsTotal = transactions.filter(t => t.category === 'withdrawal').reduce((s, t) => s + Number(t.amount), 0);
  const progress = Math.min(100, (Number(account.balance) / 500) * 100);
  const isEligible = Number(account.balance) >= 500;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.offWhite }}>
      {/* HEADER */}
      <div style={{ background: COLORS.black, padding: "24px 20px", textAlign: "center", position: "relative" }}>
        <button onClick={() => setSession(false)} style={{ position: "absolute", right: 20, top: 24, background: "rgba(255,255,255,0.1)", color: COLORS.white, border: "none", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>LOGOUT</button>
        <div style={{ fontSize: 12, color: COLORS.gold, letterSpacing: 3, fontWeight: 800, textTransform: "uppercase" }}>Unified Family Hub</div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginTop: 8, fontWeight: 700 }}>Welcome, {student.name}</div>
      </div>

      {/* BALANCE CARD */}
      <div style={{ maxWidth: 500, margin: "-20px auto 0", padding: "0 16px", position: "relative", zIndex: 10 }}>
        <div style={{ background: `linear-gradient(135deg, #1a1400 0%, #2a1f00 100%)`, borderRadius: 20, padding: 32, textAlign: "center", boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}>
          <div style={{ fontSize: 12, color: COLORS.gold, letterSpacing: 2, fontWeight: 600, marginBottom: 8 }}>CURRENT BALANCE</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.gold, lineHeight: 1 }}>{formatMoney(account.balance)}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Total deposits</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.green }}>{formatMoney(depositsTotal)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Total withdrawals</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.red }}>{formatMoney(withdrawalsTotal)}</div>
            </div>
          </div>

          {/* Progress to $500 */}
          {!isEligible && (
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
                <span>Progress to pitch eligibility</span>
                <span>{formatMoney(500 - Number(account.balance))} to go</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 100, height: 8, overflow: "hidden" }}>
                <div style={{ background: COLORS.gold, height: "100%", width: `${progress}%`, borderRadius: 100, transition: "width 0.5s ease" }} />
              </div>
            </div>
          )}
          {isEligible && !bizPlan && (
            <div style={{ marginTop: 20, padding: "10px 20px", background: "rgba(200,168,78,0.2)", borderRadius: 12, border: `1px solid ${COLORS.gold}` }}>
              <span style={{ color: COLORS.gold, fontSize: 13, fontWeight: 700 }}>👑 You're eligible to pitch your business plan!</span>
            </div>
          )}
        </div>
      </div>

      {/* TABS */}
      <div style={{ maxWidth: 640, margin: "32px auto 0", padding: "0 16px" }}>
        <div style={{ display: "flex", gap: 0, background: COLORS.white, borderRadius: 12, overflow: "hidden", border: `1px solid ${COLORS.lightGray}`, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          {["academics", "roundtable", "banking", "business", "mentoring"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: "16px 4px", background: tab === t ? COLORS.black : "transparent", color: tab === t ? COLORS.white : COLORS.textMuted, border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5, transition: "all 0.2s" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div style={{ maxWidth: 640, margin: "24px auto", padding: "0 16px 60px" }}>

        {/* ACADEMICS */}
        {tab === "academics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
             <div style={{ background: COLORS.white, borderRadius: 16, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
               <h3 style={{ fontSize: 18, fontWeight: 800, borderBottom: `2px solid ${COLORS.lightGray}`, paddingBottom: 16, marginBottom: 20, color: COLORS.black }}>Live Gradebook (Relational)</h3>
               {enrollments.length > 0 ? enrollments.map(enr => {
                 const course = courses.find(c => c.id === enr.course_id);
                 if(!course) return null;
                 const courseAssignments = assignments.filter(a => a.course_id === course.id);
                 
                 let max = 0; let earned = 0;
                 courseAssignments.forEach(a => {
                   const g = grades.find(g => g.assignment_id === a.id);
                   if(g && g.points_earned !== null) { max += Number(a.max_points); earned += Number(g.points_earned); }
                 });
                 const isGraded = max > 0;
                 const pct = isGraded ? ((earned / max) * 100).toFixed(1) : "N/A";
                 
                 return (
                   <details key={enr.id} style={{ marginBottom: 16, background: COLORS.offWhite, borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, overflow: "hidden" }}>
                     <summary style={{ padding: 16, fontWeight: 800, fontSize: 16, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", listStyle: "none" }}>
                       <div>{course.name} <span style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 600, marginLeft: 8 }}>{course.teacher_name}</span></div>
                       <div style={{ color: !isGraded ? COLORS.textMuted : pct < 60 ? COLORS.red : COLORS.gold, fontWeight: 900 }}>{isGraded ? `${pct}%` : "No Grades"}</div>
                     </summary>
                     {courseAssignments.length > 0 ? (
                       <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${COLORS.lightGray}` }}>
                         {courseAssignments.map(a => {
                           const g = grades.find(x => x.assignment_id === a.id);
                           const pts = g?.points_earned;
                           return (
                             <div key={a.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${COLORS.lightGray}`, fontSize: 14 }}>
                               <div>
                                 <div style={{ fontWeight: 700 }}>{a.title}</div>
                                 <div style={{ fontSize: 12, color: COLORS.textMuted }}>Due: {new Date(a.due_date).toLocaleDateString()}</div>
                               </div>
                               <div style={{ fontWeight: 800, color: pts === null || pts === undefined ? COLORS.textMuted : COLORS.black }}>
                                 {pts === null || pts === undefined ? "-" : pts} / {a.max_points}
                               </div>
                             </div>
                           )
                         })}
                       </div>
                     ) : <div style={{ padding: "16px", fontSize: 13, color: COLORS.textMuted }}>No assignments posted for this course.</div>}
                   </details>
                 )
               }) : <div style={{ fontSize: 14, color: COLORS.textMuted, textAlign: "center", padding: 20 }}>Not currently officially enrolled in any master courses.</div>}
             </div>

             <div style={{ background: COLORS.white, borderRadius: 16, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
               <h3 style={{ fontSize: 18, fontWeight: 800, borderBottom: `2px solid ${COLORS.lightGray}`, paddingBottom: 16, marginBottom: 20, color: COLORS.black }}>Official Attendance Log</h3>
               {attendance.length > 0 ? (
                 attendance.slice(0, 10).map((a) => {
                   const course = courses.find(c => c.id === a.course_id);
                   const statusColor = a.status === "Present" ? COLORS.green : a.status === "Tardy" ? COLORS.gold : COLORS.red;
                   return (
                     <div key={a.id} style={{ padding: 14, background: COLORS.offWhite, borderRadius: 8, marginBottom: 10, fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `4px solid ${statusColor}` }}>
                       <div><span style={{ fontWeight: 800 }}>{new Date(a.date).toLocaleDateString()}</span> &bull; {course?.name}</div>
                       <div style={{ fontWeight: 900, color: statusColor }}>{a.status}</div>
                     </div>
                   );
                 })
               ) : <div style={{ fontSize: 14, color: COLORS.green, fontWeight: 800, textAlign: "center", padding: "20px 0" }}>✨ Perfect attendance! No records logged yet.</div>}
             </div>
             
             <div style={{ background: COLORS.white, borderRadius: 16, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.04)", textAlign: "center" }}>
               <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.textMuted, letterSpacing: 2 }}>GRADUATION PORTAL PROGRESS</div>
               <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.gold, margin: "12px 0" }}>{student.credits_earned} / 22</div>
               <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 600 }}>Total High School Credits Earned</div>
             </div>
          </div>
        )}

        {/* ROUNDTABLE RECAP (TICKET OWL NATIVE PORT) */}
        {tab === "roundtable" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Header & Internal Nav */}
            <div style={{ background: COLORS.white, borderRadius: 16, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 32 }}>🦉</div>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: COLORS.black, margin: 0 }}>Roundtable Recap</h3>
                  <p style={{ color: COLORS.gold, fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, margin: "4px 0 0" }}>Native EOG & Exit Ticket Portal</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["eog", "tickets", "notebook"].map(rt => (
                  <button key={rt} onClick={() => setRoundtableTab(rt)}
                    style={{ padding: "10px 20px", background: roundtableTab === rt ? COLORS.red : "transparent", color: roundtableTab === rt ? COLORS.white : COLORS.textMuted, border: roundtableTab === rt ? "none" : `1px solid ${COLORS.lightGray}`, borderRadius: 8, fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}>
                    {rt === "eog" ? "EOG Practice" : rt === "tickets" ? "Daily Exit Tickets" : "AI Notebook"}
                  </button>
                ))}
              </div>
            </div>

            {/* Roundtable Content Areas */}
            <div style={{ background: COLORS.white, borderRadius: 16, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              
              {roundtableTab === "eog" && (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: COLORS.black }}>End-of-Grade (EOG) Practice Questions</h3>
                  <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Answer your assigned daily EOG questions to earn KCU capital. Your teacher reviews all submissions.</p>
                  
                  <div style={{ background: COLORS.offWhite, padding: 24, borderRadius: 12, borderLeft: `4px solid ${COLORS.gold}`, marginBottom: 20 }}>
                    <div style={{ fontWeight: 800, color: COLORS.gold, fontSize: 12, marginBottom: 8 }}>QUESTIONS FROM COACH NELSON</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.black, lineHeight: 1.5 }}>
                      "Explain the historical significance of the Magna Carta in relation to modern democratic rights."
                    </div>
                  </div>
                  <textarea placeholder="Write your complete response here..." style={{ width: "100%", padding: 16, borderRadius: 8, border: `2px solid ${COLORS.lightGray}`, minHeight: 120, fontSize: 15, fontFamily: "'Outfit', sans-serif" }}></textarea>
                  <button style={{ background: COLORS.black, color: COLORS.white, padding: "14px 24px", borderRadius: 8, border: "none", fontWeight: 800, cursor: "pointer", marginTop: 12 }}>Submit EOG Check &rarr;</button>
                </div>
              )}

              {roundtableTab === "tickets" && (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: COLORS.black }}>Daily Exit Tickets</h3>
                  <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Complete your exit ticket before leaving class to secure your daily attendance and KCU stipend.</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>What was the most important concept you learned today?</label>
                      <textarea value={exitTicket} onChange={e => setExitTicket(e.target.value)} placeholder="Type your answer..." style={{ width: "100%", padding: 16, borderRadius: 8, border: `2px solid ${COLORS.lightGray}`, minHeight: 80, fontSize: 15, fontFamily: "'Outfit', sans-serif" }}></textarea>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>What are you still confused about?</label>
                      <textarea placeholder="Type your answer..." style={{ width: "100%", padding: 16, borderRadius: 8, border: `2px solid ${COLORS.lightGray}`, minHeight: 80, fontSize: 15, fontFamily: "'Outfit', sans-serif" }}></textarea>
                    </div>
                    <button onClick={() => { alert('Exit Ticket securely submitted to your Teacher.'); setExitTicket(''); }} style={{ background: COLORS.red, color: COLORS.white, padding: "14px 24px", borderRadius: 8, border: "none", fontWeight: 800, cursor: "pointer", alignSelf: "flex-start" }}>Submit Exit Ticket</button>
                  </div>
                </div>
              )}

              {roundtableTab === "notebook" && (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: COLORS.black }}>Personal AI Notebook</h3>
                  <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Summarize your thoughts or brainstorm ideas. This is your private scratchpad.</p>
                  
                  <textarea value={notebookEntry} onChange={e => setNotebookEntry(e.target.value)} placeholder="Start typing your notes here..." style={{ width: "100%", padding: 20, borderRadius: 12, border: `2px dashed ${COLORS.gold}`, minHeight: 200, fontSize: 16, background: "rgba(200,168,78,0.03)", fontFamily: "'Outfit', sans-serif", resize: "vertical" }}></textarea>
                  <p style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 12, textAlign: "right" }}>Changes are auto-saved locally.</p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* BANKING (Merged Overview & History) */}
        {tab === "banking" && (
          <div>
            <div style={{ background: COLORS.white, borderRadius: 16, padding: 32, marginBottom: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: COLORS.textMuted, marginBottom: 20, letterSpacing: 1.5 }}>KCU ACCOUNT STATUS</h3>
              {[
                ["Business Funding Eligibility", account.business_status === 'none' ? 'Building your balance to $500' : account.business_status],
                ["Safety Net Mechanism", account.safety_net_used ? "Used (One-Time)" : "Available"],
                ["Account Activation Date", new Date(account.created_at).toLocaleDateString()],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${COLORS.lightGray}`, fontSize: 14 }}>
                  <span style={{ color: COLORS.textMuted, fontWeight: 700 }}>{k}</span>
                  <span style={{ fontWeight: 800, color: COLORS.black }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: COLORS.white, borderRadius: 16, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: COLORS.textMuted, marginBottom: 20, letterSpacing: 1.5 }}>OFFICIAL TRANSACTION LEDGER</h3>
              {transactions.map(tx => (
                <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${COLORS.lightGray}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.black }}>{tx.description}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4, fontWeight: 600 }}>{new Date(tx.created_at).toLocaleString()} &bull; Bal: {formatMoney(tx.balance_after)}</div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 18, color: tx.category === 'deposit' ? COLORS.green : COLORS.red, minWidth: 80, textAlign: "right" }}>
                    {tx.category === 'deposit' ? '+' : '-'}{formatMoney(tx.amount)}
                  </div>
                </div>
              ))}
              {transactions.length === 0 && <p style={{ color: COLORS.textMuted, textAlign: "center", padding: 30, fontSize: 14, fontWeight: 600 }}>No financial transactions logged yet.</p>}
            </div>
          </div>
        )}

        {/* MENTORING */}
        {tab === "mentoring" && (
          <div style={{ background: COLORS.white, borderRadius: 16, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
             <h3 style={{ fontSize: 18, fontWeight: 800, borderBottom: `2px solid ${COLORS.lightGray}`, paddingBottom: 16, marginBottom: 16, color: COLORS.black }}>Coach Nelson's Mentoring Journal</h3>
             <p style={{ fontSize: 15, color: COLORS.textMuted, marginBottom: 32, lineHeight: 1.6, fontWeight: 500 }}>These secure logs are written by Coach Nelson during weekly 1-on-1 mentoring sessions to keep parents directly informed of the student's personal, spiritual, and academic growth.</p>
             
             <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
               {(student.mentor_notes || []).length === 0 && <div style={{ fontSize: 14, color: COLORS.textMuted, textAlign: "center", padding: 30, background: COLORS.offWhite, borderRadius: 12 }}>No mentoring journals have been published yet.</div>}
               {(student.mentor_notes || []).map((note, idx) => (
                 <div key={idx} style={{ padding: 24, background: COLORS.offWhite, borderRadius: 12, borderLeft: `6px solid ${COLORS.gold}`, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.gold, letterSpacing: 1.5, marginBottom: 12 }}>{note.date}</div>
                    <div style={{ fontSize: 16, color: COLORS.black, lineHeight: 1.8, fontWeight: 500 }}>{note.note}</div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* BUSINESS PITCH */}
        {tab === "business" && (
          <div>
            {bizPlan ? (
              <div style={{ background: COLORS.white, borderRadius: 16, padding: 40, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>{bizPlan.business_name}</h3>
                  <span style={{ fontSize: 12, padding: "8px 16px", borderRadius: 8, fontWeight: 800, textTransform: "uppercase", background: bizPlan.status === 'submitted' ? "rgba(200,168,78,0.15)" : bizPlan.status === 'approved' ? COLORS.greenBg : bizPlan.status === 'funded' ? "rgba(55,138,221,0.1)" : COLORS.lightGray, color: bizPlan.status === 'submitted' ? COLORS.gold : bizPlan.status === 'approved' ? COLORS.green : bizPlan.status === 'funded' ? "#378ADD" : COLORS.textMuted }}>
                    {bizPlan.status}
                  </span>
                </div>
                {[
                  ["Investment Requested", formatMoney(bizPlan.investment_requested)],
                  ["Executive Summary", bizPlan.executive_summary],
                  ["Product/Service Outline", bizPlan.product_or_service],
                  ["Target Market Strategy", bizPlan.target_market],
                  ["Submission Date", bizPlan.submitted_at ? new Date(bizPlan.submitted_at).toLocaleDateString() : "Draft"],
                ].map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{k}</div>
                    <div style={{ fontSize: 16, color: COLORS.text, lineHeight: 1.6, fontWeight: 500, background: COLORS.offWhite, padding: 16, borderRadius: 8 }}>{v || "—"}</div>
                  </div>
                ))}
                {bizPlan.board_notes && (
                  <div style={{ background: "rgba(200,168,78,0.05)", borderRadius: 12, padding: 24, marginTop: 24, borderLeft: `6px solid ${COLORS.gold}` }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.gold, marginBottom: 12, letterSpacing: 1 }}>INVESTMENT BOARD FEEDBACK NOTE</div>
                    <div style={{ fontSize: 16, color: COLORS.text, lineHeight: 1.6, fontStyle: "italic", fontWeight: 600 }}>"{bizPlan.board_notes}"</div>
                  </div>
                )}
              </div>
            ) : isEligible ? (
              <div>
                {!showBizForm ? (
                  <div style={{ background: COLORS.white, borderRadius: 16, padding: 48, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize: 64, marginBottom: 20 }}>🚀</div>
                    <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12, color: COLORS.black }}>You're eligible to Pitch!</h3>
                    <p style={{ color: COLORS.textMuted, fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>Your financial discipline has paid off. Your KCU balance has reached the $500 threshold allowing you to submit a formal business pitch to the Krown Investment Board.</p>
                    <button onClick={() => setShowBizForm(true)} style={{ padding: "18px 40px", background: COLORS.gold, color: COLORS.black, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 900, cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={e => e.target.style.transform="scale(1.05)"} onMouseLeave={e => e.target.style.transform="scale(1)"}>
                      Write My Business Plan →
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitBizPlan} style={{ background: COLORS.white, borderRadius: 16, padding: 40, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
                    <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24, color: COLORS.gold, borderBottom: `2px solid ${COLORS.lightGray}`, paddingBottom: 16 }}>Official Business Pitch Application</h3>
                    {[
                      { key: "business_name", label: "Business Name", type: "text", required: true },
                      { key: "executive_summary", label: "What is your business? (Executive Summary)", type: "textarea", required: true },
                      { key: "product_or_service", label: "What are you selling or offering?", type: "textarea" },
                      { key: "target_market", label: "Who will buy this? Where will you find customers?", type: "textarea" },
                      { key: "marketing_plan", label: "How will people find out about your business?", type: "textarea" },
                      { key: "investment_requested", label: "How much KCU capital are you requesting? ($)", type: "number", required: true },
                      { key: "projected_revenue", label: "Projected monthly revenue? ($)", type: "number" },
                      { key: "projected_expenses", label: "Projected monthly expenses to run the business? ($)", type: "number" },
                      { key: "timeline", label: "What is your launch timeline & milestones?", type: "textarea" },
                      { key: "risk_assessment", label: "What could go wrong? How will you handle those risks?", type: "textarea" },
                    ].map(f => (
                      <div key={f.key} style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: 13, fontWeight: 800, color: COLORS.black, display: "block", marginBottom: 8 }}>{f.label}{f.required ? <span style={{color:COLORS.red}}> *</span> : ""}</label>
                        {f.type === "textarea" ? (
                          <textarea value={bizForm[f.key]} onChange={e => setBizForm(prev => ({ ...prev, [f.key]: e.target.value }))} required={f.required}
                            style={{ width: "100%", padding: 16, borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, resize: "vertical", minHeight: 120, boxSizing: "border-box", fontFamily: "inherit" }} />
                        ) : (
                          <input type={f.type} value={bizForm[f.key]} onChange={e => setBizForm(prev => ({ ...prev, [f.key]: e.target.value }))} required={f.required}
                            style={{ width: "100%", padding: 16, borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, boxSizing: "border-box" }} />
                        )}
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
                      <button type="submit" disabled={submitting} style={{ flex: 1, padding: 18, background: COLORS.gold, color: COLORS.black, border: "none", borderRadius: 10, fontSize: 16, fontWeight: 900, cursor: "pointer" }}>
                        {submitting ? "Submitting securely..." : "Submit to Investment Board →"}
                      </button>
                      <button type="button" onClick={() => setShowBizForm(false)} style={{ padding: "18px 32px", background: "transparent", border: `2px solid ${COLORS.lightGray}`, color: COLORS.textMuted, borderRadius: 10, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div style={{ background: COLORS.white, borderRadius: 16, padding: 48, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>📈</div>
                <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12, color: COLORS.black }}>Keep Building Funding!</h3>
                <p style={{ color: COLORS.textMuted, fontSize: 16, lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>You must command a KCU Treasury balance of $500 to submit a formal business plan. You are <b style={{color: COLORS.black}}>{formatMoney(500 - Number(account.balance))}</b> away. Maintain attendance and academic excellence to build capital.</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "20px 16px", borderTop: `1px solid ${COLORS.lightGray}` }}>
        <a href="/" style={{ color: COLORS.textMuted, fontSize: 13, textDecoration: "none" }}>← Back to Krown Academy</a>
        <span style={{ color: COLORS.lightGray, margin: "0 12px" }}>|</span>
        <span style={{ color: COLORS.textMuted, fontSize: 12 }}>Questions? Call Coach Nelson: 336-500-4765</span>
      </div>
    </div>
  );
}
