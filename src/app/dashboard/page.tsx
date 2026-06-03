"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Dynamic API URL setup
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

export default function Dashboard() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#050508] text-white font-sans p-8">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-16 border-b border-zinc-800 pb-6">
        <h1 className="text-2xl font-bold tracking-widest text-white">WAR PROJECT</h1>
        <div className="flex gap-6 text-sm font-bold text-zinc-400">
          <span className="cursor-pointer">EXAM GROUPS</span>
          <span className="cursor-pointer">ACCESS VAULT</span>
          <span className="cursor-pointer text-orange-500">TRANSMIT ALERTS</span>
        </div>
        <div className="flex gap-4 text-sm font-bold">
          <span className="text-amber-400 underline underline-offset-8">DASHBOARD</span>
          <span className="cursor-pointer">LEADERBOARD</span>
          <button onClick={() => router.push("/login")} className="bg-zinc-800 px-4 py-1 rounded">LOGOUT</button>
        </div>
      </nav>

      {/* Metrics Row */}
      <div className="flex justify-center gap-6 mb-12">
        {[
          { label: "TOTAL MIN", value: "1", color: "text-amber-500" },
          { label: "SESSIONS", value: "1", color: "text-blue-500" },
          { label: "WARRIOR XP", value: "1", color: "text-blue-400" },
          { label: "STREAK 🔥", value: "1 Days", color: "text-red-500" },
        ].map((item, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-32 text-center">
            <p className="text-[10px] font-bold text-zinc-500 mb-2">{item.label}</p>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Timer Section */}
      <div className="flex flex-col items-center bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 max-w-3xl mx-auto">
        <div className="text-7xl font-mono tracking-widest mb-8">00 : 00 : 00</div>
        <button className="bg-white text-black font-bold px-8 py-3 rounded-lg hover:bg-zinc-200 transition">
          INITIALIZE SECURE TIMER
        </button>
      </div>
    </main>
  );
}