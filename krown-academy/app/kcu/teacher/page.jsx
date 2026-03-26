'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../utils/supabase';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

const COLORS = {
  red: "#C41E1E", black: "#000000", gold: "#C8A84E", white: "#FFFFFF",
  offWhite: "#F8F6F0", lightGray: "#E8E6E0", text: "#1A1A1A", textMuted: "#6B6B6B",
  green: "#1D9E75", greenBg: "#E0FFE8"
};

function formatMoney(n) { return "$" + Number(n || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); }

function Toast({ message, type = "success" }) {
  if (!message) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, background: type === "success" ? COLORS.green : COLORS.red, color: COLORS.white, padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, zIndex: 9999, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
      {message}
    </div>
  );
}

export default function KCUTeacher() {
  const { user, profile, role, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const teacherName = profile?.display_name || "System User"; // Fallback if no specific display name set
  const [students, setStudents] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [recentTxs, setRecentTxs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");
  const [customAmount, setCustomAmount] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Banking");

  const showToast = (msg, type = "success") => {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [stuRes, accRes, txRes, cRes, eRes, aRes, gRes, attRes] = await Promise.all([
      supabase.from('students').select('*').order('name'),
      supabase.from('kcu_accounts').select('*'),
      supabase.from('kcu_transactions').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('krown_courses').select('*'),
      supabase.from('krown_enrollments').select('*'),
      supabase.from('krown_assignments').select('*').order('due_date', { ascending: true }),
      supabase.from('krown_grades').select('*'),
      supabase.from('krown_attendance_log').select('*')
    ]);
    if (stuRes.data) setStudents(stuRes.data);
    if (accRes.data) setAccounts(accRes.data);
    if (txRes.data) setRecentTxs(txRes.data);
    if (cRes?.data) setCourses(cRes.data);
    if (eRes?.data) setEnrollments(eRes.data);
    if (aRes?.data) setAssignments(aRes.data);
    if (gRes?.data) setGrades(gRes.data);
    if (attRes?.data) setAttendance(attRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user || (role !== 'teacher' && role !== 'admin')) router.push('/login');
      else fetchData();
    }
  }, [user, role, authLoading, router, fetchData]);

  const processTransaction = async (studentId, type, category, amount, description) => {
    const account = accounts.find(a => a.student_id === studentId);
    if (!account) { showToast("Student has no KCU account", "error"); return; }
    const currentBalance = Number(account.balance);
    let newBalance;
    if (category === 'deposit') { newBalance = currentBalance + Number(amount); }
    else {
      if (currentBalance < Number(amount)) { showToast("Insufficient balance", "error"); return; }
      newBalance = currentBalance - Number(amount);
    }
    const { error } = await supabase.from('kcu_transactions').insert({
      account_id: account.id, student_id: studentId, type, category, amount: Number(amount),
      description: `${description} (by ${teacherName})`, balance_after: newBalance, created_by: teacherName
    });
    if (error) { showToast("Error: " + error.message, "error"); return; }
    const upd = { balance: newBalance, updated_at: new Date().toISOString() };
    if (newBalance >= 500 && account.business_status === 'none') upd.business_status = 'eligible';
    await supabase.from('kcu_accounts').update(upd).eq('id', account.id);
    showToast(`${category === 'deposit' ? '+' : '-'}${formatMoney(amount)} for ${getName(studentId)} → ${formatMoney(newBalance)}`);
    fetchData();
  };

  const getName = (sid) => students.find(s => s.id === sid)?.name || 'Unknown';
  const getAccount = (sid) => accounts.find(a => a.student_id === sid);
  const studentsWithAccounts = students.filter(s => accounts.find(a => a.student_id === s.id));

  if (authLoading || !user || (role !== 'teacher' && role !== 'admin')) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.black, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <p style={{ color: COLORS.gold, fontWeight: 800, letterSpacing: 2 }}>AUTHENTICATING KCU PORTAL...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.offWhite }}>
      <div style={{ background: COLORS.black, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div>
          <span style={{ color: COLORS.gold, fontSize: 14, fontWeight: 800, letterSpacing: 2 }}>KCU</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginLeft: 8 }}>Teacher: {teacherName}</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={fetchData} style={{ background: "rgba(255,255,255,0.1)", color: COLORS.white, border: "none", padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{loading ? "..." : "↻ Refresh"}</button>
          <a href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, textDecoration: "none" }}>← Home</a>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
        
        {/* TABS */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, padding: 6, background: COLORS.white, borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <button onClick={() => setActiveTab("Gradebook")} style={{ flex: 1, padding: "12px", background: activeTab === "Gradebook" ? COLORS.black : "transparent", color: activeTab === "Gradebook" ? COLORS.white : COLORS.textMuted, borderRadius: 8, fontWeight: 800, border: "none", cursor: "pointer", transition: "all 0.2s" }}>The Master Gradebook</button>
          <button onClick={() => setActiveTab("Banking")} style={{ flex: 1, padding: "12px", background: activeTab === "Banking" ? COLORS.black : "transparent", color: activeTab === "Banking" ? COLORS.white : COLORS.textMuted, borderRadius: 8, fontWeight: 800, border: "none", cursor: "pointer", transition: "all 0.2s" }}>KCU Banking</button>
          <button onClick={() => setActiveTab("Roster")} style={{ flex: 1, padding: "12px", background: activeTab === "Roster" ? COLORS.black : "transparent", color: activeTab === "Roster" ? COLORS.white : COLORS.textMuted, borderRadius: 8, fontWeight: 800, border: "none", cursor: "pointer", transition: "all 0.2s" }}>Student Roster Lookup</button>
        </div>

        {activeTab === "Banking" && (
          <>
            <div style={{ background: COLORS.white, borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, display: "block" }}>Select Student</label>
          <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
            style={{ width: "100%", padding: 14, borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 16, fontWeight: 600 }}>
            <option value="">Choose a King or Queen...</option>
            {studentsWithAccounts.map(s => {
              const acc = getAccount(s.id);
              return <option key={s.id} value={s.id}>{s.name} — {formatMoney(acc?.balance)}</option>;
            })}
          </select>
        </div>

        {selectedStudent && (
          <>
            <div style={{ background: "linear-gradient(135deg, #1a1400, #2a1f00)", borderRadius: 16, padding: 24, textAlign: "center", marginBottom: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
              <div style={{ fontSize: 11, color: COLORS.gold, letterSpacing: 2 }}>CURRENT BALANCE</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.gold }}>{formatMoney(getAccount(selectedStudent)?.balance)}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{getName(selectedStudent)}</div>
            </div>

            <div style={{ background: COLORS.white, borderRadius: 12, padding: 20, marginBottom: 16, borderLeft: `4px solid ${COLORS.green}` }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: COLORS.green, marginBottom: 12, letterSpacing: 1 }}>GRADE BONUSES</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button onClick={() => processTransaction(selectedStudent, 'grade_bonus', 'deposit', 10, 'A on course')}
                  style={{ padding: 20, background: COLORS.greenBg, border: `2px solid ${COLORS.green}`, borderRadius: 12, fontSize: 18, fontWeight: 800, color: COLORS.green, cursor: "pointer" }}>
                  A Grade<br/><span style={{ fontSize: 24 }}>+$10</span>
                </button>
                <button onClick={() => processTransaction(selectedStudent, 'grade_bonus', 'deposit', 5, 'B on course')}
                  style={{ padding: 20, background: COLORS.greenBg, border: `2px solid ${COLORS.green}`, borderRadius: 12, fontSize: 18, fontWeight: 800, color: COLORS.green, cursor: "pointer" }}>
                  B Grade<br/><span style={{ fontSize: 24 }}>+$5</span>
                </button>
              </div>
            </div>

            <div style={{ background: COLORS.white, borderRadius: 12, padding: 20, marginBottom: 16, borderLeft: `4px solid ${COLORS.gold}` }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: COLORS.gold, marginBottom: 12, letterSpacing: 1 }}>OTHER DEPOSITS</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                {[
                  { label: "TOTD Streak", amount: 10, type: "totd_streak", desc: "10 consecutive TOTD 80%+" },
                  { label: "Perfect Month", amount: 15, type: "attendance_bonus", desc: "Perfect attendance — month" },
                  { label: "Honor Roll", amount: 25, type: "honor_roll", desc: "Honor Roll (3.0+ GPA)" },
                  { label: "Principal's List", amount: 50, type: "principals_list", desc: "Principal's List (3.5+ GPA)" },
                ].map(d => (
                  <button key={d.label} onClick={() => processTransaction(selectedStudent, d.type, 'deposit', d.amount, d.desc)}
                    style={{ padding: 14, background: "rgba(200,168,78,0.08)", border: `1px solid rgba(200,168,78,0.3)`, borderRadius: 10, fontSize: 14, fontWeight: 700, color: COLORS.text, cursor: "pointer", textAlign: "center" }}>
                    {d.label}<br/><span style={{ color: COLORS.green, fontSize: 16, fontWeight: 800 }}>+${d.amount}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="number" placeholder="$" value={customAmount} onChange={e => setCustomAmount(e.target.value)}
                  style={{ width: 80, padding: 12, borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, fontSize: 15, textAlign: "center" }} />
                <input type="text" placeholder="Reason..." value={customDesc} onChange={e => setCustomDesc(e.target.value)}
                  style={{ flex: 1, padding: 12, borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, fontSize: 14 }} />
                <button onClick={() => { if (customAmount && customDesc) { processTransaction(selectedStudent, 'custom_deposit', 'deposit', customAmount, customDesc); setCustomAmount(""); setCustomDesc(""); } }}
                  style={{ padding: "12px 20px", background: COLORS.green, color: COLORS.white, border: "none", borderRadius: 8, fontWeight: 800, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>+ Deposit</button>
              </div>
            </div>

            <div style={{ background: COLORS.white, borderRadius: 12, padding: 20, marginBottom: 16, borderLeft: `4px solid ${COLORS.red}` }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: COLORS.red, marginBottom: 12, letterSpacing: 1 }}>DEDUCTIONS</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                {[
                  { label: "Unexcused Absence", amount: 5, type: "absence_deduction", desc: "Unexcused absence" },
                  { label: "Discipline Lv2", amount: 10, type: "discipline_deduction", desc: "Discipline referral — Level 2" },
                  { label: "Discipline Lv3+", amount: 25, type: "discipline_deduction", desc: "Discipline referral — Level 3+" },
                  { label: "Failing Class", amount: 25, type: "failing_class", desc: "Failing a class (below 60%)" },
                ].map(d => (
                  <button key={d.label} onClick={() => { if (confirm(`Deduct $${d.amount} from ${getName(selectedStudent)} for ${d.desc}?`)) processTransaction(selectedStudent, d.type, 'withdrawal', d.amount, d.desc); }}
                    style={{ padding: 14, background: "rgba(226,75,74,0.06)", border: `1px solid rgba(226,75,74,0.2)`, borderRadius: 10, fontSize: 14, fontWeight: 700, color: COLORS.text, cursor: "pointer", textAlign: "center" }}>
                    {d.label}<br/><span style={{ color: COLORS.red, fontSize: 16, fontWeight: 800 }}>-${d.amount}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="number" placeholder="$" value={customAmount} onChange={e => setCustomAmount(e.target.value)}
                  style={{ width: 80, padding: 12, borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, fontSize: 15, textAlign: "center" }} />
                <input type="text" placeholder="Reason..." value={customDesc} onChange={e => setCustomDesc(e.target.value)}
                  style={{ flex: 1, padding: 12, borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, fontSize: 14 }} />
                <button onClick={() => { if (customAmount && customDesc && confirm(`Deduct $${customAmount} from ${getName(selectedStudent)}?`)) { processTransaction(selectedStudent, 'custom_deduction', 'withdrawal', customAmount, customDesc); setCustomAmount(""); setCustomDesc(""); } }}
                  style={{ padding: "12px 20px", background: COLORS.red, color: COLORS.white, border: "none", borderRadius: 8, fontWeight: 800, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>- Deduct</button>
              </div>
            </div>
          </>
        )}

        <div style={{ background: COLORS.white, borderRadius: 12, padding: 20, marginTop: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: COLORS.textMuted, marginBottom: 12, letterSpacing: 1 }}>RECENT KCU ACTIVITY</h3>
          {recentTxs.filter(t => t.created_by === teacherName).slice(0, 15).map(tx => (
            <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.lightGray}`, fontSize: 13 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{getName(tx.student_id)}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{tx.description} • {new Date(tx.created_at).toLocaleString()}</div>
              </div>
              <div style={{ fontWeight: 800, color: tx.category === 'deposit' ? COLORS.green : COLORS.red, fontSize: 15 }}>
                {tx.category === 'deposit' ? '+' : '-'}{formatMoney(tx.amount)}
              </div>
            </div>
          ))}
          {recentTxs.filter(t => t.created_by === teacherName).length === 0 && <p style={{ color: COLORS.textMuted, textAlign: "center", padding: 16 }}>No transactions by you yet.</p>}
        </div>

        <div style={{ background: COLORS.white, borderRadius: 12, padding: 20, marginTop: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: COLORS.textMuted, marginBottom: 12, letterSpacing: 1 }}>ALL STUDENT BALANCES</h3>
          {studentsWithAccounts.map(s => {
            const acc = getAccount(s.id);
            return (
              <div key={s.id} onClick={() => setSelectedStudent(s.id)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderBottom: `1px solid ${COLORS.lightGray}`, cursor: "pointer", borderRadius: 6, background: selectedStudent === s.id ? "rgba(200,168,78,0.08)" : "transparent" }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</span>
                <span style={{ fontWeight: 800, color: COLORS.gold, fontSize: 16 }}>{formatMoney(acc?.balance)}</span>
              </div>
            );
          })}
          </div>
          </>
        )}

        {activeTab === "Roster" && (
          <div>
            <div style={{ background: COLORS.white, borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
                style={{ width: "100%", padding: 14, borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 16, fontWeight: 600 }}>
                <option value="">Select a student to view details...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>)}
              </select>
            </div>

            {selectedStudent && (
              <div>
                {(() => {
                  const s = students.find(x => x.id === selectedStudent);
                  if (!s) return null;
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <div style={{ background: COLORS.white, padding: 24, borderRadius: 12, borderLeft: `4px solid ${COLORS.gold}`, boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{s.name}</h2>
                        <p style={{ color: COLORS.textMuted, fontWeight: 600 }}>Grade: {s.grade} &bull; ID: {s.id}</p>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        <div style={{ background: COLORS.white, padding: 24, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                          <h3 style={{ fontSize: 16, fontWeight: 800, borderBottom: `2px solid ${COLORS.lightGray}`, paddingBottom: 12, marginBottom: 16, color: COLORS.black }}>Current Grades</h3>
                          {Object.keys(s.grades_in_progress || {}).length > 0 ? (
                            Object.entries(s.grades_in_progress).map(([subj, grd]) => (
                              <div key={subj} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, padding: 12, background: COLORS.offWhite, borderRadius: 6 }}>
                                <span style={{ fontWeight: 700 }}>{subj}</span>
                                <span style={{ fontWeight: 800, color: COLORS.gold }}>{grd}</span>
                              </div>
                            ))
                          ) : <div style={{ fontSize: 13, color: COLORS.textMuted }}>No grades currently logged by Admin.</div>}
                        </div>

                        <div style={{ background: COLORS.white, padding: 24, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                          <h3 style={{ fontSize: 16, fontWeight: 800, borderBottom: `2px solid ${COLORS.lightGray}`, paddingBottom: 12, marginBottom: 16, color: COLORS.black }}>Emergency & Medical</h3>
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 4 }}>PARENTS / GUARDIANS</div>
                            <div style={{ fontSize: 15, fontWeight: 600 }}>{s.parent_names || "N/A"}</div>
                            <div style={{ fontSize: 14, marginTop: 4 }}>{s.parent_phone || "No phone listed"}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 800, color: COLORS.red, letterSpacing: 1, marginBottom: 4 }}>KNOWN ALLERGIES</div>
                            <div style={{ fontSize: 14, background: COLORS.offWhite, padding: 12, borderRadius: 6, color: COLORS.red, fontWeight: 600 }}>{s.allergies_medical || "None reported by Admin."}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
        
        {activeTab === "Gradebook" && (
          <GradebookView teacherName={teacherName} courses={courses} enrollments={enrollments} students={students} assignments={assignments} grades={grades} attendance={attendance} fetchData={fetchData} showToast={showToast} />
        )}

      </div>
      <Toast message={toast} type={toastType} />
    </div>
  );
}

// --------------------------------------------------------------------------------
// GRADEBOOK VIEW (Spreadsheet & Roll Call)
// --------------------------------------------------------------------------------
function GradebookView({ teacherName, courses, enrollments, students, assignments, grades, attendance, fetchData, showToast }) {
  const teacherCourses = courses.filter(c => c.teacher_name === teacherName);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("Grades"); 
  
  // Auto-connect first course
  React.useEffect(() => {
    if(!selectedCourseId && teacherCourses.length > 0) setSelectedCourseId(teacherCourses[0].id);
  }, [teacherCourses, selectedCourseId]);

  if(teacherCourses.length === 0) {
     return <div style={{ padding: 40, background: COLORS.white, borderRadius: 12, textAlign: "center", color: COLORS.textMuted, fontWeight: 600 }}>No courses assigned to your name ({teacherName}) yet. Admin must create a course in Command Center and assign you as the Instructor.</div>;
  }

  const course = teacherCourses.find(c => c.id === selectedCourseId) || teacherCourses[0];
  if(!course) return null;

  const rosterIds = enrollments.filter(e => e.course_id === course.id).map(e => e.student_id);
  const roster = students.filter(s => rosterIds.includes(s.id));
  const courseAssignments = assignments.filter(a => a.course_id === course.id);

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const max_points = e.target.max_points.value;
    const due_date = e.target.due_date.value;
    await supabase.from('krown_assignments').insert({ course_id: course.id, title, max_points: parseFloat(max_points), due_date });
    e.target.reset();
    showToast("Assignment Created", "success");
    fetchData();
  };

  const updateGrade = async (assignmentId, studentId, value) => {
    const existing = grades.find(g => g.assignment_id === assignmentId && g.student_id === studentId);
    let pts = value === "" ? null : parseFloat(value);
    if(existing) {
       await supabase.from('krown_grades').update({ points_earned: pts }).eq('id', existing.id);
    } else {
       if (pts !== null) await supabase.from('krown_grades').insert({ assignment_id: assignmentId, student_id: studentId, points_earned: pts });
    }
    fetchData(); // Silent background sync
  };

  const markAttendance = async (studentId, status) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = attendance.find(a => a.student_id === studentId && a.course_id === course.id && a.date === today);
    if(existing) {
      await supabase.from('krown_attendance_log').update({ status }).eq('id', existing.id);
    } else {
      await supabase.from('krown_attendance_log').insert({ student_id: studentId, course_id: course.id, date: today, status, recorded_by: teacherName });
    }
    showToast(`${status} logged.`);
    fetchData();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} style={{ padding: "12px 20px", borderRadius: 8, border: `2px solid ${COLORS.lightGray}`, fontSize: 20, fontWeight: 800, color: COLORS.black, outline: "none" }}>
          {teacherCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ display: "flex", gap: 8, background: COLORS.white, padding: 6, borderRadius: 8 }}>
          <button onClick={() => setActiveSubTab("Grades")} style={{ padding: "8px 16px", background: activeSubTab === "Grades" ? COLORS.black : "transparent", color: activeSubTab === "Grades" ? COLORS.white : COLORS.textMuted, border: "none", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}>Spreadsheet Gradebook</button>
          <button onClick={() => setActiveSubTab("Attendance")} style={{ padding: "8px 16px", background: activeSubTab === "Attendance" ? COLORS.black : "transparent", color: activeSubTab === "Attendance" ? COLORS.white : COLORS.textMuted, border: "none", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}>Daily Roll Call Clicker</button>
        </div>
      </div>

      {activeSubTab === "Grades" && (
        <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
             <h3 style={{ fontSize: 18, fontWeight: 800 }}>Assignment Master Spread</h3>
             
             <form onSubmit={handleAddAssignment} style={{ display: "flex", gap: 12 }}>
               <input name="title" placeholder="New Assignment Title..." required style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.lightGray}`, fontSize: 13 }} />
               <input name="max_points" type="number" placeholder="Max Pts (100)" defaultValue="100" required style={{ width: 100, padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.lightGray}`, fontSize: 13 }} />
               <input name="due_date" type="date" required style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.lightGray}`, fontSize: 13 }} />
               <button type="submit" style={{ background: COLORS.gold, color: COLORS.black, fontWeight: 800, border: "none", padding: "0 16px", borderRadius: 6, cursor: "pointer" }}>+ Add Column</button>
             </form>
           </div>

           <div style={{ overflowX: "auto", position: "relative" }}>
             <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
               <thead>
                 <tr>
                   <th style={{ textAlign: "left", padding: "16px", background: COLORS.black, color: COLORS.white, position: "sticky", left: 0, zIndex: 100, borderTopLeftRadius: 8 }}>Student Roster</th>
                   <th style={{ padding: "16px 8px", background: COLORS.black, color: COLORS.gold, width: 80, textAlign: "center", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Overall %</th>
                   {courseAssignments.map(a => (
                     <th key={a.id} style={{ padding: "12px 8px", background: COLORS.black, color: COLORS.white, textAlign: "center", minWidth: 100, borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
                       <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>{a.title}</div>
                       <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{a.max_points} Pts &bull; {a.due_date ? new Date(a.due_date).toLocaleDateString() : ""}</div>
                     </th>
                   ))}
                   {courseAssignments.length === 0 && <th style={{ background: COLORS.black, color: "rgba(255,255,255,0.5)", padding: 16, fontWeight: 500 }}>No assignments yet. Add one above.</th>}
                 </tr>
               </thead>
               <tbody>
                 {roster.map(stu => {
                   let totalEarned = 0; let totalMax = 0;
                   courseAssignments.forEach(a => {
                     const g = grades.find(x => x.assignment_id === a.id && x.student_id === stu.id);
                     if(g && g.points_earned !== null) { totalEarned += Number(g.points_earned); totalMax += Number(a.max_points); }
                   });
                   const overall = totalMax > 0 ? ((totalEarned / totalMax) * 100).toFixed(1) : "-";
                   
                   return (
                     <tr key={stu.id} style={{ borderBottom: `1px solid ${COLORS.lightGray}` }}>
                       <td style={{ padding: "12px 16px", fontWeight: 700, position: "sticky", left: 0, background: COLORS.white, zIndex: 10, borderRight: `2px solid ${COLORS.lightGray}` }}>{stu.name}</td>
                       <td style={{ padding: "12px 8px", textAlign: "center", fontWeight: 800, color: overall < 60 && overall !== "-" ? COLORS.red : COLORS.black, background: COLORS.offWhite, fontSize: 16 }}>{overall === "-" ? "-" : `${overall}%`}</td>
                       {courseAssignments.map(a => {
                         const g = grades.find(x => x.assignment_id === a.id && x.student_id === stu.id);
                         return (
                           <td key={a.id} style={{ padding: "8px", textAlign: "center", borderLeft: `1px solid ${COLORS.lightGray}` }}>
                             <input 
                               type="number" 
                               defaultValue={g?.points_earned !== null && g?.points_earned !== undefined ? g.points_earned : ""}
                               onBlur={e => updateGrade(a.id, stu.id, e.target.value)}
                               style={{ width: "80%", padding: "10px", textAlign: "center", border: `1px solid ${COLORS.lightGray}`, borderRadius: 6, fontWeight: 700, fontSize: 14, outlineColor: COLORS.gold, background: g?.points_earned !== null && g?.points_earned !== undefined ? "rgba(200,168,78,0.1)" : COLORS.white }}
                             />
                           </td>
                         )
                       })}
                     </tr>
                   )
                 })}
                 {roster.length === 0 && <tr><td colSpan={100} style={{ padding: 40, textAlign: "center", color: COLORS.textMuted }}>No students on your roster yet. Contact Administration.</td></tr>}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {activeSubTab === "Attendance" && (
        <div style={{ background: COLORS.white, borderRadius: 12, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, borderBottom: `2px solid ${COLORS.lightGray}`, paddingBottom: 24 }}>
            <div>
               <h3 style={{ fontSize: 24, fontWeight: 800 }}>Rapid Roll Call Clicker</h3>
               <div style={{ color: COLORS.textMuted, marginTop: 4 }}>Date locked to: <strong>{new Date().toLocaleDateString()}</strong></div>
            </div>
            <div style={{ fontSize: 13, background: COLORS.offWhite, padding: "8px 16px", borderRadius: 8, fontWeight: 600 }}>
               Students without a click are automatically marked "Present" by default at EOD.
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            {roster.map(stu => {
              const todaysLog = attendance.find(a => a.student_id === stu.id && a.course_id === course.id && a.date === today);
              const currentStatus = todaysLog?.status || "Unmarked";
              return (
                <div key={stu.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", background: COLORS.offWhite, borderRadius: 8, borderLeft: currentStatus === "Unmarked" ? "4px solid transparent" : currentStatus === "Present" ? `4px solid ${COLORS.green}` : currentStatus === "Tardy" ? `4px solid ${COLORS.gold}` : `4px solid ${COLORS.red}` }}>
                   <div style={{ fontSize: 18, fontWeight: 800 }}>{stu.name}</div>
                   <div style={{ display: "flex", gap: 8 }}>
                     <button onClick={() => markAttendance(stu.id, "Present")} style={{ padding: "10px 20px", background: currentStatus === "Present" ? COLORS.green : COLORS.white, color: currentStatus === "Present" ? COLORS.white : COLORS.black, border: `1px solid ${currentStatus === "Present" ? COLORS.green : COLORS.lightGray}`, borderRadius: 6, fontWeight: 700, cursor: "pointer" }}>Present</button>
                     <button onClick={() => markAttendance(stu.id, "Tardy")} style={{ padding: "10px 20px", background: currentStatus === "Tardy" ? COLORS.gold : COLORS.white, color: currentStatus === "Tardy" ? COLORS.black : COLORS.black, border: `1px solid ${currentStatus === "Tardy" ? COLORS.gold : COLORS.lightGray}`, borderRadius: 6, fontWeight: 700, cursor: "pointer" }}>Tardy</button>
                     <button onClick={() => markAttendance(stu.id, "Absent")} style={{ padding: "10px 20px", background: currentStatus === "Absent" ? COLORS.red : COLORS.white, color: currentStatus === "Absent" ? COLORS.white : COLORS.black, border: `1px solid ${currentStatus === "Absent" ? COLORS.red : COLORS.lightGray}`, borderRadius: 6, fontWeight: 700, cursor: "pointer" }}>Absent</button>
                   </div>
                </div>
              )
            })}
             {roster.length === 0 && <div style={{ padding: 40, textAlign: "center", color: COLORS.textMuted }}>No students on your roster yet. Contact Administration.</div>}
          </div>
        </div>
      )}

    </div>
  );
}
