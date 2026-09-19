import type { Metadata } from "next";
import { Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Condiciones de uso del sitio busago.ai, de las demos de IA y de los servicios de automatización de Busago.",
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

export default function TerminosYCondicionesPage() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pt-48">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[140px]" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow w-fit">
            <Scale className="h-3.5 w-3.5" />
            Términos y Condiciones
          </span>
          <h1 className="mt-6 text-balance font-display text-3xl font-bold leading-tight md:text-5xl">
            Condiciones de uso del sitio
          </h1>
          <p className="mt-5 text-balance text-white/60 md:text-lg">
            Última actualización: {ACTUALIZADO}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          <Section title="Aceptación">
            <p>
              Al navegar busago.ai, completar el formulario de diagnóstico o usar el chat y el
              agente de voz de demo, aceptás estas condiciones. Si no estás de acuerdo, te pedimos
              que no uses el sitio.
            </p>
          </Section>

          <Section title="Qué es Busago">
            <p>
              Busago es una agencia de automatización de procesos con Inteligencia Artificial:
              diseñamos e implementamos agentes de IA y flujos automatizados para atención al
              cliente, administración operativa y ventas. El contenido de este sitio es informativo
              y comercial, no constituye asesoramiento profesional, legal, financiero ni técnico
              vinculante.
            </p>
          </Section>

          <Section title="Las demos de IA">
            <p>
              El chat y el agente de voz de este sitio ("Busaia") son demos automatizadas
              impulsadas por modelos de Inteligencia Artificial de terceros. Pueden responder de
              forma incompleta, imprecisa o inesperada — no dependas de ellas como fuente única
              para decisiones importantes. Ninguna respuesta de estas demos constituye una
              cotización, propuesta comercial ni compromiso contractual de nuestra parte; eso sólo
              se formaliza por escrito con nuestro equipo.
            </p>
          </Section>

          <Section title="Precios y cotizaciones">
            <p>
              No publicamos precios fijos en el sitio: cada proyecto se cotiza a medida según la
              complejidad de los flujos a automatizar. Cualquier estimación que puedas recibir en
              una conversación con el chat, el agente de voz o nuestro equipo es preliminar hasta
              que enviemos una propuesta formal.
            </p>
          </Section>

          <Section title="Uso aceptable">
            <p>
              Te pedimos que no uses el sitio ni las demos para enviar contenido ilegal, intentar
              vulnerar la seguridad de nuestros sistemas, ni sobrecargar deliberadamente nuestros
              formularios o servicios automatizados.
            </p>
          </Section>

          <Section title="Propiedad intelectual">
            <p>
              El contenido de este sitio — textos, diseño, marca e imágenes — pertenece a Busago o
              se usa bajo licencia. No está permitido reproducirlo con fines comerciales sin
              autorización previa.
            </p>
          </Section>

          <Section title="Limitación de responsabilidad">
            <p>
              El sitio y sus demos se ofrecen "tal cual". No garantizamos que estén libres de
              errores o disponibles de forma ininterrumpida, y no somos responsables por daños
              derivados del uso del sitio más allá de lo que exija la ley aplicable.
            </p>
          </Section>

          <Section title="Ley aplicable">
            <p>
              Estos términos se rigen por las leyes de la República Argentina. Para todo lo
              referido al tratamiento de tus datos personales, aplica además nuestra{" "}
              <a href="/politica-de-privacidad" className="text-white underline underline-offset-2">
                Política de Privacidad
              </a>
              .
            </p>
          </Section>

          <Section title="Cambios a estos términos">
            <p>
              Podemos actualizar estos términos a medida que el sitio o nuestros servicios
              cambien. La fecha de "última actualización" al principio de esta página siempre va
              a reflejar la versión vigente.
            </p>
          </Section>

          <Section title="Contacto">
            <p>
              Para consultas sobre estos términos, escribinos a{" "}
              <a href="mailto:hola@busago.ai" className="text-white underline underline-offset-2">
                hola@busago.ai
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
    </section>
  );
}
