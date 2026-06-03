"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Group {
  id: number;
  name: string;
  description: string;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`);
      if (response.ok) {
        const data = await response.json();
        setGroups(data.groups || []);
      }
    } catch (error) {
      console.error("Failed to fetch groups.");
    }
  };

  const handleJoinGroup = async (groupId: number) => {
    const token = localStorage.getItem("war_token");
    if (!token) {
      setMessage("❌ Access Denied. Login first.");
      return;
    }

    setMessage("Processing Request...");
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/join`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setMessage(data.message);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Connection lost.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 p-6 font-sans text-slate-200">
      
      {/* HEADER */}
      <div className="w-full max-w-4xl flex justify-between items-center mt-6 mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          WAR Communities
        </h1>
        <button 
          onClick={() => router.push("/dashboard")}
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-700 active:scale-95"
        >
          BACK TO DASHBOARD
        </button>
      </div>

      {message && (
        <div className="mb-6 rounded-lg bg-blue-900/30 border border-blue-800 p-3 text-center text-sm font-medium text-blue-300 w-full max-w-4xl">
          {message}
        </div>
      )}

      {/* GROUPS LIST */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.length === 0 ? (
          <div className="col-span-2 text-center text-slate-500 mt-10">
            No active groups found. The Admin is preparing the battlefield.
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-200 mb-2">{group.name}</h2>
                <p className="text-slate-400 text-sm mb-6">{group.description}</p>
              </div>
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => handleJoinGroup(group.id)}
                  className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 active:scale-95 transition-all shadow-lg"
                >
                  JOIN BATTALION
                </button>
                <button 
  onClick={() => router.push(`/groups/${group.id}`)}
  className="flex-1 rounded-lg border border-blue-700 bg-blue-900/30 py-2.5 text-sm font-bold text-blue-300 hover:bg-blue-800/50 active:scale-95 transition-all cursor-pointer text-center"
>
  
                  VIEW INTEL
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}