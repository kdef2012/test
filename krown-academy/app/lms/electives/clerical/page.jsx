"use client";
import { useState, useEffect, useRef } from 'react';

const TEXTS = [
  "In corporate America, the ability to rapidly disseminate information accurately via digital communication is paramount. An executive assistant who can compose error-free briefs under strict deadlines is invaluable.",
  "Data integrity is the foundation of any algorithmic model. If you enter incorrect strings into the database framework, the entire enterprise application will suffer from compounding logical fallacies.",
  "function calculateReturnOnInvestment(initialCapital, finalValue) { const netProfit = finalValue - initialCapital; return (netProfit / initialCapital) * 100; } // Note: Strict syntax pacing.",
  "According to the quarterly fiscal report, revenue increased by 14.8% year-over-year, while operating margins shrank due to aggressive expansion into the European semiconductor market.",
  "const initializeSystem = async () => { try { await db.connect(); console.log('Terminal ready'); } catch (err) { throw new Error('Initialization failure'); } };",
  "To whom it may concern: The plaintiff asserts that the intellectual property in question was developed implicitly during company hours, thereby granting the corporation full ownership rights.",
  "Quantum entanglement demonstrates that particles can remain connected in such a way that the state of one instantaneously influences the state of another, regardless of the physical distance."
];

export default function ClericalElective() {
  const [targetText, setTargetText] = useState(TEXTS[0]);
  const [userInput, setUserInput] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const inputRef = useRef(null);

  // Focus keeper
  useEffect(() => {
    const handleClick = () => {
      if (isStarted && !isCompleted && inputRef.current) {
        inputRef.current.focus();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isStarted, isCompleted]);

  useEffect(() => {
     if (isStarted && !isCompleted) {
        // Calculate WPM and Accuracy
        const elapsedMinutes = (Date.now() - startTime) / 60000;
        const wordsTyped = userInput.length / 5;
        if (elapsedMinutes > 0) {
           setWpm(Math.round(wordsTyped / elapsedMinutes));
        }

        let errors = 0;
        for (let i = 0; i < userInput.length; i++) {
           if (userInput[i] !== targetText[i]) errors++;
        }
        
        if (userInput.length > 0) {
           setAccuracy(Math.round(((userInput.length - errors) / userInput.length) * 100));
        }

        // Check completion
        if (userInput.length === targetText.length) {
            setIsCompleted(true);
        }
     }
  }, [userInput, isStarted, isCompleted, startTime, targetText]);

  const handleChange = (e) => {
    if (!isStarted) return; // Prevent typing if not explicitly started by button
    
    const val = e.target.value;
    
    // Block backspace or deletions to prevent redo logic abuse
    if (val.length < userInput.length) {
       return; 
    }
    
    if (val.length <= targetText.length) {
       setUserInput(val);
    }
  };

  const handleStart = () => {
     // Randomize next text
     const randomText = TEXTS[Math.floor(Math.random() * TEXTS.length)];
     setTargetText(randomText);
     setUserInput("");
     setIsStarted(true);
     setStartTime(Date.now());
     setIsCompleted(false);
     setWpm(0);
     setAccuracy(100);
     setTimeout(() => {
        inputRef.current?.focus();
     }, 10);
  };

  const getCharClass = (char, index) => {
     if (index >= userInput.length) return "text-white/30";
     if (char === userInput[index]) return "text-white bg-green-500/20";
     return "text-krown-red bg-red-500/20 underline decoration-red-500";
  };

  return (
    <div className="w-full flex flex-col h-full min-h-screen pb-10">
       <div className="mb-8 shrink-0">
        <h1 className="text-4xl sm:text-5xl flex items-center gap-4 font-display font-bold text-white uppercase tracking-tight mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
           <span className="text-4xl bg-white/10 p-3 rounded-xl border border-white/20 shadow-inner">⌨️</span> 
           Data Operations
        </h1>
        <p className="text-krown-gray text-lg tracking-wide">Elective: <span className="text-amber-400 font-bold">Executive Speed.</span> Raise your WPM to unlock professional certifications and farm Krown Coin.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-8">
         {/* Live Stats */}
         <div className="xl:col-span-1 flex flex-col gap-6 shrink-0">
            <div className="bg-[#1a1a1a] border-t border-b sm:border border-white/10 sm:rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>
               <div className="text-7xl font-display font-bold text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)] relative z-10">{wpm}</div>
               <div className="text-sm font-bold tracking-widest uppercase text-amber-400/50 mt-3 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20 relative z-10">Words / Min</div>
            </div>
            
            <div className="bg-[#1a1a1a] border-t border-b sm:border border-white/10 sm:rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>
               <div className={`text-5xl font-display font-bold relative z-10 drop-shadow-md transition-colors ${accuracy === 100 ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]' : accuracy > 95 ? 'text-blue-400' : 'text-krown-red'}`}>
                 {accuracy}%
               </div>
               <div className="text-sm font-bold tracking-widest uppercase text-krown-gray mt-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 relative z-10">Accuracy</div>
            </div>
            
            {isCompleted && (
              <div className="bg-gradient-to-b from-emerald-600 to-emerald-900 rounded-3xl p-8 shadow-[0_0_30px_rgba(16,185,129,0.5)] border border-emerald-400 animate-fade-in text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-20 text-5xl">📄</div>
                 <h3 className="font-bold font-display uppercase tracking-widest text-white text-xl mb-3 relative z-10">Audit Passed</h3>
                 <p className="text-sm text-emerald-100 font-bold mb-6 tracking-wide relative z-10">You have been awarded execution pay for data integrity.</p>
                 <div className="text-3xl font-bold font-display text-amber-400 filter drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] bg-black/30 rounded-xl py-4 border border-black/50 mb-6 relative z-10">
                    + 15.00 KC
                 </div>
                 <button onClick={handleStart} className="relative z-10 bg-white hover:bg-gray-100 transition-transform active:scale-95 text-emerald-900 font-display font-bold px-6 py-4 rounded-xl w-full uppercase tracking-widest text-lg shadow-lg">Load Next Briefing</button>
              </div>
            )}
         </div>

         {/* Typer Interface */}
         <div className="xl:col-span-3 flex flex-col min-h-[60vh] xl:min-h-0 relative">
            <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 sm:p-12 relative shadow-[0_0_50px_rgba(0,0,0,0.8)] flex-1 flex flex-col h-full w-full overflow-hidden">
               {/* Terminal effect */}
               <div className="absolute top-0 inset-x-0 h-10 bg-[#111] border-b border-white/10 flex items-center px-6 gap-2 z-30 shrink-0">
                 <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 shadow-inner"></div>
                 <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 shadow-inner"></div>
                 <div className="w-3.5 h-3.5 rounded-full bg-green-500/80 shadow-inner"></div>
                 <div className="ml-6 font-mono text-xs text-krown-gray tracking-widest uppercase font-bold bg-white/5 py-1 px-3 rounded text-amber-500/50">Mavis_Protocol_v3.sh</div>
               </div>

               <div className="mt-10 flex-1 font-mono text-2xl sm:text-3xl leading-[2.2] sm:leading-[2] tracking-widest cursor-text relative group overflow-hidden break-words whitespace-pre-wrap">
                 {targetText.split("").map((char, index) => (
                    <span key={index} className={`transition-all duration-75 inline-block z-10 ${getCharClass(char, index)}`}>
                       {char === " " ? "\u00A0" : char}
                    </span>
                 ))}
                 
                 {/* Blinking cursor overlay */}
                 <div 
                   className={`absolute w-3 h-8 sm:h-10 bg-amber-400 transition-all duration-75 pointer-events-none z-0 ${isStarted && !isCompleted ? 'opacity-50' : 'opacity-0 animate-pulse'}`}
                   style={{ display: 'none' }}
                 ></div>
               </div>

               <textarea 
                  ref={inputRef}
                  value={userInput}
                  onChange={handleChange}
                  disabled={isCompleted}
                  className="fixed top-0 left-0 opacity-0 -z-50 focus:outline-none w-1 h-1 resize-none cursor-default" 
                  autoFocus
                  spellCheck="false"
               />

               {!isStarted && (
                 <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-40 rounded-3xl border border-white/10">
                    <button onClick={handleStart} className="bg-krown-red hover:bg-red-500 text-white px-10 py-6 rounded-2xl font-display font-bold text-2xl sm:text-3xl uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_40px_rgba(204,0,0,0.6)] border border-red-400">
                      Begin Transcription
                    </button>
                    <p className="mt-6 text-krown-gray font-bold tracking-widest text-sm bg-black p-3 rounded-lg border border-white/10 uppercase">Warning: Capitalization and Punctuation are strict.</p>
                 </div>
               )}
            </div>
            
            <div className="mt-6 flex gap-6 text-sm font-bold uppercase tracking-widest text-krown-gray px-6 bg-[#1a1a1a] p-4 rounded-xl border border-white/5 shrink-0">
               <div className="flex items-center gap-3">
                 <span className="bg-white/10 p-2 rounded text-lg">⌨️</span> 
                 Keystrokes: <span className="text-white font-mono text-lg">{userInput.length}</span>
               </div>
               <div className="w-px h-8 bg-white/10"></div>
               <div className="flex items-center gap-3">
                 <span className="bg-white/10 p-2 rounded text-lg">🎯</span> 
                 Target: <span className="text-white font-mono text-lg">{targetText.length}</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
