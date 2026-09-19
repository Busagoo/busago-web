"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Mic, MicOff, RotateCcw, X } from "lucide-react";
import { Room, RoomEvent, Track } from "livekit-client";
import { useDialog } from "@/lib/use-dialog";

type Status = "idle" | "connecting" | "connected" | "error";

// Demo en vivo del agente de voz Busaia: pide un token efímero, conecta
// directo con livekit-client a una room nueva (el agente tiene dispatch
// automático, así que se une solo) y reproduce su audio en un modal
// translúcido tipo glass. Portal a <body> porque la card contenedora tiene
// overflow-hidden y recortaría el modal.
//
// El disparador vive en la card (ServiciosBentoVideo), que necesita ubicarlo
// en distinta posición según el breakpoint; acá sólo se recibe `open`.
export default function VoiceAgentDemo({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [muted, setMuted] = useState(false);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [agentJoined, setAgentJoined] = useState(false);
  const [needsAudioUnlock, setNeedsAudioUnlock] = useState(false);
  const roomRef = useRef<Room | null>(null);
  const audioContainerRef = useRef<HTMLDivElement | null>(null);
  // El handler de Disconnected de LiveKit se registra una sola vez; guardamos
  // onClose en un ref para que no capture una versión vieja de la prop.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => setMounted(true), []);

  const cleanup = useCallback(() => {
    roomRef.current?.disconnect();
    roomRef.current = null;
    if (audioContainerRef.current) audioContainerRef.current.innerHTML = "";
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const startCall = useCallback(async () => {
    setStatus("connecting");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/livekit/token", { method: "POST" });
      if (!res.ok) throw new Error("token_failed");
      const { serverUrl, participantToken } = (await res.json()) as {
        serverUrl: string;
        participantToken: string;
      };

      const room = new Room();
      roomRef.current = room;

      room.on(RoomEvent.ParticipantConnected, (participant) => {
        console.info("Se unió a la room:", participant.identity);
        setAgentJoined(true);
      });
      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === Track.Kind.Audio) {
          const el = track.attach();
          audioContainerRef.current?.appendChild(el);
          el.play().catch((err) => {
            console.warn("Autoplay bloqueado, hace falta interacción:", err);
            setNeedsAudioUnlock(true);
          });
        }
      });
      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        track.detach().forEach((el) => el.remove());
      });
      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        setAgentSpeaking(speakers.some((p) => !p.isLocal));
      });
      room.on(RoomEvent.Disconnected, () => {
        setStatus("idle");
        onCloseRef.current();
      });

      await room.connect(serverUrl, participantToken);
      setAgentJoined(room.remoteParticipants.size > 0);
      await room.localParticipant.setMicrophoneEnabled(true);
      setStatus("connected");
    } catch (err) {
      console.error("Error conectando al agente de voz:", err);
      roomRef.current?.disconnect();
      roomRef.current = null;
      setStatus("error");
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setErrorMsg(
          "Necesitamos acceso a tu micrófono para la demo. Habilitalo en los permisos del navegador y probá de nuevo."
        );
      } else {
        setErrorMsg("No pudimos conectar con el agente. Probá de nuevo en unos segundos.");
      }
    }
  }, []);

  // La llamada arranca sola al abrirse el modal, no antes: nada de LiveKit se
  // negocia mientras el usuario sólo está scrolleando la sección.
  useEffect(() => {
    if (open) void startCall();
  }, [open, startCall]);

  function handleClose() {
    cleanup();
    onClose();
    setStatus("idle");
    setAgentSpeaking(false);
    setAgentJoined(false);
    setNeedsAudioUnlock(false);
  }

  useDialog(open, handleClose);

  function unlockAudio() {
    audioContainerRef.current?.querySelectorAll("audio").forEach((el) => {
      void el.play();
    });
    setNeedsAudioUnlock(false);
  }

  function toggleMute() {
    const room = roomRef.current;
    if (!room) return;
    const next = !muted;
    void room.localParticipant.setMicrophoneEnabled(!next);
    setMuted(next);
  }

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
                aria-label="Demo del agente de voz"
                className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-base-850/80 p-8 text-center shadow-lift backdrop-blur-2xl"
              >
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Cerrar"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-subtle transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>

                <div
                  ref={audioContainerRef}
                  style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}
                />

                <div className="mx-auto flex h-28 w-28 items-center justify-center">
                  <motion.div
                    animate={
                      status === "connected"
                        ? { scale: agentSpeaking ? [1, 1.15, 1] : 1 }
                        : { scale: 1 }
                    }
                    transition={{
                      duration: 0.8,
                      repeat: agentSpeaking ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                    className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-accent-cyan shadow-[0_16px_44px_-14px_rgba(94,230,216,0.75)]"
                  >
                    {status === "connecting" && (
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    )}
                  </motion.div>
                </div>

                <h3 className="mt-6 font-display text-lg font-semibold text-white">
                  {status === "connecting" && "Conectando con Busaia..."}
                  {status === "connected" && !agentJoined && "Conectado, esperando a Busaia..."}
                  {status === "connected" && agentJoined && "Estás hablando con Busaia"}
                  {status === "error" && "Algo salió mal"}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  {status === "connecting" && "Puede tardar unos segundos."}
                  {status === "connected" &&
                    !agentJoined &&
                    "El agente puede tardar unos segundos en unirse. Si esto no cambia, avisale a soporte."}
                  {status === "connected" &&
                    agentJoined &&
                    "Hablá normal, el agente te escucha en tiempo real."}
                  {status === "error" && errorMsg}
                </p>

                {status === "connected" && needsAudioUnlock && (
                  <button
                    type="button"
                    onClick={unlockAudio}
                    className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full bg-accent-cyan/20 px-4 py-2.5 text-xs font-semibold text-accent-cyan transition-colors hover:bg-accent-cyan/30"
                  >
                    Tocá para activar el audio
                  </button>
                )}

                {status === "connected" && (
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                  >
                    {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {muted ? "Mic apagado" : "Mic activo"}
                  </button>
                )}

                {status === "error" && (
                  <button
                    type="button"
                    onClick={() => void startCall()}
                    className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white shadow-brand transition-colors hover:bg-brand-400"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reintentar
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/20"
                >
                  {status === "connected" ? "Cortar" : "Cancelar"}
                </button>

                <p className="mt-4 text-[11px] leading-relaxed text-ink-subtle">
                  No grabamos el audio de esta llamada; guardamos un resumen de la conversación
                  para hacer seguimiento.{" "}
                  <a href="/politica-de-privacidad" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-white">
                    Política de Privacidad
                  </a>
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
