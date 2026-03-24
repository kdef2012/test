export default function AcademicsPage() {
  return (
    <>
      <section className="bg-krown-black text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-krown-red tracking-wider mb-4">
            THE ACADEMIC PILLAR
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            A college-preparatory academic environment that stands on its own
            merit. My scholars leave Krown Academy ready to compete in any
            academic arena.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-wider text-krown-red mb-6">
                WHAT I TEACH
              </h2>
              <div className="space-y-6 text-[15px] text-krown-gray leading-relaxed">
                <p>
                  My academic program is NC standards-aligned, rigorous, and
                  personalized. I don&apos;t lower the bar — I build my Kings &amp;
                  Queens up to clear it.
                </p>
                <p>
                  Core subjects include mathematics (my specialty), English
                  Language Arts, science, and social studies. I integrate
                  project-based learning that connects academics to the real world
                  — including connections to athletics like sports statistics,
                  biomechanics, and nutrition science.
                </p>
                <p>
                  Every student receives individual attention. With class sizes
                  capped at a 15:1 ratio, no King or Queen falls through the
                  cracks at Krown Academy.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold tracking-wider text-krown-red mb-6">
                HOW I TEACH
              </h2>
              <div className="space-y-4">
                {[
                  ["AI-Powered Assessment", "My Ticket Owl'd The Door platform delivers daily exit tickets and real-time performance tracking. I know exactly where every student stands."],
                  ["Small Class Sizes", "15:1 student-teacher ratio maximum. Every King and Queen gets the attention they deserve."],
                  ["NC Standards Aligned", "Curriculum built on Illustrative Mathematics, Open Up Resources, and my own NC EOG/EOC prep materials."],
                  ["Quarterly Report Cards", "Transparent grading with parent conferences at least twice per year. Weekly progress updates."],
                  ["Annual Standardized Testing", "Iowa Assessments or MAP Growth administered annually — NC law compliance and data-driven growth tracking."],
                ].map(([title, desc]) => (
                  <div key={title} className="border-l-4 border-krown-red pl-4 py-2">
                    <h3 className="font-display text-sm font-semibold tracking-wider uppercase mb-1">
                      {title}
                    </h3>
                    <p className="text-krown-gray text-[14px] leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GPA requirement callout */}
          <div className="mt-16 bg-krown-light p-8 border-l-4 border-krown-red">
            <h3 className="font-display text-xl font-bold tracking-wider mb-3">
              ACADEMICS FIRST. ALWAYS.
            </h3>
            <p className="text-krown-gray leading-relaxed">
              At Krown Academy, academic achievement is non-negotiable. My
              student-athletes must maintain a 2.0 GPA to compete in wrestling
              and athletics. Students falling below 2.0 are placed on academic
              probation — they may practice, but they don&apos;t compete until
              their grades are restored. I provide tutoring and support to make
              sure every King and Queen stays eligible.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
