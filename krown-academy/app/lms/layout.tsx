"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-krown-black text-krown-white flex font-body">
      {/* Sidebar / Armory Menu */}
      <aside className="w-64 border-r border-krown-gray/30 bg-[#0a0a0a] flex flex-col">
        <div className="p-6 border-b border-krown-gray/30">
          <Link href="/lms/dashboard">
            <h2 className="text-2xl font-bold font-display tracking-widest text-krown-red hover:text-white transition-colors cursor-pointer">
              KROWN<span className="text-krown-white">LMS</span>
            </h2>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <NavItem href="/lms/dashboard" label="The Armory" current={pathname} icon="🛡️" />
          <NavItem href="/lms/courses" label="My Courses" current={pathname} icon="📚" />
          <NavItem href="/lms/treasury" label="The Treasury" current={pathname} icon="🪙" />
          <NavItem href="/lms/roundtable" label="Roundtable Review" current={pathname} icon="🏛️" />
          <div className="mt-8 mb-2 px-4 text-xs font-bold text-krown-gray tracking-widest uppercase">Electives</div>
          <NavItem href="/lms/electives/clerical" label="Typing Simulator" current={pathname} icon="⌨️" />
        </nav>
        
        <div className="p-4 border-t border-krown-gray/30">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg text-krown-gray hover:text-krown-white hover:bg-white/5 transition-colors">
            <span>🚪</span> Exit to Admin
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top bar for telemetry indicator */}
        <header className="h-16 border-b border-krown-gray/30 bg-[#0a0a0a] flex items-center justify-end px-8 shrink-0">
            <div className="flex items-center gap-4">
               <div className="text-right">
                 <div className="text-sm font-bold text-white">Student Hub</div>
                 <div className="text-[10px] uppercase tracking-widest text-krown-gray">Krown Academy</div>
               </div>
               <div className="w-px h-8 bg-krown-gray/30"></div>
               <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 SYS: ONLINE
               </div>
            </div>
        </header>
        
        {/* Scrollable Canvas */}
        <div className="flex-1 overflow-y-auto bg-[#111111] p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, label, current, icon }: { href: string; label: string; current: string; icon: string }) {
  const isActive = current === href || current?.startsWith(href + '/');
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
        isActive 
          ? "bg-krown-red text-krown-white shadow-[0_0_15px_rgba(204,0,0,0.3)]" 
          : "text-krown-gray hover:text-krown-white hover:bg-white/5"
      }`}
    >
      <span className="text-lg">{icon}</span> {label}
    </Link>
  );
}
