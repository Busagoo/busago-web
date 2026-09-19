import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Qué datos recolecta Busago, para qué los usa, con quién los comparte y cómo ejercer tus derechos sobre tu información personal.",
};

const ACTUALIZADO = "13 de agosto de 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/10 py-8 first:border-t-0 first:pt-0">
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-muted md:text-base">
        {children}
      </div>
    </section>
  );
}

export default function PoliticaDePrivacidadPage() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pt-48">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[140px]" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow w-fit">
            <ShieldCheck className="h-3.5 w-3.5" />
            Política de Privacidad
          </span>
          <h1 className="mt-6 text-balance font-display text-3xl font-bold leading-tight md:text-5xl">
            Cómo tratamos tu información
          </h1>
          <p className="mt-5 text-balance text-white/60 md:text-lg">
            Última actualización: {ACTUALIZADO}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          <Section title="Quiénes somos">
            <p>
              Esta política aplica al sitio busago.ai, operado por Busago ("nosotros"), agencia de
              automatización de procesos con Inteligencia Artificial con base en Buenos Aires,
              Argentina. Para cualquier consulta sobre tus datos personales, escribinos a{" "}
              <a href="mailto:bustosthiagoagustin@gmail.com" className="text-white underline underline-offset-2">
                bustosthiagoagustin@gmail.com
              </a>
              .
            </p>
          </Section>

          <Section title="Qué datos recolectamos">
            <p>Recolectamos información en tres puntos del sitio:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">Formulario de diagnóstico ("Plan a medida"):</strong>{" "}
                nombre, empresa, email, teléfono, volumen aproximado de interacciones y la
                descripción del proceso que quisiste contarnos. También guardamos tu dirección IP
                para prevenir spam y abuso del formulario.
              </li>
              <li>
                <strong className="text-white">Chat de IA (Busaia):</strong> los mensajes que
                escribís o los audios que grabás en la demo de chat. Si mandás un audio, se
                transcribe automáticamente a texto usando el servicio de Groq (modelo Whisper); el
                audio no queda almacenado, sólo se procesa para transcribirlo. Si en la
                conversación nos dejás tu nombre, empresa o email, ese contacto se guarda para que
                nuestro equipo te escriba.
              </li>
              <li>
                <strong className="text-white">Agente de voz (Busaia, demo en vivo):</strong> la
                llamada se procesa en tiempo real para que el agente te responda; no grabamos ni
                almacenamos el audio de la conversación. Sí guardamos un resumen de los puntos más
                importantes de la charla (por ejemplo, qué proceso te interesa automatizar), para
                que el equipo pueda hacer seguimiento.
              </li>
            </ul>
          </Section>

          <Section title="Para qué usamos tus datos">
            <ul className="list-disc space-y-2 pl-5">
              <li>Contactarte para coordinar el relevamiento o diagnóstico que pediste.</li>
              <li>Armar una propuesta técnica y de alcance para tu proyecto.</li>
              <li>Responder tus consultas a través del chat o el agente de voz.</li>
              <li>Prevenir abuso o uso indebido de nuestros formularios y demos.</li>
            </ul>
            <p>No usamos tus datos para publicidad ni los vendemos a terceros.</p>
          </Section>

          <Section title="Con quién compartimos tu información">
            <p>
              No compartimos tus datos con terceros que los usen para fines propios. Sí trabajamos
              con proveedores de infraestructura que procesan datos en nuestro nombre, únicamente
              para operar el sitio:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">Supabase</strong> — base de datos donde se
                almacenan los leads del formulario y del chat.
              </li>
              <li>
                <strong className="text-white">Groq</strong> — procesa el texto y los audios del
                chat de IA para generar respuestas y transcripciones.
              </li>
              <li>
                <strong className="text-white">LiveKit</strong> — infraestructura de audio en
                tiempo real que conecta tu navegador con el agente de voz durante la demo.
              </li>
            </ul>
          </Section>

          <Section title="Cuánto tiempo conservamos tus datos">
            <p>
              Conservamos tu información mientras sea necesaria para el fin comercial por el que
              la dejaste (contactarte, avanzar una propuesta) o hasta que nos pidas que la
              eliminemos, lo que ocurra primero.
            </p>
          </Section>

          <Section title="Tus derechos">
            <p>
              De acuerdo a la Ley 25.326 de Protección de Datos Personales de Argentina, tenés
              derecho a acceder, rectificar y solicitar la supresión de tus datos personales en
              cualquier momento. Para ejercer estos derechos, escribinos a{" "}
              <a href="mailto:bustosthiagoagustin@gmail.com" className="text-white underline underline-offset-2">
                bustosthiagoagustin@gmail.com
              </a>
              . La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control
              de la Ley 25.326, tiene la atribución de atender denuncias y reclamos que interpongan
              quienes resulten afectados en sus derechos.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              Este sitio no usa cookies de analítica, publicidad ni seguimiento de terceros. Si eso
              cambia en el futuro, vamos a actualizar esta política antes de implementarlo.
            </p>
          </Section>

          <Section title="Cambios a esta política">
            <p>
              Podemos actualizar esta política a medida que el sitio o nuestros servicios cambien.
              La fecha de "última actualización" al principio de esta página siempre va a reflejar
              la versión vigente.
            </p>
          </Section>
        </div>
      </div>
    </section>
  );
}
