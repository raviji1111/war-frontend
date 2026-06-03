"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#050508] text-white font-sans">
      {/* Navbar - Exact Layout */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-zinc-800">
        <div className="flex items-center gap-10">
          <div className="text-xl font-bold tracking-widest">WAR PROJECT</div>
          <div className="flex gap-6 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            <span className="cursor-pointer hover:text-white">● EXAM GROUPS</span>
            <span className="cursor-pointer hover:text-white">📁 ACCESS VAULT</span>
            <span className="cursor-pointer text-orange-500">💬 TRANSMIT ALERTS</span>
          </div>
        </div>

        <div className="flex gap-6 text-[11px] font-bold text-zinc-400 uppercase tracking-wider items-center">
          <span className="text-yellow-500 border-b-2 border-yellow-500 pb-1 cursor-pointer">DASHBOARD</span>
          <span className="cursor-pointer hover:text-white" onClick={() => router.push("/leaderboard")}>LEADERBOARD</span>
          <span className="cursor-pointer hover:text-white" onClick={() => router.push("/admin")}>ADMIN</span>
          <button onClick={() => router.push("/login")} className="hover:text-white">LOGOUT</button>
        </div>
      </nav>

      {/* Timer Section - Only Timer will be visible now */}
      <div className="flex flex-col items-center justify-center mt-20 mb-20">
        <div className="text-7xl font-mono tracking-widest mb-10">00 : 00 : 00</div>
        <button className="bg-white text-black font-bold px-8 py-3 rounded-sm hover:bg-zinc-200 transition">
          INITIALIZE SECURE TIMER
        </button>
      </div>

      {/* Notes & Feedback Section REMOVED as requested */}
    </main>
  );
}