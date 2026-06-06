"use client";
import { useState } from "react";

export default function KimiVision() {
  const [msg, setMsg] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const askKimi = async () => {
    setLoading(true);
    const base64 = image ? image.split(',')[1] : null;
    const res = await fetch("https://war-backend-1.onrender.com/api/kimi-vision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, image: base64 }),
    });
    const data = await res.json();
    setResponse(data.choices[0].message.content);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-green-500 p-10 font-mono">
      <h1 className="text-3xl font-bold mb-6 border-b border-green-900 pb-2">// WAR_PROJECT_VISION_SYSTEM</h1>
      
      <div className="flex flex-col gap-4 max-w-2xl">
        <input type="file" onChange={handleImage} className="bg-zinc-900 p-2" />
        {image && <img src={image} className="h-40 w-auto rounded border border-green-900" />}
        
        <textarea 
          className="w-full bg-black border border-green-900 p-4 text-white"
          placeholder="Analyze image or ask tactical question..."
          onChange={(e) => setMsg(e.target.value)}
        />
        
        <button onClick={askKimi} className="bg-green-900 text-black font-bold p-3 hover:bg-green-600 transition">
          {loading ? "PROCESSING DATA..." : "EXECUTE ANALYSIS"}
        </button>

        <div className="mt-6 p-6 border border-green-900 bg-zinc-950 text-white min-h-[200px]">
          {response || "System standby..."}
        </div>
      </div>
    </main>
  );
}