'use client';
import React from 'react';

const COLORS = {
  red: "#C41E1E",
  darkRed: "#8B0000",
  black: "#000000",
  gold: "#C8A84E",
  darkGold: "#9E7E2E",
  white: "#FFFFFF",
  offWhite: "#F8F6F0",
  gray: "#2A2A2A",
  text: "#1A1A1A",
  textMuted: "#6B6B6B"
};

export default function Handbook() {
  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", backgroundColor: COLORS.offWhite, minHeight: "100vh", paddingBottom: 60 }}>
      {/* Top Navigation Bar */}
      <nav style={{ background: COLORS.black, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/Krown_Academy_New_Logo.png.png" alt="Krown Academy Crest" style={{ height: 50, width: "auto" }} />
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 800, color: COLORS.gold, letterSpacing: 2 }}>KROWN ACADEMY</div>
        </div>
        <a href="/" style={{ color: COLORS.white, textDecoration: "none", fontWeight: 700, padding: "10px 20px", background: COLORS.red, borderRadius: 8, transition: "opacity 0.2s" }}
           onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
           onMouseLeave={e => e.currentTarget.style.opacity = 1}>
          ← Back to Website
        </a>
      </nav>

      {/* Document Container */}
      <div style={{ maxWidth: 850, margin: "60px auto 0", background: COLORS.white, borderRadius: 16, boxShadow: "0 10px 40px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        
        {/* Document Header */}
        <div style={{ background: `linear-gradient(135deg, ${COLORS.black}, #1a0000)`, padding: "60px 40px", textAlign: "center", color: COLORS.white, borderBottom: `6px solid ${COLORS.red}` }}>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 48, fontWeight: 900, color: COLORS.gold, marginBottom: 16, letterSpacing: 2 }}>STUDENT HANDBOOK</h1>
          <h2 style={{ fontSize: 20, fontWeight: 500, color: "rgba(255,255,255,0.8)", marginBottom: 24, letterSpacing: 4 }}>ACADEMIC YEAR 2024–2025</h2>
          <div style={{ width: 60, height: 2, background: COLORS.red, margin: "0 auto 24px" }} />
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)" }}>
            KINGS & QUEENS | "Earn Your Krown"<br/>
            A Program of KVegas Elite Inc (501(c)(3)) | Managed by KD THRILL LLC<br/>
            Kendall Nelson, Founder | 336-500-4765 | knelson@krownacademy.org
          </p>
        </div>

        {/* Document Body */}
        <div style={{ padding: "60px 80px", color: COLORS.text, fontSize: 17, lineHeight: 1.8 }}>
          
          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 28, fontWeight: 800, color: COLORS.black, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: COLORS.gold }}>1.</span> Welcome from Coach Nelson
            </h3>
            <p style={{ marginBottom: 16 }}><strong>Welcome to Krown Academy. Welcome to the Kingdom.</strong></p>
            <p style={{ marginBottom: 16 }}>I'm Kendall Nelson. I hold degrees in Sociology and Psychology. I'm a championship wrestling coach. And I was once an at-risk youth myself. I built Krown Academy because I know what it's like to need someone who believes in you. For my Kings and Queens, that someone is me.</p>
            <p style={{ marginBottom: 16 }}>My philosophy: the pessimist complains about the wind. The optimist expects it to change. At Krown Academy, we adjust the sails.</p>
            <p style={{ marginBottom: 16 }}>Bring me metal. I'll make you a hammer.</p>
            <p style={{ fontStyle: "italic", fontWeight: 700, color: COLORS.red }}>Earn Your Krown.<br/>— Coach Nelson</p>
          </div>

          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 28, fontWeight: 800, color: COLORS.black, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: COLORS.gold }}>2.</span> Our Mission
            </h3>
            <p>Krown Academy develops the whole King and Queen — mind, body, and character — through three equally prestigious pillars: rigorous academics, championship-level athletics, and intentional mentoring. I serve at-risk youth and student-athletes in grades 6–12 in Winston-Salem / Kernersville, NC.</p>
          </div>

          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 28, fontWeight: 800, color: COLORS.black, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: COLORS.gold }}>3.</span> Organizational Structure
            </h3>
            <p>Krown Academy is a program of KVegas Elite Inc (EIN: 33-4622985), a 501(c)(3) nonprofit. Management services provided by KD THRILL LLC (EIN: 86-3367612). Governed by the KVegas Elite Board of Directors.</p>
          </div>

          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 28, fontWeight: 800, color: COLORS.black, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: COLORS.gold }}>4.</span> School Hours
            </h3>
            <p><strong>8:00 AM – 3:00 PM</strong>, Monday through Friday. Students should arrive by 7:50 AM and be picked up by 3:15 PM.</p>
          </div>

          {/* NEW LUNCH POLICY BANNERS */}
          <div style={{ marginBottom: 48, background: "rgba(200,168,78,0.1)", borderRadius: 12, padding: 32, borderLeft: `6px solid ${COLORS.gold}` }}>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: COLORS.black, marginBottom: 12 }}>Lunch & Transportation Policy (Year 1)</h3>
            <p style={{ marginBottom: 12 }}><strong>Transportation:</strong> Transportation to and from the academy is the responsibility of the families. We currently operate a Bring Your Own Transportation policy.</p>
            <p><strong>Lunch:</strong> Krown Academy enforces a Bring Your Own Lunch policy for Year 1. All students are required to bring a packed, nutritious lunch daily. We do not provide cafeteria meal service at this time.</p>
          </div>

          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 28, fontWeight: 800, color: COLORS.black, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: COLORS.gold }}>5.</span> Academic Program
            </h3>
            <p>Academics are delivered through Acellus digital curriculum (self-paced, individualized) supplemented by teacher-led direct instruction and daily assessment via Ticket Owl'd The Door. Every student receives a 1:1 school-issued Chromebook for use in school and at home.</p>
            <ul style={{ marginTop: 12, paddingLeft: 24, listStyleType: "disc", display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>Core subjects:</strong> Math, ELA, Science, History.</li>
              <li>High school students access expanded college-prep coursework through Acellus.</li>
              <li>A <strong>2.0 GPA minimum</strong> is explicitly required for athletic competition eligibility.</li>
            </ul>
          </div>

          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 28, fontWeight: 800, color: COLORS.black, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: COLORS.gold }}>6.</span> Athletic Program
            </h3>
            <p>Wrestling is our cornerstone sport. Students who prefer not to wrestle participate in structured PE. Teachers double as coaches. We compete in the NCISAA, USA Wrestling events, and travel to Prep Nationals in Pennsylvania annually. Football, basketball, and track & field coming soon.</p>
          </div>

          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 28, fontWeight: 800, color: COLORS.black, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: COLORS.gold }}>7.</span> Mentoring Program
            </h3>
            <p>Every King and Queen participates in intentional mentoring. This includes daily morning mindset sessions, weekly 1-on-1 mentor meetings, sports psychology, journaling, and group mentoring on life skills. Coach Nelson designed this proprietary program stemming from his Sociology and Psychology education and personal experience.</p>
          </div>

          <div style={{ marginBottom: 48, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: COLORS.black, marginBottom: 16 }}>Attendance</h3>
              <p>Expected every day. Notify staff by 8:00 AM for absences. <strong>10+ unexcused absences</strong> per semester may immediately affect enrollment status and scholarship funding eligibility.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: COLORS.black, marginBottom: 16 }}>Grading Scale</h3>
              <p>Acellus tracks academic progress alongside Ticket Owl'd The Door. Report cards are issued quarterly. Parent conferences are required 2x/year.</p>
              <ul style={{ marginTop: 8, listStyle: "none", padding: 0, fontWeight: 600 }}>
                <li>A (90–100) | B (80–89) | C (70–79) | D (60–69) | F (Below 60)</li>
              </ul>
            </div>
          </div>

          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 28, fontWeight: 800, color: COLORS.black, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: COLORS.gold }}>8.</span> Discipline Structure
            </h3>
            <p>Krown Academy operates heavily on a progressive, restorative framework:</p>
            <div style={{ background: COLORS.offWhite, padding: 20, borderRadius: 8, marginTop: 16, fontWeight: 600, color: COLORS.red, textAlign: "center", letterSpacing: 1 }}>
              Redirect → Intervention → Director Conference → Suspension → Expulsion
            </div>
            <p style={{ marginTop: 16, fontStyle: "italic" }}>"I'd rather invest 10 hours in a difficult conversation than give up on a King or Queen."</p>
          </div>

          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 28, fontWeight: 800, color: COLORS.black, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: COLORS.gold }}>9.</span> Disclosures & Administration
            </h3>
            <p style={{ marginBottom: 12 }}><strong>Tuition & Scholarships:</strong> $7,468/year — this is fully covered by Tier 1–2 Opportunity Scholarship. ESA+ is formally available for students with disabilities. Coach Nelson personally walks every family through the application.</p>
            <p style={{ marginBottom: 12 }}><strong>1:1 Devices:</strong> Every student receives a Chromebook. Devices must be brought charged daily. For lost/damaged hardware, consult the fee schedule in the Device Agreement.</p>
            <p><strong>Non-Discrimination:</strong> Krown Academy does not discriminate on the basis of race, color, national origin, sex, disability, religion, or any other protected status.</p>
          </div>

          <div style={{ borderTop: `2px solid ${COLORS.lightGray}`, paddingTop: 40, marginTop: 80 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: COLORS.black, marginBottom: 32, textAlign: "center" }}>Parent / Guardian Acknowledgment</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
              <div>
                <div style={{ borderBottom: `2px solid ${COLORS.black}`, height: 40 }} />
                <p style={{ fontSize: 13, fontWeight: 600, marginTop: 8, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Parent/Guardian Signature</p>
              </div>
              <div>
                <div style={{ borderBottom: `2px solid ${COLORS.black}`, height: 40 }} />
                <p style={{ fontSize: 13, fontWeight: 600, marginTop: 8, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Date</p>
              </div>
              <div>
                <div style={{ borderBottom: `2px solid ${COLORS.black}`, height: 40 }} />
                <p style={{ fontSize: 13, fontWeight: 600, marginTop: 8, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Student Signature</p>
              </div>
              <div>
                <div style={{ borderBottom: `2px solid ${COLORS.black}`, height: 40 }} />
                <p style={{ fontSize: 13, fontWeight: 600, marginTop: 8, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Date</p>
              </div>
            </div>
            
            {/* Action Bar for Printing */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
              <button onClick={() => window.print()} style={{ background: COLORS.black, color: COLORS.white, padding: "16px 40px", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, letterSpacing: 1 }}>
                🖨️ Print Handbook for Signature
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
