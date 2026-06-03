"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

export default function Dashboard() {
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [feedback, setFeedback] = useState("");

  // 1. Fetch Notes on Load
  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    const token = localStorage.getItem("war_token");
    if (!token) return;
    const res = await fetch(`${API_BASE_URL}/notes`, { headers: { "Authorization": `Bearer ${token}` } });
    const data = await res.json();
    if (res.ok) setNotes(data.notes || []);
  };

  // 2. Save Note
  const handleSaveNote = async () => {
    const token = localStorage.getItem("war_token");
    await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ title: noteTitle, content: noteContent })
    });
    setNoteTitle(""); setNoteContent(""); fetchNotes(); // Refresh
  };

  // 3. Send Feedback
  const handleSendFeedback = async () => {
    const token = localStorage.getItem("war_token");
    await fetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ category: "suggestion", message: feedback })
    });
    alert("Feedback sent!"); setFeedback("");
  };

  return (
    <main className="min-h-screen bg-[#050508] text-white pt-28 px-10">
      {/* Timer */}
      <div className="flex flex-col items-center justify-center mb-20">
        <div className="text-7xl font-mono tracking-widest mb-10">00 : 00 : 00</div>
        <button className="bg-white text-black font-bold px-8 py-3 rounded-sm hover:bg-zinc-200 transition">INITIALIZE SECURE TIMER</button>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 gap-8 mb-20">
        <div className="bg-[#111111] border border-zinc-800 p-6">
            <h3 className="text-xs font-bold text-zinc-500 mb-4 uppercase">QUICK NOTES</h3>
            <input className="w-full bg-black text-white p-3 mb-2 border border-zinc-800" placeholder="Title" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
            <textarea className="w-full bg-black text-white p-3 h-24 mb-4 border border-zinc-800" placeholder="Content..." value={noteContent} onChange={(e) => setNoteContent(e.target.value)} />
            <button onClick={handleSaveNote} className="w-full bg-blue-600 text-xs font-bold py-3 uppercase hover:bg-blue-700">SAVE NOTE</button>
            
            {/* View Notes */}
            <div className="mt-6 space-y-2">
                {notes.map((n, i) => (
                    <div key={i} className="bg-black p-3 border border-zinc-800">
                        <h4 className="font-bold text-blue-400">{n.title}</h4>
                        <p className="text-xs text-zinc-400">{n.content}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-[#111111] border border-zinc-800 p-6">
            <h3 className="text-xs font-bold text-zinc-500 mb-4 uppercase">SEND FEEDBACK</h3>
            <textarea className="w-full bg-black text-white p-3 h-32 mb-4 border border-zinc-800" placeholder="Type here..." value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            <button onClick={handleSendFeedback} className="w-full bg-green-600 text-xs font-bold py-3 uppercase hover:bg-green-700">SEND FEEDBACK</button>
        </div>
      </div>
    </main>
  );
}