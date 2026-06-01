"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const parseBackendError = (data: any) => {
    if (data && data.detail) {
      if (Array.isArray(data.detail)) return data.detail[0].msg;
      return data.detail;
    }
    return "Unknown error occurred.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const endpoint = isLoginMode ? "http://127.0.0.1:8000/token" : "http://127.0.0.1:8000/signup";
    
    const payload = isLoginMode 
      ? new URLSearchParams({ username: email, password: password })
      : JSON.stringify({ name, username, email, password });

    const headers = isLoginMode 
      ? { "Content-Type": "application/x-www-form-urlencoded" }
      : { "Content-Type": "application/json" };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: payload
      });

      const data = await response.json();

      if (response.ok) {
        if (isLoginMode) {
          localStorage.setItem("war_token", data.access_token);
          setMessage("✅ Access Granted! Entering WAR room...");
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1500);
        } else {
          setMessage("✅ Registration Successful! Now log in.");
          setIsLoginMode(true);
          setName("");
          setUsername("");
        }
      } else {
        setMessage(`❌ Error: ${parseBackendError(data)}`);
      }
    } catch (error) {
      setMessage("❌ System Failure: Python engine is offline.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 font-sans text-slate-200">
      
      {/* 🛡️ YE NAVBAR SIRF LOGO DIKHAYEGA - KOI MENU LINKS NAHI */}
      <nav className="fixed top-0 w-full p-8 flex justify-start items-center">
        <div className="text-2xl font-black tracking-wider text-slate-100">
          <span className="text-amber-500">WAR</span> Project
        </div>
      </nav>

      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-xl shadow-2xl">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-blue-400">
            {isLoginMode ? "Forge Your Account" : "Enlist in WAR"}
          </h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            {isLoginMode ? "Join the ranks of the elite" : "Create your tactical profile"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLoginMode && (
            <>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5 ml-1">Full Name</label>
                <input type="text" placeholder="Enter your name..." value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-sm font-medium text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5 ml-1">Unique User ID</label>
                <input type="text" placeholder="e.g., warrior_99" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))} className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-sm font-medium text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-all" required />
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5 ml-1">Email Address</label>
            <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-sm font-medium text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-all" required />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5 ml-1">Secret Cipher</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-sm font-medium text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-all" required />
          </div>

          <button type="submit" disabled={isLoading} className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all cursor-pointer">
            {isLoading ? "INITIALIZING..." : isLoginMode ? "Log In" : "Create Account"}
          </button>
        </form>

        {message && (
          <div className="mt-5 text-center text-xs font-semibold text-indigo-400 tracking-wide bg-indigo-950/20 border border-indigo-900/30 rounded-lg p-2.5 whitespace-pre-wrap">
            {message}
          </div>
        )}

        <div className="mt-6 text-center text-xs text-slate-500 font-medium">
          {isLoginMode ? "Don't have an account?" : "Already have an operative account?"}{" "}
          <span onClick={() => { setIsLoginMode(!isLoginMode); setMessage(""); }} className="text-indigo-400 hover:underline cursor-pointer font-bold ml-0.5">
            {isLoginMode ? "Create Account" : "Log In"}
          </span>
        </div>
      </div>
    </main>
  );
}