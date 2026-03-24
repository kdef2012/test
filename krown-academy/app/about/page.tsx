export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-krown-black text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-krown-red tracking-wider mb-4">
            MEET COACH NELSON
          </h1>
          <p className="text-white/60 italic text-lg">
            &ldquo;Bring Me Metal, I&apos;ll Make You a Hammer.&rdquo;
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6 text-[17px] leading-relaxed text-krown-gray">
            <p>
              I&apos;m Kendall Nelson — experienced educator, championship wrestling
              coach, and co-owner of K-Vegas Elite Wrestling Club in Kernersville,
              NC. I&apos;m the founder and director of Krown Academy.
            </p>
            <p>
              I&apos;ve spent my career working with two kinds of young people: students
              who need someone to push them academically, and athletes who need
              structure, discipline, and someone who genuinely believes in them.
              Most of the time, they&apos;re the same kid.
            </p>
            <p>
              I&apos;ve watched at-risk students fall through the cracks of traditional
              schools — kids with talent, heart, and potential — because nobody
              built something designed specifically for them. Krown Academy is what
              I built.
            </p>
            <p className="text-krown-black font-semibold text-xl">
              My philosophy is simple: the pessimist complains about the wind, the
              optimist expects it to change, and the realist adjusts the sails. I&apos;m
              a realist. I&apos;m not waiting for the system to fix itself. I&apos;m building
              my own.
            </p>
            <p>
              At Krown Academy, every student is a King or Queen. They earn that
              title every day — through discipline on the wrestling mat, through
              rigor in the classroom, and through showing up when it&apos;s hard.
            </p>
            <p>
              My promise to every family: bring me your child — bring me metal —
              and I will make them a hammer.
            </p>
          </div>

          <div className="mt-16 border-l-4 border-krown-red pl-8">
            <h2 className="font-display text-2xl font-bold tracking-wider mb-6">MY BACKGROUND</h2>
            <ul className="space-y-4 text-[15px] text-krown-gray">
              <li className="flex gap-3">
                <span className="text-krown-red font-bold shrink-0">▸</span>
                <span>Experienced math teacher — NC standards, middle and high school</span>
              </li>
              <li className="flex gap-3">
                <span className="text-krown-red font-bold shrink-0">▸</span>
                <span>Championship wrestling coach with years of developing student-athletes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-krown-red font-bold shrink-0">▸</span>
                <span>Co-owner, K-Vegas Elite Wrestling Club — Kernersville, NC</span>
              </li>
              <li className="flex gap-3">
                <span className="text-krown-red font-bold shrink-0">▸</span>
                <span>Founder of KVegas Elite Inc, a 501(c)(3) nonprofit serving youth athletes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-krown-red font-bold shrink-0">▸</span>
                <span>Developer of AI-powered educational technology (Ticket Owl&apos;d The Door)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-krown-red font-bold shrink-0">▸</span>
                <span>Lifelong advocate for at-risk youth and student-athlete development</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
