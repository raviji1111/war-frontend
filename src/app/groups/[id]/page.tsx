"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// Purana Post Interface
interface Post {
  id: number;
  content: string;
  file_url: string | null;
  created_at: string;
}

// UPGRADED: Quiz Interface with user_answer property
interface Quiz {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  user_answer?: string | null; // Backend se aane wala purana jawab
}

export default function GroupIntelPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<{ [quizId: number]: string }>({}); 
  
  // NAYA STATE: Har active quiz ka automatic countdown map karne ke liye ⏱️
  const [quizTimers, setQuizTimers] = useState<{ [quizId: number]: number }>({});

  // Timer initialization (Page load hote hi timer start ho jayega)
  const [pageLoadTime] = useState<number>(Date.now());

  const router = useRouter();
  const params = useParams(); // URL se group id nikalne ke liye
  const groupId = params.id;

  // UPGRADED: Backend se data laate hi purane answers lock karne ka system
  const fetchGroupTacticalData = async () => {
    const token = localStorage.getItem("war_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // 1. Fetch Posts Intel
      const postsResponse = await fetch(`http://127.0.0.1:8000/groups/${groupId}/posts`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const postsData = await postsResponse.json();

      // 2. Fetch Live Quizzes Intel
      const quizzesResponse = await fetch(`http://127.0.0.1:8000/groups/${groupId}/quizzes`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const quizzesData = await quizzesResponse.json();

      if (postsResponse.ok && quizzesResponse.ok) {
        setPosts(postsData.posts || []);
        const loadedQuizzes = quizzesData.quizzes || [];
        setQuizzes(loadedQuizzes);

        // 🔥 EXTRA MAGIC: Agar bache ne pehle answer diya tha, toh use state me load karo
        const savedAnswers: { [quizId: number]: string } = {};
        const initialTimers: { [quizId: number]: number } = {};

        loadedQuizzes.forEach((quiz: any) => {
          if (quiz.user_answer) {
            savedAnswers[quiz.id] = quiz.user_answer; // Memory locking
          } else {
            initialTimers[quiz.id] = 30; // NAYA: Har un-attempted question ko 30 seconds milenge ⏱️
          }
        });
        
        setSelectedAnswers(savedAnswers);
        setQuizTimers(initialTimers);

      } else {
        setError(postsData.detail || quizzesData.detail || "Failed to load dynamic intel.");
      }
    } catch (err) {
      setError("❌ System Offline: Unable to connect to Python engine.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchGroupTacticalData();
    }
  }, [groupId]);

  // NAYA EFFECT: Countdown ticking implementation every single second ⏱️
  useEffect(() => {
    if (quizzes.length === 0) return;

    const interval = setInterval(() => {
      setQuizTimers((prevTimers) => {
        const updated = { ...prevTimers };
        let updatedAny = false;

        quizzes.forEach((quiz) => {
          // Agar bache ne answer nahi diya aur time bacha hai, toh ticking chalu rakho
          if (!selectedAnswers[quiz.id] && updated[quiz.id] > 0) {
            updated[quiz.id] -= 1;
            updatedAny = true;

            // Agar ticking zero ho gayi, toh system automatic "TIMEOUT (X)" fire karega
            if (updated[quiz.id] === 0) {
              handleOptionClick(quiz.id, "X"); 
            }
          }
        });

        return updatedAny ? updated : prevTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizzes, selectedAnswers]);

  // Option click hote hi data database me sync hoga live!
  const handleOptionClick = async (quizId: number, optionChosen: string) => {
    if (selectedAnswers[quizId]) return; 

    const token = localStorage.getItem("war_token");
    const secondsTaken = Math.max(1, Math.floor((Date.now() - pageLoadTime) / 1000));

    try {
      const response = await fetch(`http://127.0.0.1:8000/quizzes/${quizId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          selected_option: optionChosen,
          time_taken_seconds: secondsTaken
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSelectedAnswers((prev) => ({
          ...prev,
          [quizId]: optionChosen,
        }));
      } else {
        alert(`⚠️ ${data.detail || "Submission block failed."}`);
        setSelectedAnswers((prev) => ({
          ...prev,
          [quizId]: optionChosen, 
        }));
      }
    } catch (err) {
      console.error("Tracking connection failure.");
      setSelectedAnswers((prev) => ({
        ...prev,
        [quizId]: optionChosen,
      }));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 p-6 font-sans text-slate-200 lg:p-12">
      
      {/* HEADER */}
      <div className="w-full max-w-6xl flex justify-between items-center mt-6 mb-10 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Group Intel & Feed
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">
            BATTALION ID: #{groupId}
          </p>
        </div>
        <button 
          onClick={() => router.push("/groups")}
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
        >
          BACK TO GROUPS
        </button>
      </div>

      {error && <div className="text-center text-red-400 font-bold mb-6">{error}</div>}

      {/* TWO COLUMN GRID LAYOUT */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[500px]">
        
        {/* LEFT & CENTER: LIVE MCQ QUIZZES */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-xs font-bold tracking-widest text-amber-500 uppercase flex items-center gap-2 border-b border-slate-900 pb-2">
            <span>🎯</span> LIVE MCQ CHALLENGES ({quizzes.length})
          </h2>

          {isLoading ? (
            <div className="text-center text-slate-500 font-bold mt-10 animate-pulse">DECRYPTING QUIZZES...</div>
          ) : quizzes.length === 0 ? (
            <div className="text-center text-slate-600 border border-dashed border-slate-900 rounded-2xl p-12 text-xs uppercase font-bold tracking-wider">
              No live tactical quizzes deployed yet.
            </div>
          ) : (
            quizzes.map((quiz) => {
              const userAns = selectedAnswers[quiz.id];
              const isCorrect = userAns === quiz.correct_option;
              const currentTimer = quizTimers[quiz.id]; // Fetch specific timer tick

              return (
                <div key={quiz.id} className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-6 backdrop-blur-sm shadow-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="inline-block rounded-md bg-amber-950/40 border border-amber-900/30 px-2 py-0.5 text-[9px] font-black text-amber-400 uppercase tracking-widest">
                      LIVE MISSION
                    </span>
                    
                    {/* NAYA UI NODE: Live Countdown text display overlay */}
                    {!userAns && currentTimer !== undefined && (
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${currentTimer <= 10 ? "text-red-400 border-red-900/50 bg-red-950/20 animate-pulse" : "text-slate-400 border-slate-800 bg-slate-950"}`}>
                        ⏱️ {currentTimer}s left
                      </span>
                    )}
                  </div>

                  {/* NAYA UI NODE: Graphical progress countdown bar indicator */}
                  {!userAns && currentTimer !== undefined && (
                    <div className="w-full bg-slate-950 rounded-full h-1 mb-5 border border-slate-900/50 overflow-hidden">
                      <div 
                        className={`h-1 rounded-full transition-all duration-1000 ${currentTimer <= 10 ? "bg-gradient-to-r from-red-600 to-rose-500" : "bg-gradient-to-r from-amber-500 to-yellow-500"}`}
                        style={{ width: `${(currentTimer / 30) * 100}%` }}
                      ></div>
                    </div>
                  )}

                  <h3 className="text-sm font-bold text-slate-200 mb-5 leading-relaxed">{quiz.question}</h3>
                  
                  {/* Options Dynamic List */}
                  <div className="flex flex-col gap-2.5">
                    {[
                      { key: "A", text: quiz.option_a },
                      { key: "B", text: quiz.option_b },
                      { key: "C", text: quiz.option_c },
                      { key: "D", text: quiz.option_d },
                    ].map((opt) => {
                      let btnStyle = "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200";
                      
                      if (userAns) {
                        if (opt.key === quiz.correct_option) {
                          btnStyle = "border-emerald-800 bg-emerald-950/30 text-emerald-400 font-bold";
                        } else if (userAns === opt.key && !isCorrect) {
                          btnStyle = "border-red-800 bg-red-950/30 text-red-400 font-bold";
                        } else {
                          btnStyle = "border-slate-900 bg-slate-950/10 text-slate-600 opacity-40";
                        }
                      }

                      return (
                        <button
                          key={opt.key}
                          onClick={() => handleOptionClick(quiz.id, opt.key)}
                          disabled={!!userAns}
                          className={`w-full flex items-center gap-3 rounded-lg border p-3.5 text-xs font-medium transition-all text-left ${btnStyle} ${!userAns ? "cursor-pointer active:scale-[0.99]" : "cursor-default"}`}
                        >
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[10px] font-bold ${userAns && opt.key === quiz.correct_option ? "border-emerald-500 bg-emerald-500 text-black" : userAns && userAns === opt.key ? "border-red-500 bg-red-500 text-black" : "border-slate-800 bg-slate-900 text-slate-400"}`}>
                            {opt.key}
                          </span>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Result Verdict (Tuned with timeout response condition) */}
                  {userAns && (
                    <div className={`mt-4 rounded-lg border p-3 text-center text-[11px] font-bold tracking-wide ${userAns === "X" ? "border-amber-900/50 bg-amber-950/10 text-amber-500" : isCorrect ? "border-emerald-900/40 bg-emerald-950/20 text-emerald-400" : "border-red-900/40 bg-red-950/20 text-red-400"}`}>
                      {userAns === "X" ? `⚠️ TIME OUT: Mission Expired! Correct answer was Option ${quiz.correct_option}.` : isCorrect ? "🎯 SUCCESS: Tactical response tracked globally!" : `❌ FAILED: Correct response was Option ${quiz.correct_option}.`}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: BROADCAST POSTS */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold tracking-widest text-blue-500 uppercase flex items-center gap-2 border-b border-slate-900 pb-2">
            <span>👑</span> ADMIN BROADCASTS ({posts.length})
          </h2>

          {isLoading ? (
            <div className="text-center text-slate-500 font-bold mt-10 animate-pulse">DECRYPTING BROADCASTS...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-slate-600 border border-dashed border-slate-900 rounded-2xl p-12 text-xs uppercase font-bold tracking-wider">
              📭 Radio Silence. No info shared.
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-lg relative backdrop-blur-sm">
                
                <span className="absolute top-4 right-5 font-mono text-[9px] text-slate-600 font-bold">
                  {post.created_at}
                </span>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs">👑</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">INTEL</span>
                </div>

                <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap pr-6">
                  {post.content}
                </p>

                {post.file_url && (
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-start">
                    <a 
                      href={post.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-950/60 border border-indigo-900/60 px-3 py-1.5 text-[10px] font-bold text-indigo-400 hover:bg-indigo-900/50 hover:text-indigo-300 transition-all cursor-pointer"
                    >
                      📥 DOWNLOAD PDF
                    </a>
                  </div>
                )}

              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}