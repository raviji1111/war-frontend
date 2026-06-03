"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("war_token");
    const userEmail = localStorage.getItem("user_email") || "";
    
    setIsLoggedIn(!!token);

    // Email check logic
    const normalizedEmail = userEmail.toLowerCase().trim();
    setIsAdmin(normalizedEmail === "ravik61285@gmail.com");

    // Timer status check logic (Lockdown mode)
    const checkTimer = () => {
      const status = localStorage.getItem("timer_active") === "true";
      setIsTimerActive(status);
    };
    
    // Check every second to hide/show buttons if timer changes
    const interval = setInterval(checkTimer, 1000);
    checkTimer(); 
    
    return () => clearInterval(interval);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("war_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("timer_active");
    router.push("/login");
  };

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage) return null;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-[#050508] h-20 flex items-center px-10">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="text-xl font-bold tracking-widest text-white cursor-pointer" onClick={() => router.push("/dashboard")}>WAR PROJECT</div>
          <div className="flex gap-6 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            <Link href="/groups" className="hover:text-white">● EXAM GROUPS</Link>
            <Link href="/vault" className="hover:text-white">📁 ACCESS VAULT</Link>
            <Link href="/notes" className="hover:text-white">📝 NOTES</Link>
            <Link href="/feedback" className="text-orange-500 hover:text-orange-400">💬 FEEDBACK</Link>
          </div>
        </div>

        <div className="flex gap-6 text-[11px] font-bold text-zinc-400 uppercase tracking-wider items-center">
          <Link href="/dashboard" className={pathname === '/dashboard' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'hover:text-white'}>DASHBOARD</Link>
          <Link href="/leaderboard" className="hover:text-white">LEADERBOARD</Link>
          
          {/* Admin link */}
          {isAdmin && (
             <Link href="/admin" className={pathname === '/admin' ? 'text-red-500 border-b-2 border-red-500' : 'hover:text-red-500'}>ADMIN</Link>
          )}

          {/* 🛡️ LOCKDOWN MODE: Logout button tab dikhega jab timer active NAHI hoga */}
          {!isTimerActive && (
            <button onClick={handleLogout} className="hover:text-red-500">LOGOUT</button>
          )}
        </div>
      </div>
    </nav>
  );
}