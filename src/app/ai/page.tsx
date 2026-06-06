"use client";
import { useState } from "react";

export default function AIChat() {
  const [messages, setMessages] = useState<{role: string, content: string, image?: string}[]>([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input && !image) return;

    const newMsg = { role: "user", content: input, image: image || undefined };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setImage(null);
    setLoading(true);

    try {
      const res = await fetch("https://war-backend-1.onrender.com/api/kimi-vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, image: image ? image.split(',')[1] : null }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.choices[0].message.content }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "ai", content: "Error: Backend unreachable." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen bg-black text-white flex flex-col items-center">
      {/* Header */}
      <div className="w-full p-4 border-b border-zinc-800 text-center font-bold text-green-500">
        WAR PROJECT // TACTICAL VISION AI
      </div>

      {/* Chat Area */}
      <div className="w-full max-w-2xl flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-xl max-w-[80%] ${m.role === 'user' ? 'bg-green-900' : 'bg-zinc-800'}`}>
              {m.image && <img src={m.image} className="w-full rounded mb-2" />}
              <p className="text-sm">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && <div className="text-zinc-500 text-sm italic">Kimi is thinking...</div>}
      </div>

      {/* Input Area */}
      <div className="w-full max-w-2xl p-4 border-t border-zinc-800 bg-black">
        <div className="flex gap-2 mb-2">
            <input type="file" onChange={(e) => {
                const f = e.target.files?.[0];
                if(f) { const r = new FileReader(); r.onloadend = () => setImage(r.result as string); r.readAsDataURL(f); }
            }} className="text-xs text-zinc-500" />
            {image && <span className="text-green-500 text-xs">Image attached!</span>}
        </div>
        <div className="flex gap-2">
          <textarea 
            className="flex-1 bg-zinc-900 p-3 rounded-lg outline-none border border-zinc-700" 
            placeholder="Type your tactical query..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleSend} className="bg-green-600 px-6 rounded-lg font-bold">SEND</button>
        </div>
      </div>
    </main>
  );
}