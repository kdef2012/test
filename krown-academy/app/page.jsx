'use client';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';


const COLORS = {
  red: "#C41E1E",
  darkRed: "#8B0000",
  black: "#000000",
  gold: "#C8A84E",
  darkGold: "#9E7E2E",
  white: "#FFFFFF",
  offWhite: "#F8F6F0",
  gray: "#2A2A2A",
  lightGray: "#E8E6E0",
  text: "#1A1A1A",
  textMuted: "#6B6B6B",
};

const LINKS = {
  os: "https://k12.ncseaa.edu/opportunity-scholarship/",
  osApply: "https://k12.ncseaa.edu/opportunity-scholarship/how-to-apply/",
  esa: "https://k12.ncseaa.edu/the-education-student-accounts/",
  dnpe: "https://ncadmin.nc.gov/citizens/non-public-education",
  prepNationals: "https://www.nationalprepwrestling.org/",
};

// Reusable section wrapper
function Section({ id, bg, children, className = "" }) {
  return (
    <section id={id} style={{ background: bg || "transparent" }} className={`py-20 px-4 ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

function SectionTitle({ children, light = false, sub = "" }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-3">
        <div style={{ width: 40, height: 3, background: COLORS.red }} />
        <span style={{ color: COLORS.red, fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase" }}>
          {sub}
        </span>
      </div>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: light ? COLORS.white : COLORS.black, lineHeight: 1.15, letterSpacing: -0.5 }}>
        {children}
      </h2>
    </div>
  );
}

function Card({ title, desc, icon, accent = COLORS.red }) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 12, padding: "28px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)", borderTop: `4px solid ${accent}`, height: "100%" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: COLORS.black }}>{title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.textMuted }}>{desc}</p>
    </div>
  );
}

function Button({ children, href, variant = "primary", onClick, type = "button" }) {
  const styles = {
    primary: { background: COLORS.red, color: COLORS.white, border: "none" },
    outline: { background: "transparent", color: COLORS.white, border: `2px solid ${COLORS.white}` },
    dark: { background: COLORS.black, color: COLORS.white, border: "none" },
    gold: { background: COLORS.gold, color: COLORS.black, border: "none" },
  };
  const s = styles[variant];
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} onClick={onClick} type={href ? undefined : type} target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener"
      style={{ ...s, padding: "14px 32px", borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: "none", display: "inline-block", cursor: "pointer", letterSpacing: 0.5, transition: "transform 0.2s, opacity 0.2s" }}
      onMouseEnter={e => { e.target.style.opacity = 0.9; e.target.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.target.style.opacity = 1; e.target.style.transform = "none"; }}>
      {children}
    </Tag>
  );
}

function StatBox({ num, label }) {
  return (
    <div className="text-center">
      <div style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: COLORS.gold, lineHeight: 1 }}>{num}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 6, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

const FORMS = {
  Enrollment: {
    title: "Enrollment Application",
    fields: [
      { label: "Student Full Name", type: "text" },
      { label: "Grade Level Entering (6-12)", type: "text" },
      { label: "Current School", type: "text" },
      { label: "Date of Birth", type: "date" },
      { label: "Parent/Guardian Name", type: "text" },
      { label: "Phone Number", type: "tel" },
      { label: "Email Address", type: "email" },
      { label: "Why Krown Academy?", type: "textarea" },
      { label: "Parent Signature (Type Name)", type: "text" }
    ]
  },
  Information: {
    title: "Student Information Form",
    fields: [
      { label: "Student Full Name", type: "text" },
      { label: "Home Address", type: "textarea" },
      { label: "Parent 1 Name & Phone", type: "text" },
      { label: "Parent 2 Name & Phone", type: "text" },
      { label: "Emergency Contact Name & Phone", type: "text" },
      { label: "Known Medical Conditions / Allergies", type: "textarea" },
      { label: "Parent Signature (Type Name)", type: "text" }
    ]
  },
  Athletic: {
    title: "Athletic Participation Form",
    fields: [
      { label: "Student Full Name", type: "text" },
      { label: "Primary Sport Interest", type: "select", options: ["Wrestling", "Physical Education (PE)", "Other"] },
      { label: "Primary Physician Name & Phone", type: "text" },
      { label: "Insurance Provider & Policy #", type: "text" },
      { label: "I grant permission for my child to participate in athletics.", type: "checkbox" },
      { label: "Parent Signature (Type Name)", type: "text" }
    ]
  },
  Medical: {
    title: "Medical / Immunization Records",
    fields: [
      { label: "Student Full Name", type: "text" },
      { label: "Immunization Status", type: "select", options: ["Up to date", "Needs update", "Exemption claimed"] },
      { label: "Significant Medical History", type: "textarea" },
      { label: "I acknowledge that I must also provide a physical copy of my child&apos;s official medical and immunization records to Kendall.", type: "checkbox" },
      { label: "Parent Signature (Type Name)", type: "text" }
    ]
  },
  Device: {
    title: "1:1 Device Agreement",
    fields: [
      { label: "Student Full Name", type: "text" },
      { label: "Parent/Guardian Name", type: "text" },
      { label: "Agreement Selection", type: "radio", options: [
        "I AGREE to be responsible for the assigned Chromebook and the acceptable use policy.",
        "I DO NOT AGREE to be responsible for the assigned Chromebook."
      ] },
      { label: "Parent Signature (Type Name)", type: "text" }
    ]
  },
  Media: {
    title: "Photo / Media Release",
    fields: [
      { label: "Student Full Name", type: "text" },
      { label: "Parent/Guardian Name", type: "text" },
      { label: "Media Release Selection", type: "radio", options: [
        "I GRANT permission for photo/video use in Krown Academy marketing.",
        "I DO NOT GRANT permission for photo/video use in Krown Academy marketing."
      ] },
      { label: "Parent Signature (Type Name)", type: "text" }
    ]
  },
  Employee: {
    title: "Employment Application",
    fields: [
      { label: "Full Name", type: "text" },
      { label: "Phone Number", type: "tel" },
      { label: "Email Address", type: "email" },
      { label: "Position Applying For", type: "select", options: ["Teacher / Assistant Coach", "Sports Trainer", "Administrative / Other"] },
      { label: "Highest Education Level", type: "select", options: ["High School", "Associate's", "Bachelor's", "Master's", "Doctorate"] },
      { label: "Years of Experience", type: "number" },
      { label: "Why do you want to join Krown Academy?", type: "textarea" },
      { label: "Link to Resume or LinkedIn Profile", type: "url" }
    ]
  },
  Volunteer: {
    title: "Volunteer & Mentor Application",
    fields: [
      { label: "Full Name", type: "text" },
      { label: "Phone Number", type: "tel" },
      { label: "Email Address", type: "email" },
      { label: "Area of Interest", type: "select", options: ["Weekly Mentor", "Guest Speaker", "Fundraising & Events", "Athletics Support", "Other"] },
      { label: "Availability", type: "select", options: ["Weekly", "Bi-Weekly", "Monthly", "One-Time Event"] },
      { label: "Short Bio / Area of Expertise", type: "textarea" },
      { label: "I agree to submit to a background check if required for student interaction.", type: "checkbox" }
    ]
  }
};

function FormModal({ activeForm, setActiveForm }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!activeForm || !FORMS[activeForm]) return null;
  const form = FORMS[activeForm];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const dataObj = Object.fromEntries(formData.entries());
    
    const { error } = await supabase
      .from('applications')
      .insert({ form_type: form.title, data: dataObj });
      
    setIsSubmitting(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setActiveForm(null), 3000);
    } else {
      alert("Error connecting to database. Please try again.");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: COLORS.white, borderRadius: 12, width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ padding: "24px 32px", borderBottom: `1px solid ${COLORS.lightGray}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: COLORS.white, zIndex: 10 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.black, margin: 0 }}>{form.title}</h2>
          <button onClick={() => setActiveForm(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: COLORS.textMuted }}>✕</button>
        </div>
        {success ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 60, color: "#10b981", marginBottom: 16 }}>✓</div>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: COLORS.black, marginBottom: 8 }}>Application Received!</h3>
            <p style={{ color: COLORS.textMuted }}>Your data has been securely saved to the Krown Academy Database.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: "32px" }}>
            <p style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 24, lineHeight: 1.6 }}>
              Please fill out the form below. When you click submit, your responses will be securely encrypted and saved directly to the Krown Academy Database.
            </p>
            {form.fields.map((field, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                {field.type !== "checkbox" && <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: COLORS.black, marginBottom: 8 }}>{field.label}</label>}
                {field.type === "textarea" ? (
                  <textarea name={field.label} required rows={3} style={{ width: "100%", padding: "12px", borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, fontSize: 15, fontFamily: "inherit" }} />
                ) : field.type === "select" ? (
                  <select name={field.label} required style={{ width: "100%", padding: "12px", borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, fontSize: 15, fontFamily: "inherit", background: COLORS.white }}>
                    <option value="">Select one...</option>
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : field.type === "checkbox" ? (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <input type="checkbox" name={field.label} value="Yes" required style={{ width: 18, height: 18, marginTop: 4, cursor: "pointer" }} />
                    <label style={{ fontSize: 14, fontWeight: 500, color: COLORS.text, lineHeight: 1.6 }}>{field.label}</label>
                  </div>
                ) : field.type === "radio" ? (
                  <div>
                    {field.options.map(opt => (
                      <div key={opt} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                        <input type="radio" name={field.label} value={opt} required style={{ width: 18, height: 18, marginTop: 2, cursor: "pointer" }} />
                        <label style={{ fontSize: 14, fontWeight: 500, color: COLORS.text, lineHeight: 1.4 }}>{opt}</label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <input type={field.type} name={field.label} required style={{ width: "100%", padding: "12px", borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, fontSize: 15, fontFamily: "inherit" }} />
                )}
              </div>
            ))}
            <div style={{ marginTop: 32, textAlign: "right", borderTop: `1px solid ${COLORS.lightGray}`, paddingTop: 24 }}>
              <Button type="submit" variant="primary">{isSubmitting ? "Saving Securely..." : "Submit Data Securely"}</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// NAV
function Nav({ active, setActive }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = ["Home","About","Academics","Athletics","Mentoring","Enrollment","Scholarships","Parents","Careers","Contact"];
  
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{ position: "fixed", top: 0, width: "100%", background: COLORS.black, zIndex: 1000, boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
      <div className="container mx-auto px-6 h-24 flex items-center justify-between">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/Krown_Academy_New_Logo.png.png" alt="Krown Academy Crest" style={{ height: 75 }} />
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 800, color: COLORS.gold, letterSpacing: 2 }}>KROWN ACADEMY</div>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-2 lg:gap-4 items-center">
          {["Our Story", "Academics", "Curriculum", "Athletics", "Mentoring", "Enrollment", "Scholarships", "Parents", "Careers", "Contact"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '')}`} onClick={e => { e.preventDefault(); setActive(item); document.getElementById(item.toLowerCase().replace(/\s/g, ''))?.scrollIntoView({behavior:"smooth"}); }}
              style={{ color: active === item ? COLORS.gold : "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, padding: "6px 8px", borderRadius: 6, textDecoration: "none", transition: "color 0.2s", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
              {item}
            </a>
          ))}
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: COLORS.white, fontSize: 24, cursor: "pointer" }}>
          {open ? "\u2715" : "\u2630"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-24 left-0 w-full bg-black flex flex-col items-center py-6 gap-6 lg:hidden border-t border-gray-800 h-screen overflow-y-auto pb-32">
          {["Our Story", "Academics", "Curriculum", "Athletics", "Mentoring", "Enrollment", "Scholarships", "Parents", "Careers", "Contact"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '')}`} onClick={e => { e.preventDefault(); setActive(item); setOpen(false); document.getElementById(item.toLowerCase().replace(/\s/g, ''))?.scrollIntoView({behavior:"smooth"}); }}
              style={{ display: "block", color: "rgba(255,255,255,0.8)", padding: "10px 0", fontSize: 16, textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// HERO
function Hero() {
  return (
    <section id="home" style={{ background: `linear-gradient(135deg, ${COLORS.black} 0%, #1a0000 50%, ${COLORS.darkRed} 100%)`, minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 30%, rgba(196,30,30,0.15) 0%, transparent 60%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top, rgba(10,10,10,0.5), transparent)" }} />
      <div className="max-w-6xl mx-auto px-4 relative z-10 pt-32">
        <div style={{ display: "inline-block", background: "rgba(200,168,78,0.15)", border: `1px solid ${COLORS.gold}`, borderRadius: 50, padding: "6px 18px", marginBottom: 24 }}>
          <span style={{ color: COLORS.gold, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Now Enrolling Grades 6-12</span>
        </div>
        <h1 style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 900, color: COLORS.white, lineHeight: 1.05, marginBottom: 20, maxWidth: 700 }}>
          Earn Your<br /><span style={{ color: COLORS.red }}>Krown.</span>
        </h1>
        <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 560, marginBottom: 36 }}>
          Athletics. Academics. Mentoring. A private school for at-risk youth and student-athletes in Winston-Salem / Kernersville, NC.
          <strong style={{ color: COLORS.gold }}> $0 tuition for qualifying families.</strong>
        </p>
        <div className="flex flex-wrap gap-4 mb-16">
          <Button href="#enrollment">Enroll Your King or Queen</Button>
          <Button href="#about" variant="outline">Learn Our Story</Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 32 }}>
          <StatBox num="15:1" label="Student Ratio" />
          <StatBox num="$0" label="Tuition Cost" />
          {[
              { num: "3", label: "Pillars" },
              { num: "16", label: "Student Limit" },
              { num: "100%", label: "College Ready" },
            ].map(s => <StatBox key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}

// ABOUT
function About() {
  return (
    <Section id="about" bg={COLORS.offWhite}>
      <SectionTitle sub="Our Story">Bring Me Metal. I&apos;ll Make You a Hammer.</SectionTitle>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <img src="/ProfileHome.jpg" alt="Coach Kendall Nelson" style={{ float: "left", width: 180, height: 180, borderRadius: "50%", marginRight: 24, marginBottom: 12, objectFit: "cover", border: `4px solid ${COLORS.gold}`, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} />
          <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.text, marginBottom: 16 }}>
            I&apos;m Kendall Nelson. I hold degrees in Sociology and Psychology. I&apos;m a championship level wrestling coach and owner of K-Vegas Elite Wrestling Club. I was once an at-risk youth myself.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.text, marginBottom: 16 }}>
            I know what it feels like to be written off. I know what It&apos;s like to need someone, just one person who sees your potential when nobody else does. That person, for my students, is going to be me.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.text, marginBottom: 16 }}>
            Krown Academy is built on three pillars: rigorous academics, championship-level athletics, and intentional mentoring. These aren&apos;t departments, they&apos;re the DNA of everything we do.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.textMuted, fontStyle: "italic" }}>
            &quot;The pessimist complains about the wind. The optimist expects it to change. At Krown Academy, we adjust the sails.&quot;
          </p>
        </div>
        <div style={{ background: COLORS.black, borderRadius: 16, padding: 32, color: COLORS.white }}>
          <h3 style={{ color: COLORS.gold, fontSize: 14, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>Kendall</h3>
          {[
            ["Education", "B.A. Sociology, B.A. Psychology"],
            ["Athletics", "Championship Wrestling Coach"],
            ["Club", "Owner, K-Vegas Elite Wrestling Club"],
            ["Experience", "Current Math Teacher, WSFCS"],
            ["Technology", "Creator, Ticket Owl&apos;d The Door (AI Assessment)"],
            ["Mission", "Former at-risk youth serving at-risk youth"],
          ].map(([k,v]) => (
            <div key={k} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "12px 0" }}>
              <span style={{ color: COLORS.gold, fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>{k}</span>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 2 }}>{v}</div>
            </div>
          ))}
          <div style={{ marginTop: 20, padding: "16px 20px", background: "rgba(196,30,30,0.15)", borderRadius: 8, borderLeft: `3px solid ${COLORS.red}` }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
              Krown Academy operates as a program of <strong>KVegas Elite Inc</strong>, a 501(c)(3) nonprofit (EIN: 33-4622985).
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

// THREE PILLARS
function Pillars() {
  return (
    <Section id="pillars" bg={COLORS.white}>
      <SectionTitle sub="Three Pillars">One Standard of Excellence</SectionTitle>
      <div className="grid md:grid-cols-3 gap-6">
        <Card icon="📚" accent={COLORS.red} title="The Academic Pillar"
          desc="College-preparatory digital curriculum through Acellus, supplemented by AI-powered Ticket Owl&apos;d The Door assessments and teacher-led direct instruction. Every student gets a 1:1 Chromebook. Self-paced. Individualized. No child falls through the cracks." />
        <Card icon="🤼" accent={COLORS.gold} title="The Athletic Pillar"
          desc="Championship wrestling as our cornerstone. Structured PE for non-wrestlers. USA Wrestling nationals. Prep Nationals in Pennsylvania every year. The mat teaches what the classroom alone cannot: resilience, accountability, and performance under pressure." />
        <Card icon="🤝" accent={COLORS.darkRed} title="The Mentoring Pillar"
          desc="Every student has a mentor. Every day begins with Morning Mindset. Weekly 1-on-1 meetings. Sports psychology. Journaling. Built from Kendall's Sociology and Psychology training and personal experience as an at-risk youth." />
      </div>
    </Section>
  );
}

// ACADEMICS
function Academics() {
  return (
    <Section id="academics" bg={COLORS.offWhite}>
      <SectionTitle sub="Academics">Three Layers of Learning</SectionTitle>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { n: "01", t: "Acellus Digital Curriculum", d: "Self-paced, video-based instruction in every core subject. Students work at their own level — a 7th grader in pre-algebra and a 10th grader in Algebra 2 sit side by side, each learning at their own pace. Accredited and aligned with national standards." },
          { n: "02", t: "Ticket Owl&apos;d The Door", d: "Kendall's AI-powered exit ticket platform. Every day, every student completes an assessment that measures what they actually learned. Real-time data. No student can fake progress." },
          { n: "03", t: "Teacher-Led Instruction", d: "Kendall isn&apos;t a passive monitor. Mini-lessons, small groups, 1-on-1 tutoring, Socratic discussions, and hands-on projects. The human element that makes the digital curriculum work." },
        ].map(({ n, t, d }) => (
          <div key={n} style={{ background: COLORS.white, borderRadius: 12, padding: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
            <div style={{ color: COLORS.red, fontSize: 36, fontWeight: 900, opacity: 0.2, marginBottom: 8 }}>{n}</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: COLORS.black }}>{t}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.textMuted }}>{d}</p>
          </div>
        ))}
      </div>
      <div style={{ background: COLORS.black, borderRadius: 16, padding: 32, color: COLORS.white }}>
        <h3 style={{ color: COLORS.gold, fontSize: 14, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>Daily Schedule</h3>
        {[
          ["8:00 – 8:25", "Morning Mindset / Mentoring", "Team huddle, goal-setting, daily affirmation"],
          ["8:25 – 9:55", "Academic Block 1: Math", "Acellus + teacher instruction + TOTD exit ticket"],
          ["9:55 – 10:10", "Break", "Snack and movement"],
          ["10:10 – 11:40", "Academic Block 2: ELA", "Acellus + teacher instruction + TOTD exit ticket"],
          ["11:40 – 12:15", "Lunch", "Community time"],
          ["12:15 – 1:30", "Wrestling / PE", "Training or structured fitness"],
          ["1:30 – 1:50", "Sports Psychology", "Journaling, visualization, debrief"],
          ["1:50 – 2:50", "Academic Block 3: Science/History", "Acellus + projects + TOTD exit ticket"],
          ["2:50 – 3:00", "Dismissal", "Daily reflection and goals for tomorrow"],
        ].map(([time, block, detail], i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 14 }}>
            <span style={{ color: COLORS.gold, fontWeight: 600 }}>{time}</span>
            <span style={{ color: COLORS.white }}>{block}</span>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>{detail}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

// CURRICULUM
function Curriculum() {
  const [studentId, setStudentId] = useState("");
  const [pin, setPin] = useState("");
  const [loggedInStudent, setLoggedInStudent] = useState(null);
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");

    const { data, error: sbError } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId.toUpperCase())
      .eq('pin', pin)
      .single();

    setIsLoggingIn(false);

    if (data && !sbError) {
      setLoggedInStudent({
        name: data.name,
        grade: data.grade,
        creditsEarned: data.credits_earned,
        creditsNeeded: data.credits_needed,
        taken: data.taken || [],
        needed: data.needed || []
      });
    } else {
      setError("Invalid Student ID or PIN. Please try again.");
    }
  };

  return (
    <Section id="curriculum" bg={COLORS.offWhite}>
      <SectionTitle sub="Curriculum">Path to the Krown</SectionTitle>
      
      {/* College Readiness Guarantee */}
      <div style={{ marginBottom: 60 }}>
        <h3 style={{ fontSize: 28, fontWeight: 800, color: COLORS.black, textAlign: "center", marginBottom: 32 }}>100% College Readiness Guarantee</h3>
        <p style={{ fontSize: 16, color: COLORS.text, textAlign: "center", maxWidth: 800, margin: "0 auto 32px", lineHeight: 1.8 }}>
          We guarantee 9th-12th grade parents that Krown Academy meets and exceeds every high school graduation and university admission requirement. Your child will not miss a single credit necessary to step onto any college campus in the country.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { cat: "English", req: "4 Credits Required", desc: "English I, II, III, IV or AP English" },
            { cat: "Mathematics", req: "4 Credits Required", desc: "Algebra I, Geometry, Algebra II, 4th Math" },
            { cat: "Science", req: "3 Credits Required", desc: "Earth/Environmental, Biology, Physical Science" },
            { cat: "Social Studies", req: "4 Credits Required", desc: "World History, Civics, US History, Economics" },
            { cat: "Health & PE", req: "1 Credit Required", desc: "Health & Physical Education" },
            { cat: "Foreign Language", req: "2 Credits Required", desc: "Spanish, French, or other (for UNC System)" },
          ].map((item, i) => (
            <div key={i} style={{ padding: 20, background: COLORS.white, borderRadius: 12, borderLeft: `4px solid ${COLORS.gold}`, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ color: "#10b981", fontSize: 20 }}>✓</span>
                <h4 style={{ fontWeight: 800, fontSize: 18, color: COLORS.black }}>{item.cat}</h4>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.red, marginBottom: 4 }}>{item.req}</div>
              <div style={{ fontSize: 14, color: COLORS.textMuted }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Catalogs */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: COLORS.black, marginBottom: 16 }}>Acellus Digital Catalog</h3>
          <p style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.8, marginBottom: 16 }}>
            Through our partnership with Acellus Academy, our students have on-demand access to a massive catalog of core and elective courses, including:
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {["Full Core Curriculum (Honors & AP available)", "Advanced Placement (AP) Biology, Calculus, US History", "Career & Technical Education (CTE) Pathways", "Foreign Languages (Spanish, French, German)", "Coding, Computer Science, and IT Basics", "Fine Arts and Music Appreciation"].map(course => (
              <li key={course} style={{ fontSize: 15, color: COLORS.text, marginBottom: 12, display: "flex", gap: 12 }}>
                <span style={{ color: COLORS.red, fontWeight: 800 }}>•</span> {course}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: COLORS.black, marginBottom: 16 }}>Signature Offline Seminars</h3>
          <p style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.8, marginBottom: 24 }}>
            Beyond the digital core, Krown Academy students participate in exclusive, in-person offline seminars designed to forge character, articulation, and financial dominance.
          </p>
          
          <div style={{ background: COLORS.black, color: COLORS.white, padding: 24, borderRadius: 12, marginBottom: 16 }}>
            <h4 style={{ color: COLORS.gold, fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Expressive Writing & Poetry</h4>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
              A masterclass in voice, reflection, and emotional intelligence. Students learn to articulate their pain, their ambition, and their story through powerful written and spoken word.
            </p>
          </div>

          <div style={{ background: COLORS.black, color: COLORS.white, padding: 24, borderRadius: 12 }}>
            <h4 style={{ color: COLORS.gold, fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Krown Credit Union (Financial Lit.)</h4>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
              Not just a class—a real-world financial simulator. Every junior and senior receives a real $100 deposit to manage, grow, and pitch as startup capital for a student-run business. If their business fails, our "Safety Net" restores their balance so they can fail safely and try again.
            </p>
          </div>
        </div>
      </div>

      {/* Student Database Lookup */}
      <div style={{ background: COLORS.white, padding: 40, borderRadius: 16, border: `1px solid ${COLORS.lightGray}`, boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
        <h3 style={{ fontSize: 24, fontWeight: 800, color: COLORS.black, textAlign: "center", marginBottom: 12 }}>Student Degree Audit Portal</h3>
        <p style={{ fontSize: 15, color: COLORS.textMuted, textAlign: "center", maxWidth: 600, margin: "0 auto 32px" }}>
          Parents and students can securely lookup their personal progress toward graduation. See exactly what credits you have earned and what classes you need next to be college-ready.
        </p>
        
        {!loggedInStudent ? (
          <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: "0 auto", background: COLORS.offWhite, padding: 32, borderRadius: 12 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: COLORS.black, marginBottom: 8 }}>Student ID</label>
              <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} required placeholder="e.g. KNDL01" style={{ width: "100%", padding: "12px", borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, fontSize: 15 }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: COLORS.black, marginBottom: 8 }}>Secure PIN</label>
              <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} required placeholder="****" style={{ width: "100%", padding: "12px", borderRadius: 8, border: `1px solid ${COLORS.lightGray}`, fontSize: 15 }} />
            </div>
            {error && <div style={{ color: COLORS.red, fontSize: 14, marginBottom: 16, fontWeight: 500, textAlign: "center" }}>{error}</div>}
            <div style={{ textAlign: "center" }}>
              <Button type="submit" variant="dark" style={{ width: "100%" }}>{isLoggingIn ? "Searching Database..." : "Access Secure Records"}</Button>
            </div>
            <p style={{ fontSize: 12, color: COLORS.textMuted, textAlign: "center", marginTop: 16 }}>
              Try ID: <strong>KNDL01</strong> and PIN: <strong>2024</strong>
            </p>
          </form>
        ) : (
          <div style={{ background: COLORS.offWhite, borderRadius: 12, padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `1px solid ${COLORS.lightGray}`, paddingBottom: 24, marginBottom: 24 }}>
              <div>
                <h4 style={{ fontSize: 24, fontWeight: 800, color: COLORS.black }}>{loggedInStudent.name}</h4>
                <div style={{ fontSize: 15, color: COLORS.textMuted, marginTop: 4 }}>ID: {studentId.toUpperCase()} • {loggedInStudent.grade}</div>
              </div>
              <button onClick={() => { setLoggedInStudent(null); setStudentId(""); setPin(""); }} style={{ background: "none", border: "none", color: COLORS.red, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Log Out</button>
            </div>
            
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Graduation Progress</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: COLORS.gold }}>{loggedInStudent.creditsEarned} / {loggedInStudent.creditsNeeded} Credits</span>
              </div>
              <div style={{ height: 12, background: COLORS.white, borderRadius: 6, overflow: "hidden", border: `1px solid ${COLORS.lightGray}` }}>
                <div style={{ height: "100%", background: COLORS.gold, width: `${(loggedInStudent.creditsEarned / loggedInStudent.creditsNeeded) * 100}%` }}></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h5 style={{ fontSize: 16, fontWeight: 800, color: COLORS.black, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><span style={{ color: "#10b981" }}>✓</span> Credits Earned</h5>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {loggedInStudent.taken.map(course => (
                    <li key={course} style={{ fontSize: 14, color: COLORS.text, marginBottom: 8, padding: "8px 12px", background: "#f0fdf4", borderRadius: 6, borderLeft: "3px solid #10b981" }}>{course}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 style={{ fontSize: 16, fontWeight: 800, color: COLORS.black, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><span style={{ color: COLORS.red }}>⚠</span> Missing Requirements</h5>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {loggedInStudent.needed.map(course => (
                    <li key={course} style={{ fontSize: 14, color: COLORS.text, marginBottom: 8, padding: "8px 12px", background: "#fef2f2", borderRadius: 6, borderLeft: `3px solid ${COLORS.red}` }}>{course}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

// ATHLETICS
function Athletics() {
  return (
    <Section id="athletics" bg={COLORS.white}>
      <SectionTitle sub="Athletics">Where Champions Are Made</SectionTitle>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, color: COLORS.black }}>Wrestling Program</h3>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: COLORS.text, marginBottom: 16 }}>
            Wrestling is our cornerstone sport. Coached by championship-level Kendall, our wrestlers compete at the highest levels from Day 1. The mat teaches discipline, accountability, mental toughness, and the ability to perform under pressure.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: COLORS.text }}>
            Students who prefer not to wrestle participate in <strong>structured PE and functional fitness</strong> — bodyweight training, conditioning, agility, and sport fundamentals. Krown Academy will not stop with just wrestling, Basketball, Track, and Football are on the horizon.
          </p>
        </div>
        <div style={{ background: COLORS.offWhite, borderRadius: 12, padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: COLORS.black }}>Competitive Calendar</h3>
          {[
            ["Oct–Nov", "Local & regional tournaments"],
            ["Dec–Jan", "NC Folkstyle events & dual meets"],
            ["February", "USA Wrestling NC State Championships"],
            ["March–Apr", "Prep Nationals — Pennsylvania (Annual Trip)"],
            ["Summer", "USA Wrestling national events (optional)"],
          ].map(([when, what], i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <span style={{ color: COLORS.red, fontWeight: 700, fontSize: 13, minWidth: 90 }}>{when}</span>
              <span style={{ fontSize: 14, color: COLORS.text }}>{what}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.black}, #1a0505)`, borderRadius: 16, padding: 32, color: COLORS.white, textAlign: "center" }}>
        <h3 style={{ color: COLORS.gold, fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Prep Nationals — Pennsylvania</h3>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, maxWidth: 500, margin: "0 auto 20px" }}>
          Every year, Krown Academy travels to Pennsylvania for Prep Nationals. This is a premier national preparatory school wrestling event. It&apos;s built into our budget and our identity.
        </p>
        <Button href={LINKS.prepNationals} variant="gold">Prep Nationals</Button>
      </div>
    </Section>
  );
}

// MENTORING
function Mentoring() {
  return (
    <Section id="mentoring" bg={COLORS.offWhite}>
      <SectionTitle sub="Mentoring">This Is Why We Exist</SectionTitle>
      <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.text, marginBottom: 24, maxWidth: 700 }}>
        Mentoring is not an add-on at Krown Academy. It&apos;s woven into every day. Designed by Kendall from his degrees in Sociology and Psychology and his own experience as an at-risk youth.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { t: "Morning Mindset", time: "8:00–8:25 Daily", d: "Affirmations, gratitude shares, goal-setting, motivational content. Every day starts with purpose." },
          { t: "1-on-1 Meetings", time: "Weekly, 20 min", d: "Every student meets with Kendall individually. Academic review, personal check-in, goal-setting, specific recognition." },
          { t: "Sports Psychology", time: "1:30–1:50 Daily", d: "Journaling with structured prompts. Visualization. Breathing exercises. Processing the day's challenges." },
          { t: "Group Sessions", time: "Monthly", d: "Identity, anger management, gratitude, financial literacy, conflict resolution, college readiness, leadership, service." },
        ].map(({ t, time, d }) => (
          <div key={t} style={{ background: COLORS.white, borderRadius: 12, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: COLORS.black, marginBottom: 4 }}>{t}</h4>
            <div style={{ fontSize: 12, color: COLORS.red, fontWeight: 600, marginBottom: 10 }}>{time}</div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textMuted }}>{d}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, background: COLORS.white, borderRadius: 12, padding: 28, borderLeft: `4px solid ${COLORS.gold}`, boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: COLORS.text }}>
          <strong>Research shows</strong> that a single caring adult relationship is the strongest protective factor for at-risk youth. At Krown Academy, every King and Queen has that relationship — guaranteed. With only 15 students and a founder who was once in their shoes, no child is invisible.
        </p>
      </div>
    </Section>
  );
}

// ENROLLMENT
function Enrollment({ setActiveForm }) {
  return (
    <Section id="enrollment" bg={COLORS.white}>
      <SectionTitle sub="Enrollment">Join the Kingdom</SectionTitle>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>How to Enroll</h3>
          {[
            { n: "1", t: "Contact Kendall", d: "Call or text 336-500-4765 or email krownacademynelson@gmail.com. I&apos;ll answer every question personally." },
            { n: "2", t: "Complete the Online Enrollment Form", d: "Fill out the enrollment application below. I&apos;ll walk you through every step." },
            { n: "3", t: "Apply for Opportunity Scholarship", d: "I help every family apply. Most families pay $0 tuition. Link below." },
            { n: "4", t: "Submit Required Documents", d: "Student info form, medical clearance, immunization records, device agreement. All available as online forms." },
            { n: "5", t: "Welcome to Krown Academy", d: "Attend parent orientation, receive your Chromebook, and begin Day 1." },
          ].map(({ n, t, d }) => (
            <div key={n} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.red, color: COLORS.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{n}</div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{t}</h4>
                <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ background: COLORS.offWhite, borderRadius: 12, padding: 28, marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Online Forms</h3>
            <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16 }}>Complete these forms online. Kendall reviews every submission personally.</p>
            {[
              ["Enrollment Application", "Start your application to Krown Academy", "Enrollment"],
              ["Student Information Form", "Demographics, medical, emergency contacts", "Information"],
              ["Athletic Participation Form", "Sports interest, medical clearance, sport selection", "Athletic"],
              ["Medical / Immunization Records", "Upload or complete health records", "Medical"],
              ["1:1 Device Agreement", "Chromebook program acknowledgment", "Device"],
              ["Photo / Media Release", "Permission for school marketing", "Media"],
            ].map(([name, desc, formKey], i) => (
              <button key={i} onClick={() => setActiveForm(formKey)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", textAlign: "left", padding: "14px 16px", background: COLORS.white, borderRadius: 8, marginBottom: 8, border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.red}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.black }}>{name}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{desc}</div>
                </div>
                <span style={{ color: COLORS.red, fontSize: 18 }}>→</span>
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: COLORS.textMuted, textAlign: "center" }}>
            Need help? Call Kendall directly: <strong>336-500-4765</strong>
          </p>
        </div>
      </div>
    </Section>
  );
}

// SCHOLARSHIPS
function Scholarships() {
  return (
    <Section id="scholarships" bg={COLORS.black}>
      <SectionTitle sub="Scholarships" light>Your Child Can Attend for $0</SectionTitle>
      <div className="grid md:grid-cols-2 gap-8">
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 32, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ color: COLORS.gold, fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Opportunity Scholarship</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: COLORS.white, marginBottom: 8 }}>Up to $7,942<span style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>/year</span></div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            State-funded. Pays tuition directly to Krown Academy. Available to ALL NC K-12 families regardless of income. Lower-income families receive larger awards — most of our families qualify for 100% coverage.
          </p>
          <p style={{ color: COLORS.gold, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            I personally walk every family through the application.
          </p>
          <Button href={LINKS.osApply} variant="gold">Apply for Opportunity Scholarship</Button>
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 32, border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ color: COLORS.gold, fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>ESA+ (Students with Disabilities)</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: COLORS.white, marginBottom: 8 }}>Up to $17,000<span style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>/year</span></div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Additional funding ON TOP of the Opportunity Scholarship. For students with documented disabilities. Funds go to a ClassWallet account for tutoring, therapy, S&C, technology, and more.
          </p>
          <p style={{ color: COLORS.gold, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            A qualifying student could receive up to $24,942/year total.
          </p>
          <Button href={LINKS.esa} variant="outline">Learn About ESA+</Button>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
          Questions? Call Kendall: <strong style={{ color: COLORS.gold }}>336-500-4765</strong> | NCSEAA Helpline: <strong style={{ color: COLORS.gold }}>855-330-3955</strong>
        </p>
      </div>
    </Section>
  );
}

// PARENTS
function Parents() {
  return (
    <Section id="parents" bg={COLORS.offWhite}>
      <SectionTitle sub="For Parents">Your One-Stop Shop</SectionTitle>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { t: "Parent Portal (Gradelink)", d: "View grades, attendance, handle billing, pay fines/fees, and purchase school merchandise.", link: "https://secure.gradelink.com/lkg/Gradelink.xml?contenttype=text%2Fhtml&Language=English&v=1.0" },
          { t: "School Handbook", d: "Complete guide to Krown Academy policies, schedules, grading, discipline, and expectations.", link: "/14_School_Handbook.pdf" },
          { t: "Frequently Asked Questions", d: "Answers to the 11 most common questions from parents about Krown Academy.", link: "/15_Parent_FAQ.pdf" },
        ].map(({ t, d, link }) => (
          <a key={t} href={link} target="_blank" rel="noopener noreferrer" style={{ background: COLORS.white, borderRadius: 12, padding: 24, textDecoration: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", display: "block", transition: "transform 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.black, marginBottom: 8 }}>{t}</h3>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textMuted }}>{d}</p>
            <span style={{ color: COLORS.red, fontSize: 14, fontWeight: 600, marginTop: 12, display: "inline-block" }}>Access →</span>
          </a>
        ))}
      </div>
      <div style={{ background: COLORS.white, borderRadius: 12, padding: 28 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Quick FAQ</h3>
        {[
          ["How much does it cost?", "$7,468/year — fully covered by Opportunity Scholarship for qualifying families. Most families pay $0."],
          ["Does my child get a computer?", "Yes. Every student receives a school-issued Chromebook for use in school and at home."],
          ["Does my child have to wrestle?", "No. Wrestling is our cornerstone sport, but students who prefer not to wrestle participate in structured PE."],
          ["What about mentoring?", "Every student participates daily. Morning mindset, weekly 1-on-1 meetings, sports psychology, group sessions."],
          ["What if my child has a disability?", "They may qualify for ESA+ ($9,000–$17,000/year) on top of the Opportunity Scholarship. I&apos;ll help you navigate it."],
        ].map(([q, a], i) => (
          <details key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "14px 0", cursor: "pointer" }}>
            <summary style={{ fontWeight: 600, fontSize: 15, color: COLORS.black, listStyle: "none", display: "flex", justifyContent: "space-between" }}>
              {q} <span style={{ color: COLORS.red }}>+</span>
            </summary>
            <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 8, paddingLeft: 0 }}>{a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

// CAREERS
function Careers({ setActiveForm }) {
  return (
    <Section id="careers" bg={COLORS.offWhite}>
      <SectionTitle sub="Join the Team">Careers & Volunteering</SectionTitle>
      <div className="max-w-4xl mx-auto">
        <div style={{ background: COLORS.white, borderRadius: 16, padding: 40, boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
          <p style={{ fontSize: 16, color: COLORS.text, lineHeight: 1.8, marginBottom: 24 }}>
            Krown Academy is built by people who refuse to give up on kids. We are looking for relentless educators, coaches, and mentors who understand that true teaching is about relationships.
          </p>
          <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Current & Future Openings:</h4>
          {[
            ["Teacher / Assistant Coach", "Core academics (Acellus-guided) + coaching duties + mentoring. $40K + incentives."],
            ["Sports Trainer", "Strength & conditioning, injury prevention, PE. $35K."],
            ["Volunteer Mentor", "Weekly commitment. Background check required. Training provided."],
            ["Guest Speaker", "Share your career, story, or expertise with our Kings & Queens."],
          ].map(([title, desc], i) => (
            <div key={i} style={{ borderBottom: `1px solid ${COLORS.lightGray}`, padding: "16px 0" }}>
              <div style={{ fontWeight: 700, color: COLORS.black, fontSize: 16 }}>{title}</div>
              <div style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 4 }}>{desc}</div>
            </div>
          ))}
          <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Button onClick={() => setActiveForm("Employee")} variant="dark">Employment Application</Button>
            <Button onClick={() => setActiveForm("Volunteer")} variant="outline" style={{ color: COLORS.black, borderColor: COLORS.black }}>Volunteer & Mentor App</Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

// CONTACT
function Contact() {
  return (
    <Section id="contact" bg={COLORS.black}>
      <SectionTitle sub="Get in Touch" light>Contact Kendall</SectionTitle>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.8, marginBottom: 28 }}>
            I answer every call, every text, every email personally. If you're thinking about Krown Academy for your child, reach out. I&apos;ll walk you through everything.
          </p>
          {[
            ["Phone / Text", "336-500-4765"],
            ["Email", "krownacademynelson@gmail.com"],
            ["Location", "Winston-Salem / Kernersville, NC"],
            ["Hours", "Available 7 AM – 9 PM, 7 days a week"],
          ].map(([label, val]) => (
            <div key={label} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 0" }}>
              <div style={{ color: COLORS.gold, fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
              <div style={{ color: COLORS.white, fontSize: 16, marginTop: 2 }}>{val}</div>
            </div>
          ))}
          <div style={{ marginTop: 24 }}>
            <Button href="tel:3365004765" variant="gold">Call Now</Button>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,0.1)" }}>
          <h3 style={{ color: COLORS.white, fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Send a Message</h3>
          {["Your Name", "Email", "Phone", "I&apos;m interested in..."].map((label, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 4, fontWeight: 600 }}>{label}</label>
              {i === 3 ? (
                <select style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: COLORS.white, fontSize: 14 }}>
                  <option value="">Select one...</option>
                  <option>Enrolling my child</option>
                  <option>Scholarship information</option>
                  <option>Employment opportunities</option>
                  <option>Volunteering</option>
                  <option>Partnership / sponsorship</option>
                  <option>Other</option>
                </select>
              ) : (
                <input type={i === 1 ? "email" : i === 2 ? "tel" : "text"} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: COLORS.white, fontSize: 14, boxSizing: "border-box" }} />
              )}
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 4, fontWeight: 600 }}>Message</label>
            <textarea rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: COLORS.white, fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
          </div>
          <Button>Send Message</Button>
        </div>
      </div>
    </Section>
  );
}

// FOOTER
function Footer() {
  return (
    <footer style={{ background: COLORS.black, borderTop: `3px solid ${COLORS.red}`, padding: "40px 16px 24px" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <img src="/Krown_Academy_New_Logo.png.png" alt="Krown Academy Logo" style={{ height: 75, width: "auto" }} />
              <span style={{ color: COLORS.white, fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 20, letterSpacing: 2 }}>KROWN ACADEMY</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, lineHeight: 1.7 }}>
              A program of KVegas Elite Inc (501(c)(3))<br />
              Managed by KD THRILL LLC<br />
              Winston-Salem / Kernersville, NC
            </p>
          </div>
          <div>
            <h4 style={{ color: COLORS.gold, fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>Quick Links</h4>
            {["Enrollment", "Scholarships", "Academics", "Athletics", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 13, padding: "4px 0", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          <div>
            <h4 style={{ color: COLORS.gold, fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>Scholarship Resources</h4>
            <a href={LINKS.os} style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 13, padding: "4px 0", textDecoration: "none" }}>NC Opportunity Scholarship</a>
            <a href={LINKS.esa} style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 13, padding: "4px 0", textDecoration: "none" }}>ESA+ Program</a>
            <a href={LINKS.osApply} style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 13, padding: "4px 0", textDecoration: "none" }}>How to Apply</a>
            <a href={LINKS.dnpe} style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 13, padding: "4px 0", textDecoration: "none" }}>NC DNPE</a>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
            &copy; {new Date().getFullYear()} Krown Academy. A program of KVegas Elite Inc. All rights reserved.
          </p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
            Krown Academy does not discriminate on the basis of race, color, national origin, sex, disability, or religion.
          </p>
        </div>
      </div>
    </footer>
  );
}

// MAIN APP
export default function KrownAcademy() {
  const [active, setActive] = useState("Home");
  const [activeForm, setActiveForm] = useState(null);
  
  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: COLORS.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&display=swap" rel="stylesheet" />
      <Nav active={active} setActive={setActive} />
      <Hero />
      <About />
      <Pillars />
      <Academics />
      <Curriculum />
      <Athletics />
      <Mentoring />
      <Enrollment setActiveForm={setActiveForm} />
      <Scholarships />
      <Parents />
      <Careers setActiveForm={setActiveForm} />
      <Contact />
      <Footer />
      <FormModal activeForm={activeForm} setActiveForm={setActiveForm} />
    </div>
  );
}




