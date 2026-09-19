import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Mail } from "lucide-react";

const SERVICIOS = [
  { label: "Atención al Cliente", href: "/servicios?area=ATENCION_CLIENTE" },
  { label: "Administración Operativa", href: "/servicios?area=ADMINISTRACION_OPERATIVA" },
  { label: "Comercial y Ventas", href: "/servicios?area=COMERCIAL_VENTAS" },
  { label: "Plan a Medida", href: "/#plan-a-medida" },
];

const COMPANIA = [
  { label: "Cómo trabajamos", href: "/como-trabajamos" },
  { label: "Todos los servicios", href: "/servicios" },
  { label: "Contacto", href: "/#plan-a-medida" },
];

const SOCIALES = [
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: Linkedin },
  { label: "Email", href: "mailto:hola@busago.studio", Icon: Mail },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="-my-2.5 inline-block py-2.5 text-ink-subtle transition-colors hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-base-950">
      <div className="container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/logo.webp"
                alt="Busago"
                width={193}
                height={209}
                sizes="56px"
                className="h-14 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-ink-subtle">
              Agencia de automatizaciones con Inteligencia Artificial. Convertimos procesos
              manuales en flujos automáticos que ahorran horas de trabajo cada semana.
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIALES.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-ink-subtle transition-colors hover:border-white/30 hover:bg-white/5 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white">Servicios</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {SERVICIOS.map((item) => (
                <FooterLink key={item.href + item.label} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white">Compañía</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {COMPANIA.map((item) => (
                <FooterLink key={item.href + item.label} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white">Contacto</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-subtle">
              <li>
                <a
                  href="mailto:hola@busago.studio"
                  className="-my-2.5 inline-block py-2.5 transition-colors hover:text-white"
                >
                  hola@busago.studio
                </a>
              </li>
              <li>Buenos Aires, Argentina</li>
              <li>Remoto para toda Latam</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-ink-subtle md:flex-row">
          <p>© {new Date().getFullYear()} Busago. Todos los derechos reservados.</p>
          <div className="flex items-center gap-5">
            <Link href="/politica-de-privacidad" className="transition-colors hover:text-white">
              Política de Privacidad
            </Link>
            <Link href="/terminos-y-condiciones" className="transition-colors hover:text-white">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
