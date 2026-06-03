"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the API URL at the top level
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

export default function AdminRoom() {
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState("");
  const [banId, setBanId] = useState("");
  const [banMessage, setBanMessage] = useState("");
  const router = useRouter();

  const [groups, setGroups] = useState<any[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupMessage, setGroupMessage] = useState("");

  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [postContent, setPostContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [intelMessage, setIntelMessage] = useState("");

  const [quizGroupId, setQuizGroupId] = useState("");
  const [quizQuestion, setQuizQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState("A");
  const [quizMessage, setQuizMessage] = useState("");

  const [reportQuizId, setReportQuizId] = useState("");
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [reportMessage, setReportMessage] = useState("");

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const fetchAdminData = async () => {
    const token = localStorage.getItem("war_token");
    if (!token) {
      setError("❌ ACCESS DENIED: Unidentified entity. Please log in.");
      return;
    }

    try {
      // Fixed with Backticks
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();

      if (response.ok) {
        setMetrics(data.metrics);
      } else {
        setError(`🛑 ${data.detail || "ACCESS DENIED: Admins Only 👑"}`);
      }
    } catch (err) {
      setError("❌ SYSTEM FAILURE: Python engine is offline.");
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`);
      if (response.ok) {
        const data = await response.json();
        setGroups(data.groups || []);
      }
    } catch (err) {
      console.error("Failed to load groups for admin.");
    }
  };

  const fetchLiveFeedbacks = async () => {
    const token = localStorage.getItem("war_token");
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/admin/feedbacks`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setFeedbacks(data.feedbacks || []);
      }
    } catch (err) {
      setFeedbackMessage("❌ Connection Failure: Telemetry bug loop disconnected.");
    }
  };

  useEffect(() => {
    fetchAdminData();
    fetchGroups(); 
    fetchLiveFeedbacks();
  }, []);

  const handleBanUser = async () => {
    if (!banId) return;
    const token = localStorage.getItem("war_token");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${banId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setBanMessage(`✅ ${data.message}`);
        fetchAdminData(); 
      }
    } catch (err) {
      setBanMessage("❌ SYSTEM FAILURE.");
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("war_token");
    const response = await fetch(`${API_BASE_URL}/admin/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: groupName, description: groupDescription })
    });
    if (response.ok) {
        setGroupMessage("✅ Group created!");
        fetchGroups();
    }
  };

  const handleDeployIntel = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("war_token");
    const response = await fetch(`${API_BASE_URL}/admin/groups/${selectedGroupId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ content: postContent, file_url: fileUrl || null })
    });
    if (response.ok) setIntelMessage("🚀 Intel deployed!");
  };

  const handleDeployQuiz = async (e: React.FormEvent) => {
      e.preventDefault();
      const token = localStorage.getItem("war_token");
      await fetch(`${API_BASE_URL}/admin/groups/${quizGroupId}/quizzes`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ question: quizQuestion, option_a: optionA, option_b: optionB, option_c: optionC, option_d: optionD, correct_option: correctOption })
      });
      setQuizMessage("🔥 Quiz deployed!");
  };

  const handleFetchReport = async (e: React.FormEvent) => {
      e.preventDefault();
      const token = localStorage.getItem("war_token");
      const response = await fetch(`${API_BASE_URL}/admin/quizzes/${reportQuizId}/responses`, {
          headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setQuizResults(data.results || []);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-950 p-8 font-sans text-zinc-200">
      <div className="mb-12 mt-8 text-center relative w-full max-w-4xl">
        <button onClick={() => router.push("/dashboard")} className="absolute left-0 top-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-400 hover:bg-zinc-800 transition-all cursor-pointer">
          BACK TO DASHBOARD
        </button>
        <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-700 drop-shadow-[0_0_15px_rgba(225,29,72,0.4)]">
          The WAR Room
        </h1>
        <p className="mt-3 text-sm font-bold tracking-widest text-red-500 uppercase flex items-center justify-center gap-2">
          <span>👑</span> SUPER ADMIN ACCESS ONLY
        </p>
      </div>

      {error ? (
        <div className="mt-10 max-w-lg rounded-2xl border-2 border-red-900 bg-red-950/40 p-8 text-center shadow-[0_0_30px_rgba(225,29,72,0.2)] backdrop-blur-md">
          <div className="text-6xl mb-4">🛑</div>
          <h2 className="text-xl font-bold text-red-400 mb-2">SECURITY BREACH DETECTED</h2>
          <p className="text-red-300/80 font-medium">{error}</p>
        </div>
      ) : metrics ? (
        <div className="w-full max-w-4xl flex flex-col gap-8">
            {/* UI Content goes here - Use your original table structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md shadow-2xl">
                    <h2 className="text-emerald-400">System Metrics</h2>
                    <p>Users: {metrics.total_users}</p>
                </div>
            </div>
            {/* You can add back the rest of your table and form code here! */}
        </div>
      ) : (
        <div className="text-zinc-500 font-bold tracking-widest animate-pulse mt-20">VERIFYING CREDENTIALS...</div>
      )}
    </main>
  );
}