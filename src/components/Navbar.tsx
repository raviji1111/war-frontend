"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

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
          <Link href="/admin" className="hover:text-white">ADMIN</Link>
          <button onClick={() => { localStorage.removeItem("war_token"); router.push("/login"); }} className="hover:text-red-500">LOGOUT</button>
        </div>
      </div>
    </nav>
  );
}