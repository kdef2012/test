import Link from "next/link";

export default function EnrollmentPage() {
  return (
    <>
      <section className="bg-krown-black text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-krown-red tracking-wider mb-4">
            ENROLL YOUR KING OR QUEEN
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Grades 6–12 · Winston-Salem / Kernersville, NC · I make enrollment
            easy for every family.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold tracking-wider text-krown-red mb-8">
            MY ENROLLMENT PROCESS
          </h2>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "CONTACT ME",
                desc: "Call, text, or email me. I'll answer your questions and tell you about Krown Academy. No pressure — just a conversation about your child.",
              },
              {
                step: "02",
                title: "VISIT & MEET",
                desc: "Come see the school. Meet me. Let your child see the classroom and the wrestling room. I want your King or Queen to feel it.",
              },
              {
                step: "03",
                title: "APPLY FOR SCHOLARSHIPS",
                desc: "I personally walk every family through the NC Opportunity Scholarship and ESA+ applications. Most families qualify for 100% tuition coverage — you pay $0.",
              },
              {
                step: "04",
                title: "COMPLETE ENROLLMENT PAPERWORK",
                desc: "I'll give you everything you need: enrollment agreement, student info form, medical clearance (for athletes), immunization records. I make it simple.",
              },
              {
                step: "05",
                title: "WELCOME TO THE KINGDOM",
                desc: "Your King or Queen is officially enrolled. We'll set up orientation, get them their Krown Academy gear, and get ready for Day 1.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="shrink-0 w-14 h-14 bg-krown-red flex items-center justify-center">
                  <span className="font-display text-xl font-bold text-white">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-wider mb-1">
                    {item.title}
                  </h3>
                  <p className="text-krown-gray text-[15px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 bg-krown-black text-white p-10 text-center">
            <h3 className="font-display text-2xl font-bold tracking-wider mb-4">
              READY TO START?
            </h3>
            <p className="text-white/70 mb-8">
              Reach out today. I respond to every call, text, and email personally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:3365004765"
                className="bg-krown-red hover:bg-krown-dark-red text-white font-display text-sm font-semibold tracking-widest uppercase px-8 py-4 transition-colors"
              >
                CALL 336-500-4765
              </a>
              <a
                href="mailto:krownacademynelson@gmail.com?subject=Enrollment Inquiry - Krown Academy"
                className="border-2 border-white hover:bg-white hover:text-krown-black text-white font-display text-sm font-semibold tracking-widest uppercase px-8 py-4 transition-colors"
              >
                EMAIL ME
              </a>
            </div>
          </div>

          {/* Scholarship reminder */}
          <div className="mt-12 bg-krown-light p-8 border-l-4 border-krown-red">
            <h3 className="font-display text-lg font-semibold tracking-wider mb-2">
              MOST FAMILIES PAY $0
            </h3>
            <p className="text-krown-gray text-[15px] leading-relaxed">
              Krown Academy tuition is $7,468/year — fully covered by the NC
              Opportunity Scholarship for qualifying families. I walk every
              family through the application process personally.{" "}
              <Link href="/scholarships" className="text-krown-red font-semibold hover:underline">
                Learn more about free tuition →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
