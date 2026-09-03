import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Mic } from "lucide-react";
import { useStore } from "@/lib/store";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: "user" | "bot", text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addProduct } = useStore();

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const getLanguage = () => {
    const saved = localStorage.getItem("merchantLang") || "English";
    if (saved.includes("Hindi")) return "Hindi";
    if (saved.includes("Telugu")) return "Telugu";
    if (saved.includes("Marathi")) return "Marathi";
    return "English";
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, language: getLanguage() })
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: "bot", text: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: "bot", text: "Error connecting to AI." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceListing = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Your browser does not support voice input.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const lang = getLanguage();
    recognition.lang = lang === "Telugu" ? "te-IN" : lang === "Hindi" ? "hi-IN" : lang === "Marathi" ? "mr-IN" : "en-IN";
    let finalTranscript = "";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let current = "";
      for (let i = 0; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      finalTranscript = current;
    };

    recognition.onend = async () => {
      setIsListening(false);
      
      const transcript = finalTranscript.trim();
      if (!transcript) {
        setMessages(prev => [...prev, { role: "bot", text: "I couldn't hear anything. Please try again." }]);
        return;
      }

      setMessages(prev => [...prev, { role: "user", text: `🎙️ ${transcript}` }]);
      setLoading(true);

      try {
        const res = await fetch(`http://localhost:8000/ai/generate-catalog`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript })
        });
        
        const data = await res.json();
        
        if (res.ok) {
          const isTelugu = lang === "Telugu";
          const isHindi = lang === "Hindi";
          const isMarathi = lang === "Marathi";
          const localTitle = isTelugu ? data.title_telugu : isHindi ? data.title_hindi : isMarathi ? data.title_marathi : data.title;

          addProduct({
            name: data.title || "New Product",
            nameLocal: localTitle || data.title,
            craft: data.category || "Artisan Craft",
            status: "draft",
            priceLow: Math.round((data.estimated_price || 1500) * 0.85),
            priceHigh: Math.round((data.estimated_price || 1500) * 1.2),
            confidence: "High",
            materials: data.materials || "",
            exceptions: ["Missing photo. Please edit draft to add an image."],
            priceReasoning: data.price_reasoning,
            image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=400&q=80",
            timeHours: 24,
            capturedBy: (typeof window !== "undefined" ? localStorage.getItem("merchantName") : "") || "Artisan",
            merchantId: (typeof window !== "undefined" ? localStorage.getItem("merchantPhone") || localStorage.getItem("merchantName") : "") || "Artisan",
          });
          
          setMessages(prev => [...prev, { 
            role: "bot", 
            text: `I've listed "${data.title}" in your catalog as a draft! Please go to the Catalog tab to add a photo and verify it.`
          }]);
        } else {
          setMessages(prev => [...prev, { role: "bot", text: "I couldn't process that listing right now." }]);
        }
      } catch (err) {
        setMessages(prev => [...prev, { role: "bot", text: "Network error while processing listing." }]);
      } finally {
        setLoading(false);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[88px] right-4 sm:right-[max(1rem,calc((100vw-430px)/2+1rem))] z-40 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          <MessageCircle className="size-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-[88px] right-4 sm:right-[max(1rem,calc((100vw-430px)/2+1rem))] z-40 w-[calc(100vw-32px)] sm:w-[380px] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl flex flex-col h-[420px]">
          <div className="flex items-center justify-between bg-muted/30 p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-success"></div>
              <span className="text-sm font-semibold">KalaMitr</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-muted text-muted-foreground">
              <X className="size-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground my-auto h-full flex flex-col items-center justify-center gap-2">
                <p className="text-xs">
                  Ask me anything, or tap the microphone to instantly list a product using your voice!
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border bg-background flex items-center gap-2">
            <button
              onClick={handleVoiceListing}
              className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors ${isListening ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              title="Voice Listing"
            >
              <Mic className="size-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Message KalaMitr..."
              className="flex-1 min-w-0 bg-muted/50 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/30"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="size-4 shrink-0 -ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
