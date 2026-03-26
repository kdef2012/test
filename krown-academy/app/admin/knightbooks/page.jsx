'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../utils/supabase';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

const C = { red:"#C41E1E", black:"#000000", gold:"#C8A84E", white:"#FFFFFF", off:"#F8F6F0", lg:"#E8E6E0", text:"#1A1A1A", muted:"#6B6B6B", green:"#1D9E75", blue:"#378ADD" };
const ICAT = ['OS Disbursement','ESA+ Services','Grant','Fundraising','Donation','Sponsorship','Other'];
const ECAT = ['Salary','Rent','Utilities','Curriculum','Technology','Athletics','Insurance','Marketing','Supplies','Travel','KCU Program','Larry Barron Contract','Other'];
const fm = n => "$"+Number(n||0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g,'$&,');
const td = () => new Date().toISOString().split('T')[0];

function Stat({l,v,c=C.text,s=""}){return(<div style={{background:C.white,borderRadius:12,padding:"20px 24px",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}><div style={{fontSize:12,color:C.muted,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{l}</div><div style={{fontSize:28,fontWeight:800,color:c}}>{v}</div>{s&&<div style={{fontSize:12,color:C.muted,marginTop:2}}>{s}</div>}</div>)}

export default function KnightBooks(){
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const[tab,setTab]=useState("Dashboard");
  const[income,setIncome]=useState([]);const[expenses,setExpenses]=useState([]);const[budget,setBudget]=useState([]);const[students,setStudents]=useState([]);
  const[loading,setLoading]=useState(true);const[toast,setToast]=useState("");
  const st=m=>{setToast(m);setTimeout(()=>setToast(""),3000)};

  const fetch=useCallback(async()=>{
    setLoading(true);
    const[i,e,b,s]=await Promise.all([supabase.from('knightbooks_income').select('*').order('date',{ascending:false}),supabase.from('knightbooks_expenses').select('*').order('date',{ascending:false}),supabase.from('knightbooks_budget').select('*').order('category'),supabase.from('students').select('id,name').order('name')]);
    if(i.data)setIncome(i.data);if(e.data)setExpenses(e.data);if(b.data)setBudget(b.data);if(s.data)setStudents(s.data);setLoading(false);
  },[]);

  useEffect(() => {
    if (!authLoading) {
      if (!user || role !== 'admin') router.push('/login');
      else fetch();
    }
  }, [user, role, authLoading, router, fetch]);

  if (authLoading || !user || role !== 'admin') return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.black} 0%,#0a1a0a 100%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <p style={{ color: C.green, fontWeight: 800, letterSpacing: 2 }}>AUTHENTICATING KNIGHT-BOOKS...</p>
    </div>
  );

  const ti=income.reduce((s,i)=>s+Number(i.amount),0);const te=expenses.reduce((s,e)=>s+Number(e.amount),0);const ni=ti-te;
  const tabs=["Dashboard","Income","Expenses","Budget"];

  return(
    <div style={{minHeight:"100vh",background:C.off,display:"flex"}}>
      <div style={{width:260,background:C.black,color:C.white,padding:24,display:"flex",flexDirection:"column",position:"fixed",top:0,bottom:0,overflowY:"auto"}}>
        <div style={{marginBottom:32}}><h2 style={{fontSize:18,fontWeight:900,color:C.green,letterSpacing:2}}>KNIGHT-BOOKS</h2><div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:4,letterSpacing:1}}>FINANCIAL MANAGEMENT</div></div>
        {tabs.map(t=><button key={t} onClick={()=>setTab(t)} style={{textAlign:"left",background:tab===t?"rgba(29,158,117,0.15)":"transparent",color:tab===t?C.green:"rgba(255,255,255,0.6)",border:"none",padding:"12px 14px",borderRadius:8,fontSize:14,fontWeight:tab===t?700:500,cursor:"pointer",borderLeft:tab===t?`3px solid ${C.green}`:"3px solid transparent",marginBottom:4}}>{t}</button>)}
        <div style={{flex:1}}/>
        <button onClick={fetch} style={{background:"rgba(255,255,255,0.08)",color:C.white,border:"none",padding:10,borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",marginBottom:8}}>{loading?"...":"↻ Refresh"}</button>
        <a href="/admin" style={{textAlign:"center",display:"block",color:"rgba(255,255,255,0.5)",padding:10,fontSize:12,textDecoration:"none"}}>← Admin Portal</a>
        <a href="/admin/kcu" style={{textAlign:"center",display:"block",color:"rgba(255,255,255,0.4)",padding:6,fontSize:11,textDecoration:"none"}}>← KCU Admin</a>
      </div>
      <div style={{flex:1,padding:"32px 48px",marginLeft:260}}>
        {tab==="Dashboard"&&<Dash income={income} expenses={expenses} budget={budget} ti={ti} te={te} ni={ni}/>}
        {tab==="Income"&&<Inc income={income} students={students} fetch={fetch} st={st}/>}
        {tab==="Expenses"&&<Exp expenses={expenses} fetch={fetch} st={st}/>}
        {tab==="Budget"&&<Bud budget={budget} expenses={expenses} fetch={fetch} st={st}/>}
      </div>
      {toast&&<div style={{position:"fixed",bottom:24,right:24,background:C.green,color:C.white,padding:"14px 28px",borderRadius:12,fontSize:15,fontWeight:700,zIndex:9999,boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>{toast}</div>}
    </div>
  );
}

function Dash({income,expenses,budget,ti,te,ni}){
  const ebc={};expenses.forEach(e=>{ebc[e.category]=(ebc[e.category]||0)+Number(e.amount)});
  const mo={};
  income.forEach(i=>{const m=new Date(i.date).toLocaleString('default',{month:'short',year:'2-digit'});if(!mo[m])mo[m]={i:0,e:0};mo[m].i+=Number(i.amount)});
  expenses.forEach(e=>{const m=new Date(e.date).toLocaleString('default',{month:'short',year:'2-digit'});if(!mo[m])mo[m]={i:0,e:0};mo[m].e+=Number(e.amount)});
  const mx=Math.max(...Object.values(mo).map(m=>Math.max(m.i,m.e)),1);
  return(<div>
    <h1 style={{fontSize:28,fontWeight:900,marginBottom:24,color:C.green}}>Knight-Books Dashboard</h1>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:32}}>
      <Stat l="Total Income (YTD)" v={fm(ti)} c={C.green}/><Stat l="Total Expenses (YTD)" v={fm(te)} c={C.red}/><Stat l="Net Income" v={fm(ni)} c={ni>=0?C.green:C.red} s={ni>=0?"In the green":"Operating at a loss"}/>
    </div>
    <div style={{background:C.white,borderRadius:12,padding:28,marginBottom:24,boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
      <h2 style={{fontSize:18,fontWeight:800,marginBottom:20}}>Monthly Revenue vs Expenses</h2>
      {Object.keys(mo).length===0?<p style={{color:C.muted,textAlign:"center",padding:20}}>No data yet.</p>:
      <div style={{display:"flex",gap:16,alignItems:"flex-end",height:200}}>
        {Object.entries(mo).slice(-8).map(([m,d])=><div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{display:"flex",gap:2,alignItems:"flex-end",height:160}}>
            <div style={{width:16,background:C.green,borderRadius:"4px 4px 0 0",height:`${(d.i/mx)*160}px`,minHeight:d.i>0?4:0}} title={fm(d.i)}/>
            <div style={{width:16,background:C.red,borderRadius:"4px 4px 0 0",height:`${(d.e/mx)*160}px`,minHeight:d.e>0?4:0}} title={fm(d.e)}/>
          </div><div style={{fontSize:11,color:C.muted,fontWeight:600}}>{m}</div>
        </div>)}
      </div>}
      <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:12,fontSize:12,color:C.muted}}>
        <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,background:C.green,borderRadius:2}}/> Income</span>
        <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,background:C.red,borderRadius:2}}/> Expenses</span>
      </div>
    </div>
    <div style={{background:C.white,borderRadius:12,padding:28,boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
      <h2 style={{fontSize:18,fontWeight:800,marginBottom:16}}>Recent Transactions</h2>
      {[...income.map(i=>({...i,_t:'i'})),...expenses.map(e=>({...e,_t:'e'}))].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,12).map(tx=>
        <div key={tx.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.lg}`,fontSize:13}}>
          <div><span style={{fontWeight:600}}>{tx.description}</span><div style={{fontSize:11,color:C.muted}}>{tx.category} • {new Date(tx.date).toLocaleDateString()}</div></div>
          <div style={{fontWeight:800,color:tx._t==='i'?C.green:C.red}}>{tx._t==='i'?'+':'-'}{fm(tx.amount)}</div>
        </div>)}
    </div>
  </div>);
}

function Inc({income,students,fetch:f,st}){
  const[form,setForm]=useState({date:td(),category:'OS Disbursement',description:'',amount:'',student_id:'',reference_number:''});
  const[filter,setFilter]=useState('');
  const add=async e=>{e.preventDefault();if(!form.description||!form.amount)return;
    const{error}=await supabase.from('knightbooks_income').insert({date:form.date,category:form.category,description:form.description,amount:Number(form.amount),student_id:form.student_id||null,reference_number:form.reference_number||null});
    if(error){alert(error.message);return}st(`+${fm(form.amount)} recorded!`);setForm({date:td(),category:form.category,description:'',amount:'',student_id:'',reference_number:''});f()};
  const fl=filter?income.filter(i=>i.category===filter):income;const tot=fl.reduce((s,i)=>s+Number(i.amount),0);
  return(<div><h1 style={{fontSize:28,fontWeight:900,marginBottom:24}}>Income</h1>
    <form onSubmit={add} style={{background:C.white,borderRadius:12,padding:24,marginBottom:24,borderLeft:`4px solid ${C.green}`,boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
      <h2 style={{fontSize:16,fontWeight:800,marginBottom:16,color:C.green}}>Record Income</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
        <div><label style={{fontSize:11,fontWeight:700,color:C.muted,display:"block",marginBottom:4}}>DATE</label><input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} style={{width:"100%",padding:10,borderRadius:8,border:`1px solid ${C.lg}`,fontSize:14,boxSizing:"border-box"}}/></div>
        <div><label style={{fontSize:11,fontWeight:700,color:C.muted,display:"block",marginBottom:4}}>CATEGORY</label><select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} style={{width:"100%",padding:10,borderRadius:8,border:`1px solid ${C.lg}`,fontSize:14}}>{ICAT.map(c=><option key={c}>{c}</option>)}</select></div>
        <div><label style={{fontSize:11,fontWeight:700,color:C.muted,display:"block",marginBottom:4}}>AMOUNT ($)</label><input type="number" step="0.01" placeholder="0.00" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} required style={{width:"100%",padding:10,borderRadius:8,border:`1px solid ${C.lg}`,fontSize:14,boxSizing:"border-box"}}/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:12,marginBottom:16}}>
        <div><label style={{fontSize:11,fontWeight:700,color:C.muted,display:"block",marginBottom:4}}>DESCRIPTION</label><input type="text" placeholder="e.g. OS disbursement — Fall" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} required style={{width:"100%",padding:10,borderRadius:8,border:`1px solid ${C.lg}`,fontSize:14,boxSizing:"border-box"}}/></div>
        <div><label style={{fontSize:11,fontWeight:700,color:C.muted,display:"block",marginBottom:4}}>STUDENT</label><select value={form.student_id} onChange={e=>setForm(p=>({...p,student_id:e.target.value}))} style={{width:"100%",padding:10,borderRadius:8,border:`1px solid ${C.lg}`,fontSize:14}}><option value="">N/A</option>{students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
        <div><label style={{fontSize:11,fontWeight:700,color:C.muted,display:"block",marginBottom:4}}>REF #</label><input type="text" placeholder="Optional" value={form.reference_number} onChange={e=>setForm(p=>({...p,reference_number:e.target.value}))} style={{width:"100%",padding:10,borderRadius:8,border:`1px solid ${C.lg}`,fontSize:14,boxSizing:"border-box"}}/></div>
      </div>
      <button type="submit" style={{padding:"12px 32px",background:C.green,color:C.white,border:"none",borderRadius:8,fontSize:15,fontWeight:800,cursor:"pointer"}}>+ Record Income</button>
    </form>
    <div style={{background:C.white,borderRadius:12,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{fontSize:16,fontWeight:800}}>Income Records</h2>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:8,borderRadius:6,border:`1px solid ${C.lg}`,fontSize:13}}><option value="">All</option>{ICAT.map(c=><option key={c}>{c}</option>)}</select>
      </div>
      <table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}><thead><tr style={{borderBottom:`2px solid ${C.lg}`}}><th style={{textAlign:"left",padding:8,color:C.muted}}>Date</th><th style={{textAlign:"left",padding:8,color:C.muted}}>Category</th><th style={{textAlign:"left",padding:8,color:C.muted}}>Description</th><th style={{textAlign:"right",padding:8,color:C.muted}}>Amount</th></tr></thead>
      <tbody>{fl.map(i=><tr key={i.id} style={{borderBottom:`1px solid ${C.lg}`}}><td style={{padding:8}}>{new Date(i.date).toLocaleDateString()}</td><td style={{padding:8}}><span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:"#E0FFE8",color:C.green,fontWeight:600}}>{i.category}</span></td><td style={{padding:8,fontWeight:500}}>{i.description}</td><td style={{padding:8,textAlign:"right",fontWeight:800,color:C.green}}>{fm(i.amount)}</td></tr>)}</tbody></table>
      <div style={{marginTop:12,textAlign:"right",fontSize:16,fontWeight:800,color:C.green}}>Total: {fm(tot)}</div>
    </div>
  </div>);
}

function Exp({expenses,fetch:f,st}){
  const[form,setForm]=useState({date:td(),category:'Rent',description:'',amount:'',vendor:'',recurring:false});
  const[filter,setFilter]=useState('');
  const add=async e=>{e.preventDefault();if(!form.description||!form.amount)return;
    const{error}=await supabase.from('knightbooks_expenses').insert({date:form.date,category:form.category,description:form.description,amount:Number(form.amount),vendor:form.vendor||null,recurring:form.recurring});
    if(error){alert(error.message);return}st(`Expense of ${fm(form.amount)} recorded.`);setForm({date:td(),category:form.category,description:'',amount:'',vendor:'',recurring:false});f()};
  const fl=filter?expenses.filter(e=>e.category===filter):expenses;const tot=fl.reduce((s,e)=>s+Number(e.amount),0);
  return(<div><h1 style={{fontSize:28,fontWeight:900,marginBottom:24}}>Expenses</h1>
    <form onSubmit={add} style={{background:C.white,borderRadius:12,padding:24,marginBottom:24,borderLeft:`4px solid ${C.red}`,boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
      <h2 style={{fontSize:16,fontWeight:800,marginBottom:16,color:C.red}}>Record Expense</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
        <div><label style={{fontSize:11,fontWeight:700,color:C.muted,display:"block",marginBottom:4}}>DATE</label><input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} style={{width:"100%",padding:10,borderRadius:8,border:`1px solid ${C.lg}`,fontSize:14,boxSizing:"border-box"}}/></div>
        <div><label style={{fontSize:11,fontWeight:700,color:C.muted,display:"block",marginBottom:4}}>CATEGORY</label><select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} style={{width:"100%",padding:10,borderRadius:8,border:`1px solid ${C.lg}`,fontSize:14}}>{ECAT.map(c=><option key={c}>{c}</option>)}</select></div>
        <div><label style={{fontSize:11,fontWeight:700,color:C.muted,display:"block",marginBottom:4}}>AMOUNT ($)</label><input type="number" step="0.01" placeholder="0.00" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} required style={{width:"100%",padding:10,borderRadius:8,border:`1px solid ${C.lg}`,fontSize:14,boxSizing:"border-box"}}/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr auto",gap:12,marginBottom:16}}>
        <div><label style={{fontSize:11,fontWeight:700,color:C.muted,display:"block",marginBottom:4}}>DESCRIPTION</label><input type="text" placeholder="e.g. Monthly rent — August" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} required style={{width:"100%",padding:10,borderRadius:8,border:`1px solid ${C.lg}`,fontSize:14,boxSizing:"border-box"}}/></div>
        <div><label style={{fontSize:11,fontWeight:700,color:C.muted,display:"block",marginBottom:4}}>VENDOR</label><input type="text" placeholder="Who was paid?" value={form.vendor} onChange={e=>setForm(p=>({...p,vendor:e.target.value}))} style={{width:"100%",padding:10,borderRadius:8,border:`1px solid ${C.lg}`,fontSize:14,boxSizing:"border-box"}}/></div>
        <div style={{display:"flex",alignItems:"flex-end",paddingBottom:4}}><label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer",fontWeight:600,color:C.muted}}><input type="checkbox" checked={form.recurring} onChange={e=>setForm(p=>({...p,recurring:e.target.checked}))} style={{width:16,height:16}}/>Recurring</label></div>
      </div>
      <button type="submit" style={{padding:"12px 32px",background:C.red,color:C.white,border:"none",borderRadius:8,fontSize:15,fontWeight:800,cursor:"pointer"}}>+ Record Expense</button>
    </form>
    <div style={{background:C.white,borderRadius:12,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{fontSize:16,fontWeight:800}}>Expense Records</h2>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:8,borderRadius:6,border:`1px solid ${C.lg}`,fontSize:13}}><option value="">All</option>{ECAT.map(c=><option key={c}>{c}</option>)}</select>
      </div>
      <table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}><thead><tr style={{borderBottom:`2px solid ${C.lg}`}}><th style={{textAlign:"left",padding:8,color:C.muted}}>Date</th><th style={{textAlign:"left",padding:8,color:C.muted}}>Category</th><th style={{textAlign:"left",padding:8,color:C.muted}}>Description</th><th style={{textAlign:"left",padding:8,color:C.muted}}>Vendor</th><th style={{textAlign:"right",padding:8,color:C.muted}}>Amount</th></tr></thead>
      <tbody>{fl.map(e=><tr key={e.id} style={{borderBottom:`1px solid ${C.lg}`}}><td style={{padding:8}}>{new Date(e.date).toLocaleDateString()}</td><td style={{padding:8}}><span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:"rgba(226,75,74,0.08)",color:C.red,fontWeight:600}}>{e.category}</span></td><td style={{padding:8,fontWeight:500}}>{e.description}{e.recurring?" 🔄":""}</td><td style={{padding:8,color:C.muted}}>{e.vendor||"—"}</td><td style={{padding:8,textAlign:"right",fontWeight:800,color:C.red}}>{fm(e.amount)}</td></tr>)}</tbody></table>
      <div style={{marginTop:12,textAlign:"right",fontSize:16,fontWeight:800,color:C.red}}>Total: {fm(tot)}</div>
    </div>
  </div>);
}

function Bud({budget,expenses,fetch:f,st}){
  const[nc,setNc]=useState("");const[na,setNa]=useState("");
  const ebc={};expenses.forEach(e=>{ebc[e.category]=(ebc[e.category]||0)+Number(e.amount)});
  const add=async()=>{if(!nc||!na)return;const{error}=await supabase.from('knightbooks_budget').insert({category:nc,annual_budget:Number(na)});if(error){alert(error.message);return}st("Budget category added!");setNc("");setNa("");f()};
  const upd=async(id,v)=>{await supabase.from('knightbooks_budget').update({annual_budget:Number(v),updated_at:new Date().toISOString()}).eq('id',id);f()};
  const tb=budget.reduce((s,b)=>s+Number(b.annual_budget),0);const ts=Object.values(ebc).reduce((s,v)=>s+v,0);
  return(<div><h1 style={{fontSize:28,fontWeight:900,marginBottom:24}}>Budget vs Actual</h1>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:24}}>
      <Stat l="Annual Budget" v={fm(tb)} c={C.blue}/><Stat l="Spent YTD" v={fm(ts)} c={C.red}/><Stat l="Remaining" v={fm(tb-ts)} c={tb-ts>=0?C.green:C.red}/>
    </div>
    <div style={{background:C.white,borderRadius:12,padding:24,marginBottom:24,boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
      <h2 style={{fontSize:16,fontWeight:800,marginBottom:16}}>Budget Categories</h2>
      <table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}><thead><tr style={{borderBottom:`2px solid ${C.lg}`}}><th style={{textAlign:"left",padding:8,color:C.muted}}>Category</th><th style={{textAlign:"right",padding:8,color:C.muted}}>Budget</th><th style={{textAlign:"right",padding:8,color:C.muted}}>Spent</th><th style={{textAlign:"right",padding:8,color:C.muted}}>Remaining</th><th style={{textAlign:"right",padding:8,color:C.muted}}>% Used</th></tr></thead>
      <tbody>{budget.map(b=>{const sp=ebc[b.category]||0;const rm=Number(b.annual_budget)-sp;const pc=Number(b.annual_budget)>0?Math.round((sp/Number(b.annual_budget))*100):0;const bc=pc<75?C.green:pc<100?C.gold:C.red;
        return(<tr key={b.id} style={{borderBottom:`1px solid ${C.lg}`}}>
          <td style={{padding:8,fontWeight:600}}>{b.category}</td>
          <td style={{padding:8,textAlign:"right"}}><input type="number" value={b.annual_budget} onChange={e=>upd(b.id,e.target.value)} style={{width:100,padding:4,borderRadius:4,border:`1px solid ${C.lg}`,textAlign:"right",fontSize:13}}/></td>
          <td style={{padding:8,textAlign:"right",fontWeight:700,color:sp>0?C.red:C.muted}}>{fm(sp)}</td>
          <td style={{padding:8,textAlign:"right",fontWeight:700,color:rm>=0?C.green:C.red}}>{fm(rm)}</td>
          <td style={{padding:"8px 8px 8px 16px",textAlign:"right"}}><div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"flex-end"}}><div style={{width:60,height:6,background:C.lg,borderRadius:3,overflow:"hidden"}}><div style={{width:`${Math.min(pc,100)}%`,height:"100%",background:bc,borderRadius:3}}/></div><span style={{fontSize:12,fontWeight:700,color:bc,minWidth:36}}>{pc}%</span></div></td>
        </tr>)})}</tbody></table>
    </div>
    <div style={{background:C.white,borderRadius:12,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
      <h2 style={{fontSize:16,fontWeight:800,marginBottom:12}}>Add Budget Category</h2>
      <div style={{display:"flex",gap:12}}>
        <input type="text" placeholder="Category name" value={nc} onChange={e=>setNc(e.target.value)} style={{flex:1,padding:10,borderRadius:8,border:`1px solid ${C.lg}`,fontSize:14}}/>
        <input type="number" placeholder="Annual budget" value={na} onChange={e=>setNa(e.target.value)} style={{width:140,padding:10,borderRadius:8,border:`1px solid ${C.lg}`,fontSize:14}}/>
        <button onClick={add} style={{padding:"10px 24px",background:C.green,color:C.white,border:"none",borderRadius:8,fontWeight:700,cursor:"pointer"}}>+ Add</button>
      </div>
    </div>
  </div>);
}
