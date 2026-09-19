"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Mic, Send, Square, X } from "lucide-react";
import { useDialog } from "@/lib/use-dialog";

type ChatMessage = { role: "user" | "assistant"; content: string };

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

// Demo de chat con RAG simple: cada request manda el historial completo +
// los servicios de Busago como contexto (ver /api/chat), sin vector DB —
// el catálogo es chico, así que "meter todo en el prompt" alcanza. Portal a
// <body> por la misma razón que VoiceAgentDemo: la card tiene overflow-hidden.
// Los audios se graban con MediaRecorder, se transcriben en /api/transcribe
// (Whisper vía Groq) y el texto resultante se manda como un mensaje más.
//
// El disparador vive en la card (ServiciosBentoVideo), que necesita ubicarlo
// en distinta posición según el breakpoint; acá sólo se recibe `open`.
export default function ChatDemo({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const leadAlreadySavedRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Saludo inicial al abrir por primera vez; si el usuario cierra y vuelve,
  // se conserva la conversación.
  useEffect(() => {
    if (!open) return;
    setMessages((prev) =>
      prev.length > 0
        ? prev
        : [
            {
              role: "assistant",
              content:
                "Hola, soy Busaia el asistente de Busago. ¿Con quien tengo el gusto de hablar?",
            },
          ]
    );
  }, [open]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, leadAlreadySaved: leadAlreadySavedRef.current }),
      });

      if (!res.ok || !res.body) throw new Error("request_failed");

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const visible = acc
          .replace(/LEAD_SAVED/g, "")
          .replace(/\(Esperando[^\)]*\)/gi, "")
          .trim();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: visible };
          return updated;
        });
      }

      if (acc.includes("LEAD_SAVED")) leadAlreadySavedRef.current = true;

      const cleaned = acc
        .replace(/LEAD_SAVED/g, "")
        .replace(/\(Esperando[^\)]*\)/gi, "")
        .replace(/^[-\*•]\s+/gm, "")
        .trim();
      let parts = cleaned
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);

      if (parts.length <= 1 && cleaned.length > 180) {
        const bySentence = cleaned
          .split(/(?<=[.!?])\s+(?=[A-Z\u00C1\u00C9\u00CD\u00D3\u00DA\u00D1\u00BF\u00A1])/)
          .map((p) => p.trim())
          .filter(Boolean);
        if (bySentence.length > 1) parts = bySentence;
      }

      const bubbles: ChatMessage[] = (parts.length > 0 ? parts : [cleaned]).map((content) => ({
        role: "assistant",
        content,
      }));
      setMessages((prev) => [...prev.slice(0, -1), ...bubbles]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Uy, algo falló. Probá de nuevo en unos segundos." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    setInput("");
    void sendMessage(text);
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await transcribeAndSend(audioBlob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Necesitamos acceso a tu micrófono para mandar audios. Habilitalo en los permisos del navegador.",
        },
      ]);
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  async function transcribeAndSend(audioBlob: Blob) {
    setTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      const res = await fetch("/api/transcribe", { method: "POST", body: formData });
      if (!res.ok) throw new Error("transcribe_failed");

      const { text } = (await res.json()) as { text: string };
      if (text?.trim()) {
        await sendMessage(text.trim());
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "No pudimos transcribir el audio. Probá de nuevo." },
      ]);
    } finally {
      setTranscribing(false);
    }
  }

  function handleClose() {
    if (recording) stopRecording();
    onClose();
  }

  useDialog(open, handleClose);

  const micBusy = loading || transcribing;

  return (
    <>
      {mounted &&
        open &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.target === e.currentTarget && handleClose()}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                role="dialog"
                aria-modal="true"
                aria-label="Asistente Busago"
                className="relative flex h-[min(32rem,80dvh)] w-full max-w-sm flex-col rounded-3xl border border-white/15 bg-base-850/80 shadow-lift backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-white">
                    <span className="h-2 w-2 rounded-full bg-accent-cyan shadow-accent" />
                    Asistente Busago
                  </h3>
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Cerrar"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-ink-subtle transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                  {messages.map((m, i) => {
                    const isLatest = i === messages.length - 1;
                    return (
                      <div
                        key={i}
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          m.role === "user"
                            ? "ml-auto bg-brand-500/80 text-white"
                            : "bg-white/10 text-white/90"
                        }`}
                      >
                        {m.role === "assistant" && isLatest ? (
                          <TypewriterText text={m.content} />
                        ) : (
                          <span>{m.content}</span>
                        )}
                      </div>
                    );
                  })}
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
                  {transcribing && (
                    <div className="ml-auto flex max-w-[85%] items-center gap-2 rounded-2xl bg-brand-500/40 px-4 py-2.5 text-sm text-white/80">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Transcribiendo audio...
                    </div>
                  )}
                  <p className="pt-1 text-center text-[11px] leading-relaxed text-ink-subtle">
                    Este chat usa IA. Los audios se transcriben automáticamente y no se guardan.{" "}
                    <a href="/politica-de-privacidad" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-white">
                      Política de Privacidad
                    </a>
                  </p>
                  <div ref={bottomRef} />
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/10 p-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    aria-label="Mensaje"
                    placeholder={recording ? "Grabando..." : "Escribí o mandá un audio..."}
                    disabled={loading || recording}
                    className="min-h-11 flex-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-brand-400 focus:bg-white/[0.06] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={recording ? stopRecording : startRecording}
                    disabled={micBusy}
                    aria-label={recording ? "Detener grabación" : "Grabar audio"}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-40 ${
                      recording
                        ? "bg-red-500 text-white hover:bg-red-400"
                        : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  <button
                    type="submit"
                    disabled={loading || recording || !input.trim()}
                    aria-label="Enviar"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-400 disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
