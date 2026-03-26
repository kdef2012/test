'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

const COLORS = {
  red: "#C41E1E", black: "#000000", gold: "#C8A84E", white: "#FFFFFF",
  offWhite: "#F8F6F0", lightGray: "#E8E6E0", text: "#1A1A1A", textMuted: "#6B6B6B",
  green: "#1D9E75",
};

export default function AthleticsPortal() {
  const [athletes, setAthletes] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Wrestling");

  useEffect(() => {
    async function loadSports() {
      const [rRes, sRes] = await Promise.all([
        supabase.from('krown_athletics_roster').select('*').order('created_at', { ascending: false }).catch(()=>({data:[]})),
        supabase.from('krown_athletics_schedule').select('*').order('match_date', { ascending: true }).catch(()=>({data:[]}))
      ]);
      if(rRes && rRes.data) setAthletes(rRes.data);
      if(sRes && sRes.data) setSchedules(sRes.data);
      setLoading(false);
    }
    loadSports();
  }, []);

  const sportAthletes = athletes.filter(a => a.sport === activeTab);
  const sportSchedules = schedules.filter(s => s.sport === activeTab);
  const aotw = sportAthletes.find(a => a.is_athlete_of_week) || sportAthletes[0];

  return (
    <div style={{ background: COLORS.black, minHeight: "100vh", color: COLORS.white, fontFamily: "'Outfit', sans-serif" }}>
      {/* HEADER HERO */}
      <section style={{ position: "relative", overflow: "hidden", borderBottom: `4px solid ${COLORS.red}` }}>
         <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "url('/knights-logo.png') no-repeat center bottom", backgroundSize: "cover", opacity: 0.1, zIndex: 0 }} />
         <div style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto", padding: "80px 20px 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
           <img src="/knights-logo.png" alt="Krown Knights Official Mascot" style={{ width: 220, height: "auto", marginBottom: 20, filter: "drop-shadow(0 10px 30px rgba(196,30,30,0.4))" }} />
           <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 56, fontWeight: 900, color: COLORS.white, letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>
             Krown <span style={{ color: COLORS.red }}>Knights</span>
           </h1>
           <p style={{ color: COLORS.gold, fontSize: 18, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2 }}>Mind. Body. Character. Excellence.</p>
         </div>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 80px" }}>
        {/* SPORTS TABS */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 48, flexWrap: "wrap" }}>
           {["Wrestling", "Basketball", "Track & Field"].map(sport => (
             <button 
               key={sport} 
               onClick={() => setActiveTab(sport)}
               style={{ padding: "14px 32px", fontSize: 18, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, border: "none", borderRadius: 8, cursor: "pointer", transition: "all 0.3s", background: activeTab === sport ? COLORS.red : "rgba(255,255,255,0.05)", color: activeTab === sport ? COLORS.white : "rgba(255,255,255,0.6)" }}
             >
               {sport}
             </button>
           ))}
        </div>

        {loading ? (
           <div style={{ textAlign: "center", color: COLORS.gold, fontWeight: 800, letterSpacing: 2, padding: "100px 0" }}>LOADING {activeTab.toUpperCase()} SCHEDULES AND ROSTERS...</div>
        ) : (
           <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
             {/* LEFT COLUMN: ROSTER & AOTW */}
             <div style={{ flex: 2, minWidth: 320 }}>
               
               {/* ATHLETE OF THE WEEK SHOWCASE */}
               {aotw && (
                 <div style={{ marginBottom: 40 }}>
                   <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                     <div style={{ width: 40, height: 4, background: COLORS.gold }} />
                     <h3 style={{ fontSize: 20, fontWeight: 900, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>Athlete of the Week</h3>
                   </div>
                   <div style={{ background: `linear-gradient(135deg, ${COLORS.red} 0%, #800000 100%)`, borderRadius: 16, padding: "32px 40px", display: "flex", gap: 24, alignItems: "center", boxShadow: "0 12px 40px rgba(196,30,30,0.3)", flexWrap: "wrap" }}>
                     <div style={{ width: 100, height: 100, background: COLORS.black, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, color: COLORS.white, border: `4px solid ${COLORS.gold}`, flexShrink: 0 }}>
                       {aotw.jersey_number ? `#${aotw.jersey_number}` : aotw.student_name.charAt(0)}
                     </div>
                     <div style={{ flex: 1, minWidth: 200 }}>
                       <h4 style={{ fontSize: 28, fontWeight: 900, marginBottom: 4, color: COLORS.white, letterSpacing: 0.5 }}>{aotw.student_name}</h4>
                       <div style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", fontWeight: 700, marginBottom: 12 }}>
                         {aotw.grade} &bull; {aotw.weight_class ? aotw.weight_class : aotw.position}
                       </div>
                       <p style={{ fontSize: 15, color: "rgba(255,255,255,0.9)", lineHeight: 1.6, fontWeight: 500 }}>{aotw.bio || "Excellence on and off the mat. True embodiment of a Krown Knight."}</p>
                     </div>
                   </div>
                 </div>
               )}

               {/* OFFICIAL ROSTER */}
               <div>
                 <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                   <div style={{ width: 40, height: 4, background: COLORS.white }} />
                   <h3 style={{ fontSize: 20, fontWeight: 900, color: COLORS.white, textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>Official Roster</h3>
                 </div>
                 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                   {sportAthletes.map(a => (
                     <div key={a.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 20, border: `1px solid rgba(255,255,255,0.1)`, transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.red} onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}>
                       <h4 style={{ fontSize: 18, fontWeight: 800, color: COLORS.white }}>{a.student_name}</h4>
                       <div style={{ fontSize: 13, color: COLORS.red, fontWeight: 700, marginTop: 4 }}>
                         {a.grade} &bull; {a.weight_class ? a.weight_class : a.position} {a.jersey_number ? `(#${a.jersey_number})` : ""}
                       </div>
                     </div>
                   ))}
                   {sportAthletes.length === 0 && <p style={{ color: "rgba(255,255,255,0.4)", fontWeight: 500, fontStyle: "italic", padding: "10px 0" }}>Roster not officially posted by Coach Nelson yet.</p>}
                 </div>
               </div>
             </div>

             {/* RIGHT COLUMN: SEASON SCHEDULE */}
             <div style={{ flex: 1, minWidth: 320 }}>
               <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                   <div style={{ width: 40, height: 4, background: COLORS.red }} />
                   <h3 style={{ fontSize: 20, fontWeight: 900, color: COLORS.red, textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>Season Schedule</h3>
               </div>
               <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 24, border: `1px solid rgba(255,255,255,0.1)` }}>
                 {sportSchedules.length === 0 ? <p style={{ color: "rgba(255,255,255,0.4)", fontWeight: 500, fontStyle: "italic" }}>Schedule TBA. Waiting for finalization.</p> : sportSchedules.map((game, i) => (
                   <div key={game.id} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: i < sportSchedules.length - 1 ? `1px solid rgba(255,255,255,0.1)` : "none" }}>
                     <div style={{ textAlign: "center", minWidth: 60 }}>
                       <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.gold, textTransform: "uppercase" }}>
                         {new Date(game.match_date).toLocaleDateString('en-US', { month: 'short' })}
                       </div>
                       <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.white, lineHeight: 1 }}>
                         {new Date(game.match_date).toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' })}
                       </div>
                     </div>
                     <div style={{ flex: 1 }}>
                       <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.white }}>vs. {game.opponent}</div>
                       <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4, fontWeight: 600 }}>{game.location} &bull; {game.match_time}</div>
                     </div>
                     {game.result && (
                       <div style={{ fontWeight: 900, fontSize: 16, color: game.result.startsWith('W') ? COLORS.green : COLORS.red }}>
                         {game.result}
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             </div>
           </div>
        )}
      </section>
      
      {/* FOOTER NAV */}
      <div style={{ textAlign: "center", padding: "40px", borderTop: `1px solid rgba(255,255,255,0.1)` }}>
         <a href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>← BACK TO HOME</a>
      </div>
    </div>
  );
}
