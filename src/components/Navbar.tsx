"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("war_token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("war_token");
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-[#050508] h-20 flex items-center px-10">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="text-xl font-bold tracking-widest text-white cursor-pointer" onClick={() => router.push("/dashboard")}>WAR PROJECT</div>
          <div className="flex gap-8 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            <span onClick={() => router.push("/groups")} className="cursor-pointer hover:text-white flex items-center gap-2">● EXAM GROUPS</span>
            <span onClick={() => router.push("/vault")} className="cursor-pointer hover:text-white flex items-center gap-2">📁 ACCESS VAULT</span>
            <span onClick={() => router.push("/alerts")} className="cursor-pointer text-orange-500 hover:text-orange-400 flex items-center gap-2">💬 TRANSMIT ALERTS</span>
          </div>
        </div>

        <div className="flex gap-8 text-[11px] font-bold text-zinc-400 uppercase tracking-wider items-center">
          <span onClick={() => router.push("/dashboard")} className={`cursor-pointer ${pathname === '/dashboard' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'hover:text-white'}`}>DASHBOARD</span>
          <span onClick={() => router.push("/leaderboard")} className="cursor-pointer hover:text-white">LEADERBOARD</span>
          <span onClick={() => router.push("/admin")} className="cursor-pointer hover:text-white">ADMIN</span>
          <button onClick={handleLogout} className="hover:text-red-500">LOGOUT</button>
        </div>
      </div>
    </nav>
  );
}