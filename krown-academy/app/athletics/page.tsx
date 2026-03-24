export default function AthleticsPage() {
  return (
    <>
      <section className="bg-krown-black text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-krown-red tracking-wider mb-4">
            THE ATHLETIC PILLAR
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Championship-level athletic development. My Kings &amp; Queens don&apos;t
            just train — they compete at the highest levels.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Wrestling */}
          <div className="mb-20">
            <h2 className="font-display text-3xl font-bold tracking-wider text-krown-red mb-6">
              WRESTLING — THE CORNERSTONE
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4 text-[15px] text-krown-gray leading-relaxed">
                <p>
                  Wrestling is the foundation of Krown Academy athletics. There is
                  no sport that builds discipline, mental toughness, and
                  accountability like wrestling. On the mat, there are no
                  teammates to hide behind. It&apos;s you, your preparation, and your
                  will.
                </p>
                <p>
                  My wrestling program is led by championship-level coaching
                  staff. I co-own K-Vegas Elite Wrestling Club in Kernersville — my
                  Kings &amp; Queens train with the same intensity and methodology
                  that has developed competitive wrestlers for years.
                </p>
                <p>
                  Students who prefer not to wrestle participate in my structured
                  PE program — functional fitness, conditioning, and athletic
                  development that builds the same character and physical
                  excellence.
                </p>
              </div>
              <div className="bg-krown-light p-8">
                <h3 className="font-display text-lg font-semibold tracking-wider uppercase mb-4">
                  Training Schedule
                </h3>
                <div className="space-y-3 text-[14px]">
                  <div className="flex justify-between border-b border-white py-2">
                    <span className="font-semibold">Daily Training</span>
                    <span className="text-krown-gray">12:15 – 1:45 PM (90 min)</span>
                  </div>
                  <div className="flex justify-between border-b border-white py-2">
                    <span className="font-semibold">Cool Down</span>
                    <span className="text-krown-gray">1:45 – 2:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-white py-2">
                    <span className="font-semibold">Competition Season</span>
                    <span className="text-krown-gray">November – February</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Off-Season</span>
                    <span className="text-krown-gray">Freestyle / Greco / S&amp;C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Competitive Pathway */}
          <div className="mb-20 border-l-4 border-krown-red pl-8">
            <h2 className="font-display text-2xl font-bold tracking-wider mb-6">
              THE COMPETITIVE PATHWAY
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-base font-semibold tracking-wider uppercase text-krown-red mb-2">
                  YEAR 1–2: OPEN COMPETITION &amp; USA WRESTLING
                </h3>
                <p className="text-krown-gray text-[15px] leading-relaxed">
                  From Day 1, my wrestlers compete in open tournaments, USA
                  Wrestling sanctioned events, and the NC Folkstyle State
                  Championships near Winston-Salem. My Kings &amp; Queens also
                  compete at USA Wrestling Preseason Nationals (Des Moines, IA),
                  Kids Folkstyle Nationals, and the 16U &amp; Junior Folkstyle
                  Nationals — national events that attract college recruiters.
                </p>
              </div>
              <div>
                <h3 className="font-display text-base font-semibold tracking-wider uppercase text-krown-red mb-2">
                  YEAR 2–3: NCISAA STATE CHAMPIONSHIPS
                </h3>
                <p className="text-krown-gray text-[15px] leading-relaxed">
                  As enrollment grows, Krown Academy joins the NCISAA (NC
                  Independent Schools Athletic Association) — the private school
                  athletic association that runs state championships in wrestling,
                  football, basketball, track &amp; field, and more. My Kings &amp;
                  Queens compete for state titles alongside programs like
                  Charlotte Latin, Charlotte Christian, and North Raleigh
                  Christian.
                </p>
              </div>
              <div>
                <h3 className="font-display text-base font-semibold tracking-wider uppercase text-krown-red mb-2">
                  THE COLLEGE PIPELINE
                </h3>
                <p className="text-krown-gray text-[15px] leading-relaxed">
                  I&apos;m not just building wrestlers — I&apos;m building a pipeline from
                  Krown Academy to collegiate wrestling programs. Competition
                  resume, coaching development, academic preparation. My Kings
                  &amp; Queens will be ready to wrestle at the next level.
                </p>
              </div>
            </div>
          </div>

          {/* Sports Lineup */}
          <div>
            <h2 className="font-display text-2xl font-bold tracking-wider mb-8">
              SPORTS LINEUP
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { sport: "Wrestling", status: "Year 1 — NOW", desc: "The foundation. Championship coaching." },
                { sport: "PE / Functional Fitness", status: "Year 1 — NOW", desc: "For non-wrestlers. Structured conditioning." },
                { sport: "Basketball", status: "Coming Year 2", desc: "High interest. Team discipline." },
                { sport: "Track & Field", status: "Coming Year 2", desc: "Individual goal-setting. Low cost." },
                { sport: "Football", status: "Coming Year 2–3", desc: "Community interest. Team physicality." },
                { sport: "More Sports", status: "Year 3+", desc: "Based on student interest and growth." },
              ].map((item) => (
                <div
                  key={item.sport}
                  className="bg-krown-light p-6 border-t-4 border-krown-red"
                >
                  <h3 className="font-display text-lg font-semibold tracking-wider mb-1">
                    {item.sport}
                  </h3>
                  <p className="text-krown-red text-xs font-display tracking-wider uppercase mb-2">
                    {item.status}
                  </p>
                  <p className="text-krown-gray text-[14px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
