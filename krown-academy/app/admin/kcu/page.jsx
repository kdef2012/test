'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../utils/supabase';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

const COLORS = {
  red: "#C41E1E", darkRed: "#8B0000", black: "#000000", gold: "#C8A84E",
  darkGold: "#9E7E2E", white: "#FFFFFF", offWhite: "#F8F6F0", lightGray: "#E8E6E0",
  text: "#1A1A1A", textMuted: "#6B6B6B", green: "#1D9E75", greenBg: "#E0FFE8"
};

const DEPOSIT_PRESETS = [
  { label: "A Grade", amount: 10, type: "grade_bonus", desc: "A on course" },
  { label: "B Grade", amount: 5, type: "grade_bonus", desc: "B on course" },
  { label: "Perfect Attendance", amount: 15, type: "attendance_bonus", desc: "Perfect attendance — month" },
  { label: "Honor Roll", amount: 25, type: "honor_roll", desc: "Honor Roll (3.0+ GPA)" },
  { label: "Principal's List", amount: 50, type: "principals_list", desc: "Principal's List (3.5+ GPA)" },
  { label: "Test Growth 10%+", amount: 25, type: "test_growth", desc: "Standardized test growth 10%+" },
  { label: "TOTD Streak", amount: 10, type: "totd_streak", desc: "10 consecutive TOTD scores 80%+" },
];

const CURRICULUM_UNITS = [
  { unit: "Unit 1: Money & Me", amount: 10 },
  { unit: "Unit 2: Banking & Saving", amount: 15 },
  { unit: "Unit 3: Budgeting", amount: 15 },
  { unit: "Unit 4: Credit & Debt", amount: 10 },
  { unit: "Unit 5: Investing", amount: 20 },
  { unit: "Unit 6: Entrepreneurship", amount: 25 },
  { unit: "Unit 7: Marketing & Sales", amount: 15 },
  { unit: "Unit 8: Taxes & Legal", amount: 10 },
  { unit: "Unit 9: Pitch Prep", amount: 0 },
];

const JOB_TITLES = [
  { title: "Bank Teller", wage: 5 },
  { title: "Classroom Manager", wage: 5 },
  { title: "Equipment Manager", wage: 5 },
  { title: "Mindset Leader", wage: 5 },
  { title: "Peer Tutor", wage: 3 },
  { title: "Marketing Director", wage: 5 },
];

const DEDUCTION_PRESETS = [
  { label: "Unexcused Absence", amount: 5, type: "absence_deduction", desc: "Unexcused absence" },
  { label: "Discipline (Level 2)", amount: 10, type: "discipline_deduction", desc: "Discipline referral — Level 2" },
  { label: "Discipline (Level 3+)", amount: 25, type: "discipline_deduction", desc: "Discipline referral — Level 3+" },
  { label: "Failing Class", amount: 25, type: "failing_class", desc: "Failing a class (below 60%)" },
];

// ============================================================
// HELPERS
// ============================================================
function StatCard({ label, value, color = COLORS.text, sub = "" }) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function ActionButton({ children, onClick, color = COLORS.gold, textColor = COLORS.black, disabled = false, small = false }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: disabled ? COLORS.lightGray : color, color: disabled ? COLORS.textMuted : textColor, border: "none", padding: small ? "8px 16px" : "12px 24px", borderRadius: 8, fontSize: small ? 13 : 15, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", transition: "opacity 0.2s", opacity: disabled ? 0.5 : 1 }}
      onMouseEnter={e => { if (!disabled) e.target.style.opacity = 0.85; }}
      onMouseLeave={e => { e.target.style.opacity = disabled ? 0.5 : 1; }}>
      {children}
    </button>
  );
}

function Toast({ message, type = "success" }) {
  if (!message) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, background: type === "success" ? COLORS.green : COLORS.red, color: COLORS.white, padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, zIndex: 9999, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", animation: "fadeIn 0.3s ease" }}>
      {message}
    </div>
  );
}

function formatMoney(n) { return "$" + Number(n || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); }

// Dual Entry Helper for Knight-Books
const syncKnightBooks = async (type, category, amount, description, studentId = null) => {
  if (!amount || Number(amount) <= 0) return;
  const dateStr = new Date().toISOString().split('T')[0];
  if (category === 'deposit') {
    await supabase.from('knightbooks_expenses').insert({
      date: dateStr, category: 'KCU Program', description: `KCU Payout: ${description}`, amount: Number(amount)
    });
  } else if (category === 'withdrawal') {
    if (['business_investment', 'graduation_withdrawal'].includes(type)) {
      await supabase.from('knightbooks_expenses').insert({
        date: dateStr, category: 'KCU Program', description: `KCU Cash Dispensed: ${description}`, amount: Number(amount)
      });
    } else {
      await supabase.from('knightbooks_income').insert({
        date: dateStr, category: 'Other', description: `KCU Deduction Recovery: ${description}`, amount: Number(amount), student_id: studentId
      });
    }
  }
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function KCUAdmin() {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("Dashboard");
  const [students, setStudents] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [businessPlans, setBizPlans] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");

  const showToast = (msg, type = "success") => {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [stuRes, accRes, txRes, bizRes, jobRes] = await Promise.all([
      supabase.from('students').select('*').order('name'),
      supabase.from('kcu_accounts').select('*'),
      supabase.from('kcu_transactions').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('kcu_business_plans').select('*').order('created_at', { ascending: false }),
      supabase.from('kcu_jobs').select('*').eq('active', true),
    ]);
    if (stuRes.data) setStudents(stuRes.data);
    if (accRes.data) setAccounts(accRes.data);
    if (txRes.data) setTransactions(txRes.data);
    if (bizRes.data) setBizPlans(bizRes.data);
    if (jobRes.data) setJobs(jobRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user || role !== 'admin') router.push('/login');
      else fetchAll();
    }
  }, [user, role, authLoading, router, fetchAll]);

  if (authLoading || !user || role !== 'admin') {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.black, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <p style={{ color: COLORS.gold, fontWeight: 800, letterSpacing: 2 }}>AUTHENTICATING KCU ADMIN...</p>
      </div>
    );
  }

  // Create KCU account for a student who doesn't have one
  const createAccount = async (studentId) => {
    const { data, error } = await supabase.from('kcu_accounts').insert({ student_id: studentId, balance: 100 }).select().single();
    if (error) { showToast("Error creating account: " + error.message, "error"); return null; }
    // Create opening deposit transaction
    await supabase.from('kcu_transactions').insert({
      account_id: data.id, student_id: studentId, type: 'opening_deposit', category: 'deposit',
      amount: 100, description: 'Opening deposit — Welcome to the Krown Credit Union', balance_after: 100, created_by: 'admin'
    });
    await syncKnightBooks('opening_deposit', 'deposit', 100, 'Opening deposit', studentId);
    showToast("KCU Account created with $100 opening deposit!");
    fetchAll();
    return data;
  };

  // Process a deposit or withdrawal
  const processTransaction = async (studentId, type, category, amount, description, createdBy = 'admin') => {
    const account = accounts.find(a => a.student_id === studentId);
    if (!account) { showToast("Student has no KCU account", "error"); return; }

    const currentBalance = Number(account.balance);
    let newBalance;
    if (category === 'deposit') {
      newBalance = currentBalance + Number(amount);
    } else {
      if (currentBalance < Number(amount)) { showToast("Insufficient balance — cannot go below $0", "error"); return; }
      newBalance = currentBalance - Number(amount);
    }

    // Insert transaction
    const { error: txErr } = await supabase.from('kcu_transactions').insert({
      account_id: account.id, student_id: studentId, type, category, amount: Number(amount),
      description, balance_after: newBalance, created_by: createdBy
    });
    if (txErr) { showToast("Transaction error: " + txErr.message, "error"); return; }

    await syncKnightBooks(type, category, amount, description, studentId);

    // Update balance
    const updateData = { balance: newBalance, updated_at: new Date().toISOString() };
    // Check if they hit $500 threshold
    if (newBalance >= 500 && account.business_status === 'none') {
      updateData.business_status = 'eligible';
    }
    await supabase.from('kcu_accounts').update(updateData).eq('id', account.id);

    // Send automated email receipt
    fetch('/api/emails/kcu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        studentName: getName(studentId),
        accountId: account.id,
        amount,
        newBalance,
        category,
        description
      })
    }).catch(err => console.error(err));

    showToast(`${category === 'deposit' ? '+' : '-'}${formatMoney(amount)} → New balance: ${formatMoney(newBalance)}`);
    fetchAll();
  };

  // Process monthly interest for all accounts
  const processInterest = async () => {
    if (!confirm("Calculate and deposit 2% monthly interest for ALL accounts?")) return;
    let count = 0;
    for (const acc of accounts) {
      const interest = Math.round(Number(acc.balance) * 0.02 * 100) / 100;
      if (interest <= 0) continue;
      const newBal = Number(acc.balance) + interest;
      await supabase.from('kcu_transactions').insert({
        account_id: acc.id, student_id: acc.student_id, type: 'interest', category: 'deposit',
        amount: interest, description: `Monthly interest (2% on ${formatMoney(acc.balance)})`,
        balance_after: newBal, created_by: 'system'
      });
      await syncKnightBooks('interest', 'deposit', interest, 'Monthly interest (2%)', acc.student_id);
      const upd = { balance: newBal, updated_at: new Date().toISOString() };
      if (newBal >= 500 && acc.business_status === 'none') upd.business_status = 'eligible';
      await supabase.from('kcu_accounts').update(upd).eq('id', acc.id);
      count++;
    }
    showToast(`Interest deposited for ${count} accounts!`);
    fetchAll();
  };

  // Process weekly job wages
  const processJobWages = async () => {
    if (!confirm("Process weekly wages for all active jobs?")) return;
    let count = 0;
    for (const job of jobs) {
      await processTransaction(job.student_id, 'job_wage', 'deposit', job.weekly_wage, `Weekly wage — ${job.job_title}`);
      count++;
    }
    showToast(`Wages processed for ${count} jobs!`);
  };

  // Fund a business
  const fundBusiness = async (plan, matchOption) => {
    const account = accounts.find(a => a.student_id === plan.student_id);
    if (!account) return;
    const preBalance = Number(account.balance);
    const investment = Number(plan.investment_requested);

    if (preBalance < investment) { showToast("Student doesn't have enough balance for this investment", "error"); return; }

    // Record pre-investment balance
    await supabase.from('kcu_accounts').update({
      pre_investment_balance: preBalance,
      business_status: 'funded',
      match_status: matchOption === 'upfront' ? 'deployed_upfront' : 'deployed_backup',
      updated_at: new Date().toISOString()
    }).eq('id', account.id);

    // Withdraw investment amount
    let newBal = preBalance - investment;
    await supabase.from('kcu_transactions').insert({
      account_id: account.id, student_id: plan.student_id, type: 'business_investment', category: 'withdrawal',
      amount: investment, description: `Business investment — ${plan.business_name}`, balance_after: newBal, created_by: 'admin'
    });
    await syncKnightBooks('business_investment', 'withdrawal', investment, `Business investment - ${plan.business_name}`, plan.student_id);

    // If upfront match, deposit the match amount
    if (matchOption === 'upfront') {
      newBal += investment;
      await supabase.from('kcu_transactions').insert({
        account_id: account.id, student_id: plan.student_id, type: 'match_deposit', category: 'deposit',
        amount: investment, description: `School match (upfront) — ${plan.business_name}`, balance_after: newBal, created_by: 'admin'
      });
      await syncKnightBooks('match_deposit', 'deposit', investment, `School Match - ${plan.business_name}`, plan.student_id);
    }

    // Update account balance
    await supabase.from('kcu_accounts').update({ balance: newBal }).eq('id', account.id);

    // Update business plan status
    await supabase.from('kcu_business_plans').update({
      status: 'funded', match_option: matchOption, funded_at: new Date().toISOString()
    }).eq('id', plan.id);

    showToast(`Business "${plan.business_name}" funded! ${matchOption === 'upfront' ? 'Match deployed upfront.' : 'Match held as backup.'}`);
    fetchAll();
  };

  // Activate safety net
  const activateSafetyNet = async (studentId) => {
    const account = accounts.find(a => a.student_id === studentId);
    if (!account || account.safety_net_used) { showToast("Safety net already used", "error"); return; }
    if (!account.pre_investment_balance) { showToast("No pre-investment balance recorded", "error"); return; }
    if (!confirm(`Restore balance to ${formatMoney(account.pre_investment_balance)}? This uses the one-time safety net.`)) return;

    const restoreAmount = Number(account.pre_investment_balance) - Number(account.balance);
    const newBal = Number(account.pre_investment_balance);

    await supabase.from('kcu_transactions').insert({
      account_id: account.id, student_id: studentId, type: 'safety_net_restore', category: 'deposit',
      amount: Math.abs(restoreAmount), description: 'Safety net activated — balance restored to pre-investment level',
      balance_after: newBal, created_by: 'admin'
    });
    await syncKnightBooks('safety_net_restore', 'deposit', Math.abs(restoreAmount), 'Safety net activated', studentId);

    await supabase.from('kcu_accounts').update({
      balance: newBal, safety_net_used: true, business_status: 'restored',
      match_status: account.match_status === 'deployed_backup' ? 'available' : account.match_status,
      updated_at: new Date().toISOString()
    }).eq('id', account.id);

    // Update business plan
    const plan = businessPlans.find(p => p.student_id === studentId && ['funded', 'active'].includes(p.status));
    if (plan) await supabase.from('kcu_business_plans').update({ status: 'failed' }).eq('id', plan.id);

    showToast(`Safety net activated. Balance restored to ${formatMoney(newBal)}`);
    fetchAll();
  };

  // Get student name from ID
  const getName = (sid) => students.find(s => s.id === sid)?.name || 'Unknown';
  const getAccount = (sid) => accounts.find(a => a.student_id === sid);
  // ============================================================
  // MAIN LAYOUT
  // ============================================================
  const tabs = ["Dashboard", "Accounts", "Quick Actions", "Business Plans", "End of Year"];
  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);
  const eligible = accounts.filter(a => Number(a.balance) >= 500).length;
  const activeBiz = businessPlans.filter(p => ['funded', 'active'].includes(p.status)).length;
  const studentsWithAccounts = accounts.length;
  const studentsWithoutAccounts = students.filter(s => !accounts.find(a => a.student_id === s.id)).length;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.offWhite, display: "flex" }}>
      {/* SIDEBAR */}
      <div style={{ width: 260, background: COLORS.black, color: COLORS.white, padding: 24, display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, overflowY: "auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: COLORS.gold, letterSpacing: 2 }}>KROWN CREDIT UNION</h2>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, letterSpacing: 1 }}>ADMIN DASHBOARD</div>
        </div>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ textAlign: "left", background: tab === t ? "rgba(200,168,78,0.15)" : "transparent", color: tab === t ? COLORS.gold : "rgba(255,255,255,0.6)", border: "none", padding: "12px 14px", borderRadius: 8, fontSize: 14, fontWeight: tab === t ? 700 : 500, cursor: "pointer", borderLeft: tab === t ? `3px solid ${COLORS.gold}` : "3px solid transparent", marginBottom: 4, transition: "all 0.2s" }}>
            {t}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={fetchAll} style={{ background: "rgba(255,255,255,0.08)", color: COLORS.white, border: "none", padding: 10, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>
          {loading ? "Syncing..." : "↻ Refresh"}
        </button>
        <a href="/admin" style={{ textAlign: "center", display: "block", color: "rgba(255,255,255,0.5)", padding: 10, fontSize: 12, textDecoration: "none" }}>← Admin Portal</a>
        <a href="/" style={{ textAlign: "center", display: "block", color: "rgba(255,255,255,0.4)", padding: 6, fontSize: 11, textDecoration: "none" }}>← Home</a>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: "32px 48px", marginLeft: 260 }}>
        {tab === "Dashboard" && <DashboardTab accounts={accounts} students={students} transactions={transactions} businessPlans={businessPlans} totalBalance={totalBalance} eligible={eligible} activeBiz={activeBiz} studentsWithoutAccounts={studentsWithoutAccounts} createAccount={createAccount} getName={getName} />}
        {tab === "Accounts" && <AccountsTab accounts={accounts} students={students} transactions={transactions} getName={getName} />}
        {tab === "Quick Actions" && <QuickActionsTab accounts={accounts} students={students} processTransaction={processTransaction} processInterest={processInterest} processJobWages={processJobWages} getName={getName} getAccount={getAccount} showToast={showToast} />}
        {tab === "Business Plans" && <BusinessPlansTab businessPlans={businessPlans} accounts={accounts} students={students} getName={getName} getAccount={getAccount} fundBusiness={fundBusiness} activateSafetyNet={activateSafetyNet} fetchAll={fetchAll} showToast={showToast} />}
        {tab === "End of Year" && <EndOfYearTab accounts={accounts} students={students} businessPlans={businessPlans} getName={getName} processTransaction={processTransaction} showToast={showToast} fetchAll={fetchAll} />}
      </div>
      <Toast message={toast} type={toastType} />
    </div>
  );
}

// ============================================================
// DASHBOARD TAB
// ============================================================
function DashboardTab({ accounts, students, transactions, businessPlans, totalBalance, eligible, activeBiz, studentsWithoutAccounts, createAccount, getName }) {
  const depositsThisMonth = transactions.filter(t => t.category === 'deposit' && new Date(t.created_at).getMonth() === new Date().getMonth()).reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24, color: COLORS.gold }}>KCU Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Total KCU Balance" value={formatMoney(totalBalance)} color={COLORS.gold} />
        <StatCard label="Active Accounts" value={accounts.length} sub={`${studentsWithoutAccounts} students need accounts`} />
        <StatCard label="Eligible to Pitch" value={eligible} sub="Balance ≥ $500" color={COLORS.green} />
        <StatCard label="Active Businesses" value={activeBiz} color={COLORS.red} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Deposits This Month" value={formatMoney(depositsThisMonth)} color={COLORS.green} />
        <StatCard label="Total Transactions" value={transactions.length} />
      </div>

      {/* Leaderboard */}
      <div style={{ background: COLORS.white, borderRadius: 12, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: COLORS.gold }}>👑 KCU Leaderboard</h2>
        {[...accounts].sort((a, b) => Number(b.balance) - Number(a.balance)).slice(0, 10).map((acc, i) => (
          <div key={acc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 9 ? `1px solid ${COLORS.lightGray}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: i < 3 ? COLORS.gold : COLORS.lightGray, color: i < 3 ? COLORS.black : COLORS.textMuted, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>{i + 1}</span>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{getName(acc.student_id)}</span>
              {acc.business_status !== 'none' && <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: acc.business_status === 'eligible' ? COLORS.greenBg : "rgba(200,168,78,0.15)", color: acc.business_status === 'eligible' ? COLORS.green : COLORS.gold, fontWeight: 700 }}>{acc.business_status}</span>}
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: COLORS.gold }}>{formatMoney(acc.balance)}</span>
          </div>
        ))}
      </div>

      {/* Students without accounts */}
      {studentsWithoutAccounts > 0 && (
        <div style={{ background: COLORS.white, borderRadius: 12, padding: 28, borderLeft: `4px solid ${COLORS.red}` }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Students Without KCU Accounts</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {students.filter(s => !accounts.find(a => a.student_id === s.id)).map(s => (
              <button key={s.id} onClick={() => createAccount(s.id)}
                style={{ padding: "8px 16px", background: COLORS.offWhite, border: `1px solid ${COLORS.lightGray}`, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                + {s.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ACCOUNTS TAB
// ============================================================
function AccountsTab({ accounts, students, transactions, getName }) {
  const [selected, setSelected] = useState(null);
  const sorted = [...accounts].sort((a, b) => getName(a.student_id).localeCompare(getName(b.student_id)));

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24 }}>Student Accounts</h1>
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 24 }}>
        <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${COLORS.lightGray}` }}>
                <th style={{ textAlign: "left", padding: "10px 8px", fontWeight: 700, color: COLORS.textMuted }}>Student</th>
                <th style={{ textAlign: "right", padding: "10px 8px", fontWeight: 700, color: COLORS.textMuted }}>Balance</th>
                <th style={{ textAlign: "center", padding: "10px 8px", fontWeight: 700, color: COLORS.textMuted }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(acc => (
                <tr key={acc.id} onClick={() => setSelected(acc)} style={{ borderBottom: `1px solid ${COLORS.lightGray}`, cursor: "pointer", background: selected?.id === acc.id ? "rgba(200,168,78,0.08)" : "transparent" }}>
                  <td style={{ padding: "12px 8px", fontWeight: 600 }}>{getName(acc.student_id)}</td>
                  <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: 800, color: COLORS.gold, fontSize: 15 }}>{formatMoney(acc.balance)}</td>
                  <td style={{ padding: "12px 8px", textAlign: "center" }}>
                    <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, fontWeight: 700, background: acc.business_status === 'none' ? COLORS.lightGray : acc.business_status === 'eligible' ? COLORS.greenBg : "rgba(200,168,78,0.15)", color: acc.business_status === 'none' ? COLORS.textMuted : acc.business_status === 'eligible' ? COLORS.green : COLORS.gold }}>
                      {acc.business_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Transaction detail panel */}
        {selected && (
          <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>{getName(selected.student_id)}</h2>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: COLORS.textMuted }}>✕</button>
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.gold, marginBottom: 4 }}>{formatMoney(selected.balance)}</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 20 }}>
              Safety net: {selected.safety_net_used ? "Used" : "Available"} | Pre-investment: {selected.pre_investment_balance ? formatMoney(selected.pre_investment_balance) : "N/A"}
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Transaction History</h3>
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {transactions.filter(t => t.student_id === selected.student_id).map(tx => (
                <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.lightGray}`, fontSize: 13 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{tx.description}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>{new Date(tx.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: tx.category === 'deposit' ? COLORS.green : COLORS.red }}>
                    {tx.category === 'deposit' ? '+' : '-'}{formatMoney(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// QUICK ACTIONS TAB
// ============================================================
function QuickActionsTab({ accounts, students, processTransaction, processInterest, processJobWages, getName, getAccount, showToast }) {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customType, setCustomType] = useState("deposit");

  const studentsWithAccounts = students.filter(s => accounts.find(a => a.student_id === s.id));

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Quick Actions</h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 24 }}>One click = one transaction. Fast deposits and deductions for your Kings & Queens.</p>

      {/* Student selector */}
      <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, display: "block" }}>Select Student</label>
        <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
          style={{ width: "100%", padding: 14, borderRadius: 8, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, fontWeight: 600 }}>
          <option value="">Choose a King or Queen...</option>
          {studentsWithAccounts.map(s => {
            const acc = getAccount(s.id);
            return <option key={s.id} value={s.id}>{s.name} — {formatMoney(acc?.balance)}</option>;
          })}
        </select>
      </div>

      {selectedStudent && (
        <>
          {/* DEPOSITS */}
          <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, marginBottom: 20, borderLeft: `4px solid ${COLORS.green}` }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: COLORS.green }}>Deposits</h2>

            <h3 style={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, marginBottom: 8 }}>Grade Bonuses</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {DEPOSIT_PRESETS.map(d => (
                <ActionButton key={d.label} onClick={() => processTransaction(selectedStudent, d.type, 'deposit', d.amount, d.desc)} color={COLORS.green} textColor={COLORS.white} small>
                  {d.label} (+${d.amount})
                </ActionButton>
              ))}
            </div>

            <h3 style={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, marginBottom: 8 }}>Curriculum Milestones</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {CURRICULUM_UNITS.filter(u => u.amount > 0).map(u => (
                <ActionButton key={u.unit} onClick={() => processTransaction(selectedStudent, 'curriculum_milestone', 'deposit', u.amount, u.unit)} small>
                  {u.unit} (+${u.amount})
                </ActionButton>
              ))}
            </div>

            <h3 style={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, marginBottom: 8 }}>Custom Deposit</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="number" placeholder="Amount" value={customType === 'deposit' ? customAmount : ""} onChange={e => { setCustomAmount(e.target.value); setCustomType('deposit'); }}
                style={{ padding: 10, borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, width: 100, fontSize: 14 }} />
              <input type="text" placeholder="Description" value={customType === 'deposit' ? customDesc : ""} onChange={e => { setCustomDesc(e.target.value); setCustomType('deposit'); }}
                style={{ padding: 10, borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, flex: 1, fontSize: 14 }} />
              <ActionButton onClick={() => { if (customAmount && customDesc) { processTransaction(selectedStudent, 'custom_deposit', 'deposit', customAmount, customDesc); setCustomAmount(""); setCustomDesc(""); } }} color={COLORS.green} textColor={COLORS.white} small>
                Deposit
              </ActionButton>
            </div>
          </div>

          {/* DEDUCTIONS */}
          <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, marginBottom: 20, borderLeft: `4px solid ${COLORS.red}` }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: COLORS.red }}>Deductions</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {DEDUCTION_PRESETS.map(d => (
                <ActionButton key={d.label} onClick={() => processTransaction(selectedStudent, d.type, 'withdrawal', d.amount, d.desc)} color={COLORS.red} textColor={COLORS.white} small>
                  {d.label} (-${d.amount})
                </ActionButton>
              ))}
            </div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, marginBottom: 8 }}>Custom Deduction</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="number" placeholder="Amount" value={customType === 'withdrawal' ? customAmount : ""} onChange={e => { setCustomAmount(e.target.value); setCustomType('withdrawal'); }}
                style={{ padding: 10, borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, width: 100, fontSize: 14 }} />
              <input type="text" placeholder="Reason" value={customType === 'withdrawal' ? customDesc : ""} onChange={e => { setCustomDesc(e.target.value); setCustomType('withdrawal'); }}
                style={{ padding: 10, borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, flex: 1, fontSize: 14 }} />
              <ActionButton onClick={() => { if (customAmount && customDesc) { processTransaction(selectedStudent, 'custom_deduction', 'withdrawal', customAmount, customDesc); setCustomAmount(""); setCustomDesc(""); } }} color={COLORS.red} textColor={COLORS.white} small>
                Deduct
              </ActionButton>
            </div>
          </div>
        </>
      )}

      {/* BULK ACTIONS */}
      <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, borderLeft: `4px solid ${COLORS.gold}` }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: COLORS.gold }}>Bulk Actions (All Students)</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <ActionButton onClick={processInterest}>💰 Process Monthly Interest (2%)</ActionButton>
          <ActionButton onClick={processJobWages}>💼 Process Weekly Job Wages</ActionButton>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// BUSINESS PLANS TAB
// ============================================================
function BusinessPlansTab({ businessPlans, accounts, students, getName, getAccount, fundBusiness, activateSafetyNet, fetchAll, showToast }) {
  const [viewing, setViewing] = useState(null);

  const updatePlanStatus = async (planId, status) => {
    await supabase.from('kcu_business_plans').update({ status, reviewed_at: new Date().toISOString() }).eq('id', planId);
    showToast(`Plan ${status}!`);
    fetchAll();
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24 }}>Business Plans</h1>
      {businessPlans.length === 0 ? (
        <div style={{ background: COLORS.white, borderRadius: 12, padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <p style={{ color: COLORS.textMuted }}>No business plans submitted yet. Students become eligible to pitch when their balance reaches $500.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {businessPlans.map(plan => {
            const acc = getAccount(plan.student_id);
            return (
              <div key={plan.id} style={{ background: COLORS.white, borderRadius: 12, padding: 24, borderLeft: `4px solid ${plan.status === 'submitted' ? COLORS.gold : plan.status === 'approved' ? COLORS.green : plan.status === 'failed' ? COLORS.red : COLORS.lightGray}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800 }}>{plan.business_name}</h3>
                    <div style={{ fontSize: 13, color: COLORS.textMuted }}>{getName(plan.student_id)} • Requesting {formatMoney(plan.investment_requested)} • Balance: {formatMoney(acc?.balance)}</div>
                  </div>
                  <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 6, fontWeight: 700, textTransform: "uppercase", background: plan.status === 'submitted' ? "rgba(200,168,78,0.15)" : plan.status === 'approved' ? COLORS.greenBg : plan.status === 'funded' ? "rgba(55,138,221,0.1)" : plan.status === 'failed' ? "rgba(226,75,74,0.1)" : COLORS.lightGray, color: plan.status === 'submitted' ? COLORS.gold : plan.status === 'approved' ? COLORS.green : plan.status === 'funded' ? "#378ADD" : plan.status === 'failed' ? COLORS.red : COLORS.textMuted }}>
                    {plan.status}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: COLORS.text, marginBottom: 16, lineHeight: 1.6 }}>{plan.executive_summary}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <ActionButton onClick={() => setViewing(plan)} small>View Full Plan</ActionButton>
                  {plan.status === 'submitted' && (
                    <>
                      <ActionButton onClick={() => updatePlanStatus(plan.id, 'approved')} color={COLORS.green} textColor={COLORS.white} small>Approve</ActionButton>
                      <ActionButton onClick={() => updatePlanStatus(plan.id, 'not_ready')} color={COLORS.lightGray} textColor={COLORS.text} small>Not Yet Ready</ActionButton>
                    </>
                  )}
                  {plan.status === 'approved' && (
                    <>
                      <ActionButton onClick={() => fundBusiness(plan, 'upfront')} color={COLORS.gold} small>Fund + Match Upfront</ActionButton>
                      <ActionButton onClick={() => fundBusiness(plan, 'backup')} color={COLORS.black} textColor={COLORS.gold} small>Fund + Hold Match</ActionButton>
                    </>
                  )}
                  {['funded', 'active'].includes(plan.status) && acc && !acc.safety_net_used && (
                    <ActionButton onClick={() => activateSafetyNet(plan.student_id)} color={COLORS.red} textColor={COLORS.white} small>Activate Safety Net</ActionButton>
                  )}
                  {['funded', 'active'].includes(plan.status) && acc?.safety_net_used && (
                    <span style={{ fontSize: 12, color: COLORS.red, fontWeight: 700, padding: "8px 16px" }}>Safety net already used</span>
                  )}
                  {['funded', 'active'].includes(plan.status) && (
                    <ActionButton onClick={() => updatePlanStatus(plan.id, 'succeeded')} color={COLORS.green} textColor={COLORS.white} small>Mark Successful</ActionButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Plan Modal */}
      {viewing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: COLORS.white, borderRadius: 16, maxWidth: 700, width: "100%", maxHeight: "85vh", overflow: "auto", padding: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: COLORS.gold }}>{viewing.business_name}</h2>
              <button onClick={() => setViewing(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>✕</button>
            </div>
            {[
              ["Student", getName(viewing.student_id)],
              ["Executive Summary", viewing.executive_summary],
              ["Product / Service", viewing.product_or_service],
              ["Target Market", viewing.target_market],
              ["Marketing Plan", viewing.marketing_plan],
              ["Investment Requested", formatMoney(viewing.investment_requested)],
              ["Projected Revenue", formatMoney(viewing.projected_revenue)],
              ["Projected Expenses", formatMoney(viewing.projected_expenses)],
              ["Timeline", viewing.timeline],
              ["Risk Assessment", viewing.risk_assessment],
              ["Board Notes", viewing.board_notes || "None yet"],
            ].map(([label, val]) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.6 }}>{val || "—"}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// END OF YEAR TAB
// ============================================================
function EndOfYearTab({ accounts, students, businessPlans, getName, processTransaction, showToast, fetchAll }) {
  const [graduating, setGraduating] = useState({});

  const toggleGrad = (sid) => setGraduating(prev => ({ ...prev, [sid]: !prev[sid] }));

  const processGraduationPayout = async (studentId) => {
    const acc = accounts.find(a => a.student_id === studentId);
    if (!acc || Number(acc.balance) <= 0) return;
    await processTransaction(studentId, 'graduation_withdrawal', 'withdrawal', acc.balance, 'Graduation payout — congratulations, King/Queen!');
    showToast(`${getName(studentId)} graduated with ${formatMoney(acc.balance)}!`);
  };

  const processAllGraduations = async () => {
    const grads = Object.entries(graduating).filter(([_, v]) => v).map(([k]) => k);
    if (grads.length === 0) { showToast("No students selected for graduation", "error"); return; }
    if (!confirm(`Process graduation payouts for ${grads.length} students?`)) return;
    for (const sid of grads) await processGraduationPayout(sid);
    showToast(`${grads.length} graduation payouts processed!`);
    fetchAll();
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>End of Year Processing</h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 24 }}>Check graduating students, then process payouts. Returning students keep their balance for next year.</p>

      <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Student Roster</h2>
        <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${COLORS.lightGray}` }}>
              <th style={{ textAlign: "center", padding: 8, width: 40 }}>Grad?</th>
              <th style={{ textAlign: "left", padding: 8 }}>Student</th>
              <th style={{ textAlign: "right", padding: 8 }}>Balance</th>
              <th style={{ textAlign: "center", padding: 8 }}>Business</th>
              <th style={{ textAlign: "center", padding: 8 }}>Safety Net</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(acc => (
              <tr key={acc.id} style={{ borderBottom: `1px solid ${COLORS.lightGray}` }}>
                <td style={{ textAlign: "center", padding: 8 }}>
                  <input type="checkbox" checked={!!graduating[acc.student_id]} onChange={() => toggleGrad(acc.student_id)} style={{ width: 18, height: 18, cursor: "pointer" }} />
                </td>
                <td style={{ padding: 8, fontWeight: 600 }}>{getName(acc.student_id)}</td>
                <td style={{ padding: 8, textAlign: "right", fontWeight: 800, color: COLORS.gold }}>{formatMoney(acc.balance)}</td>
                <td style={{ padding: 8, textAlign: "center", fontSize: 12 }}>{acc.business_status}</td>
                <td style={{ padding: 8, textAlign: "center", fontSize: 12 }}>{acc.safety_net_used ? "Used" : "Available"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <ActionButton onClick={processAllGraduations} color={COLORS.red} textColor={COLORS.white}>
          Process Graduation Payouts ({Object.values(graduating).filter(Boolean).length} selected)
        </ActionButton>
        <ActionButton onClick={() => showToast("Returning students' balances are automatically preserved for next year.")}>
          Roll Over Returning Students
        </ActionButton>
      </div>
    </div>
  );
}
