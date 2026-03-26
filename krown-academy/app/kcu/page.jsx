'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const COLORS = {
  red: "#C41E1E", black: "#000000", gold: "#C8A84E", white: "#FFFFFF",
  offWhite: "#F8F6F0", lightGray: "#E8E6E0", text: "#1A1A1A", textMuted: "#6B6B6B",
  green: "#1D9E75", greenBg: "#E0FFE8"
};

function formatMoney(n) { return "$" + Number(n || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); }

export default function KCUPortal() {
  const { user, profile, role, loading: authLoading } = useAuth();
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [bizPlan, setBizPlan] = useState(null);
  const [tab, setTab] = useState("balance");
  const [showBizForm, setShowBizForm] = useState(false);
  const [bizForm, setBizForm] = useState({ business_name: "", executive_summary: "", product_or_service: "", target_market: "", marketing_plan: "", investment_requested: "", projected_revenue: "", projected_expenses: "", timeline: "", risk_assessment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user || !['student', 'parent', 'admin'].includes(role)) {
        router.push('/login');
      } else if (profile?.student_id) {
        fetchStudentData(profile.student_id);
      }
    }
  }, [user, profile, role, authLoading, router]);

  const fetchStudentData = async (studentId) => {
    const { data: stu } = await supabase.from('students').select('*').eq('id', studentId).single();
    if (!stu) return;
    const { data: acc } = await supabase.from('kcu_accounts').select('*').eq('student_id', studentId).single();
    if (!acc) return;
    
    setStudent(stu);
    setAccount(acc);
    // Fetch transactions
    const { data: txs } = await supabase.from('kcu_transactions').select('*').eq('student_id', studentId).order('created_at', { ascending: false });
    if (txs) setTransactions(txs);
    // Fetch business plan
    const { data: plans } = await supabase.from('kcu_business_plans').select('*').eq('student_id', studentId).order('created_at', { ascending: false }).limit(1);
    if (plans && plans.length > 0) setBizPlan(plans[0]);
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
    // Refresh
    const { data: plans } = await supabase.from('kcu_business_plans').select('*').eq('student_id', student.id).order('created_at', { ascending: false }).limit(1);
    if (plans && plans.length > 0) setBizPlan(plans[0]);
  };

  // SECURE LOADING SCREEN
  if (authLoading || !user || !account || !student) {
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${COLORS.black} 0%, #1a0f00 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <p style={{ color: COLORS.gold, fontSize: 14, fontWeight: 800, letterSpacing: 2 }}>LOADING KCU VAULT...</p>
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
      <div style={{ background: COLORS.black, padding: "24px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: COLORS.gold, letterSpacing: 3, fontWeight: 700, textTransform: "uppercase" }}>Krown Credit Union</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Welcome, {student.name}</div>
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
      <div style={{ maxWidth: 500, margin: "20px auto 0", padding: "0 16px" }}>
        <div style={{ display: "flex", gap: 0, background: COLORS.white, borderRadius: 12, overflow: "hidden", border: `1px solid ${COLORS.lightGray}` }}>
          {["balance", "history", "business"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: "12px 0", background: tab === t ? COLORS.gold : "transparent", color: tab === t ? COLORS.black : COLORS.textMuted, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>
              {t === "balance" ? "Overview" : t === "history" ? "Transactions" : "Business"}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div style={{ maxWidth: 500, margin: "16px auto", padding: "0 16px 40px" }}>

        {/* OVERVIEW */}
        {tab === "balance" && (
          <div>
            <div style={{ background: COLORS.white, borderRadius: 12, padding: 20, marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textMuted, marginBottom: 12 }}>Account Status</h3>
              {[
                ["Business status", account.business_status === 'none' ? 'Building your balance' : account.business_status],
                ["Safety net", account.safety_net_used ? "Used (one-time)" : "Available"],
                ["Account opened", new Date(account.created_at).toLocaleDateString()],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.lightGray}`, fontSize: 14 }}>
                  <span style={{ color: COLORS.textMuted }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: COLORS.white, borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textMuted, marginBottom: 12 }}>Recent Activity</h3>
              {transactions.slice(0, 5).map(tx => (
                <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.lightGray}` }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{tx.description}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>{new Date(tx.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: tx.category === 'deposit' ? COLORS.green : COLORS.red }}>
                    {tx.category === 'deposit' ? '+' : '-'}{formatMoney(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRANSACTION HISTORY */}
        {tab === "history" && (
          <div style={{ background: COLORS.white, borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textMuted, marginBottom: 12 }}>All Transactions</h3>
            {transactions.map(tx => (
              <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.lightGray}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{tx.description}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{new Date(tx.created_at).toLocaleString()} • Bal: {formatMoney(tx.balance_after)}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 15, color: tx.category === 'deposit' ? COLORS.green : COLORS.red, minWidth: 80, textAlign: "right" }}>
                  {tx.category === 'deposit' ? '+' : '-'}{formatMoney(tx.amount)}
                </div>
              </div>
            ))}
            {transactions.length === 0 && <p style={{ color: COLORS.textMuted, textAlign: "center", padding: 20 }}>No transactions yet.</p>}
          </div>
        )}

        {/* BUSINESS */}
        {tab === "business" && (
          <div>
            {bizPlan ? (
              <div style={{ background: COLORS.white, borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>{bizPlan.business_name}</h3>
                  <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 700, textTransform: "uppercase", background: bizPlan.status === 'submitted' ? "rgba(200,168,78,0.15)" : bizPlan.status === 'approved' ? COLORS.greenBg : bizPlan.status === 'funded' ? "rgba(55,138,221,0.1)" : COLORS.lightGray, color: bizPlan.status === 'submitted' ? COLORS.gold : bizPlan.status === 'approved' ? COLORS.green : bizPlan.status === 'funded' ? "#378ADD" : COLORS.textMuted }}>
                    {bizPlan.status}
                  </span>
                </div>
                {[
                  ["Investment Requested", formatMoney(bizPlan.investment_requested)],
                  ["Summary", bizPlan.executive_summary],
                  ["Product/Service", bizPlan.product_or_service],
                  ["Target Market", bizPlan.target_market],
                  ["Submitted", bizPlan.submitted_at ? new Date(bizPlan.submitted_at).toLocaleDateString() : "Draft"],
                ].map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{k}</div>
                    <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.5 }}>{v || "—"}</div>
                  </div>
                ))}
                {bizPlan.board_notes && (
                  <div style={{ background: COLORS.offWhite, borderRadius: 8, padding: 16, marginTop: 12, borderLeft: `3px solid ${COLORS.gold}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold, marginBottom: 4 }}>BOARD NOTES</div>
                    <div style={{ fontSize: 14, color: COLORS.text }}>{bizPlan.board_notes}</div>
                  </div>
                )}
              </div>
            ) : isEligible ? (
              <div>
                {!showBizForm ? (
                  <div style={{ background: COLORS.white, borderRadius: 12, padding: 32, textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>You're eligible to pitch!</h3>
                    <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 20 }}>Your balance has reached $500. Submit your business plan to the Krown Investment Board.</p>
                    <button onClick={() => setShowBizForm(true)} style={{ padding: "14px 32px", background: COLORS.gold, color: COLORS.black, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
                      Write My Business Plan →
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitBizPlan} style={{ background: COLORS.white, borderRadius: 12, padding: 24 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: COLORS.gold }}>Your Business Plan</h3>
                    {[
                      { key: "business_name", label: "Business Name", type: "text", required: true },
                      { key: "executive_summary", label: "What is your business? (Executive Summary)", type: "textarea", required: true },
                      { key: "product_or_service", label: "What are you selling or offering?", type: "textarea" },
                      { key: "target_market", label: "Who will buy this? Where will you find customers?", type: "textarea" },
                      { key: "marketing_plan", label: "How will people find out about your business?", type: "textarea" },
                      { key: "investment_requested", label: "How much KCU money do you need? ($)", type: "number", required: true },
                      { key: "projected_revenue", label: "How much do you expect to earn? ($)", type: "number" },
                      { key: "projected_expenses", label: "How much will it cost to run? ($)", type: "number" },
                      { key: "timeline", label: "When will you launch? Key milestones?", type: "textarea" },
                      { key: "risk_assessment", label: "What could go wrong? How will you handle it?", type: "textarea" },
                    ].map(f => (
                      <div key={f.key} style={{ marginBottom: 14 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>{f.label}{f.required ? " *" : ""}</label>
                        {f.type === "textarea" ? (
                          <textarea value={bizForm[f.key]} onChange={e => setBizForm(prev => ({ ...prev, [f.key]: e.target.value }))} required={f.required}
                            style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, fontSize: 14, resize: "vertical", minHeight: 80, boxSizing: "border-box", fontFamily: "inherit" }} />
                        ) : (
                          <input type={f.type} value={bizForm[f.key]} onChange={e => setBizForm(prev => ({ ...prev, [f.key]: e.target.value }))} required={f.required}
                            style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, fontSize: 14, boxSizing: "border-box" }} />
                        )}
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                      <button type="submit" disabled={submitting} style={{ flex: 1, padding: 14, background: COLORS.gold, color: COLORS.black, border: "none", borderRadius: 8, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
                        {submitting ? "Submitting..." : "Submit to Investment Board →"}
                      </button>
                      <button type="button" onClick={() => setShowBizForm(false)} style={{ padding: "14px 20px", background: COLORS.lightGray, border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div style={{ background: COLORS.white, borderRadius: 12, padding: 32, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📈</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Keep Building!</h3>
                <p style={{ color: COLORS.textMuted, fontSize: 14 }}>You need a balance of $500 to submit a business plan. You're {formatMoney(500 - Number(account.balance))} away. Keep earning through grades, attendance, and jobs!</p>
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
