"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    const token = localStorage.getItem("war_token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("war_token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  if (isAuthPage) {
    return (
      <nav className="fixed top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-6">
          <div className="text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">
            WAR Project
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Left Section: Logo + Features */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-default">
            <span className="text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">WAR</span>
            <span className="text-xl font-bold tracking-wide text-slate-200">Project</span>
          </div>

          {/* Nav Features (Groups, Vault, Alerts) */}
          <div className="flex gap-6 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
            <span className="cursor-pointer hover:text-white flex items-center gap-2">● EXAM GROUPS</span>
            <span className="cursor-pointer hover:text-white flex items-center gap-2">📁 ACCESS VAULT</span>
            <span className="cursor-pointer text-orange-500 hover:text-orange-400 flex items-center gap-2">💬 TRANSMIT ALERTS</span>
          </div>
        </div>
        
        {/* Right Section: Navigation Links */}
        <div className="flex items-center gap-6 text-xs font-bold tracking-widest text-slate-400">
          <Link href="/dashboard" className={`transition-all hover:text-amber-400 ${pathname === '/dashboard' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : ''}`}>DASHBOARD</Link>
          <Link href="/leaderboard" className={`transition-all hover:text-amber-400 ${pathname === '/leaderboard' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : ''}`}>LEADERBOARD</Link>
          <Link href="/admin" className={`transition-all hover:text-red-500 ${pathname === '/admin' ? 'text-red-500 border-b-2 border-red-500 pb-1' : ''}`}>ADMIN</Link>
          
          {isLoggedIn ? (
            <button onClick={handleLogout} className="ml-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-1.5 text-slate-300 transition-all hover:bg-red-500/10 hover:text-red-400">
              LOGOUT
            </button>
          ) : (
            <Link href="/login" className="ml-2 rounded-lg bg-amber-600 px-4 py-1.5 text-slate-950 transition-all hover:bg-amber-500">
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}