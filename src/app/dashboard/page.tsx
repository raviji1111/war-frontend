"use client";
export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#050508] text-white font-sans flex flex-col items-center justify-center">
      <div className="text-7xl font-mono tracking-widest mb-10">00 : 00 : 00</div>
      <button className="bg-white text-black font-bold px-8 py-3 rounded-sm hover:bg-zinc-200 transition">
        INITIALIZE SECURE TIMER
      </button>
    </main>
  );
}