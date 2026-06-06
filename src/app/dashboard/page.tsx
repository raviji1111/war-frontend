"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  // AI Chat & Vision States
  const [aiMsg, setAiMsg] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  // File Handle Logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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

  // --- TACTICAL VISION LOGIC ---
  const askKimi = async () => {
    setIsAiLoading(true);
    const base64 = image ? image.split(',')[1] : null;

    try {
      const res = await fetch("https://war-backend-1.onrender.com/api/kimi-vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: aiMsg, image: base64 }),
      });
      const data = await res.json();
      setAiResponse(data.choices[0].message.content);
    } catch (e) {
      setAiResponse("System Error: Vision module offline.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // 3. Security (Same as before)
  useEffect(() => {
    audioRef.current = new Audio('/alert.mp3');
    const triggerAlarm = () => { audioRef.current?.play().catch(e => console.log("Audio blocked")); alert("SECURITY BREACH!"); };
    const handleFullscreenChange = () => { if (isActive && !document.fullscreenElement) triggerAlarm(); };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isActive]);

  return (
    <main className="min-h-screen bg-black text-white p-6 font-mono">
      <div className="flex flex-col items-center justify-center">
        {/* Timer */}
        <div className="text-7xl font-bold tracking-widest mb-10 text-green-500">
          {new Date(seconds * 1000).toISOString().substr(11, 8)}
        </div>

        {/* Action Buttons */}
        {!isActive && (
          <div className="flex gap-4 mb-10">
            <button onClick={toggleTimer} className="bg-green-900 border border-green-500 text-green-400 font-bold px-8 py-3 rounded hover:bg-green-800 transition">
              INITIALIZE SECURE TIMER
            </button>
            <button onClick={() => setShowChat(!showChat)} className="bg-zinc-800 border border-zinc-600 px-8 py-3 rounded hover:bg-zinc-700 transition">
              {showChat ? "CLOSE TACTICAL AI" : "KIMI VISION AI"}
            </button>
          </div>
        )}

        {/* TACTICAL CHAT BOX */}
        {showChat && !isActive && (
          <div className="w-full max-w-2xl bg-black border border-green-900 p-6 rounded-lg shadow-[0_0_15px_rgba(21,128,61,0.3)]">
            <h3 className="text-green-500 mb-4 uppercase text-sm font-bold">// COMMAND INTERFACE</h3>
            
            <input type="file" onChange={handleFileChange} className="mb-4 block w-full text-sm text-zinc-400 file:bg-green-900 file:text-white file:border-0 file:px-4 file:py-2" />
            {image && <img src={image} className="h-32 w-auto mb-4 border border-green-800" />}
            
            <textarea
              className="w-full bg-zinc-950 p-4 text-white border border-green-800 rounded focus:border-green-500 outline-none"
              placeholder="Analyze tactical data or ask..."
              onChange={(e) => setAiMsg(e.target.value)}
            />
            
            <button onClick={askKimi} className="mt-4 w-full bg-green-700 py-3 rounded font-bold hover:bg-green-600 transition">
              {isAiLoading ? "PROCESSING..." : "EXECUTE ANALYSIS"}
            </button>

            <div className="mt-6 text-zinc-300 text-sm h-48 overflow-auto bg-black p-4 border border-zinc-800">
              {aiResponse || "System waiting for input..."}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}