"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function CoursePlayer({ params }) {
  const unwrappedParams = use(params);
  const courseId = unwrappedParams?.courseId || "math-8";
  
  const isEnglish = courseId.includes("eng");
  const courseTitle = isEnglish ? "English II: Argumentative Structure" : "Math 8: Systems of Equations";
  const moduleLabel = isEnglish ? "Module 1 • Lesson 1" : "Module 4 • Lesson 1";
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [activeTool, setActiveTool] = useState(null);

  // Passive Telemetry Engine (Background heartbeat)
  useEffect(() => {
    const heartbeat = setInterval(() => {
      // In a real implementation: check document.hasFocus() or mouse activity
      const hasFocus = document.hasFocus();
      if (hasFocus) {
         setActiveSeconds(prev => prev + 1);
         // if (activeSeconds % 60 === 0 && activeSeconds > 0) {
         //    // Ping Supabase `krown_lms_telemetry_logs`
         //    supabase.from('krown_lms_telemetry_logs').upsert(...)
         // }
      }
    }, 1000);

    return () => clearInterval(heartbeat);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Top Telemetry Breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-krown-gray/30 pb-6 gap-4">
        <div>
          <Link href="/lms/dashboard" className="inline-block text-krown-gray text-xs font-bold hover:text-white uppercase tracking-widest transition-colors mb-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">← Return to Armory</Link>
          <h1 className="text-3xl font-display font-bold text-white uppercase tracking-tight drop-shadow-md">{courseTitle}</h1>
          <div className="text-blue-400 text-sm font-bold tracking-widest uppercase mt-2 bg-blue-500/10 inline-block px-3 py-1 rounded border border-blue-500/20">{moduleLabel}</div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-white/10 px-6 py-3 rounded-xl flex flex-col items-center sm:items-end shadow-xl">
           <span className="text-[10px] uppercase font-bold text-krown-gray tracking-widest mb-1">Session Protocol</span>
           <div className="text-2xl font-display text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]">{Math.floor(activeSeconds / 60)}m {activeSeconds % 60}s <span className="text-[10px] sm:text-xs text-krown-gray ml-1 uppercase tracking-widest font-body">Logged</span></div>
        </div>
      </div>

      {/* Main Content View (The Page) */}
      <div className="bg-white rounded-[2rem] text-krown-black shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden border border-white/10">
         {/* Accessibility Tools Bar */}
         <div className="h-16 bg-[#f8fafc] border-b border-gray-200 flex items-center justify-end px-6 gap-3 sm:gap-4 overflow-x-auto relative">
            {activeTool === "audio" && (
               <div className="absolute left-6 text-krown-red font-bold text-xs animate-pulse flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-krown-red"></span> Neural Voice Active...
               </div>
            )}
            <button onClick={() => setActiveTool(activeTool === 'audio' ? null : 'audio')} className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold transition-colors uppercase tracking-widest ${activeTool === 'audio' ? 'bg-krown-red text-white border-krown-red shadow-[0_0_10px_rgba(204,0,0,0.3)]' : 'bg-white border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50'}`}>
              <span className="text-lg">🗣️</span> Audio
            </button>
            <button onClick={() => setActiveTool(activeTool === 'simplify' ? null : 'simplify')} className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold shadow-sm transition-colors uppercase tracking-widest ${activeTool === 'simplify' ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}`}>
              <span className="text-lg">🧠</span> Simplify Base
            </button>
            <button onClick={() => setActiveTool(activeTool === 'analogy' ? null : 'analogy')} className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold shadow-sm transition-colors uppercase tracking-widest ${activeTool === 'analogy' ? 'bg-amber-500 border-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}>
              <span className="text-lg">🏀</span> Shift Analogy
            </button>
         </div>
         
         {activeTool === 'simplify' && (
            <div className="bg-blue-600 text-white font-bold p-4 text-center text-sm tracking-widest uppercase animate-fade-in shadow-inner">
               Lexile Level Reduced by 30% — Concept simplified for direct comprehension
            </div>
         )}
         
         {activeTool === 'analogy' && (
            <div className="bg-amber-500 text-white font-bold p-4 text-center text-sm tracking-widest uppercase animate-fade-in shadow-inner">
               Analogy Engine Active — Translating academic variables into tangible physical objects
            </div>
         )}

         {/* Lesson Content Generated by AI */}
         <div className="p-8 sm:p-12 prose prose-lg font-body max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-a:text-krown-red">
            <h2 className="text-4xl mb-8 flex items-center gap-4">
              <span className="text-blue-500 opacity-50">#</span> {isEnglish ? "Analyzing Rhetorical Appeals" : "Understanding Substitution"}
            </h2>
            
            {isEnglish ? (
              <>
                <p className="text-xl leading-relaxed text-gray-700 mb-6">
                  In argumentative writing, authors use specific strategies to persuade their audience. These are called rhetorical appeals. The three primary appeals are <strong>Ethos</strong> (credibility), <strong>Pathos</strong> (emotion), and <strong>Logos</strong> (logic/reason).
                </p>
                <div className="bg-[#f0f9ff] p-8 rounded-2xl border-l-4 border-blue-500 mb-8 shadow-inner shadow-blue-500/5 font-serif text-xl text-blue-900 leading-loose mx-0 sm:-mx-4 lg:mx-0 italic">
                  "As a doctor with 20 years of experience (Ethos), I urge you to consider the data showing a 40% decrease in illness (Logos). Think of the children who suffer unnecessarily every winter (Pathos)."
                </div>
                <div className="bg-emerald-50/50 p-8 sm:p-10 rounded-[1.5rem] border border-emerald-200 mb-10 cursor-pointer hover:bg-emerald-50 transition-colors group relative overflow-hidden text-center shadow-lg shadow-emerald-500/5">
                  <div className="absolute inset-0 bg-emerald-500/5 transition-opacity opacity-0 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                    <p className="font-bold text-emerald-800 text-2xl font-display mb-2 drop-shadow-sm">Check for Understanding</p>
                    <p className="text-sm font-bold tracking-wider text-emerald-600 uppercase mb-6">Which appeal relies on statistics?</p>
                    <div className="text-3xl font-mono font-bold text-gray-900 border-2 border-dashed border-emerald-300 px-8 py-6 rounded-xl bg-white shadow-sm inline-block group-hover:border-emerald-500 transition-colors">
                       Logos
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-xl leading-relaxed text-gray-700 mb-6">
                  Imagine you are managing the budget for the school's basketball team. You know that purchasing new jerseys (J) and basketballs (B) costs a total of $500. You also know that a jersey costs twice as much as a basketball. 
                </p>
                
                <div className="bg-[#f0f9ff] p-8 rounded-2xl border-l-4 border-blue-500 mb-8 shadow-inner shadow-blue-500/5 font-mono text-xl text-blue-900 leading-loose mx-0 sm:-mx-4 lg:mx-0">
                   J + B = 500<br/>
                   J = 2B
                </div>
                
                <p className="text-xl leading-relaxed text-gray-700 mb-8">
                  Substitution is exactly what it sounds like. We take the value of J (which is 2B) and literally <strong>substitute</strong> it into the first equation where the J used to be.
                </p>
                
                {/* Interactive Widget Concept */}
                <div className="bg-emerald-50/50 p-8 sm:p-10 rounded-[1.5rem] border border-emerald-200 mb-10 cursor-pointer hover:bg-emerald-50 transition-colors group relative overflow-hidden text-center shadow-lg shadow-emerald-500/5">
                  <div className="absolute inset-0 bg-emerald-500/5 transition-opacity opacity-0 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                    <p className="font-bold text-emerald-800 text-2xl font-display mb-2 drop-shadow-sm">Check for Understanding</p>
                    <p className="text-sm font-bold tracking-wider text-emerald-600 uppercase mb-6">Click to reveal the next step in the substitution.</p>
                    <div className="text-3xl font-mono font-bold text-gray-900 border-2 border-dashed border-emerald-300 px-8 py-6 rounded-xl bg-white shadow-sm inline-block group-hover:border-emerald-500 transition-colors">
                       (2B) + B = 500
                    </div>
                  </div>
                </div>
              </>
            )}
         </div>
      </div>

      {/* Progress Footer */}
      <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6">
         <button className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/20 text-white font-bold tracking-widest uppercase text-sm hover:bg-white/10 transition-colors">
           Previous Concept
         </button>
         
         {/* Assessment Trigger */}
         <Link href={`/lms/course/${courseId}/assessment`} className="w-full sm:w-auto">
           <button className="w-full sm:w-auto px-10 py-4 rounded-xl bg-krown-red text-white font-display font-bold text-xl tracking-widest uppercase hover:bg-red-600 transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(204,0,0,0.5)] flex items-center justify-center gap-4 group">
             Proceed to Crucible 
             <span className="group-hover:translate-x-3 transition-transform text-2xl">→</span>
           </button>
         </Link>
      </div>
    </div>
  );
}
