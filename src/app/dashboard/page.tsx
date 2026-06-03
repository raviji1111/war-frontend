"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // 1. Timer Logic
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

  // 2. SECURITY: Tab Switch Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        // Tab switch hote hi gana bajega
        const audio = new Audio('/alert.mp3'); // Make sure public folder mein alert.mp3 ho
        audio.play().catch(e => console.log("Audio blocked by browser"));
        alert("SECURITY BREACH! Tab switch mat karo!");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${h} : ${m} : ${s}`;
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black text-white font-sans flex flex-col items-center justify-center">
      
      {/* ⚠️ SECURITY: Timer chal raha hai toh Navbar/Exit links ko hide karne ke liye CSS use karo */}
      <div className={`text-7xl font-mono tracking-widest mb-10 text-zinc-100 ${isActive ? 'opacity-100' : 'opacity-90'}`}>
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

      {/* Security Info */}
      {isActive && (
        <p className="mt-6 text-red-500 font-bold animate-pulse uppercase tracking-widest text-sm">
          ⚠️ SECURE MODE ENABLED: Do not switch tabs.
        </p>
      )}
    </main>
  );
}