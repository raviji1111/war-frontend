"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Purana Post Interface
interface Post {
  id: number;
  content: string;
  file_url: string | null;
  created_at: string;
}

export default function AdminRoom() {
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState("");
  const [banId, setBanId] = useState("");
  const [banMessage, setBanMessage] = useState("");
  const router = useRouter();

  // Groups aur Intel Management ke liye states
  const [groups, setGroups] = useState<any[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupMessage, setGroupMessage] = useState("");

  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [postContent, setPostContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [intelMessage, setIntelMessage] = useState("");

  // Live MCQ Quiz System ke liye states
  const [quizGroupId, setQuizGroupId] = useState("");
  const [quizQuestion, setQuizQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState("A");
  const [quizMessage, setQuizMessage] = useState("");

  // NAYI STATES: Live Quiz Tracking Report ke liye 📊
  const [reportQuizId, setReportQuizId] = useState("");
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [reportMessage, setReportMessage] = useState("");

  // NAYI STATES: Live Feedbacks & Bug reports render karne ke liye 🐛
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Admin data laane ka function
  const fetchAdminData = async () => {
    const token = localStorage.getItem("war_token");
    if (!token) {
      setError("❌ ACCESS DENIED: Unidentified entity. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/admin/dashboard", {
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

  // Saare available groups load karne ka function
  const fetchGroups = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/groups");
      if (response.ok) {
        const data = await response.json();
        setGroups(data.groups || []);
      }
    } catch (err) {
      console.error("Failed to load groups for admin.");
    }
  };

  // NAYA COMPONENT MOUNT FETCH: Live feed telemetry pull out logic
  const fetchLiveFeedbacks = async () => {
    const token = localStorage.getItem("war_token");
    if (!token) return;
    try {
      const response = await fetch("http://127.0.0.1:8000/admin/feedbacks", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setFeedbacks(data.feedbacks || []);
        if (data.feedbacks.length === 0) {
          setFeedbackMessage("📭 Telemetry Silent: No reports submitted by warriors yet.");
        }
      }
    } catch (err) {
      setFeedbackMessage("❌ Connection Failure: Telemetry bug loop disconnected.");
    }
  };

  useEffect(() => {
    fetchAdminData();
    fetchGroups(); 
    fetchLiveFeedbacks(); // Auto trigger on room entering
  }, []);

  // User ko ban/delete karne ka function
  const handleBanUser = async () => {
    if (!banId) return;
    setBanMessage("Initiating ban protocol...");

    const token = localStorage.getItem("war_token");
    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/users/${banId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();

      if (response.ok) {
        setBanMessage(`✅ ${data.message}`);
        setBanId(""); 
        fetchAdminData(); 
      } else {
        setBanMessage(`❌ ${data.detail}`);
      }
    } catch (err) {
      setBanMessage("❌ SYSTEM FAILURE: Ban protocol failed.");
    }
  };

  // Naya Study/Exam Group banane ka function
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName || !groupDescription) return;
    setGroupMessage("Forging battalion...");

    const token = localStorage.getItem("war_token");
    try {
      const response = await fetch("http://127.0.0.1:8000/admin/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: groupName, description: groupDescription })
      });
      const data = await response.json();

      if (response.ok) {
        setGroupMessage(`✅ Success: ${data.message}`);
        setGroupName("");
        setGroupDescription("");
        fetchGroups(); 
      } else {
        setGroupMessage(`❌ ${data.detail}`);
      }
    } catch (err) {
      setGroupMessage("❌ Connection failure.");
    }
    setTimeout(() => setGroupMessage(""), 4000);
  };

  // Selected group mein PDF/Notes deploy karne ka function
  const handleDeployIntel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId || !postContent) {
      setIntelMessage("⚠️ Please select a group and write a message.");
      return;
    }
    setIntelMessage("Deploying intel...");

    const token = localStorage.getItem("war_token");
    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/groups/${selectedGroupId}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: postContent, file_url: fileUrl || null })
      });

      if (response.ok) {
        setIntelMessage("🚀 Intel successfully deployed to the group!");
        setPostContent("");
        setFileUrl("");
      } else {
        const data = await response.json();
        setIntelMessage(`❌ ${data.detail}`);
      }
    } catch (err) {
      setIntelMessage("❌ Connection failure.");
    }
    setTimeout(() => setIntelMessage(""), 4000);
  };

  // Live Quiz Deploy Karne Ka Function
  const handleDeployQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizGroupId || !quizQuestion || !optionA || !optionB || !optionC || !optionD) {
      setQuizMessage("⚠️ Please fill all tactical quiz fields.");
      return;
    }
    setQuizMessage("Deploying quiz challenge...");

    const token = localStorage.getItem("war_token");
    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/groups/${quizGroupId}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          question: quizQuestion,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          correct_option: correctOption
        })
      });

      const data = await response.json();

      if (response.ok) {
        setQuizMessage(`🔥 Quiz successfully deployed! Generated Quiz ID: ${data.quiz_id}`);
        setQuizQuestion("");
        setOptionA("");
        setOptionB("");
        setOptionC("");
        setOptionD("");
      } else {
        setQuizMessage(`❌ ${data.detail || "Failed to deploy quiz."}`);
      }
    } catch (err) {
      setQuizMessage("❌ Connection failure.");
    }
    setTimeout(() => setQuizMessage(""), 4000);
  };

  // Live Students Response Report Card Pull Karna 📊
  const handleFetchReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportQuizId) return;
    setReportMessage("Fetching battalion scores...");

    const token = localStorage.getItem("war_token");
    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/quizzes/${reportQuizId}/responses`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();

      if (response.ok) {
        setQuizResults(data.results || []);
        if (data.results.length === 0) {
          setReportMessage("📭 Radio Silence: No warrior has solved this quiz yet.");
        } else {
          setReportMessage("");
        }
      } else {
        setReportMessage(`❌ ${data.detail || "Failed to load report card."}`);
        setQuizResults([]);
      }
    } catch (err) {
      setReportMessage("❌ Connection failure with Python engine.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-950 p-8 font-sans text-zinc-200">
      
      <div className="mb-12 mt-8 text-center relative w-full max-w-4xl">
        <button 
          onClick={() => router.push("/dashboard")}
          className="absolute left-0 top-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-400 hover:bg-zinc-800 transition-all cursor-pointer"
        >
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
          <button 
            onClick={() => router.push("/login")}
            className="mt-6 rounded-lg bg-red-900/50 px-6 py-2 text-sm font-bold tracking-widest text-red-200 border border-red-800 hover:bg-red-800 transition-all cursor-pointer"
          >
            RETURN TO LOGIN
          </button>
        </div>
      ) : metrics ? (
        <div className="w-full max-w-4xl flex flex-col gap-8">
          
          {/* TOP ROW: Live Metrics & Ban Hammer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT: Live Metrics Dashboard */}
            <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md shadow-2xl">
              <h2 className="mb-6 text-sm font-bold tracking-widest text-zinc-400 uppercase border-b border-zinc-800 pb-2">
                System Intel
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center bg-zinc-950 rounded-xl p-4 border border-zinc-800/50">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Total Operatives (Users)</span>
                  <span className="text-2xl font-mono font-bold text-emerald-400">{metrics.total_users}</span>
                </div>
                <div className="flex justify-between items-center bg-zinc-950 rounded-xl p-4 border border-zinc-800/50">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Total Study Sessions</span>
                  <span className="text-2xl font-mono font-bold text-amber-400">{metrics.total_study_sessions}</span>
                </div>
                <div className="flex justify-between items-center bg-zinc-950 rounded-xl p-4 border border-zinc-800/50">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Intel Saved (Notes)</span>
                  <span className="text-2xl font-mono font-bold text-blue-400">{metrics.total_notes_saved}</span>
                </div>
              </div>
            </div>

            {/* RIGHT: The Ban Hammer */}
            <div className="flex flex-col rounded-2xl border border-red-900/40 bg-red-950/10 p-6 backdrop-blur-md shadow-[0_0_30px_rgba(225,29,72,0.1)]">
              <h2 className="mb-6 text-sm font-bold tracking-widest text-red-500 uppercase border-b border-red-900/40 pb-2 flex items-center gap-2">
                <span>🔨</span> THE BAN HAMMER
              </h2>
              <p className="text-xs text-red-400/70 mb-6 uppercase tracking-widest font-bold">
                Warning: Deleting a user is permanent and cannot be undone.
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={banId}
                  onChange={(e) => setBanId(e.target.value)}
                  placeholder="Enter User ID..."
                  className="w-full rounded-xl border border-red-900/50 bg-zinc-950 p-4 text-sm font-bold text-red-200 placeholder-red-900/50 focus:border-red-500 focus:outline-none transition-all"
                />
                <button
                  onClick={handleBanUser}
                  className="rounded-xl bg-red-700 px-6 font-bold text-white shadow-lg shadow-red-900/50 transition-all hover:bg-red-600 active:scale-95 cursor-pointer"
                >
                  BANISH
                </button>
              </div>
              {banMessage && (
                <div className="mt-6 rounded-lg bg-zinc-950 border border-zinc-900 p-3 text-center text-sm font-bold text-zinc-400 tracking-wide">
                  {banMessage}
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM ROW: Group Creation & Material Deployment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {/* LEFT bottom: Forge Study Group */}
            <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md shadow-2xl">
              <h2 className="mb-6 text-sm font-bold tracking-widest text-emerald-500 uppercase border-b border-zinc-800 pb-2 flex items-center gap-2">
                <span>🌍</span> FORGE BATTALION (CREATE GROUP)
              </h2>
              <form onSubmit={handleCreateGroup} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Group Name (e.g., Python Core)"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                  required
                />
                <textarea
                  placeholder="Group Mission / Exam Description..."
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none resize-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer"
                >
                  DEPLOY NEW GROUP
                </button>
              </form>
              {groupMessage && (
                <div className="mt-4 text-center text-xs font-bold text-emerald-400">{groupMessage}</div>
              )}
            </div>

            {/* RIGHT bottom: Deploy Material/Intel */}
            <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md shadow-2xl">
              <h2 className="mb-6 text-sm font-bold tracking-widest text-blue-500 uppercase border-b border-zinc-800 pb-2 flex items-center gap-2">
                <span>🚀</span> DEPLOY INTEL (SHARE MATERIAL / FILE)
              </h2>
              <form onSubmit={handleDeployIntel} className="flex flex-col gap-4">
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300 focus:border-blue-500 focus:outline-none cursor-pointer"
                  required
                >
                  <option value="">-- SELECT TARGET GROUP --</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id} className="bg-zinc-950 text-white">
                      {g.name} (ID: {g.id})
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Write announcement, core questions, or guidelines..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none resize-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Paste PDF / File URL Link (Optional)"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-500 active:scale-95 transition-all cursor-pointer"
                >
                  BROADCAST MATERIAL
                </button>
              </form>
              {intelMessage && (
                <div className="mt-4 text-center text-xs font-bold text-blue-400">{intelMessage}</div>
              )}
            </div>
          </div>

          {/* MIDDLE ROW: Deploy Live MCQ Quiz Challenge */}
          <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md shadow-2xl mt-4">
            <h2 className="mb-6 text-sm font-bold tracking-widest text-amber-500 uppercase border-b border-zinc-800 pb-2 flex items-center gap-2">
              <span>🎯</span> DEPLOY TACTICAL MCQ QUIZ (TEST BATTALION)
            </h2>
            <form onSubmit={handleDeployQuiz} className="flex flex-col gap-4">
              <select
                value={quizGroupId}
                onChange={(e) => setQuizGroupId(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300 focus:border-amber-500 focus:outline-none cursor-pointer"
                required
              >
                <option value="">-- SELECT TARGET BATTALION GROUP --</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id} className="bg-zinc-950 text-white">
                    {g.name} (ID: {g.id})
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Type the live challenge question here..."
                value={quizQuestion}
                onChange={(e) => setQuizQuestion(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none resize-none"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Option A"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Option B"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Option C"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Option D"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 sm:w-1/4">Correct Answer Key:</label>
                <select
                  value={correctOption}
                  onChange={(e) => setCorrectOption(e.target.value)}
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm font-bold text-amber-500 focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="A">OPTION A</option>
                  <option value="B">OPTION B</option>
                  <option value="C">OPTION C</option>
                  <option value="D">OPTION D</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-amber-600 py-3 text-sm font-bold text-white shadow-md hover:bg-amber-500 active:scale-95 transition-all cursor-pointer"
              >
                LAUNCH LIVE MCQ QUIZ
              </button>
            </form>
            {quizMessage && (
              <div className="mt-4 text-center text-xs font-bold text-amber-400">{quizMessage}</div>
            )}
          </div>

          {/* LIVE QUIZ SUBMISSIONS TRACKER REPORT CARD 📊 */}
          <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md shadow-2xl mt-4">
            <h2 className="mb-6 text-sm font-bold tracking-widest text-blue-400 uppercase border-b border-zinc-800 pb-2 flex items-center gap-2">
              <span>📊</span> LIVE BATTALION REPORT CARD (QUIZ RESPONSES TRACKER)
            </h2>

            <form onSubmit={handleFetchReport} className="flex gap-2 mb-6">
              <input
                type="number"
                placeholder="Enter Quiz ID to Track (e.g., 1)"
                value={reportQuizId}
                onChange={(e) => setReportQuizId(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-sm font-bold text-white placeholder-zinc-700 focus:border-blue-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-6 font-bold text-white text-xs tracking-wider hover:bg-blue-500 transition-all active:scale-95 cursor-pointer"
              >
                PULL REPORT
              </button>
            </form>

            {reportMessage && (
              <div className="text-center text-sm text-zinc-500 font-bold py-4 animate-pulse">{reportMessage}</div>
            )}

            {/* Dynamic Results Table */}
            {quizResults.length > 0 && (
              <div className="w-full overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/40 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      <th className="p-4">Warrior Name</th>
                      <th className="p-4">User ID</th>
                      <th className="p-4">Chosen Option</th>
                      <th className="p-4">Verdict</th>
                      <th className="p-4">Time Taken</th>
                      <th className="p-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-medium">
                    {quizResults.map((res, index) => (
                      <tr key={index} className="hover:bg-zinc-900/20 transition-all">
                        <td className="p-4 font-bold text-zinc-300">{res.name}</td>
                        <td className="p-4 text-zinc-500 font-mono">@{res.username}</td>
                        <td className="p-4 font-mono text-center"><span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-zinc-400 font-bold">{res.selected_option}</span></td>
                        <td className={`p-4 font-bold ${res.verdict.includes("✅") ? "text-emerald-400" : "text-red-400"}`}>{res.verdict}</td>
                        <td className="p-4 font-mono text-amber-400 font-bold">{res.time_taken}</td>
                        <td className="p-4 text-zinc-600 text-[10px] font-mono">{res.submitted_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* NAYA FULL WIDTH ROW: LIVE BUG & FEEDBACK TELEMETRY MONITOR 🐛 */}
          <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md shadow-2xl mt-4">
            <h2 className="mb-6 text-sm font-bold tracking-widest text-cyan-400 uppercase border-b border-zinc-800 pb-2 flex items-center gap-2">
              <span>🐛</span> LIVE SYSTEM BUG & FEEDBACK TELEMETRY MONITOR
            </h2>

            {feedbackMessage && (
              <div className="text-center text-sm text-zinc-500 font-bold py-4">{feedbackMessage}</div>
            )}

            {/* Dynamic Feedbacks Stream Table */}
            {feedbacks.length > 0 ? (
              <div className="w-full overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/40 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      <th className="p-4">Warrior Agent</th>
                      <th className="p-4">User ID</th>
                      <th className="p-4">Matrix Category</th>
                      <th className="p-4">Logged Alert Message</th>
                      <th className="p-4">Dispatched At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-medium">
                    {feedbacks.map((fb, index) => (
                      <tr key={index} className="hover:bg-zinc-900/20 transition-all">
                        <td className="p-4 font-bold text-zinc-300">{fb.name}</td>
                        <td className="p-4 text-zinc-500 font-mono">@{fb.username}</td>
                        <td className="p-4 font-mono">
                          <span className={`rounded border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                            fb.category === "bug" ? "border-red-900/60 bg-red-950/30 text-red-400" :
                            fb.category === "glitch" ? "border-orange-900/60 bg-orange-950/30 text-orange-400" :
                            "border-cyan-900/60 bg-cyan-950/30 text-cyan-400"
                          }`}>
                            {fb.category}
                          </span>
                        </td>
                        <td className="p-4 text-zinc-300 whitespace-pre-wrap leading-relaxed max-w-xs">{fb.message}</td>
                        <td className="p-4 text-zinc-600 text-[10px] font-mono">{fb.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              !feedbackMessage && (
                <div className="text-center text-xs text-zinc-600 py-6 uppercase font-bold tracking-wider">
                  No active feedback alerts in current telemetry stream.
                </div>
              )
            )}
          </div>

        </div>
      ) : (
        <div className="text-zinc-500 font-bold tracking-widest animate-pulse mt-20">VERIFYING CREDENTIALS...</div>
      )}

    </main>
  );
}