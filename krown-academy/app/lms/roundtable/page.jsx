"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function StudentRoundtableView() {
  const [replies, setReplies] = useState({});

  const artifacts = [
    {
      id: 1,
      student: "Marcus Aurelius",
      course: "English II (Honors)",
      module: "Capstone Synthesis Project",
      content: "Here is my essay arguing the implications of rhetoric in the fall of the Republic...",
      link: "https://docs.google.com/document/d/example",
      status: "pending_review",
      reviews: 0
    },
    {
      id: 2,
      student: "Ada Lovelace",
      course: "Computer Science A",
      module: "Data Structures Crucible",
      content: "Built a visualizer for shortest path algorithms using React...",
      link: "https://github.com/example/algo-visualizer",
      status: "reviewed",
      reviews: 2
    }
  ];

  const handleReviewSubmit = (id) => {
    if (!replies[id] || replies[id].length < 20) {
      alert("Peer review must be substantive (at least 20 characters) to earn Harkness credit.");
      return;
    }
    alert("Peer review submitted successfully! You have earned +1.00 Krown Coin (Harkness Credit).");
    setReplies({ ...replies, [id]: "" });
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4 border-b border-white/10 pb-8">
        <div>
           <h1 className="text-4xl font-display font-bold text-white uppercase tracking-tight flex items-center gap-3">
             <span className="text-blue-500">🏛️</span> HARKNESS ROUNDTABLE
           </h1>
           <p className="text-krown-gray mt-2 text-sm max-w-xl">
             Welcome to the intellectual arena. To unlock your next curriculum pacing node, you must rigorously critique the synthesis projects of your peers. Iron sharpens iron.
           </p>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 text-center shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
           <div className="text-[10px] font-bold tracking-widest text-krown-gray uppercase mb-1">Required Critiques</div>
           <div className="text-2xl font-display font-bold text-blue-400">0 / 2</div>
        </div>
      </div>

      <div className="grid gap-8">
        {artifacts.map((art) => (
          <div key={art.id} className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div>
                 <h3 className="text-2xl font-bold font-body text-white mb-1 group-hover:text-blue-400 transition-colors">{art.module}</h3>
                 <div className="flex items-center gap-3 text-sm text-krown-gray font-bold uppercase tracking-widest">
                   <span>By {art.student}</span>
                   <span>•</span>
                   <span className="text-krown-gold">{art.course}</span>
                 </div>
              </div>
              <div className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs text-white font-bold uppercase tracking-widest">
                 {art.reviews} Peer Reviews
              </div>
            </div>

            <div className="bg-black/40 p-5 rounded-xl border border-white/5 mb-6 text-gray-300 font-serif text-lg italic border-l-4 border-l-blue-500">
              "{art.content}"
              <br/><br/>
              <a href={art.link} target="_blank" className="not-italic text-sm font-bold font-body text-blue-400 hover:underline uppercase tracking-widest">🔗 View Full Artifact</a>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>⚔️</span> Submit Peer Critique
              </h4>
              <div className="flex gap-4">
                <textarea 
                  value={replies[art.id] || ""}
                  onChange={(e) => setReplies({ ...replies, [art.id]: e.target.value })}
                  placeholder="Offer constructive synthesis. What flaw exists in their logic? What did they execute perfectly?"
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors min-h-[100px]"
                ></textarea>
                <div className="flex flex-col gap-2 w-32 shrink-0">
                  <button onClick={() => handleReviewSubmit(art.id)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest px-4 py-3 rounded-lg flex-1 transition-all">Submit</button>
                  <button className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest px-4 py-3 rounded-lg border border-white/10 transition-colors">Flag</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
