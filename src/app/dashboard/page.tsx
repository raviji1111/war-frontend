"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

export default function Dashboard() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#050508] text-zinc-100 font-sans p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-16 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold tracking-widest text-white">WAR PROJECT</h1>
          <div className="flex gap-6 text-[12px] font-bold text-zinc-400 uppercase tracking-wider">
            <span className="flex items-center gap-2 cursor-pointer hover:text-white">● EXAM GROUPS</span>
            <span className="flex items-center gap-2 cursor-pointer hover:text-white">📁 ACCESS VAULT</span>
            <span className="flex items-center gap-2 cursor-pointer hover:text-white">💬 TRANSMIT ALERTS</span>
          </div>
        </div>
        
        <div className="flex gap-6 text-[12px] font-bold text-zinc-400 uppercase tracking-wider">
          <span className="text-amber-400 border-b-2 border-amber-400 pb-1">DASHBOARD</span>
          <span className="cursor-pointer hover:text-white" onClick={() => router.push("/leaderboard")}>LEADERBOARD</span>
          <button onClick={() => router.push("/login")} className="text-zinc-400 hover:text-white">LOGOUT</button>
        </div>
      </nav>

      {/* Metrics Row */}
      <div className="flex justify-center gap-4 mb-16">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 w-36 text-center">
            <p className="text-[9px] font-bold text-zinc-500 mb-2">TOTAL MIN</p>
            <p className="text-2xl font-bold text-orange-500">1</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 w-36 text-center">
            <p className="text-[9px] font-bold text-zinc-500 mb-2">SESSIONS</p>
            <p className="text-2xl font-bold text-blue-500">1</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 w-36 text-center">
            <p className="text-[9px] font-bold text-zinc-500 mb-2">WARRIOR XP</p>
            <p className="text-2xl font-bold text-blue-400">1</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 w-36 text-center">
            <p className="text-[9px] font-bold text-zinc-500 mb-2">STREAK 🔥</p>
            <p className="text-2xl font-bold text-red-500">1 Days</p>
        </div>
      </div>

      {/* Timer Section */}
      <div className="flex flex-col items-center bg-zinc-900/30 border border-zinc-800 rounded-2xl p-16 max-w-3xl mx-auto">
        <div className="text-7xl font-mono tracking-widest mb-10 text-white">00 : 00 : 00</div>
        <button className="bg-zinc-50 text-black text-sm font-bold px-8 py-3 rounded-md hover:bg-zinc-200 transition">
          INITIALIZE SECURE TIMER
        </button>
      </div>

      {/* Bottom N Logo */}
      <div className="fixed bottom-6 left-6 w-10 h-10 border border-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
        N
      </div>
    </main>
  );
}