"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

function TypewriterText({ text, speed = 16 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return <span>{displayedText}</span>;
}

export default function FaqChat() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages.length > 0 || loading) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg = { role: "user" as const, text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/faq-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId }),
      });
      const data = (await res.json()) as { sessionId?: string; reply?: string; text?: string };
      if (data?.sessionId && !sessionId) setSessionId(data.sessionId);
      const reply = data?.reply ?? data?.text ?? "Lo siento, no pude procesar tu pregunta.";
      
      const cleaned = reply.trim();
      let parts = cleaned
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);

      if (parts.length <= 1 && cleaned.length > 160) {
        const bySentence = cleaned
          .split(/(?<=[.!?])\s+(?=[A-Z\u00C1\u00C9\u00CD\u00D3\u00DA\u00D1\u00BF\u00A1])/)
          .map((p) => p.trim())
          .filter(Boolean);
        if (bySentence.length > 1) parts = bySentence;
      }

      const newBubbles = (parts.length > 0 ? parts : [cleaned]).map((text) => ({
        role: "assistant" as const,
        text,
      }));

      setMessages((m) => [...m, ...newBubbles]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { role: "assistant", text: "Error al conectar con el agente." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-white/15 bg-base-900/70 p-4 sm:p-5 shadow-lift backdrop-blur-md overflow-hidden">
      <div className="space-y-3.5 max-h-80 overflow-y-auto px-1 scroll-smooth">
        {messages.length === 0 && !loading && (
          <p className="text-xs sm:text-sm text-ink-muted text-center py-4">
            Escribí tu consulta sobre nuestros servicios o sectores y te responderemos en el acto.
          </p>
        )}
        {messages.map((m, i) => {
          const isLatest = i === messages.length - 1;
          return (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-brand-500 to-brand-400 text-white shadow-[0_0_20px_rgba(67,86,253,0.35)] font-medium"
                    : "border border-white/15 bg-white/[0.08] text-white/95 shadow-sm backdrop-blur-md"
                } max-w-[85%] text-pretty`}
              >
                {m.role === "assistant" && isLatest ? (
                  <TypewriterText text={m.text} />
                ) : (
                  <span>{m.text}</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Indicador de escritura "3 puntitos" cuando el agente está pensando */}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3 border border-white/15 bg-white/[0.08] backdrop-blur-md shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent-cyan animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-accent-cyan animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-accent-cyan animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input container */}
      <div className="mt-4 flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-white/[0.06] p-1.5 focus-within:border-accent-cyan focus-within:shadow-[0_0_25px_rgba(94,230,216,0.3)] transition-all backdrop-blur-md">
        <input
          className="min-w-0 flex-1 w-full bg-transparent px-3.5 py-1.5 text-xs sm:text-sm text-white placeholder:text-white/40 outline-none"
          placeholder="Escribí tu pregunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          className={`shrink-0 rounded-full h-9 w-9 flex items-center justify-center transition-all ${
            loading
              ? "bg-white/10 text-white/30 cursor-not-allowed"
              : "bg-gradient-to-r from-brand-500 to-accent-cyan text-white shadow-[0_0_20px_rgba(94,230,216,0.3)] hover:opacity-90 active:scale-95"
          }`}
          onClick={handleSend}
          disabled={loading || !input.trim()}
          aria-label="Enviar mensaje"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
