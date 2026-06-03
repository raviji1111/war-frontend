"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Note {
  id: number;
  title: string;
  content: string;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 1. Fetch All Notes on Load
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("war_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("${API_BASE_URL}/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error("Failed to fetch notes.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Save a New Note
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setMessage("⚠️ Title and Content are required!");
      return;
    }

    setMessage("Saving to vault...");
    const token = localStorage.getItem("war_token");

    try {
      const response = await fetch("${API_BASE_URL}/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        setMessage("✅ Note securely saved!");
        setTitle("");
        setContent("");
        fetchNotes(); // Refresh the list
      } else {
        setMessage("❌ Failed to save note.");
      }
    } catch (error) {
      setMessage("❌ Connection error.");
    }
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 p-6 font-sans text-slate-200">
      
      {/* HEADER */}
      <div className="w-full max-w-4xl flex justify-between items-center mt-6 mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          WAR Vault (Notes)
        </h1>
        <button 
          onClick={() => router.push("/dashboard")}
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-700 active:scale-95"
        >
          BACK TO DASHBOARD
        </button>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT PANEL: Create Note Form */}
        <div className="col-span-1 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
          <h2 className="text-lg font-bold text-slate-300 mb-2">Create New Intel</h2>
          
          <form onSubmit={handleSaveNote} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Note Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            <textarea
              placeholder="Write your study material or plans here..."
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
            />
            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-blue-600 p-3 font-bold text-white hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-600/30"
            >
              SAVE TO VAULT
            </button>
          </form>
          
          {message && (
            <div className="mt-2 text-center text-sm font-medium text-emerald-400">
              {message}
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Saved Notes List */}
        <div className="col-span-2 flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl h-[600px] overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-300 mb-6 flex items-center justify-between">
            Saved Materials
            <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full">
              {notes.length} Records
            </span>
          </h2>

          {isLoading ? (
            <div className="text-center text-slate-500 mt-10">Decrypting files...</div>
          ) : notes.length === 0 ? (
            <div className="text-center text-slate-500 mt-10">No intel found. Start writing your notes.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {notes.map((note) => (
                <div key={note.id} className="rounded-xl border border-slate-700/50 bg-slate-950 p-5 hover:border-slate-600 transition-colors">
                  <h3 className="text-xl font-bold text-blue-400 mb-2">{note.title}</h3>
                  <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}