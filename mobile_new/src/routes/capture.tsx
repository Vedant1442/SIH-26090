import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Camera, Mic, Sparkles, Volume2, Check, Loader2, Wand2, X, ZapIcon } from "lucide-react";
import { AppShell, Panel, PanelRow, Tag } from "@/components/kala/shell";
import { captureSteps } from "@/data/kalasangam";
import { useStore } from "@/lib/store";

const API = "http://localhost:8000";

export const Route = createFileRoute("/capture")({
  head: () => ({
    meta: [
      { title: "Voice Capture Studio — Kalasangam" },
      {
        name: "description",
        content:
          "Photograph a craft, enhance it on device, describe it by voice and let AI draft a multilingual catalog listing with a transparent price.",
      },
    ],
  }),
  component: CapturePage,
});

function CameraModal({ onCapture, onClose }: { onCapture: (blob: Blob) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {
        // fallback to any camera
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          .then((stream) => {
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
          });
      });

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        onCapture(blob);
      }
    }, "image/jpeg", 0.92);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-medium text-white">Camera</span>
        <button onClick={onClose} className="grid size-8 place-items-center rounded-full bg-white/20 text-white">
          <X className="size-4" />
        </button>
      </div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="flex-1 object-cover w-full"
      />
      <div className="flex items-center justify-center pb-10 pt-6">
        <button
          onClick={capture}
          className="grid size-20 place-items-center rounded-full border-4 border-white bg-white/20 transition-transform active:scale-90"
        >
          <div className="size-14 rounded-full bg-white" />
        </button>
      </div>
    </div>
  );
}

function CapturePage() {
  const navigate = useNavigate();
  const { addProduct } = useStore();
  const [step, setStep] = useState(1);
  const [recording, setRecording] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Camera modal
  const [showCamera, setShowCamera] = useState(false);

  // Voice
  const [transcript, setTranscript] = useState("");
  const transcriptRef = useRef("");
  const recognitionRef = useRef<any>(null);

  // AI-generated listing fields
  const [title, setTitle] = useState("");
  const [titleHindi, setTitleHindi] = useState("");
  const [titleTelugu, setTitleTelugu] = useState("");
  const [titleMarathi, setTitleMarathi] = useState("");
  const [category, setCategory] = useState("");
  const [materials, setMaterials] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoDescriptionHindi, setSeoDescriptionHindi] = useState("");
  const [seoDescriptionMarathi, setSeoDescriptionMarathi] = useState("");
  const [price, setPrice] = useState(0);
  const [priceLow, setPriceLow] = useState(0);
  const [priceHigh, setPriceHigh] = useState(0);
  const [priceReasoning, setPriceReasoning] = useState("");
  const [confidence, setConfidence] = useState<"High" | "Medium" | "Low">("High");

  // Image enhancement
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [enhancing, setEnhancing] = useState(false);

  const merchantName = typeof window !== "undefined" ? localStorage.getItem("merchantName") || "Artisan" : "Artisan";
  const merchantLang = typeof window !== "undefined" ? localStorage.getItem("merchantLang") || "English" : "English";

  // ----- IMAGE PROCESSING (shared by camera capture + file picker) -----
  const processImageBlob = async (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setOriginalImage(url);
    setEnhancedImage(null);
    setEnhancing(true);
    setShowCamera(false);

    try {
      const formData = new FormData();
      formData.append("file", blob, "photo.jpg");
      const res = await fetch(`${API}/ai/enhance`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Enhancement failed");
      const enhanced = await res.blob();
      setEnhancedImage(URL.createObjectURL(enhanced));
    } catch (err) {
      console.error("Image enhancement error:", err);
      setEnhancedImage(url); // fallback to original
    } finally {
      setEnhancing(false);
    }
  };

  // ----- VOICE RECORDING -----
  const startRecording = () => {
    setRecording(true);
    setTranscript("Listening...");
    transcriptRef.current = "";
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser. Use Chrome.");
      setRecording(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = merchantLang.includes("Telugu") ? "te-IN" : merchantLang.includes("Hindi") ? "hi-IN" : merchantLang.includes("Marathi") ? "mr-IN" : "en-IN";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      let t = "";
      for (let i = 0; i < event.results.length; ++i) {
        t += event.results[i][0].transcript;
      }
      setTranscript(t);
      transcriptRef.current = t;
    };

    recognition.onend = () => {
      setRecording(false);
      if (transcriptRef.current && transcriptRef.current !== "Listening...") {
        callAI(transcriptRef.current);
      }
    };

    recognition.start();
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
  };

  // ----- REAL AI CATALOG GENERATION -----
  const callAI = async (text: string) => {
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch(`${API}/ai/generate-catalog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "AI request failed");
      }
      const data = await res.json();

      setTitle(data.title || "");
      setTitleHindi(data.title_hindi || "");
      setTitleTelugu(data.title_telugu || "");
      setTitleMarathi(data.title_marathi || "");
      setCategory(data.category || "Artisan Craft");
      setMaterials(data.materials || "");
      setSeoDescription(data.seo_description || "");
      setSeoDescriptionHindi(data.seo_description_hindi || "");
      setSeoDescriptionMarathi(data.seo_description_marathi || "");
      setPrice(data.estimated_price || 1500);
      setPriceLow(Math.round((data.estimated_price || 1500) * 0.85));
      setPriceHigh(Math.round((data.estimated_price || 1500) * 1.2));
      setPriceReasoning(data.price_reasoning || "");
      setStep(4);

      // Also get detailed pricing breakdown
      await callPricing(data.title, data.materials, data.category, data.estimated_price);
    } catch (err: any) {
      setAiError(err.message || "AI failed. Check console.");
      console.error(err);
      // Fallback to simple local parser
      localFallback(text);
    } finally {
      setAiLoading(false);
    }
  };

  const callPricing = async (t: string, m: string, c: string, basePrice: number) => {
    try {
      const res = await fetch(`${API}/ai/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: t, materials: m, category: c }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setPriceLow(data.price_low || basePrice * 0.85);
      setPriceHigh(data.price_high || basePrice * 1.2);
      setPrice(data.recommended_price || basePrice);
      setConfidence(data.confidence || "High");
      setPriceReasoning(data.market_insight || "");
    } catch { /* Ignore pricing failures */ }
  };

  // Simple local fallback if AI fails
  const localFallback = (text: string) => {
    const lower = text.toLowerCase();
    const priceMatch = text.match(/(\d+)/);
    const p = priceMatch && priceMatch[1] ? parseInt(priceMatch[1], 10) : 1500;
    setTitle(text.slice(0, 40));
    setPrice(p);
    setPriceLow(Math.round(p * 0.85));
    setPriceHigh(Math.round(p * 1.2));
    setCategory(lower.includes("wood") ? "Furniture › Wooden Craft" : lower.includes("clay") ? "Home décor › Pottery" : "Artisan Craft");
    setMaterials(lower.includes("wood") ? "Wood" : lower.includes("clay") ? "Clay" : "Natural materials");
    setStep(4);
  };

  const playVoice = () => {
    if (!title) return;
    const isMarathi = merchantLang.includes("Marathi");
    const isHindi = merchantLang.includes("Hindi");
    const isTelugu = merchantLang.includes("Telugu");
    
    // Choose the best string based on language
    const displayTitle = isTelugu ? titleTelugu : isHindi ? titleHindi : isMarathi ? titleMarathi : title;
    const displayDesc = isMarathi ? seoDescriptionMarathi : isHindi ? seoDescriptionHindi : seoDescription;
    
    const utterance = new SpeechSynthesisUtterance(`${displayTitle}. Price: ${price} rupees. ${displayDesc}`);
    utterance.lang = isTelugu ? "te-IN" : isHindi ? "hi-IN" : isMarathi ? "mr-IN" : "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  const handleSave = () => {
    setStep(5);
    const merchantId =
      (typeof window !== "undefined"
        ? localStorage.getItem("merchantPhone") || localStorage.getItem("merchantName")
        : "") || merchantName;

    addProduct({
      name: title,
      nameLocal: titleTelugu || titleMarathi || titleHindi || title,
      craft: category,
      status: "pending",
      priceLow,
      priceHigh,
      confidence,
      capturedBy: merchantName,
      merchantId,
      image: enhancedImage || originalImage || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&q=70",
      materials,
      timeHours: 10,
      exceptions: [],
      priceReasoning,
    });
    setTimeout(() => navigate({ to: "/catalog" }), 600);
  };

  const displayImage = enhancedImage || originalImage;

  return (
    <>
      {showCamera && (
        <CameraModal
          onCapture={processImageBlob}
          onClose={() => setShowCamera(false)}
        />
      )}
      <AppShell title="Capture" subtitle={`Speaking in ${merchantLang.split(" ")[0]}`}>

      {/* STEP 1: PHOTO */}
      <Panel title="Step 1 · Take a photo">
        <div className="relative bg-muted">
          {displayImage ? (
            <img
              src={displayImage}
              alt="Product"
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 text-muted-foreground">
              <Camera className="size-12 opacity-30" />
              <p className="text-sm">No photo yet</p>
            </div>
          )}
          {enhancing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="flex flex-col items-center gap-2 text-white">
                <Loader2 className="size-8 animate-spin" />
                <p className="text-sm font-medium">AI removing background…</p>
              </div>
            </div>
          )}
          {enhancedImage && !enhancing && (
            <span className="absolute bottom-3 left-3 rounded-full bg-success/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-success-foreground">
              ✓ AI Enhanced
            </span>
          )}
        </div>

        {/* File picker for gallery (no camera constraint) */}
        <input
          id="gallery-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processImageBlob(file);
          }}
        />

        <div className="hairline grid grid-cols-2">
          <button
            onClick={() => setShowCamera(true)}
            className="flex cursor-pointer items-center justify-center gap-2 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            <Camera className="size-4" /> {displayImage ? "Retake" : "Take Photo"}
          </button>
          <label
            htmlFor="gallery-input"
            className="flex cursor-pointer items-center justify-center gap-2 border-l border-border py-3 text-sm font-medium text-primary hover:bg-muted/50 transition-colors"
          >
            <Sparkles className="size-4" /> {displayImage ? "From Gallery" : "Choose File"}
          </label>
        </div>
      </Panel>

      {/* STEP 2: VOICE */}
      <Panel title="Step 2 · Describe by voice">
        <div className="flex flex-col items-center gap-3 p-6">
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={aiLoading}
            className={`grid size-24 place-items-center rounded-full transition-transform active:scale-95 ${
              recording ? "animate-pulse bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
            } disabled:opacity-50`}
          >
            {aiLoading ? <Loader2 className="size-9 animate-spin" /> : <Mic className="size-9" />}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            {aiLoading ? "AI is generating listing…" : recording ? "Tap to stop recording" : "Tap mic and describe your product"}
          </p>
          <div className="flex h-8 items-end gap-1">
            {[6, 14, 22, 10, 26, 18, 8, 20, 12, 24, 9, 16].map((h, i) => (
              <span key={i} className="w-1.5 rounded-full bg-primary/40 transition-all" style={{ height: recording ? h : 4 }} />
            ))}
          </div>
        </div>
        {transcript && (
          <div className="hairline bg-muted/50 px-4 py-3">
            <p className="panel-label">Live Transcript</p>
            <p className="mt-1 text-sm">{transcript}</p>
          </div>
        )}
        {aiError && (
          <div className="hairline bg-destructive/10 px-4 py-3 text-xs text-destructive">{aiError}</div>
        )}
      </Panel>

      {/* STEP 3: AI CATALOG (shown after AI runs) */}
      {step >= 4 && title && (
        <Panel title="Step 3 · AI Generated Listing">
          <PanelRow>
            <span className="panel-label w-28 shrink-0">Title (EN)</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="min-w-0 flex-1 border-b border-dashed border-primary/50 bg-transparent text-sm focus:border-primary focus:outline-none"
            />
          </PanelRow>
          {titleHindi && (
            <PanelRow>
              <span className="panel-label w-28 shrink-0">Hindi</span>
              <span className="min-w-0 flex-1 text-sm">{titleHindi}</span>
            </PanelRow>
          )}
          {titleTelugu && (
            <PanelRow>
              <span className="panel-label w-28 shrink-0">Telugu</span>
              <span className="min-w-0 flex-1 text-sm">{titleTelugu}</span>
            </PanelRow>
          )}
          <PanelRow>
            <span className="panel-label w-28 shrink-0">Category</span>
            <span className="min-w-0 flex-1 text-sm">{category}</span>
          </PanelRow>
          <PanelRow>
            <span className="panel-label w-28 shrink-0">Materials</span>
            <span className="min-w-0 flex-1 text-sm">{materials}</span>
          </PanelRow>
          {seoDescription && (
            <div className="hairline px-4 py-3">
              <p className="panel-label mb-1">SEO Description</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{seoDescription}</p>
            </div>
          )}
          {seoDescriptionHindi && (
            <div className="hairline px-4 py-3">
              <p className="panel-label mb-1">हिंदी विवरण</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{seoDescriptionHindi}</p>
            </div>
          )}
          <button onClick={playVoice} className="panel-row hairline text-primary">
            <Volume2 className="size-4 shrink-0" />
            <span className="text-sm font-medium">Play back in {merchantLang.split(" ")[0]}</span>
          </button>
        </Panel>
      )}

      {/* STEP 4: PRICING */}
      {step >= 4 && price > 0 && (
        <Panel title="Step 4 · Dynamic Price Assessment">
          <div className="hairline flex items-center gap-3 bg-muted/50 px-4 py-4">
            <span className="min-w-0 flex-1">
              <span className="panel-label block">Recommended Price</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-28 border-b border-dashed border-primary/50 bg-transparent font-display text-2xl focus:border-primary focus:outline-none"
              />
              <span className="text-sm text-muted-foreground ml-1">₹</span>
            </span>
            <Tag tone={confidence === "High" ? "success" : confidence === "Medium" ? "warning" : "muted"}>
              {confidence} confidence
            </Tag>
          </div>
          <PanelRow>
            <span className="panel-label w-24 shrink-0">Price range</span>
            <span className="min-w-0 flex-1 font-mono text-sm">₹{priceLow} – ₹{priceHigh}</span>
          </PanelRow>
          {priceReasoning && (
            <div className="hairline px-4 py-3 text-xs text-muted-foreground">{priceReasoning}</div>
          )}
        </Panel>
      )}

      {/* STEP 5: PROGRESS + SAVE */}
      <Panel title="Progress">
        {captureSteps.map((s) => (
          <PanelRow key={s.id}>
            <span className={`grid size-6 shrink-0 place-items-center rounded-full font-mono text-[11px] ${s.id <= step ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
              {s.id <= step ? <Check className="size-3.5" /> : s.id}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{s.title}</span>
              <span className="block truncate text-xs text-muted-foreground">{s.detail}</span>
            </span>
          </PanelRow>
        ))}
      </Panel>

      {step >= 4 && title && (
        <button
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-success py-4 text-base font-bold text-success-foreground shadow-lg active:scale-95"
        >
          <Wand2 className="size-5" /> Confirm & save listing
        </button>
      )}
    </AppShell>
    </>
  );
}
