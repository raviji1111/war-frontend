"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !email || !password) {
      setMessage("⚠️ Saari fields bharna zaroori hai!");
      return;
    }

    setIsLoading(true);
    setMessage("Registering warrior...");

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          username: username.toLowerCase().replace(/\s+/g, ""),
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Registration Successful! Tactical core initialized.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setMessage(`❌ ${data.detail || "Registration failed."}`);
      }
    } catch (error) {
      setMessage("❌ System Failure: Backend engine is offline.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 font-sans text-slate-200">
      
      {/* SECURITY LOCKDOWN NAVBAR: Guest mode mein baaki buttons hidden */}
      <nav className="fixed top-0 w-full p-6 flex justify-center">
        <div className="text-2xl font-black tracking-wider text-slate-100">
          <span className="text-amber-500">WAR</span> Project
        </div>
      </nav>

      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-xl shadow-2xl mt-12">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-blue-400">
            Enlist in WAR
          </h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            Create your tactical profile
          </p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5 ml-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-sm font-medium text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5 ml-1">Unique User ID</label>
            <input
              type="text"
              placeholder="e.g., warrior_99"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-sm font-medium text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-sm font-medium text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5 ml-1">Secret Cipher</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-sm font-medium text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-blue-500 active:scale-95 transition-all cursor-pointer"
          >
            {isLoading ? "INITIALIZING..." : "SIGN UP"}
          </button>
        </form>

        {message && (
          <div className="mt-5 text-center text-xs font-semibold text-indigo-400 tracking-wide bg-indigo-950/20 border border-indigo-900/30 rounded-lg p-2.5">
            {message}
          </div>
        )}

        <div className="mt-6 text-center text-xs text-slate-500 font-medium">
          Already have an operative account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-indigo-400 hover:underline cursor-pointer font-bold ml-0.5"
          >
            Log In
          </span>
        </div>
      </div>
    </main>
  );
}