"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  // 1. Timer Logic & Auto-Exit Status
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
        localStorage.setItem("timer_active", "true");
      }, 1000);
    } else {
      localStorage.setItem("timer_active", "false");
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // 2. Security: Shortcuts/Keys Blocking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isActive) {
        if (e.key === "F5" || (e.ctrlKey && (e.key === "r" || e.key === "w" || e.key === "t"))) {
          e.preventDefault();
          alert("Security Lock: You cannot refresh or exit during the exam!");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive]);

  // 3. Security: Tab Switch Detection (Audio)
  useEffect(() => {
    audioRef.current = new Audio('/alert.mp3'); // Ensure alert.mp3 is in /public folder

    const handleVisibilityChange = () => {
      if (isActive) {
        if (document.hidden) {
          audioRef.current?.play().catch(e => console.log("Audio blocked"));
        } else {
          audioRef.current?.pause();
          if (audioRef.current) audioRef.current.currentTime = 0;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isActive]);

  const handleAutoExit = () => {
    localStorage.setItem("timer_active", "false");
    router.push("/dashboard"); 
  };

  // 4. Timer Format
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${h} : ${m} : ${s}`;
  };

  return (
    <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1497633762265-9d176722d3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center flex flex-col items-center justify-center text-white relative">
      <div className="absolute inset-0 bg-black/80"></div>

      {/* Timer Display */}
      <div className="relative z-10 text-7xl font-mono tracking-widest mb-10 text-zinc-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
        {formatTime(seconds)}
      </div>

      {/* Initialize Button */}
      {!isActive && (
        <button 
          onClick={() => setIsActive(true)} 
          className="relative z-10 bg-white text-black font-bold px-8 py-3 rounded hover:bg-zinc-200 transition"
        >
          INITIALIZE SECURE TIMER
        </button>
      )}

      {/* Auto Exit Button (Visible only after 45 mins / 2700 seconds) */}
      {seconds >= 2700 && (
        <button 
          onClick={handleAutoExit} 
          className="relative z-10 bg-red-600 text-white font-bold px-8 py-3 rounded animate-bounce shadow-xl"
        >
          EXIT EXAM
        </button>
      )}

      {/* Security Warning */}
      {isActive && seconds < 2700 && (
        <p className="relative z-10 mt-6 text-red-500 font-bold animate-pulse uppercase tracking-widest text-sm">
          ⚠️ SECURE MODE: Do not switch tabs. Audio monitoring active.
        </p>
      )}
    </main>
  );
}