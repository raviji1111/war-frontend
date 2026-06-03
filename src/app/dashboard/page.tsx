"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

const getErrorMessage = (error: any) => {
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return "❌ COMMAND CENTER OFFLINE: Python engine is not responding.";
  }
  return "❌ SYSTEM ERROR: The battlefield is unstable. Try again.";
};

export default function Dashboard() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [isAutosaved, setIsAutosaved] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false); 
  const [isLoading, setIsLoading] = useState(true); 
  
  // 🔥 Feedback System Modal States
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [stats, setStats] = useState({ 
    total_minutes: 0, 
    total_sessions: 0,
    email: "",                
    xp: 0,                    
    streak: 0,                
    quiz_stats: { total_attempted: 0, correct: 0, wrong: 0, accuracy_percent: 0 }
  });

  const router = useRouter(); 

  // STRICT AUTHENTICATION CHECKER
  useEffect(() => {
    const token = localStorage.getItem("war_token");
    if (!token) {
      setIsAuthorized(false);
      setIsLoading(false);
      router.push("/login"); 
    } else {
      setIsAuthorized(true);
      fetchStats();
    }
  }, [router]);

  // NAVBAR TOGGLE ENGINE: Spacing layout algorithms
  useEffect(() => {
    if (!isAuthorized) return;
    const globalNavs = document.querySelectorAll("header, nav, [class*='navbar']");
    globalNavs.forEach((nav) => {
      if (nav.id !== "local-war-navbar") {
        if (stats.email === "ravik61285@gmail.com") {
          (nav as HTMLElement).style.display = ""; 
        } else if (stats.email && stats.email !== "ravik61285@gmail.com") {
          (nav as HTMLElement).style.display = "none"; 
        }
      }
    });
  }, [stats.email, isAuthorized]);

  // WINDOW CLOSE INTERCEPTION (Hard-block browser exit)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning && seconds < 2700) {
        e.preventDefault();
        e.returnValue = "🛑 UN-AUTHORIZED EXIT DETECTED: Lockdown is active for 45 minutes!";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isRunning, seconds]);

  // FULLSCREEN CHEATING DETECTION
  useEffect(() => {
    const handleFullscreenChange = () => {
      const audio = document.getElementById("war-alarm") as HTMLAudioElement;
      if (!document.fullscreenElement && isRunning && seconds < 2700) {
        if (audio) {
          audio.muted = false;
          audio.play().catch(err => console.log("Alarm blocked by gesture"));
        }
        setMessage("🚨 SECURITY BREACH: Fullscreen breached! Return to Fullscreen immediately!");
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isRunning, seconds]);

  // AUTOMATIC PROGRESS SYNC ENGINE
  useEffect(() => {
    if (seconds === 2700 && !isAutosaved) {
      triggerBackgroundAutoSave(45);
      setIsAutosaved(true);
    } else if (seconds > 2700 && seconds % 60 === 0) {
      triggerBackgroundAutoSave(Math.floor(seconds / 60));
    }
  }, [seconds, isAutosaved]);

  const triggerBackgroundAutoSave = async (minutes: number) => {
    const token = localStorage.getItem("war_token");
    if (!token) return;
    try {
      const todayDate = new Date().toISOString().split('T')[0];
      const response = await fetch("${API_BASE_URL}/study-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ duration_minutes: minutes, date: todayDate }),
      });
      if (response.ok) {
        setMessage(`🔄 live AUTO-SAVE: ${minutes} Mins uploaded securely!`);
        fetchStats(); 
      }
    } catch (error) {
      console.error("Background auto-save failed", error);
    }
  };

  // INITIALIZE MILITARY-GRADE LOCKDOWN
  const startStrictLockdown = () => {
    setIsFeedbackOpen(false); // Lockdown shuru hote hi agar feedback khula hai toh band karo
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        console.log("Fullscreen restriction handled");
      });
    }

    const audio = document.getElementById("war-alarm") as HTMLAudioElement;
    if (audio) {
      audio.muted = true; 
      audio.loop = true;  
      audio.play().catch(e => console.log("Audio pipeline loaded"));
    }
    setIsRunning(true);
    setMessage("⚔️ HARD LOCKDOWN INITIALIZED: Screen locked for 45 minutes!");
  };

  // ANTI-CHEAT TAB SWITCH DETECTOR
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = document.getElementById("war-alarm") as HTMLAudioElement;
      if (document.hidden && isRunning) {
        if (audio) {
          audio.muted = false; 
          audio.play().catch(() => {}); 
        }
        setMessage("⚠️ SECURITY BREACH: Tab switch detected during focus loop!"); 
      } else if (!document.hidden && audio) { 
        audio.muted = true; 
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isRunning]);

  // Clock Engine Interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const fetchStats = async () => {
    const token = localStorage.getItem("war_token");
    if (!token) return;
    try {
      const res = await fetch("${API_BASE_URL}/analytics", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats({
          total_minutes: data.total_study_minutes ?? data.total_minutes ?? 0,
          total_sessions: data.total_sessions ?? 0,
          email: data.email ?? "",
          xp: data.xp ?? 0,              
          streak: data.streak ?? 0,      
          quiz_stats: data.quiz_stats ?? { total_attempted: 0, correct: 0, wrong: 0, accuracy_percent: 0 }
        });
        setIsLoading(false);
      }
    } catch (e) { 
      console.error(e);
      setIsLoading(false);
    }
  };

  // 🔥 TRANSMIT FEEDBACK HANDLER: API integration
  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) {
      setFeedbackMessage("⚠️ System requires a message before transmission!");
      return;
    }
    const token = localStorage.getItem("war_token");
    setFeedbackMessage("Transmitting logs to the high command...");
    try {
      const response = await fetch("${API_BASE_URL}/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: feedbackText })
      });
      if (response.ok) {
        setFeedbackMessage("✅ ALERT SECURELY TRANSMITTED: Admin has been notified!");
        setFeedbackText("");
        setTimeout(() => {
          setIsFeedbackOpen(false);
          setFeedbackMessage("");
        }, 2000);
      } else {
        throw new Error("Transmission failed");
      }
    } catch (error) {
      setFeedbackMessage("❌ FAILURE: Secure link compromised. Try again.");
    }
  };

  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");

  const resetLockdownSession = () => {
    setIsRunning(false);
    setSeconds(0);
    setIsAutosaved(false);
    setMessage("✅ Mission Accompleted! Device Released.");
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    fetchStats();
  };

  const handleLogout = () => {
    localStorage.removeItem("war_token");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400 font-mono text-xs tracking-widest uppercase">
        Checking clearance credentials...
      </main>
    );
  }

  if (!isAuthorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-rose-500 font-mono text-xs tracking-widest uppercase">
        🛑 ACCESS DENIED: Redirecting to login terminal...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 p-6 font-sans text-slate-200 relative pt-3 select-none">
      
      {/* 🔊 AUDIO ENGINE CONTROLLER */}
      <audio id="war-alarm" src="/alarm.mp3" preload="auto"></audio>

      {/* 🚨 THE EXCLUSIVE IRON LAYER LOCKDOWN OVERLAY (Blocks everything when running) */}
      {isRunning && seconds < 2700 && (
        <div 
          className="fixed inset-0 bg-slate-950/90 z-[99999] flex flex-col items-center justify-center p-4 cursor-none select-none animate-fadeIn"
          onClick={(e) => {
            e.preventDefault();
            setMessage("🛑 SYSTEM LOCKED: Absolute focus mandatory for 45 minutes!");
          }}
        >
          <div className="text-center max-w-xl flex flex-col items-center">
            <div className="text-xs font-black text-rose-500 tracking-widest uppercase bg-rose-950/40 border border-rose-900 px-4 py-1.5 rounded-full mb-8 animate-pulse">
              🔒 STAGE 1 FOCUS LOCKDOWN ENABLED
            </div>
            
            <div className="flex gap-4 items-center justify-center py-6 mb-6">
              <div className="flex flex-col"><span className="text-7xl font-mono font-black text-white">{h}</span><span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Hrs</span></div>
              <span className="text-5xl text-slate-800 font-mono">:</span>
              <div className="flex flex-col"><span className="text-7xl font-mono font-black text-white">{m}</span><span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Min</span></div>
              <span className="text-5xl text-slate-800 font-mono">:</span>
              <div className="flex flex-col"><span className="text-7xl font-mono font-black text-white">{s}</span><span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Sec</span></div>
            </div>

            <p className="text-sm font-semibold text-slate-400 tracking-wide mb-2">
              All interactions, buttons, and system exits are completely frozen.
            </p>
            <p className="text-[11px] font-bold text-amber-500 tracking-widest uppercase">
              Remaining time: {Math.ceil((2700 - seconds) / 60)} minutes to automatic progression sync.
            </p>
            
            {message && <div className="mt-8 text-xs font-black text-rose-400 bg-rose-950/20 border border-rose-900/40 px-4 py-2 rounded-lg tracking-wide">{message}</div>}
          </div>
        </div>
      )}

      {/* 🔮 NEW MODAL OVERLAY FOR TRANSMIT ALERTS (FEEDBACK SYSTEM) */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[50000] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-6 rounded-2xl shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-black tracking-widest text-slate-200 uppercase">💬 TRANSMIT LIVE ALERTS / FEEDBACK</span>
              <button 
                onClick={() => { setIsFeedbackOpen(false); setFeedbackMessage(""); }} 
                className="text-slate-500 hover:text-slate-200 text-xs font-bold tracking-widest"
              >
                [CLOSE]
              </button>
            </div>
            
            <textarea 
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Report bugs, UI issues, or submit your recommendations directly to the commander..."
              className="w-full min-h-[120px] bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-sans text-xs focus:outline-none focus:border-amber-500 tracking-wide resize-none placeholder-slate-600"
            />
            
            {feedbackMessage && <div className="text-[10px] font-bold text-amber-400 tracking-wide">{feedbackMessage}</div>}

            <div className="flex justify-end gap-3 mt-2">
              <button 
                onClick={() => { setIsFeedbackOpen(false); setFeedbackMessage(""); }}
                className="px-4 py-2 rounded-lg text-[10px] font-black tracking-widest text-slate-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all uppercase"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendFeedback}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black tracking-widest transition-all uppercase"
              >
                SUBMIT LOGS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPGRADED NAVBAR (With Transmit Alerts sitting proudly at the top layout) */}
      {stats.email && stats.email !== "ravik61285@gmail.com" && (
        <div id="local-war-navbar" className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center border-b border-slate-900 pb-4 mb-8 gap-4 mt-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-[11px] font-black tracking-widest uppercase">
            <div className="text-2xl font-black tracking-wider text-slate-100 mr-2"><span className="text-amber-500">WAR</span> Project</div>
            <span onClick={() => router.push("/groups")} className="text-slate-400 hover:text-emerald-400 cursor-pointer">🌍 EXAM GROUPS</span>
            <span onClick={() => router.push("/notes")} className="text-slate-400 hover:text-blue-400 cursor-pointer">📂 ACCESS VAULT</span>
            {/* 🔥 NEw TOP ACCESSIBLE BUTTON */}
            <span 
              onClick={() => setIsFeedbackOpen(true)} 
              className="text-amber-500/80 hover:text-amber-400 cursor-pointer bg-amber-500/5 border border-amber-500/20 px-2 py-0.5 rounded transition-all font-bold"
            >
              💬 TRANSMIT ALERTS
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-black tracking-widest text-slate-400 uppercase">
            <span className="text-amber-400 border-b-2 border-amber-500 pb-1">DASHBOARD</span>
            <span onClick={() => router.push("/leaderboard")} className="hover:text-slate-100 cursor-pointer">LEADERBOARD</span>
            <button onClick={handleLogout} className="rounded bg-slate-900 border border-slate-800 px-3 py-1.5 text-red-400 font-black tracking-widest text-[10px]">LOGOUT</button>
          </div>
        </div>
      )}

      {/* METRICS ROW BLOCKS */}
      <div className="flex flex-wrap justify-center gap-4 mb-10 w-full max-w-6xl">
        <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-xl text-center w-28">
          <div className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">Total Min</div>
          <div className="text-lg font-mono font-bold text-amber-500">{stats.total_minutes}</div>
        </div>
        <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-xl text-center w-28">
          <div className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">Sessions</div>
          <div className="text-lg font-mono font-bold text-blue-500">{stats.total_sessions}</div>
        </div>
        <div className="bg-slate-900/30 border border-indigo-950 p-4 rounded-xl text-center w-28 shadow-lg">
          <div className="text-indigo-400 text-[9px] uppercase font-bold tracking-widest">Warrior XP</div>
          <div className="text-lg font-mono font-bold text-indigo-400">{stats.xp}</div>
        </div>
        <div className="bg-slate-900/30 border border-rose-950 p-4 rounded-xl text-center w-28 shadow-lg">
          <div className="text-rose-400 text-[9px] uppercase font-bold tracking-widest">Streak 🔥</div>
          <div className="text-lg font-mono font-bold text-rose-400">{stats.streak} Days</div>
        </div>
      </div>

      {/* CORE TIMER DISPLAY BLOCK */}
      <div className="w-full max-w-4xl flex flex-col items-center">
        <div className="w-full flex flex-col items-center justify-center rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-xl p-8 shadow-2xl relative min-h-[310px]">
          
          {seconds >= 2700 && (
            <div className="absolute top-4 text-[10px] font-bold text-emerald-400 tracking-widest uppercase bg-emerald-950/30 border border-emerald-900/50 px-3 py-1 rounded-full">
              🔓 MISSION ACCOMPLISHED: Core Session Saved!
            </div>
          )}

          <div className="flex items-start justify-center gap-4 py-4 mt-2">
            <div><span className="font-mono text-7xl font-semibold text-white">{h}</span></div>
            <span className="text-6xl text-slate-700">:</span>
            <div><span className="font-mono text-7xl font-semibold text-white">{m}</span></div>
            <span className="text-6xl text-slate-700">:</span>
            <div><span className="font-mono text-7xl font-semibold text-white">{s}</span></div>
          </div>

          <div className="flex gap-4 w-full max-w-md mt-6">
            {!isRunning ? (
              <button 
                onClick={startStrictLockdown} 
                className="flex-1 rounded-xl bg-slate-100 py-3.5 text-sm font-bold text-slate-950 hover:bg-white transition-all active:scale-95 cursor-pointer"
              >
                INITIALIZE SECURE TIMER
              </button>
            ) : (
              <button 
                onClick={resetLockdownSession} 
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-sm font-bold text-slate-950 transition-all active:scale-95 cursor-pointer"
              >
                FINISH & EXIT LOCKDOWN
              </button>
            )}
          </div>
          
          {message && <div className="mt-4 text-center text-xs font-bold text-amber-500 tracking-wide">{message}</div>}
        </div>
      </div>
    </main>
  );
}