"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

export default function AdminRoom() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState("");
  const [banId, setBanId] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  // Function to fetch all data
  const fetchData = async () => {
    const token = localStorage.getItem("war_token");
    if (!token) {
      setError("Please login first.");
      return;
    }
    try {
      // Fetching Admin Dashboard Metrics
      const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setMetrics(data.metrics);
      else setError("Access Denied");
    } catch (err) {
      setError("System failure");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-200">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-red-500">The WAR Room</h1>
        <button onClick={() => router.push("/dashboard")} className="bg-zinc-800 p-2 rounded">BACK TO DASHBOARD</button>
      </div>

      {error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : metrics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Metrics Card */}
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-bold mb-4">System Intel</h2>
            <p>Total Users: {metrics.total_users}</p>
            <p>Study Sessions: {metrics.total_study_sessions}</p>
          </div>

          {/* Ban Hammer Section */}
          <div className="bg-red-950/20 p-6 rounded-xl border border-red-900">
            <h2 className="text-xl font-bold text-red-500 mb-4">Ban Hammer</h2>
            <div className="flex gap-2">
              <input 
                className="bg-black p-2 rounded text-white" 
                value={banId} 
                onChange={(e) => setBanId(e.target.value)} 
                placeholder="User ID" 
              />
              <button 
                onClick={async () => {
                  const token = localStorage.getItem("war_token");
                  await fetch(`${API_BASE_URL}/admin/users/${banId}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                  });
                  alert("Banned!");
                }}
                className="bg-red-600 px-4 py-2 rounded"
              >
                BANISH
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading System...</div>
      )}
    </main>
  );
}