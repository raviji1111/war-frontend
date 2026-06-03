"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Timer ki logic
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Time ko HH : MM : SS format mein convert karne ke liye
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${h} : ${m} : ${s}`;
  };

  return (
    // Classic Dark Gradient Background
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black text-white font-sans flex flex-col items-center justify-center">
      
      <div className="text-7xl font-mono tracking-widest mb-10 text-zinc-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
        {formatTime(seconds)}
      </div>
      
      <button 
        onClick={() => setIsActive(!isActive)}
        className={`${
          isActive ? "bg-red-600 hover:bg-red-700" : "bg-white hover:bg-zinc-200"
        } text-black font-bold px-8 py-3 rounded-sm transition-all duration-300 shadow-lg`}
      >
        {isActive ? "STOP SECURE TIMER" : "INITIALIZE SECURE TIMER"}
      </button>
      
      <p className="mt-4 text-zinc-500 text-xs uppercase tracking-widest">
        {isActive ? "System Active" : "System Standby"}
      </p>
    </main>
  );
}