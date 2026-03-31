"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [swordsEarned] = useState(14);
  const [totalSwords] = useState(40);
  const [krownCoin] = useState(28.00);
  
  // A simple simulated sword inventory array
  const inventory = Array.from({ length: totalSwords }, (_, i) => ({
    id: i + 1,
    unlocked: i < swordsEarned
  }));

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-bold font-display tracking-tight text-white mb-2 uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">The Armory</h1>
          <p className="text-krown-gray text-lg">Your academic arsenal. Complete modules to earn swords and expand your power.</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-krown-gray/30 rounded-xl p-5 flex gap-6 items-center shadow-lg">
           <div>
             <div className="text-xs font-bold text-krown-gray tracking-widest uppercase mb-1">Treasury Balance</div>
             <div className="text-3xl font-display font-bold text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">KC {krownCoin.toFixed(2)}</div>
           </div>
           <button className="bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 px-5 py-2.5 rounded-lg font-bold text-sm transition-all text-amber-400 uppercase tracking-widest">
             Exchange
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* The Knight Render (Left 1 col) */}
        <div className="bg-[#1a1a1a] border border-krown-gray/30 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden group shadow-xl">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-krown-red/10 mix-blend-screen pointer-events-none transition-opacity duration-1000"></div>
            
            <h2 className="text-sm font-bold tracking-widest text-krown-gray uppercase absolute top-6 left-6">Current Form</h2>
            
            {/* Visualizer silhouette */}
            <div className="relative w-48 h-80 flex items-end justify-center">
              {/* Silhouette Body (Placeholder styling using CSS clip paths to look like armor) */}
              <div className="absolute inset-0 bg-krown-gray/10 rounded-t-[100px] w-full" style={{ clipPath: 'polygon(50% 0%, 100% 20%, 80% 100%, 20% 100%, 0% 20%)' }}></div>
              
              {/* Progress Fill over the Silhouette - Fills from bottom based on progression */}
              <div 
                className="absolute bottom-0 w-full bg-gradient-to-t from-krown-red to-orange-500 transition-all duration-1000 shadow-[0_0_30px_rgba(204,0,0,0.5)]"
                style={{ 
                  height: `${(swordsEarned / totalSwords) * 100}%`,
                  clipPath: 'polygon(50% 0%, 100% 20%, 80% 100%, 20% 100%, 0% 20%)'
                }}
              ></div>
              
              {/* Overlay grid lines to make it look mechanical/armor-like */}
              <div className="absolute inset-x-0 bottom-0 h-full bg-[linear-gradient(rgba(0,0,0,0.5)_2px,transparent_2px)] bg-[size:100%_25px] opacity-40"></div>
            </div>

            <div className="mt-10 text-center relative z-10">
              <div className="text-5xl font-display font-bold text-white mb-1 drop-shadow-md">{((swordsEarned / totalSwords) * 100).toFixed(0)}%</div>
              <div className="text-xs font-bold tracking-widest text-krown-red uppercase">Mastery Rate</div>
            </div>
        </div>

        {/* The Swords Grid (Right 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-[#1a1a1a] border border-krown-gray/30 rounded-2xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-display tracking-wide text-white">EARNED WEAPONRY</h2>
                <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                   <span className="text-sm font-bold text-krown-gray"><span className="text-white">{swordsEarned}</span> / {totalSwords} Unlocked</span>
                </div>
              </div>
              
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
                {inventory.map(slot => (
                  <div 
                    key={slot.id} 
                    className={`aspect-square rounded-lg flex items-center justify-center border transition-all duration-500 ${
                      slot.unlocked 
                        ? 'bg-krown-red/10 border-krown-red/50 shadow-[0_0_15px_rgba(204,0,0,0.2)] hover:bg-krown-red/20 hover:-translate-y-1 cursor-pointer' 
                        : 'bg-black/40 border-krown-gray/20 opacity-50'
                    }`}
                  >
                    {slot.unlocked ? (
                      <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">🗡️</span>
                    ) : (
                      <span className="text-[10px] sm:text-xs font-bold text-krown-gray/50 uppercase tracking-wider">LOCKED</span>
                    )}
                  </div>
                ))}
              </div>
           </div>

           {/* Active Quests (Current Modules) */}
           <div className="bg-[#1a1a1a] border border-krown-gray/30 rounded-2xl p-8 shadow-xl">
              <h2 className="text-xl font-bold font-display tracking-wide text-white mb-6">ACTIVE QUESTS</h2>
              <div className="space-y-4">
                 
                 {/* Quest Item 1 */}
                 <div className="p-5 rounded-xl border border-white/5 bg-white/5 flex flex-col sm:flex-row gap-6 items-start sm:items-center group hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer">
                    <div className="w-14 h-14 shrink-0 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-display font-bold text-2xl group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                      M8
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="font-bold text-white text-lg">Math 8: Systems of Equations</h3>
                        <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">Module 4</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-black/60 overflow-hidden border border-white/5">
                         <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 w-[65%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 self-end sm:self-auto">
                      <Link href="/lms/course/math-8">
                        <button className="text-xs font-bold px-5 py-2.5 rounded-lg bg-krown-red text-white uppercase tracking-wider hover:bg-red-600 transition-colors shadow-lg">Resume</button>
                      </Link>
                    </div>
                 </div>

                 {/* Quest Item 2 */}
                 <div className="p-5 rounded-xl border border-white/5 bg-white/5 flex flex-col sm:flex-row gap-6 items-start sm:items-center group hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer">
                    <div className="w-14 h-14 shrink-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-display font-bold text-2xl group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
                      E2
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="font-bold text-white text-lg">English II: Argumentative Structure</h3>
                        <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Module 1</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-black/60 overflow-hidden border border-white/5">
                         <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[12%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 self-end sm:self-auto">
                      <Link href="/lms/course/eng-2">
                         <button className="text-xs font-bold px-5 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white uppercase tracking-wider group-hover:bg-white/20 transition-colors">Resume</button>
                      </Link>
                    </div>
                 </div>

              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
