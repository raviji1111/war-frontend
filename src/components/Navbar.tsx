"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Path check: Kya hum Login ya Signup page par hain?
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

  // Agar hum Login/Signup page par hain, toh Navbar ka navigation portion hide kar do
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

  // Dashboard aur baki pages ke liye full Navigation
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        <div className="flex items-center gap-2 cursor-default">
          <span className="text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">WAR</span>
          <span className="text-xl font-bold tracking-wide text-slate-200">Project</span>
        </div>
        
        <div className="flex items-center gap-8 text-xs font-bold tracking-widest text-slate-400">
          <Link href="/dashboard" className={`transition-all hover:text-amber-400 ${pathname === '/dashboard' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : ''}`}>DASHBOARD</Link>
          <Link href="/leaderboard" className={`transition-all hover:text-amber-400 ${pathname === '/leaderboard' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : ''}`}>LEADERBOARD</Link>
          <Link href="/admin" className={`transition-all hover:text-red-500 ${pathname === '/admin' ? 'text-red-500 border-b-2 border-red-500 pb-1' : ''}`}>ADMIN</Link>
          
          {isLoggedIn ? (
            <button onClick={handleLogout} className="ml-4 rounded-lg border border-slate-700 bg-slate-800 px-5 py-2 text-slate-300 transition-all hover:bg-red-500/10 hover:text-red-400 active:scale-95 cursor-pointer">
              LOGOUT
            </button>
          ) : (
            <Link href="/login" className="ml-4 rounded-lg bg-amber-600 px-5 py-2 text-slate-950 transition-all hover:bg-amber-500 shadow-lg shadow-amber-600/20">
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}