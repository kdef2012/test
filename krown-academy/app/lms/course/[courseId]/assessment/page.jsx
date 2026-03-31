"use client";
import { useState, use } from 'react';
import Link from 'next/link';

export default function AssessmentCrucible({ params }) {
  const unwrappedParams = use(params);
  const courseId = unwrappedParams?.courseId || "math-8";
  
  const isEnglish = courseId.includes("eng");
  const isPBL = courseId.includes("pbl");
  const moduleLabel = isPBL ? "Capstone Synthesis Project" : (isEnglish ? "English II • Mastery Check" : "Math 8 • Mastery Check");
  const [attempts, setAttempts] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showTutor, setShowTutor] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isVictorious, setIsVictorious] = useState(false);
  const [pblLink, setPblLink] = useState("");
  const [pblSubmitted, setPblSubmitted] = useState(false);

  const handleSubmit = () => {
    const correctAnswer = isEnglish ? "A" : "C";
    if (selectedAnswer !== correctAnswer) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setFeedback("Incorrect. Review your materials constraints.");
      if (newAttempts >= 2) {
         setShowTutor(true);
      }
    } else {
      setFeedback("Correct! You have mastered this concept.");
      setIsVictorious(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-krown-red uppercase tracking-tight flex items-center gap-3 drop-shadow-[0_0_15px_rgba(204,0,0,0.3)]">
            <span className="text-3xl backdrop-blur-md bg-krown-red/10 p-2 rounded-full border border-krown-red/20 shadow-inner">⚔️</span> THE CRUCIBLE
          </h1>
          <div className="text-white text-sm font-bold tracking-widest uppercase mt-3 bg-white/5 py-1 px-3 inline-block rounded border border-white/10">{moduleLabel}</div>
        </div>
        
        {/* Lives / Attempts indicator */}
        <div className="flex flex-col items-center sm:items-end p-4 rounded-xl border border-white/10 bg-[#1a1a1a]">
           <span className="text-[10px] font-bold tracking-widest text-krown-gray uppercase mb-2">Error Margin</span>
           <div className="flex gap-3">
              <div className={`w-4 h-4 rounded-full border-2 border-[#1a1a1a] shadow-[0_0_10px_rgba(0,0,0,0.5)_inset] transition-colors duration-500 ${attempts > 0 ? 'bg-krown-red shadow-[0_0_10px_rgba(204,0,0,0.8)]' : 'bg-gray-700/50'}`}></div>
              <div className={`w-4 h-4 rounded-full border-2 border-[#1a1a1a] shadow-[0_0_10px_rgba(0,0,0,0.5)_inset] transition-colors duration-500 ${attempts > 1 ? 'bg-krown-red shadow-[0_0_10px_rgba(204,0,0,0.8)]' : 'bg-gray-700/50'}`}></div>
              <div className={`w-4 h-4 rounded-full border-2 border-[#1a1a1a] shadow-[0_0_10px_rgba(0,0,0,0.5)_inset] transition-colors duration-500 ${attempts > 2 ? 'bg-krown-red shadow-[0_0_10px_rgba(204,0,0,0.8)]' : 'bg-gray-700/50'}`}></div>
           </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-white/10 rounded-[2rem] p-8 sm:p-12 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
         {isVictorious ? (
           <div className="bg-gradient-to-b from-emerald-600 to-emerald-900 rounded-3xl p-10 shadow-[0_0_50px_rgba(16,185,129,0.5)] border border-emerald-400 text-center relative overflow-hidden animate-fade-in -mx-4 sm:mx-0">
               <div className="text-7xl mb-6 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">⚔️</div>
               <h3 className="font-bold font-display uppercase tracking-widest text-white text-3xl mb-4 relative z-10 drop-shadow-md">Crucible Conquered</h3>
               <p className="text-lg text-emerald-100 font-bold mb-8 tracking-wide relative z-10">Your logic algorithms are intact. You have earned a new weapon for your Armory.</p>
               <div className="text-4xl font-bold font-display text-amber-400 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] bg-black/40 rounded-xl py-6 border border-black/50 mb-8 relative z-10">
                  + 1 Sword <br/><span className="text-sm text-emerald-300 mt-2 block">(+ 2.00 KC)</span>
               </div>
               <Link href="/lms/dashboard">
                 <button className="relative z-10 bg-white hover:bg-gray-100 transition-transform active:scale-95 text-emerald-900 font-display font-bold px-8 py-5 rounded-xl w-full sm:w-auto uppercase tracking-widest text-xl shadow-[0_0_20px_rgba(255,255,255,0.4)]">Return to Armory</button>
               </Link>
           </div>
         ) : (
           <>
             {isPBL ? (
               <div className="animate-fade-in text-center">
                 <h2 className="text-3xl font-display font-bold text-white mb-6 uppercase tracking-wider">Project Synthesis Upload</h2>
                 <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                   This module cannot be brute-forced. It requires deep, interdisciplinary critical thinking. Paste the direct URL to your coded application, video presentation, or polished essay artifact below. It will be submitted for manual faculty grading and peer Roundtable review.
                 </p>
                 
                 {!pblSubmitted ? (
                   <div className="bg-black/40 border border-white/10 p-8 rounded-2xl shadow-inner max-w-3xl mx-auto">
                     <input 
                        type="url" 
                        placeholder="https://your-project-link..."
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white text-lg focus:outline-none focus:border-krown-gold transition-colors mb-6 placeholder-gray-600"
                        value={pblLink}
                        onChange={e => setPblLink(e.target.value)}
                     />
                     <button 
                        onClick={() => {
                          if(pblLink.length > 5) setPblSubmitted(true);
                        }}
                        className="bg-krown-gold text-black font-display font-bold px-10 py-4 w-full rounded-xl uppercase tracking-widest text-lg transition-transform hover:scale-105 shadow-[0_0_20px_rgba(200,168,78,0.4)]"
                     >
                        Submit to Faculty & Roundtable
                     </button>
                   </div>
                 ) : (
                   <div className="bg-emerald-900/30 border border-emerald-500/50 p-10 rounded-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                      <div className="relative z-10">
                        <span className="text-5xl mb-4 block">📡</span>
                        <h3 className="text-emerald-400 font-display font-bold text-2xl uppercase tracking-widest mb-3">Transmission Successful</h3>
                        <p className="text-emerald-100/80 mb-6">Your mastery artifact is now pending human evaluation. You will receive notification when your rubric has been scored.</p>
                        <Link href="/lms/dashboard">
                          <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-lg uppercase text-sm tracking-wider transition-colors">Return to Dashboard</button>
                        </Link>
                      </div>
                   </div>
                 )}
               </div>
             ) : isEnglish ? (
               <>
                 <h2 className="text-2xl sm:text-3xl font-bold font-body text-white mb-8 leading-relaxed sm:leading-snug">
                   When an author uses statistical data and logical structure to persuade the reader, which rhetorical appeal is strictly being used?
                 </h2>
                 <div className="bg-black/60 p-8 rounded-2xl border border-krown-gray/20 font-serif text-2xl text-center text-white mb-10 shadow-inner w-full flex flex-col align-center italic">
                    "According to the CDC, vaccination rates improved by 42%..."
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {["A) Logos", "B) Pathos", "C) Ethos", "D) Hubris"].map((option, i) => {
                      const letter = option.charAt(0);
                      return (
                        <button 
                          key={i}
                          onClick={() => setSelectedAnswer(letter)}
                          className={`p-6 rounded-2xl border-2 text-left font-bold transition-all duration-300 text-xl flex items-center gap-5 hover:translate-y-[-2px] ${
                            selectedAnswer === letter 
                             ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                             : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          <span className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center font-display text-xl transition-colors ${selectedAnswer === letter ? 'bg-blue-500 text-white' : 'bg-white/10 text-white group-hover:bg-white/20'}`}>{letter}</span>
                          {option.substring(3)}
                        </button>
                      )
                    })}
                 </div>
               </>
             ) : (
               <>
                 <h2 className="text-2xl sm:text-3xl font-bold font-body text-white mb-8 leading-relaxed sm:leading-snug">
                   Using the substitution method on the system below, what is the value of <span className="text-blue-400 font-mono bg-blue-500/10 px-3 py-1 rounded inline-block shadow-inner border border-blue-500/20 translate-y-[-2px]">B</span> (Basketballs)?
                 </h2>
                 
                 <div className="bg-black/60 p-8 rounded-2xl border border-krown-gray/20 font-mono text-2xl text-center text-white mb-10 shadow-inner w-full flex flex-col align-center">
                    <div className="inline-block text-left mx-auto">
                      J + B = 500<br/>
                      J = 2B
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {["A) 500", "B) 250", "C) 166.67", "D) 333.33"].map((option, i) => {
                      const letter = option.charAt(0);
                      return (
                        <button 
                          key={i}
                          onClick={() => setSelectedAnswer(letter)}
                          className={`p-6 rounded-2xl border-2 text-left font-bold transition-all duration-300 text-xl flex items-center gap-5 hover:translate-y-[-2px] ${
                            selectedAnswer === letter 
                             ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                             : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          <span className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center font-display text-xl transition-colors ${selectedAnswer === letter ? 'bg-blue-500 text-white' : 'bg-white/10 text-white group-hover:bg-white/20'}`}>{letter}</span>
                          {option.substring(3)}
                        </button>
                      )
                    })}
                 </div>
               </>
             )}
           </>
         )}
         {feedback && (
            <div className={`p-5 rounded-xl text-center font-bold text-lg mb-6 tracking-wide animate-fade-in ${feedback.includes('Correct') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-krown-red/20 text-red-400 border border-krown-red/30 shadow-[0_0_15px_rgba(204,0,0,0.2)]'}`}>
              {feedback}
            </div>
         )}

         <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-white/10 gap-6">
           <Link href={`/lms/course/${courseId}`} className="text-krown-gray font-bold hover:text-white transition-colors uppercase tracking-widest text-sm bg-white/5 px-6 py-3 rounded-xl border border-white/10 w-full sm:w-auto text-center">
             ← Review Theory
           </Link>
           {feedback.includes('Correct') ? (
             <Link href="/lms/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-10 py-4 rounded-xl bg-emerald-500 text-black font-display font-bold text-xl tracking-widest uppercase hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-3">
                  <span>🗡️</span> Claim Sword
                </button>
             </Link>
           ) : (
             <button 
               onClick={handleSubmit}
               disabled={!selectedAnswer}
               className="w-full sm:w-auto px-10 py-4 rounded-xl bg-krown-red text-white font-display font-bold text-xl tracking-widest uppercase hover:bg-red-600 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(204,0,0,0.5)]"
             >
               Cast Answer
             </button>
           )}
         </div>
      </div>

      {/* SOCRATIC AI TUTOR (Only appears if stuck) */}
      {showTutor && (
        <div className="mt-8 bg-blue-950/40 border-2 border-blue-500/40 rounded-3xl p-8 shadow-[0_0_40px_rgba(59,130,246,0.2)] animate-fade-in relative overflow-hidden backdrop-blur-sm">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
           
           <div className="flex items-center gap-5 mb-8 border-b border-blue-500/20 pb-6 relative z-10">
             <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 border border-blue-400 text-white flex items-center justify-center text-3xl filter drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
               🦉
             </div>
             <div>
               <h3 className="text-blue-300 font-bold font-display uppercase tracking-widest text-xl mb-1">Krown AI Tutor</h3>
               <p className="text-xs text-blue-400/80 font-bold tracking-widest uppercase bg-blue-900/50 inline-block px-2 py-0.5 rounded border border-blue-500/30">Intervention Protocol Active</p>
             </div>
           </div>

           <div className="space-y-6 mb-8 relative z-10">
             <div className="flex justify-start drop-shadow-lg">
               <div className="bg-gradient-to-r from-blue-900/80 to-blue-800/60 border border-blue-500/30 rounded-2xl rounded-tl-sm p-6 max-w-[85%]">
                 <p className="text-blue-100 text-lg leading-relaxed">
                   {isEnglish ? "I see you're struggling with rhetorical appeals. Let's look at the quote again. Does '42%' represent an emotion, a logical data point, or a credential?" : "I see you're struggling with finding B. Let's trace it back. What did the final equation look like after you substituted 2B in for J?"}
                 </p>
               </div>
             </div>
           </div>

           <div className="flex gap-4 relative z-10">
             <div className="relative flex-1">
               <input type="text" placeholder="Type your answer here..." className="w-full bg-black/40 border-2 border-blue-500/30 rounded-xl px-5 py-4 text-white text-lg focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-colors shadow-inner" />
               <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-500/50 uppercase tracking-widest pointer-events-none">Press Enter</div>
             </div>
             <button className="bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 border border-blue-400 text-white px-8 font-bold font-display text-2xl rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(59,130,246,0.6)]">→</button>
           </div>
        </div>
      )}
    </div>
  );
}
