'use client';
import React from 'react';

const COLORS = {
  red: "#C41E1E",
  darkRed: "#8B0000",
  black: "#000000",
  gold: "#C8A84E",
  white: "#FFFFFF",
  offWhite: "#F8F6F0",
  lightGray: "#E8E6E0",
  text: "#1A1A1A",
  textMuted: "#6B6B6B"
};

const SCHEDULE = [
  {
    month: "August 2024",
    events: [
      { date: "Aug 15", title: "Parent & Student Orientation", desc: "Mandatory kick-off meeting and Chromebook distribution. 6:00 PM." },
      { date: "Aug 26", title: "First Day of School", desc: "Instruction begins at 8:00 AM sharp." },
    ]
  },
  {
    month: "September 2024",
    events: [
      { date: "Sep 2", title: "Labor Day", desc: "No School." },
      { date: "Sep 15", title: "Quarterly Mentor Seminars Begin", desc: "First major offline leadership seminar." },
    ]
  },
  {
    month: "October 2024",
    events: [
      { date: "Oct 15", title: "End of Quarter 1", desc: "Report Cards Issued." },
      { date: "Oct 26", title: "Wrestling Season Kickoff", desc: "Official start of competitive training and local tournament registration." },
    ]
  },
  {
    month: "November 2024",
    events: [
      { date: "Nov 11", title: "Veterans Day", desc: "No School." },
      { date: "Nov 27-29", title: "Thanksgiving Break", desc: "No School." },
    ]
  },
  {
    month: "December 2024",
    events: [
      { date: "Dec 18", title: "End of Semester 1", desc: "Final Exams and Ticket Owl'd The Door comprehensive reviews." },
      { date: "Dec 20-Jan 5", title: "Winter Break", desc: "No School." },
    ]
  },
  {
    month: "February 2025",
    events: [
      { date: "Feb (TBA)", title: "NC State Championships", desc: "USA Wrestling tournament." },
    ]
  },
  {
    month: "March/April 2025",
    events: [
      { date: "Mar/Apr", title: "Prep Nationals", desc: "Annual wrestling trip to Pennsylvania." },
    ]
  }
];

export default function Calendar() {
  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", backgroundColor: COLORS.offWhite, minHeight: "100vh", paddingBottom: 60 }}>
      {/* Top Navigation Bar */}
      <nav style={{ background: COLORS.black, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/Krown_Academy_New_Logo.png.png" alt="Krown Academy Crest" style={{ height: 50, width: "auto" }} />
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 800, color: COLORS.gold, letterSpacing: 2 }}>KROWN ACADEMY</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/" style={{ color: COLORS.white, textDecoration: "none", fontWeight: 700, padding: "10px 20px", background: COLORS.red, borderRadius: 8 }}>
            Back to Website
          </a>
        </div>
      </nav>

      {/* Hero Header */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.black}, #1a0000)`, padding: "80px 40px 120px", textAlign: "center", color: COLORS.white, position: "relative" }}>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: COLORS.gold, marginBottom: 16, letterSpacing: 2 }}>ACADEMIC CALENDAR</h1>
        <h2 style={{ fontSize: 20, fontWeight: 500, color: "rgba(255,255,255,0.8)", marginBottom: 24, letterSpacing: 1 }}>2024–2025 School Year</h2>
        <div style={{ width: 60, height: 3, background: COLORS.red, margin: "0 auto 24px" }} />
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
          Important dates, holidays, offline seminars, and cornerstone athletic events.
        </p>
      </div>

      {/* Calendar Container */}
      <div style={{ maxWidth: 900, margin: "-60px auto 0", position: "relative", zIndex: 10, padding: "0 20px" }}>
        <div style={{ background: COLORS.white, borderRadius: 16, boxShadow: "0 20px 40px rgba(0,0,0,0.08)", padding: "40px" }}>
          
          {SCHEDULE.map((monthBlock, idx) => (
            <div key={idx} style={{ marginBottom: 40 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: COLORS.black, borderBottom: `2px solid ${COLORS.gold}`, paddingBottom: 12, marginBottom: 24 }}>
                {monthBlock.month}
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {monthBlock.events.map((event, eIdx) => (
                  <div key={eIdx} style={{ display: "flex", gap: 24, padding: "20px", background: "rgba(0,0,0,0.02)", borderRadius: 12, borderLeft: `4px solid ${COLORS.red}` }}>
                    <div style={{ minWidth: 100 }}>
                      <span style={{ display: "block", color: COLORS.red, fontSize: 18, fontWeight: 800 }}>{event.date}</span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: 18, fontWeight: 700, color: COLORS.black, marginBottom: 8 }}>{event.title}</h4>
                      <p style={{ fontSize: 15, color: COLORS.textMuted, lineHeight: 1.6 }}>{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>

        <div style={{ marginTop: 40, textAlign: "center", padding: "40px", background: COLORS.black, borderRadius: 16, color: COLORS.white }}>
          <h3 style={{ color: COLORS.gold, fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Need to ask Coach Nelson about a date?</h3>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 24 }}>Call or text directly for immediate answers.</p>
          <a href="tel:3365004765" style={{ background: COLORS.red, color: COLORS.white, padding: "16px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 800, fontSize: 16 }}>
            📞 336-500-4765
          </a>
        </div>
      </div>
    </div>
  );
}
