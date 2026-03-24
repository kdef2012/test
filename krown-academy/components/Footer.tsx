import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-krown-black text-white">
      {/* CTA band */}
      <div className="bg-krown-red py-12 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wide mb-4">
          READY TO EARN YOUR KROWN?
        </h2>
        <p className="text-white/90 mb-6 max-w-xl mx-auto px-4">
          Call, text, or email Coach Nelson. I&apos;ll walk you through everything —
          enrollment, scholarships, athletics. Let&apos;s build your King or Queen.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <a
            href="tel:3365004765"
            className="bg-krown-black hover:bg-krown-black/80 text-white font-display text-sm font-semibold tracking-widest uppercase px-8 py-3 transition-colors"
          >
            CALL 336-500-4765
          </a>
          <a
            href="mailto:krownacademynelson@gmail.com?subject=Enrollment Inquiry"
            className="border-2 border-white hover:bg-white hover:text-krown-red text-white font-display text-sm font-semibold tracking-widest uppercase px-8 py-3 transition-colors"
          >
            EMAIL ME
          </a>
        </div>
      </div>

      {/* Footer info */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-xl font-bold text-krown-red tracking-wider mb-4">
            <img src="/logo-web.png" alt="Krown Academy" className="w-16 h-16 mb-2" />
            KROWN ACADEMY
          </h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Athletics &amp; Academics for At-Risk Youth
            <br />
            Grades 6–12 · Kings &amp; Queens
            <br />
            Winston-Salem / Kernersville, NC
          </p>
          <p className="text-white/40 text-sm mt-3 italic">
            &ldquo;Bring Me Metal, I&apos;ll Make You a Hammer.&rdquo;
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold tracking-widest uppercase text-white/50 mb-4">
            QUICK LINKS
          </h4>
          <div className="flex flex-col gap-2">
            {[
              { href: "/about", label: "About Coach Nelson" },
              { href: "/academics", label: "Academic Program" },
              { href: "/athletics", label: "Athletic Program" },
              { href: "/enrollment", label: "Enroll Your King or Queen" },
              { href: "/scholarships", label: "Free Tuition Info" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/60 hover:text-krown-red text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold tracking-widest uppercase text-white/50 mb-4">
            CONTACT
          </h4>
          <p className="text-white/60 text-sm leading-relaxed">
            Coach Kendall Nelson
            <br />
            <a href="tel:3365004765" className="hover:text-krown-red transition-colors">
              336-500-4765
            </a>
            <br />
            <a
              href="mailto:krownacademynelson@gmail.com"
              className="hover:text-krown-red transition-colors"
            >
              krownacademynelson@gmail.com
            </a>
          </p>
          <p className="text-white/40 text-xs mt-6">
            A program of KVegas Elite Inc · 501(c)(3)
            <br />
            Managed by KD THRILL LLC
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4 text-center">
        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} Krown Academy · KVegas Elite Inc · &ldquo;Earn Your Krown&rdquo;
        </p>
      </div>
    </footer>
  );
}
