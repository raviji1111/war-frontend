"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootLandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Check validation credentials in background
    const token = localStorage.getItem("war_token");
    
    if (token) {
      // Logged in warrior -> Send to the dashboard deck instantly
      router.push("/dashboard");
    } else {
      // Stranger or new user -> Send straight to the login gate
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 font-mono text-xs tracking-widest text-slate-500 uppercase select-none">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-t-amber-500 border-r-transparent border-slate-900 rounded-full animate-spin"></div>
        <span>Establishing Secure Link...</span>
      </div>
    </main>
  );
}