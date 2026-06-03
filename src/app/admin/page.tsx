"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

export default function AdminRoom() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Naya state add kiya

  const fetchData = async () => {
    const token = localStorage.getItem("war_token");
    if (!token) {
      console.log("Token missing!");
      return;
    }
    
    try {
      console.log("Fetching data from:", `${API_BASE_URL}/admin/dashboard`);
      const mRes = await fetch(`${API_BASE_URL}/admin/dashboard`, { 
        headers: { "Authorization": `Bearer ${token}` } 
      });
      const mData = await mRes.json();
      console.log("API Response:", mData); // Yeh console mein dikhega!

      if (mRes.ok) {
        setMetrics(mData.metrics);
        setLoading(false);
      } else {
        console.error("API Error:", mData);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="text-white p-20">Loading System... Check Console (F12) for logs!</div>;

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      <div className="bg-zinc-900 p-6 rounded">
        <h2 className="text-xl">Users: {metrics?.total_users || 0}</h2>
      </div>
    </main>
  );
}