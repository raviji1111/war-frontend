"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  // 1. Fullscreen Toggle
  const toggleTimer = async () => {
    if (!isActive) {
      try {
        await document.documentElement.requestFullscreen();
        setIsActive(true);
      } catch (e) {
        alert("Full-screen mode is required to start.");
      }
    } else {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setIsActive(false);
    }
  };

  // 2. Timer Logic
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

  // 3. Security: ESC Key, Fullscreen Exit, Tab Switch, Refresh Block
  useEffect(() => {
    audioRef.current = new Audio('/alert.mp3');

    const triggerAlarm = () => {
        audioRef.current?.play().catch(e => console.log("Audio blocked"));
        alert("SECURITY BREACH! Stay in full-screen mode!");
    };

    // A. Detect Fullscreen Exit
    const handleFullscreenChange = () => {
      if (isActive && !document.fullscreenElement) {
        triggerAlarm();
      }
    };

    // B. Detect ESC Key (Backup)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isActive) {
        if (e.key === "Escape" || e.key === "F5" || (e.ctrlKey && (e.key === "r" || e.key === "w" || e.key === "t"))) {
          e.preventDefault();
          triggerAlarm();
        }
      }
    };

    // C. Tab Switch Detection
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

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isActive]);

  const handleAutoExit = () => {
    localStorage.setItem("timer_active", "false");
    if (document.fullscreenElement) document.exitFullscreen();
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1497633762265-9d176722d3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center flex flex-col items-center justify-center text-white relative">
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="relative z-10 text-7xl font-mono tracking-widest mb-10 text-zinc-100">
        {new Date(seconds * 1000).toISOString().substr(11, 8)}
      </div>

      {!isActive && (
        <button onClick={toggleTimer} className="relative z-10 bg-white text-black font-bold px-8 py-3 rounded hover:bg-zinc-200 transition">
          INITIALIZE SECURE TIMER
        </button>
      )}

      {seconds >= 2700 && (
        <button onClick={handleAutoExit} className="relative z-10 bg-red-600 text-white font-bold px-8 py-3 rounded animate-bounce">
          EXIT EXAM
        </button>
      )}

      {isActive && seconds < 2700 && (
        <p className="relative z-10 mt-6 text-red-500 font-bold animate-pulse uppercase tracking-widest text-sm">
          ⚠️ LOCKDOWN ACTIVE: Full-screen enforced.
        </p>
      )}
    </main>
  );
}