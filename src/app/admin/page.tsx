"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

export default function AdminRoom() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [banId, setBanId] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("war_token");
    if (!token) { setError("Login required"); return; }
    
    try {
      // 1. Fetch Metrics
      const mRes = await fetch(`${API_BASE_URL}/admin/dashboard`, { headers: { "Authorization": `Bearer ${token}` } });
      const mData = await mRes.json();
      if (mRes.ok) setMetrics(mData.metrics);

      // 2. Fetch Feedbacks
      const fRes = await fetch(`${API_BASE_URL}/admin/feedbacks`, { headers: { "Authorization": `Bearer ${token}` } });
      const fData = await fRes.json();
      if (fRes.ok) setFeedbacks(fData.feedbacks || []);
      
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleBan = async () => {
    const token = localStorage.getItem("war_token");
    await fetch(`${API_BASE_URL}/admin/users/${banId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    alert("User Banned");
    fetchData();
  };

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-200">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold text-red-500">WAR ROOM ADMIN</h1>
        <button onClick={() => router.push("/dashboard")} className="bg-zinc-800 px-4 py-2 rounded">BACK TO DASHBOARD</button>
      </div>

      {!metrics ? (
        <div className="text-center mt-20 animate-pulse text-zinc-500">Loading System...</div>
      ) : (
        <div className="space-y-8">
          {/* Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <h3 className="text-zinc-400">Total Users</h3>
              <p className="text-4xl font-bold">{metrics.total_users}</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <h3 className="text-zinc-400">Study Sessions</h3>
              <p className="text-4xl font-bold">{metrics.total_study_sessions}</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <h3 className="text-zinc-400">Notes Saved</h3>
              <p className="text-4xl font-bold">{metrics.total_notes_saved}</p>
            </div>
          </div>

          {/* Ban Hammer & Tools */}
          <div className="bg-red-950/10 p-6 rounded-xl border border-red-900/30">
            <h2 className="text-xl font-bold mb-4 text-red-500">Ban Hammer</h2>
            <div className="flex gap-4">
              <input className="bg-black p-2 border border-zinc-700 rounded w-64" value={banId} onChange={(e) => setBanId(e.target.value)} placeholder="Enter User ID" />
              <button onClick={handleBan} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-bold">BAN USER</button>
            </div>
          </div>

          {/* Feedback Table */}
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-bold mb-4">Live Feedback/Bugs</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="text-zinc-500 border-b border-zinc-800"><th className="pb-2">User</th><th className="pb-2">Category</th><th className="pb-2">Message</th></tr></thead>
                <tbody>
                  {feedbacks.map((fb, i) => (
                    <tr key={i} className="border-b border-zinc-800">
                      <td className="py-3">{fb.username}</td>
                      <td className="py-3 text-red-400 uppercase text-xs">{fb.category}</td>
                      <td className="py-3">{fb.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}