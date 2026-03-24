'use client';
import React, { useState } from 'react';

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

const FAQ_DATA = [
  {
    q: "What is Krown Academy?",
    a: "A private school for at-risk youth and student-athletes, grades 6–12. Three pillars: academics (Acellus + teachers + Ticket Owl'd The Door), athletics (wrestling/PE), and mentoring. Located in Winston-Salem / Kernersville, NC."
  },
  {
    q: "Who is Coach Nelson?",
    a: "I'm Kendall Nelson — I hold degrees in Sociology and Psychology, I'm a championship wrestling coach and co-owner of K-Vegas Elite Wrestling Club, and I was once an at-risk youth myself. I built Krown Academy because I know what these kids need."
  },
  {
    q: "How much does it cost?",
    a: "$7,468/year. Families qualifying for Tier 1–2 Opportunity Scholarship pay $0. I walk every family through the application personally."
  },
  {
    q: "Does my child get a computer?",
    a: "Yes. Every student receives a school-issued Chromebook for use in school and at home. All coursework runs through Acellus and Ticket Owl'd The Door on this device."
  },
  {
    q: "What curriculum do you use?",
    a: "Acellus digital curriculum (self-paced, individualized, accredited) supplemented by teacher-led direct instruction and daily assessment through my Ticket Owl'd The Door platform."
  },
  {
    q: "Does my child have to wrestle?",
    a: "No. Wrestling is our cornerstone sport, but students who prefer not to wrestle participate in structured PE — functional fitness, conditioning, and athletic development."
  },
  {
    q: "Who will my child compete against?",
    a: "Krown Academy is an NCISAA member from Year 1 — we compete for private school state championships. We also compete at USA Wrestling Preseason Nationals and Prep Nationals in Pennsylvania every year."
  },
  {
    q: "What about mentoring?",
    a: "Every student has a mentor and participates daily. Morning mindset sessions, weekly 1-on-1 meetings, sports psychology, group mentoring on life skills. I designed this from my Sociology and Psychology background."
  },
  {
    q: "What if my child has behavioral issues?",
    a: "I use restorative practices. My goal is always to keep your child at Krown Academy. I have a detailed progressive discipline policy and I communicate with you every step of the way."
  },
  {
    q: "What if my child has a disability?",
    a: "They may qualify for ESA+ ($9,000–$17,000/year) on top of the Opportunity Scholarship. I also offer enhanced services for ESA+ families. I'll help you navigate the process."
  },
  {
    q: "How do I enroll?",
    a: "Call or text me at 336-500-4765 or email krownacademynelson@gmail.com. I walk you through everything."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0); // First one open by default

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

      {/* Hero Header */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.black}, #1a0000)`, padding: "80px 40px 120px", textAlign: "center", color: COLORS.white, position: "relative" }}>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: COLORS.gold, marginBottom: 16, letterSpacing: 2 }}>PARENT F.A.Q.</h1>
        <h2 style={{ fontSize: 20, fontWeight: 500, color: "rgba(255,255,255,0.8)", marginBottom: 24, letterSpacing: 1 }}>Frequently Asked Questions</h2>
        <div style={{ width: 60, height: 3, background: COLORS.red, margin: "0 auto 24px" }} />
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
          If you have a question that isn't answered below, call or text me directly at <strong>336-500-4765</strong> anytime.
        </p>
      </div>

      {/* Accordion Container */}
      <div style={{ maxWidth: 800, margin: "-60px auto 0", position: "relative", zIndex: 10, padding: "0 20px" }}>
        <div style={{ background: COLORS.white, borderRadius: 16, boxShadow: "0 20px 40px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          {FAQ_DATA.map((item, index) => {
            const isOpen = index === openIndex;
            return (
              <div key={index} style={{ borderBottom: index < FAQ_DATA.length - 1 ? `1px solid ${COLORS.lightGray}` : "none" }}>
                <button 
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  style={{ width: "100%", textAlign: "left", padding: "24px 32px", background: isOpen ? "rgba(196,30,30,0.02)" : COLORS.white, border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "all 0.2s" }}
                >
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: isOpen ? COLORS.red : COLORS.black, paddingRight: 24, lineHeight: 1.4 }}>
                    {item.q}
                  </h3>
                  <div style={{ color: isOpen ? COLORS.red : COLORS.gold, fontSize: 24, fontWeight: 300, transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.3s" }}>
                    +
                  </div>
                </button>
                
                {isOpen && (
                  <div style={{ padding: "0 32px 32px", fontSize: 16, color: COLORS.text, lineHeight: 1.8, animation: "fadeIn 0.3s ease-in-out" }}>
                    <div style={{ borderLeft: `3px solid ${COLORS.gold}`, paddingLeft: 20 }}>
                      {item.a}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Contact CTA */}
        <div style={{ marginTop: 60, textAlign: "center" }}>
          <p style={{ fontSize: 16, color: COLORS.textMuted, marginBottom: 20 }}>Ready to begin your child's journey at Krown Academy?</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <a href="tel:3365004765" style={{ background: COLORS.gold, color: COLORS.black, padding: "16px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 800, fontSize: 16, letterSpacing: 1 }}>
              📞 Call Coach Nelson
            </a>
            <a href="mailto:krownacademynelson@gmail.com" style={{ background: COLORS.black, color: COLORS.white, padding: "16px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 800, fontSize: 16, letterSpacing: 1 }}>
              ✉️ Email Admissions
            </a>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
