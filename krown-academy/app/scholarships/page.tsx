export default function ScholarshipsPage() {
  return (
    <>
      <section className="bg-krown-black text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-krown-red tracking-wider mb-4">
            FREE TUITION
          </h1>
          <p className="font-display text-3xl font-bold mt-4 mb-2">
            $7,468/year — <span className="text-krown-red">100% covered</span>
          </p>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            I set my tuition so qualifying families pay zero. Here&apos;s how it
            works.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* OS Section */}
          <h2 className="font-display text-2xl font-bold tracking-wider text-krown-red mb-6">
            NC OPPORTUNITY SCHOLARSHIP
          </h2>
          <p className="text-krown-gray text-[15px] leading-relaxed mb-6">
            The Opportunity Scholarship is a state-funded program that pays
            private school tuition for NC students in grades K–12. There is no
            income cap — every family is eligible. Lower-income families receive
            higher awards that fully cover Krown Academy&apos;s tuition.
          </p>

          {/* Tier table */}
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="bg-krown-black text-white">
                  <th className="text-left p-3 font-display tracking-wider">Income Tier</th>
                  <th className="text-left p-3 font-display tracking-wider">Approx. Award</th>
                  <th className="text-left p-3 font-display tracking-wider">Covers Tuition?</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Tier 1–2 (Lower Income)", "$7,468+", "YES — 100% covered"],
                  ["Tier 3 (Middle Income)", "~$5,000–$6,000", "Most covered"],
                  ["Tier 4 (Higher Income)", "~$3,400–$4,000", "Partially covered"],
                ].map(([tier, amount, covers], i) => (
                  <tr key={tier} className={i % 2 === 0 ? "bg-krown-light" : ""}>
                    <td className="p-3">{tier}</td>
                    <td className="p-3 font-semibold">{amount}</td>
                    <td className="p-3">{covers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Steps */}
          <h3 className="font-display text-lg font-semibold tracking-wider mb-4">
            HOW TO APPLY (I&apos;LL WALK YOU THROUGH IT)
          </h3>
          <div className="space-y-4 mb-16">
            {[
              "Create your MyPortal account at k12.ncseaa.edu (opens December for next school year)",
              "Apply during the priority window (February – March)",
              "Submit household income documentation — this determines your award tier",
              "Receive award notification (April) and accept in MyPortal",
              "Enroll your child at Krown Academy by October 1",
              "I certify enrollment — scholarship funds are sent directly to Krown Academy. You pay $0.",
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="shrink-0 w-8 h-8 bg-krown-red text-white font-display text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-krown-gray text-[15px] leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>

          {/* ESA+ Section */}
          <h2 className="font-display text-2xl font-bold tracking-wider text-krown-red mb-6">
            NC ESA+ (STUDENTS WITH DISABILITIES)
          </h2>
          <p className="text-krown-gray text-[15px] leading-relaxed mb-4">
            If your child has a documented disability, they may qualify for
            additional funding through the NC ESA+ program — on top of the
            Opportunity Scholarship.
          </p>
          <div className="bg-krown-light p-8 mb-6">
            <div className="grid sm:grid-cols-2 gap-4 text-[15px]">
              <div>
                <span className="font-display text-sm tracking-wider uppercase text-krown-gray">
                  Base Award
                </span>
                <p className="font-display text-3xl font-bold text-krown-red">$9,000/yr</p>
              </div>
              <div>
                <span className="font-display text-sm tracking-wider uppercase text-krown-gray">
                  Designated Disabilities
                </span>
                <p className="font-display text-3xl font-bold text-krown-red">$17,000/yr</p>
              </div>
            </div>
          </div>
          <p className="text-krown-gray text-[15px] leading-relaxed mb-4">
            The ESA+ can be <strong>stacked</strong> with the Opportunity
            Scholarship. A qualifying student could receive $7,468 + $9,000–$17,000
            = up to $24,468/year in total funding.
          </p>
          <p className="text-krown-gray text-[15px] leading-relaxed mb-16">
            Your child needs an Eligibility Determination from a NC public school
            (issued within the last 3 years). I&apos;ll help you navigate the entire
            process.
          </p>

          {/* CTA */}
          <div className="bg-krown-red text-white p-10 text-center">
            <h3 className="font-display text-2xl font-bold tracking-wider mb-4">
              I HELP EVERY FAMILY APPLY
            </h3>
            <p className="text-white/90 mb-6 max-w-lg mx-auto">
              I know this process can feel overwhelming. That&apos;s why I personally
              walk every Krown Academy family through the scholarship
              application. You are not alone in this.
            </p>
            <a
              href="tel:3365004765"
              className="inline-block bg-krown-black hover:bg-krown-black/80 text-white font-display text-sm font-semibold tracking-widest uppercase px-10 py-4 transition-colors"
            >
              CALL COACH NELSON: 336-500-4765
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
