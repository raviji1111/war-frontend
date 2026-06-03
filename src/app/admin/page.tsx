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
  // Yahan fix kiya hai: Live URL uthayega agar Vercel mein hai, warna default le lega
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://war-backend-1.onrender.com";

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
    fetchLiveFeedbacks();
  }, []);

  const handleBanUser = async () => {
    if (!banId) return;
    setBanMessage("Initiating ban protocol...");

    const token = localStorage.getItem("war_token");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${banId}`, {
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

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName || !groupDescription) return;
    setGroupMessage("Forging battalion...");

    const token = localStorage.getItem("war_token");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/groups`, {
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

  const handleDeployIntel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId || !postContent) {
      setIntelMessage("⚠️ Please select a group and write a message.");
      return;
    }
    setIntelMessage("Deploying intel...");

    const token = localStorage.getItem("war_token");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/groups/${selectedGroupId}/posts`, {
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

  const handleDeployQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizGroupId || !quizQuestion || !optionA || !optionB || !optionC || !optionD) {
      setQuizMessage("⚠️ Please fill all tactical quiz fields.");
      return;
    }
    setQuizMessage("Deploying quiz challenge...");

    const token = localStorage.getItem("war_token");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/groups/${quizGroupId}/quizzes`, {
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

  const handleFetchReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportQuizId) return;
    setReportMessage("Fetching battalion scores...");

    const token = localStorage.getItem("war_token");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/quizzes/${reportQuizId}/responses`, {
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
    // (Baki ka UI code same rahega, niche waisa ka waisa hai)
    <main className="flex min-h-screen flex-col items-center bg-zinc-950 p-8 font-sans text-zinc-200">
      {/* ... tumhara baaki ka return JSX same rahega ... */}
      <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-700 drop-shadow-[0_0_15px_rgba(225,29,72,0.4)]">
          The WAR Room
      </h1>
      {/* ... (baki code pura same rakhna, maine yahan space bachane ke liye truncate kiya hai) ... */}
    </main>
  );
}