"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#050508] text-white font-sans">
      {/* Navbar - Exact top position */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-zinc-800">
        <div className="text-xl font-bold tracking-widest">WAR PROJECT</div>
        
        <div className="flex gap-8 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          <span className="cursor-pointer hover:text-white">EXAM GROUPS</span>
          <span className="cursor-pointer hover:text-white">ACCESS VAULT</span>
          <span className="cursor-pointer hover:text-white">TRANSMIT ALERTS</span>
        </div>

        <div className="flex gap-6 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          <span className="text-yellow-500 border-b-2 border-yellow-500 pb-1 cursor-pointer">DASHBOARD</span>
          <span className="cursor-pointer hover:text-white" onClick={() => router.push("/leaderboard")}>LEADERBOARD</span>
          <span className="cursor-pointer hover:text-white" onClick={() => router.push("/admin")}>ADMIN</span>
          <button onClick={() => router.push("/login")} className="hover:text-white">LOGOUT</button>
        </div>
      </nav>

      {/* Timer Section */}
      <div className="flex flex-col items-center justify-center mt-16 mb-20">
        <div className="text-7xl font-mono tracking-widest mb-10">00 : 00 : 00</div>
        <button className="bg-white text-black font-bold px-8 py-3 rounded-sm hover:bg-zinc-200 transition">
          INITIALIZE SECURE TIMER
        </button>
      </div>

      {/* Bottom Section: Notes & Feedback */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 gap-8 px-6">
        {/* Quick Notes */}
        <div className="bg-[#111111] border border-zinc-800 p-4">
            <h3 className="text-[11px] font-bold text-zinc-500 mb-3 uppercase">QUICK NOTES</h3>
            <textarea className="w-full bg-black text-white p-3 h-24 mb-3 border border-zinc-800 focus:outline-none" />
            <button className="w-full bg-blue-600 text-white text-xs font-bold py-3 uppercase">SAVE NOTE</button>
        </div>

        {/* Send Feedback */}
        <div className="bg-[#111111] border border-zinc-800 p-4">
            <h3 className="text-[11px] font-bold text-zinc-500 mb-3 uppercase">SEND FEEDBACK</h3>
            <textarea className="w-full bg-black text-white p-3 h-24 mb-3 border border-zinc-800 focus:outline-none" />
            <button className="w-full bg-green-600 text-white text-xs font-bold py-3 uppercase">SEND FEEDBACK</button>
        </div>
      </div>
    </main>
  );
}