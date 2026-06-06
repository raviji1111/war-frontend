"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function AIChat() {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://war-backend-1.onrender.com/api/kimi-vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const aiMsg = { role: 'ai' as const, content: data.choices[0].message.content };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'ai', content: "Error: Could not connect to Kimi." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen bg-[#0d0d0d] text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 text-center font-bold text-green-500">
        WAR PROJECT // TACTICAL AI
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-green-700 text-white' : 'bg-zinc-800 text-zinc-100'}`}>
              
<div className="prose prose-invert prose-sm text-sm">
  <ReactMarkdown>
    {m.content}
  </ReactMarkdown>
</div>
            </div>
          </div>
        ))}
        {loading && <div className="text-zinc-500 text-sm italic animate-pulse">Kimi is typing...</div>}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-zinc-800 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea 
            className="flex-1 bg-zinc-900 p-3 rounded-xl border border-zinc-700 outline-none focus:border-green-500" 
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
          />
          <button onClick={handleSend} className="bg-green-600 px-6 rounded-xl font-bold hover:bg-green-500 transition">SEND</button>
        </div>
      </div>
    </main>
  );
}