"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Building2, Target, Send } from "lucide-react";

const SECTORS = [
  { id: "Inmobiliarias", label: "Inmobiliarias", desc: "Clasificación de leads, portales y turnos" },
  { id: "Clínicas y Salud", label: "Clínicas y Salud", desc: "Agendamiento de turnos y triaje" },
  { id: "E-Commerce & Retail", label: "E-Commerce", desc: "Seguimiento de pedidos y soporte 24/7" },
  { id: "Contables y Jurídicos", label: "Estudios Contables", desc: "Recepciones de documentos y vencimientos" },
  { id: "Gastronomía", label: "Gastronomía", desc: "Reservas, pedidos y fidelización" },
  { id: "Talleres y Servicios", label: "Talleres / Servicios", desc: "Presupuestos y estados de reparación" },
  { id: "Otro Sector", label: "Otro Sector", desc: "Soluciones a medida para cualquier industria" },
];

const CHALLENGES = [
  { id: "Atención WhatsApp 24/7", label: "Atención y Ventas 24/7", desc: "Responder inmediatamente a consultas sin perder prospectos fuera de horario." },
  { id: "Agendamiento de Citas", label: "Agendamiento Inteligente", desc: "Sincronizar turnos y reuniones directamente en el calendario del equipo." },
  { id: "Triaje y Calificación", label: "Triaje y Calificación de Leads", desc: "Filtrar leads fríos de compradores reales antes de pasar a un vendedor." },
  { id: "Automatización Administrativa", label: "Carga de Datos / CRM", desc: "Eliminar el tipeo manual en planillas, Supabase, ERP o CRM." },
  { id: "Agente de Voz IA", label: "Agente de Voz por Teléfono", desc: "Atender llamadas de voz entrantes y salientes con respuestas humanas." },
];

type Status = "idle" | "loading" | "success" | "error" | "rate_limited";

export default function PlanPersonalizado() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [aceptaTerminos, setAceptaTerminos] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    descripcion: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  const toggleChallenge = (id: string) => {
    setSelectedChallenges((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#plan-a-medida") {
      const el = document.getElementById("plan-a-medida");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !aceptaTerminos) return;

    setStatus("loading");

    const challengesStr = selectedChallenges.join(", ");
    const payload = {
      nombre: formData.nombre,
      empresa: formData.empresa || selectedSector,
      email: formData.email,
      telefono: formData.telefono,
      volumenAprox: challengesStr,
      descripcion: `[Sector: ${selectedSector}] [Objetivos: ${challengesStr}] ${formData.descripcion}`,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 429) {
        setStatus("rate_limited");
        return;
      }
      if (!res.ok) throw new Error("request_failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="seccion-plan-a-medida" className="section-y relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] border border-brand-500/40 bg-gradient-to-br from-[#0e1642] via-[#080d2c] to-[#160c38] p-8 md:p-14 shadow-[0_0_70px_-15px_rgba(67,86,253,0.35)] backdrop-blur-2xl"
        >
          {/* Ambient Lighting */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-500/30 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent-cyan/20 blur-[120px]" />

          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            {/* Left Column: Value Proposition */}
            <div className="flex flex-col justify-center">
              <span className="eyebrow w-fit">
                <Sparkles className="h-3.5 w-3.5 text-accent-cyan" />
                Diagnóstico de Automatización
              </span>
              <h2 className="mt-6 text-balance font-display text-3xl font-bold leading-tight md:text-4xl">
                Diseñamos la estrategia de IA exacta para tu empresa
              </h2>
              <p className="mt-5 max-w-[52ch] text-pretty leading-relaxed text-ink-muted">
                Completá 3 breves pasos para obtener una propuesta de alcance técnico y retorno estimado en menos de 48 horas sin costo.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { title: "Evaluación sin costo", desc: "Analizamos tus procesos actuales y detectamos cuellos de botella." },
                  { title: "Propuesta Técnica en 48hs", desc: "Te enviamos la arquitectura recomendada con retorno estimado de inversión." },
                  { title: "Cero fricción de integración", desc: "Nos conectamos a tus sistemas existentes sin interrumpir tus ventas." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-cyan/10 text-accent-cyan">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                      <p className="text-xs text-ink-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: 3-Step Interactive Quiz Form */}
            <div id="plan-a-medida" className="scroll-mt-28 md:scroll-mt-36 rounded-3xl border border-white/10 bg-base-900/80 p-6 backdrop-blur-xl md:p-8">
              {/* Progress Indicator */}
              {status !== "success" && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-semibold text-ink-muted">
                    <span className={step >= 1 ? "text-accent-cyan" : ""}>1. Tu Sector</span>
                    <span className={step >= 2 ? "text-accent-cyan" : ""}>2. Tu Objetivo</span>
                    <span className={step >= 3 ? "text-accent-cyan" : ""}>3. Tu Contacto</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-brand-500 to-accent-cyan"
                      initial={{ width: "33%" }}
                      animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full flex-col items-center justify-center py-12 text-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-cyan/20 text-accent-cyan">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">¡Solicitud recibida!</h3>
                  <p className="mt-3 max-w-sm text-sm text-ink-muted">
                    Analizaremos tu caso ({selectedSector || "Empresa"}) y te contactaremos en menos de 48hs con la propuesta a medida.
                  </p>
                  <button
                    onClick={() => {
                      setStatus("idle");
                      setStep(1);
                    }}
                    className="mt-6 text-xs text-brand-300 underline hover:text-white"
                  >
                    Enviar otra consulta
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h3 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                        <Building2 className="h-5 w-5 text-accent-cyan" />
                        ¿En qué sector opera tu empresa?
                      </h3>
                      <p className="mt-1 text-xs text-ink-muted">
                        Seleccioná tu rubro para adaptar las herramientas recomendadas.
                      </p>

                      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                        {SECTORS.map((sec) => (
                          <button
                            key={sec.id}
                            type="button"
                            onClick={() => {
                              setSelectedSector(sec.id);
                              setStep(2);
                            }}
                            className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all duration-200 ${
                              selectedSector === sec.id
                                ? "border-accent-cyan bg-accent-cyan/10 text-white"
                                : "border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05]"
                            }`}
                          >
                            <span className="text-xs font-semibold text-white">{sec.label}</span>
                            <span className="mt-0.5 text-[11px] text-ink-muted">{sec.desc}</span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          disabled={!selectedSector}
                          onClick={() => setStep(2)}
                          className="btn-pill !py-2.5 !px-5 text-xs disabled:opacity-40"
                        >
                          Siguiente paso
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h3 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                        <Target className="h-5 w-5 text-accent-cyan" />
                        ¿Cuáles son tus objetivos?
                      </h3>
                      <p className="mt-1 text-xs text-ink-muted">
                        Podés seleccionar uno o varios objetivos para tu empresa.
                      </p>

                      <div className="mt-5 space-y-2.5">
                        {CHALLENGES.map((ch) => {
                          const isChecked = selectedChallenges.includes(ch.id);
                          return (
                            <button
                              key={ch.id}
                              type="button"
                              onClick={() => toggleChallenge(ch.id)}
                              className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                                isChecked
                                  ? "border-accent-cyan bg-accent-cyan/15 text-white shadow-[0_0_20px_rgba(94,230,216,0.15)]"
                                  : "border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05]"
                              }`}
                            >
                              <div
                                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded transition-all ${
                                  isChecked
                                    ? "bg-accent-cyan text-base-900 shadow-[0_0_10px_rgba(94,230,216,0.5)]"
                                    : "border border-white/30 bg-white/5"
                                }`}
                              >
                                {isChecked && <CheckCircle2 className="h-3.5 w-3.5 stroke-[3]" />}
                              </div>
                              <div>
                                <span className="text-xs font-semibold text-white">{ch.label}</span>
                                <p className="text-[11px] text-ink-muted">{ch.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-white"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" /> Volver
                        </button>
                        <button
                          type="button"
                          disabled={selectedChallenges.length === 0}
                          onClick={() => setStep(3)}
                          className="btn-pill !py-2.5 !px-5 text-xs disabled:opacity-40"
                        >
                          Siguiente paso ({selectedChallenges.length})
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h3 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                        <Send className="h-5 w-5 text-accent-cyan" />
                        ¿A dónde te enviamos la propuesta?
                      </h3>
                      <p className="mt-1 text-xs text-ink-muted">
                        Último paso. Recibirás el informe a medida en menos de 48 horas.
                      </p>

                      <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="field-label">Nombre *</label>
                            <input
                              name="nombre"
                              type="text"
                              required
                              placeholder="Ej: Nicolas Mantecon"
                              value={formData.nombre}
                              onChange={handleInputChange}
                              className="field !py-2 !text-xs"
                            />
                          </div>
                          <div>
                            <label className="field-label">Empresa</label>
                            <input
                              name="empresa"
                              type="text"
                              placeholder="Nombre de tu empresa"
                              value={formData.empresa}
                              onChange={handleInputChange}
                              className="field !py-2 !text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="field-label">Email Profesional *</label>
                            <input
                              name="email"
                              type="email"
                              required
                              placeholder="vos@empresa.com"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="field !py-2 !text-xs"
                            />
                          </div>
                          <div>
                            <label className="field-label">WhatsApp / Teléfono</label>
                            <input
                              name="telefono"
                              type="tel"
                              placeholder="+54 9 11 ..."
                              value={formData.telefono}
                              onChange={handleInputChange}
                              className="field !py-2 !text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="field-label">Detalles adicionales (opcional)</label>
                          <textarea
                            name="descripcion"
                            rows={2}
                            placeholder="Comentarios sobre tus sistemas actuales (CRM, WhatsApp, etc.)..."
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            className="field resize-none !py-2 !text-xs"
                          />
                        </div>

                        {/* Terms & Privacy Checkbox */}
                        <label className="flex items-start gap-2.5 pt-1 text-xs leading-relaxed text-ink-muted cursor-pointer select-none">
                          <input
                            type="checkbox"
                            name="aceptaTerminos"
                            checked={aceptaTerminos}
                            onChange={(e) => setAceptaTerminos(e.target.checked)}
                            required
                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/[0.03] text-brand-500 accent-brand-500 cursor-pointer"
                          />
                          <span>
                            Acepto la{" "}
                            <a
                              href="/politica-de-privacidad"
                              target="_blank"
                              rel="noreferrer"
                              className="text-white underline underline-offset-2 hover:text-accent-cyan"
                            >
                              Política de Privacidad
                            </a>{" "}
                            y los{" "}
                            <a
                              href="/terminos-y-condiciones"
                              target="_blank"
                              rel="noreferrer"
                              className="text-white underline underline-offset-2 hover:text-accent-cyan"
                            >
                              Términos y Condiciones
                            </a>
                            .
                          </span>
                        </label>

                        <div className="mt-4 flex items-center justify-between pt-2">
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-white"
                          >
                            <ArrowLeft className="h-3.5 w-3.5" /> Volver
                          </button>

                          <button
                            type="submit"
                            disabled={status === "loading" || !formData.nombre || !formData.email || !aceptaTerminos}
                            className="btn-pill !py-2.5 !px-6 text-xs disabled:opacity-40"
                          >
                            {status === "loading" ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                Solicitar propuesta
                                <Send className="h-3.5 w-3.5" />
                              </>
                            )}
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-subtle">
                          <ShieldCheck className="h-3.5 w-3.5 text-accent-cyan" />
                          <span>Datos 100% confidenciales y protegidos. Sin compromiso.</span>
                        </div>

                        {status === "error" && (
                          <p className="text-center text-xs text-red-400">
                            Algo salió mal. Por favor intentá de nuevo o escribinos a hola@busago.studio
                          </p>
                        )}
                        {status === "rate_limited" && (
                          <p className="text-center text-xs text-red-400">
                            Ya recibimos tu solicitud. Nos contactaremos a la brevedad.
                          </p>
                        )}
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
