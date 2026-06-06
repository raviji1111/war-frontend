"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  // --- AI CHAT STATES (Added) ---
  const [aiMsg, setAiMsg] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

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

  // --- AI CHAT LOGIC (Added) ---
  // dashboard/page.tsx mein askKimi function replace karo
  const askKimi = async () => {
    if (!aiMsg) return;
    setIsAiLoading(true);
    try {
      // Yahan URL check karo: /api/kimi-chat
      const res = await fetch("https://war-backend-1.onrender.com/api/kimi-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: aiMsg }),
      });
      const data = await res.json();
      setAiResponse(data.choices[0].message.content);
    } catch (e) {
      setAiResponse("Backend connection error. Check Render logs.");
    } finally {
      setIsAiLoading(false);
    }
  };

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

      {/* BUTTONS: Timer + AI Chat Toggle */}
      {!isActive && (
        <div className="flex gap-4 relative z-10">
            <button onClick={toggleTimer} className="bg-white text-black font-bold px-8 py-3 rounded hover:bg-zinc-200 transition">
              INITIALIZE SECURE TIMER
            </button>
            <button onClick={() => setShowChat(!showChat)} className="bg-zinc-800 text-white font-bold px-8 py-3 rounded hover:bg-zinc-700 transition">
              {showChat ? "CLOSE KIMI" : "KIMI AI CHAT"}
            </button>
        </div>
      )}

      {/* AI CHAT BOX (Added) */}
      {showChat && !isActive && (
        <div className="relative z-10 mt-10 w-full max-w-lg bg-zinc-900/90 p-6 rounded-lg border border-zinc-700">
          <textarea
            className="w-full bg-black p-3 text-white border border-zinc-700 rounded mb-4"
            placeholder="Ask Kimi something..."
            onChange={(e) => setAiMsg(e.target.value)}
          />
          <button onClick={askKimi} className="w-full bg-blue-600 py-2 rounded font-bold hover:bg-blue-700">
            {isAiLoading ? "PROCESSING..." : "ASK KIMI"}
          </button>
          <div className="mt-4 text-zinc-300 text-sm overflow-auto h-32 p-2 bg-black rounded border border-zinc-800">
            {aiResponse || "Waiting for Kimi..."}
          </div>
        </div>
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



