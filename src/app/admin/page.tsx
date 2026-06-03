"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

export default function AdminRoom() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [banId, setBanId] = useState("");
  const [grpName, setGrpName] = useState("");
  const [quizData, setQuizData] = useState({ gid: "", q: "", a: "", b: "", c: "", d: "", correct: "A" });

  const fetchData = async () => {
    const token = localStorage.getItem("war_token");
    if (!token) { router.push("/login"); return; }
    try {
      const mRes = await fetch(`${API_BASE_URL}/admin/dashboard`, { headers: { "Authorization": `Bearer ${token}` } });
      const mData = await mRes.json();
      if (mRes.ok) setMetrics(mData.metrics);

      const fRes = await fetch(`${API_BASE_URL}/admin/feedbacks`, { headers: { "Authorization": `Bearer ${token}` } });
      const fData = await fRes.json();
      if (fRes.ok) setFeedbacks(fData.feedbacks || []);
      
      const gRes = await fetch(`${API_BASE_URL}/groups`);
      const gData = await gRes.json();
      if (gRes.ok) setGroups(gData.groups || []);

      setLoading(false);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    // SECURITY CHECK: Email verify karo
    const userEmail = localStorage.getItem("user_email");
    if (userEmail !== "ravik61285@gmail.com") {
      alert("⚠️ Unauthorized Access!");
      router.push("/dashboard"); // Unauthorized ko bhaga do
    } else {
      fetchData(); // Sirf Admin hai to data fetch karo
    }
  }, []);

  const handleBan = async () => {
    const token = localStorage.getItem("war_token");
    await fetch(`${API_BASE_URL}/admin/users/${banId}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
    alert("User Banned!");
  };

  const createGroup = async () => {
    const token = localStorage.getItem("war_token");
    await fetch(`${API_BASE_URL}/admin/groups`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ name: grpName, description: "New Group" })
    });
    alert("Group Created!");
    fetchData();
  };

  const deployQuiz = async () => {
    const token = localStorage.getItem("war_token");
    await fetch(`${API_BASE_URL}/admin/groups/${quizData.gid}/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ question: quizData.q, option_a: quizData.a, option_b: quizData.b, option_c: quizData.c, option_d: quizData.d, correct_option: quizData.correct })
    });
    alert("Quiz Deployed!");
  };

  if (loading) return <div className="text-white text-center mt-20">Verifying Admin Access...</div>;

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-200">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-red-500">WAR ROOM ADMIN</h1>
        <button onClick={() => router.push("/dashboard")} className="bg-zinc-800 px-4 py-2 rounded">BACK TO DASHBOARD</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Metrics */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-xl font-bold mb-4">System Stats</h2>
          <p>Users: {metrics?.total_users}</p>
          <p>Sessions: {metrics?.total_study_sessions}</p>
        </div>

        {/* Ban Section */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-red-900/50">
          <h2 className="text-xl font-bold text-red-500 mb-4">Ban Hammer</h2>
          <input className="bg-black p-2 rounded w-full mb-2" placeholder="User ID" onChange={(e) => setBanId(e.target.value)} />
          <button onClick={handleBan} className="bg-red-600 w-full p-2 rounded font-bold">BANISH</button>
        </div>

        {/* Group Creation */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-xl font-bold mb-4">Create Group</h2>
          <input className="bg-black p-2 rounded w-full mb-2" placeholder="Group Name" onChange={(e) => setGrpName(e.target.value)} />
          <button onClick={createGroup} className="bg-blue-600 w-full p-2 rounded font-bold">CREATE</button>
        </div>

        {/* Quiz Deployment */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-xl font-bold mb-4">Deploy Quiz</h2>
          <input className="bg-black p-2 rounded w-full mb-1" placeholder="Group ID" onChange={(e) => setQuizData({...quizData, gid: e.target.value})} />
          <input className="bg-black p-2 rounded w-full mb-1" placeholder="Question" onChange={(e) => setQuizData({...quizData, q: e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <input className="bg-black p-2 rounded" placeholder="A" onChange={(e) => setQuizData({...quizData, a: e.target.value})} />
            <input className="bg-black p-2 rounded" placeholder="B" onChange={(e) => setQuizData({...quizData, b: e.target.value})} />
            <input className="bg-black p-2 rounded" placeholder="C" onChange={(e) => setQuizData({...quizData, c: e.target.value})} />
            <input className="bg-black p-2 rounded" placeholder="D" onChange={(e) => setQuizData({...quizData, d: e.target.value})} />
          </div>
          <button onClick={deployQuiz} className="bg-emerald-600 w-full p-2 mt-2 rounded font-bold">DEPLOY QUIZ</button>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="mt-8 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h2 className="text-xl font-bold mb-4">Feedback Monitoring</h2>
        <table className="w-full">
          <thead><tr className="text-zinc-500 text-left"><th className="pb-2">User</th><th className="pb-2">Category</th><th className="pb-2">Message</th></tr></thead>
          <tbody>
            {feedbacks.map((fb, i) => (
              <tr key={i} className="border-t border-zinc-800">
                <td className="py-2">{fb.username}</td>
                <td className="py-2 text-red-400">{fb.category}</td>
                <td className="py-2">{fb.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}