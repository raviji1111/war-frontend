"use client";
import { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Backend se rank data laane ka function
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/leaderboard`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setLeaderboardData(data.leaderboard);
      } catch (err) {
        setError("❌ Database connection failed. Is the Python engine running?");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Rank ke hisaab se special color aur icon dene ka logic
  const getRankStyle = (rank: number) => {
    if (rank === 1) return { color: "text-amber-400", icon: "🏆", bg: "bg-amber-400/10 border-amber-400/30" };
    if (rank === 2) return { color: "text-slate-300", icon: "🥈", bg: "bg-slate-300/10 border-slate-300/30" };
    if (rank === 3) return { color: "text-orange-400", icon: "🥉", bg: "bg-orange-400/10 border-orange-400/30" };
    return { color: "text-slate-400", icon: "", bg: "bg-slate-900/50 border-slate-800/60" };
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 p-8 font-sans text-slate-200">
      
      {/* Header Section */}
      <div className="mb-12 mt-8 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600 drop-shadow-sm">
          The Battleground
        </h1>
        <p className="mt-3 text-sm font-bold tracking-widest text-slate-500 uppercase">
          War Project Global Leaderboard
        </p>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-amber-500"></div>
          <p className="mt-4 text-sm font-bold tracking-widest text-slate-400">CONNECTING TO DATABASE...</p>
        </div>
      )}

      {error && (
        <div className="mt-10 rounded-xl bg-red-950/50 border border-red-900 p-4 text-center text-red-400 font-medium">
          {error}
        </div>
      )}

      {/* The Leaderboard Table */}
      {!isLoading && !error && leaderboardData.length > 0 && (
        <div className="w-full max-w-3xl flex flex-col gap-3">
          
          {/* Table Headers */}
          <div className="grid grid-cols-12 gap-4 px-6 mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-7">Commander</div>
            <div className="col-span-3 text-right">Time Logged</div>
          </div>

          {/* List of Users */}
          {leaderboardData.map((user: any) => {
            const style = getRankStyle(user.rank);
            
            return (
              <div 
                key={user.email} 
                className={`grid grid-cols-12 gap-4 items-center rounded-xl border ${style.bg} px-6 py-5 backdrop-blur-md transition-all hover:scale-[1.01] hover:shadow-lg`}
              >
                {/* Rank & Medal */}
                <div className={`col-span-2 text-center text-xl font-black ${style.color}`}>
                  {user.rank} {style.icon}
                </div>
                
                {/* Email/Name */}
                <div className="col-span-7 font-mono text-sm tracking-wide text-slate-200 truncate">
                  {user.email}
                </div>
                
                {/* Time Studied */}
                <div className="col-span-3 text-right">
                  <span className="font-mono text-lg font-bold text-slate-300">
                    {user.total_minutes}
                  </span>
                  <span className="ml-1 text-[10px] uppercase font-bold tracking-widest text-slate-500">min</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* If database is completely empty */}
      {!isLoading && !error && leaderboardData.length === 0 && (
        <div className="mt-20 text-center text-slate-500 border border-slate-800 rounded-xl p-10 bg-slate-900/30">
          <p className="text-xl font-bold tracking-widest mb-2">NO DATA FOUND</p>
          <p className="text-sm">The battleground is quiet. Go to the Dashboard and start studying to claim Rank 1!</p>
        </div>
      )}

    </main>
  );
}