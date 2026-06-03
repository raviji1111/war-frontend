"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

export default function Dashboard() {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState("");

  const sendFeedback = async () => {
    const token = localStorage.getItem("war_token");
    await fetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ category: "suggestion", message: feedback })
    });
    alert("Feedback sent!");
    setFeedback("");
  };

  return (
    <main className="min-h-screen bg-[#050508] text-white p-8">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-16 border-b border-zinc-800 pb-6">
        <h1 className="text-2xl font-bold tracking-widest">WAR PROJECT</h1>
        <div className="flex gap-6 text-sm font-bold text-zinc-400">
          <span className="cursor-pointer hover:text-white">EXAM GROUPS</span>
          <span className="cursor-pointer hover:text-white">ACCESS VAULT</span>
          <span className="cursor-pointer text-orange-500">TRANSMIT ALERTS</span>
        </div>
        <div className="flex gap-4 text-sm font-bold">
          <span className="text-amber-400 border-b-2 border-amber-400">DASHBOARD</span>
          <span className="cursor-pointer" onClick={() => router.push("/leaderboard")}>LEADERBOARD</span>
          <button onClick={() => router.push("/login")} className="bg-zinc-800 px-4 py-1 rounded">LOGOUT</button>
        </div>
      </nav>

      {/* Metrics & Timer */}
      <div className="flex justify-center gap-6 mb-12">
        {/* ... Metrics cards ... */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-32 text-center"><p className="text-xs text-zinc-500">STREAK 🔥</p><p className="text-xl font-bold text-red-500">1 Days</p></div>
      </div>

      <div className="flex flex-col items-center bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 max-w-3xl mx-auto mb-10">
        <div className="text-7xl font-mono mb-8">00 : 00 : 00</div>
        <button className="bg-white text-black font-bold px-8 py-3 rounded-lg">INITIALIZE SECURE TIMER</button>
      </div>

      {/* NEW: Notes & Feedback Section */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-xl font-bold mb-4">Quick Notes</h2>
          <textarea className="w-full bg-black p-3 rounded mb-2" rows={4} placeholder="Write something..." onChange={(e) => setNotes(e.target.value)} />
          <button className="bg-blue-600 px-4 py-2 rounded w-full">SAVE NOTE</button>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-xl font-bold mb-4">Send Feedback</h2>
          <textarea className="w-full bg-black p-3 rounded mb-2" rows={4} placeholder="Report a bug or suggestion..." value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          <button onClick={sendFeedback} className="bg-green-600 px-4 py-2 rounded w-full">SEND FEEDBACK</button>
        </div>
      </div>
    </main>
  );
}