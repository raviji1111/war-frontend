"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

export default function Dashboard() {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState("");

  const saveNote = async () => {
    const token = localStorage.getItem("war_token");
    await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ title: "Quick Note", content: note })
    });
    alert("Note Saved!");
  };

  const sendFeedback = async () => {
    const token = localStorage.getItem("war_token");
    await fetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ category: "suggestion", message: feedback })
    });
    alert("Feedback Sent!");
    setFeedback("");
  };

  return (
    <main className="min-h-screen bg-[#050508] text-zinc-100 font-sans p-6">
      {/* Navbar exactly like screenshot */}
      <nav className="flex justify-between items-center mb-16 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold tracking-widest text-white">WAR PROJECT</h1>
          <div className="flex gap-6 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            <span className="cursor-pointer hover:text-white flex items-center gap-2">● EXAM GROUPS</span>
            <span className="cursor-pointer hover:text-white flex items-center gap-2">📁 ACCESS VAULT</span>
            <span className="cursor-pointer text-orange-500 flex items-center gap-2">💬 TRANSMIT ALERTS</span>
          </div>
        </div>
        <div className="flex gap-6 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
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
      <div className="flex flex-col items-center bg-zinc-900/30 border border-zinc-800 rounded-2xl p-16 max-w-3xl mx-auto mb-10">
        <div className="text-7xl font-mono tracking-widest mb-10 text-white">00 : 00 : 00</div>
        <button className="bg-zinc-50 text-black text-sm font-bold px-8 py-3 rounded-md hover:bg-zinc-200 transition">
          INITIALIZE SECURE TIMER
        </button>
      </div>

      {/* Notes & Feedback Section */}
      <div className="max-w-3xl mx-auto grid grid-cols-2 gap-6">
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-sm font-bold mb-3 text-zinc-400 uppercase">Quick Notes</h3>
            <textarea className="w-full bg-black p-3 rounded text-sm mb-2" rows={3} onChange={(e) => setNote(e.target.value)} />
            <button onClick={saveNote} className="w-full bg-blue-600 text-xs font-bold py-2 rounded">SAVE NOTE</button>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-sm font-bold mb-3 text-zinc-400 uppercase">Send Feedback</h3>
            <textarea className="w-full bg-black p-3 rounded text-sm mb-2" rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            <button onClick={sendFeedback} className="w-full bg-green-600 text-xs font-bold py-2 rounded">SEND FEEDBACK</button>
        </div>
      </div>
    </main>
  );
}