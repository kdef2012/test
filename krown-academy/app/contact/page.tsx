export default function ContactPage() {
  return (
    <>
      <section className="bg-krown-black text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-krown-red tracking-wider mb-4">
            CONTACT COACH NELSON
          </h1>
          <p className="text-white/70 text-lg">
            I respond to every call, text, and email personally.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-8 mb-16">
            <a
              href="tel:3365004765"
              className="block bg-krown-light p-8 text-center hover:border-krown-red border-2 border-transparent transition-colors group"
            >
              <div className="text-4xl mb-3">📞</div>
              <h3 className="font-display text-lg font-semibold tracking-wider uppercase mb-2 group-hover:text-krown-red transition-colors">
                Call or Text
              </h3>
              <p className="font-display text-2xl font-bold text-krown-red">
                336-500-4765
              </p>
            </a>
            <a
              href="mailto:krownacademynelson@gmail.com?subject=Inquiry - Krown Academy"
              className="block bg-krown-light p-8 text-center hover:border-krown-red border-2 border-transparent transition-colors group"
            >
              <div className="text-4xl mb-3">✉️</div>
              <h3 className="font-display text-lg font-semibold tracking-wider uppercase mb-2 group-hover:text-krown-red transition-colors">
                Email
              </h3>
              <p className="text-krown-red font-semibold text-[15px] break-all">
                krownacademynelson@gmail.com
              </p>
            </a>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 mb-16">
            <div className="bg-krown-light p-8 text-center">
              <div className="text-4xl mb-3">📍</div>
              <h3 className="font-display text-lg font-semibold tracking-wider uppercase mb-2">
                Location
              </h3>
              <p className="text-krown-gray">
                Winston-Salem / Kernersville, NC
                <br />
                <span className="text-sm">(Facility location coming soon)</span>
              </p>
            </div>
            <div className="bg-krown-light p-8 text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="font-display text-lg font-semibold tracking-wider uppercase mb-2">
                Grades
              </h3>
              <p className="text-krown-gray">
                6th – 12th Grade
                <br />
                <span className="text-sm">Now Enrolling Kings &amp; Queens</span>
              </p>
            </div>
          </div>

          <div className="bg-krown-black text-white p-10">
            <h3 className="font-display text-xl font-bold tracking-wider text-krown-red mb-4">
              WHAT TO EXPECT WHEN YOU REACH OUT
            </h3>
            <div className="space-y-4 text-[15px] text-white/70 leading-relaxed">
              <p>
                When you call, text, or email me, here&apos;s what happens: I answer. 
                Not a secretary, not a voicemail tree — me, Kendall Nelson. I&apos;ll 
                ask about your child, listen to what you need, and tell you honestly 
                whether Krown Academy is the right fit.
              </p>
              <p>
                If it is, I&apos;ll walk you through everything: enrollment paperwork,
                scholarship applications (most families pay $0), athletic
                clearance, and what to expect on Day 1. I make it easy for my
                families.
              </p>
              <p className="text-white font-semibold">
                Bring me your King or Queen. Bring me metal. I&apos;ll make them a
                hammer.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
