import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import type { IconType } from "react-icons";

type LogoItem = {
  name: string;
  /** Full icon+wordmark lockup, already flattened to solid white. */
  image?: string;
  width?: number;
  height?: number;
  /** Icon component paired with a set text label, for brands without a usable wordmark image. */
  Icon?: IconType;
  /** Tailwind text-color class for the icon; defaults to white. */
  iconClassName?: string;
  /**
   * Some monochrome marks (Meta's squarer wordmarks) read visibly lighter/
   * smaller than the rest at the same box height, even with identical crop
   * bounds — this nudges just those up to match the row's visual weight.
   */
  boost?: boolean;
};

const LOGOS: LogoItem[] = [
  { name: "n8n", image: "/logos/logo_n8n.webp", width: 886, height: 240 },
  { name: "Claude", image: "/logos/logo_claude.webp", width: 1117, height: 240 },
  { name: "Gemini", image: "/logos/logo_gemini.webp", width: 654, height: 240 },
  { name: "ChatGPT", image: "/logos/logo_chatgpt-icon.webp", width: 240, height: 240 },
  { name: "Facebook", image: "/logos/logo_facebook.webp", width: 500, height: 166, boost: true },
  { name: "Instagram", image: "/logos/logo_instagram.webp", width: 500, height: 166, boost: true },
  // Los assets generados a partir del SVG oficial (raster aplanado o a color)
  // salían mal en algunos navegadores — el mismo ícono ya probado que usa el
  // botón flotante de WhatsApp es más confiable que seguir generando un PNG.
  { name: "WhatsApp", Icon: FaWhatsapp },
  { name: "TikTok", image: "/logos/logo_tiktok.webp", width: 500, height: 166, boost: true },
  { name: "LinkedIn", image: "/logos/logo_linkedin.webp", width: 500, height: 166, boost: true },
  { name: "Shopify", image: "/logos/logo_shopify.webp", width: 765, height: 240 },
  { name: "Tiendanube", image: "/logos/logo_tiendanube.webp", width: 1427, height: 240 },
  { name: "Gmail", image: "/logos/logo_gmail-icon.webp", width: 319, height: 240 },
  { name: "Zapier", image: "/logos/logo_zapier.webp", width: 884, height: 240 },
];

// Marcas sin wordmark propio en el asset: van como ícono + nombre en vez de
// la imagen de lockup completa.
const ICON_ONLY = new Set(["ChatGPT", "Gmail"]);

function LogoChip({ name, image, width, height, Icon, iconClassName, boost }: LogoItem) {
  const boxSize = boost ? "h-9" : "h-7";
  const iconOnly = !Icon && ICON_ONLY.has(name);

  return (
    <div
      className={`flex ${boxSize} shrink-0 items-center gap-2 px-5 opacity-65 transition-opacity hover:opacity-100 sm:px-8`}
    >
      {Icon ? (
        <Icon className={`h-7 w-7 shrink-0 ${iconClassName ?? "text-white"}`} aria-hidden="true" />
      ) : iconOnly ? (
        <Image
          src={image!}
          alt=""
          aria-hidden="true"
          width={width}
          height={height}
          sizes="28px"
          className="h-7 w-auto"
        />
      ) : (
        <Image
          src={image!}
          alt={name}
          width={width}
          height={height}
          sizes="150px"
          className={`${boxSize} w-auto max-w-[150px] object-contain`}
        />
      )}
      {(Icon || iconOnly) && (
        <span className="whitespace-nowrap font-display text-lg font-bold tracking-tight text-white">
          {name}
        </span>
      )}
    </div>
  );
}

export default function LogoMarquee() {
  // w-full y no w-screen: 100vw incluye el ancho de la barra de scroll, lo que
  // desbordaba la página 5px y descentraba la banda. Los dos lugares donde se
  // usa este bloque ya le dan el ancho correcto al padre.
  return (
    <section className="relative w-full border-y border-white/5 py-5">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-subtle">
          Conectamos e integramos con las herramientas que ya usás
        </p>
        <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max items-center animate-marquee group-hover:[animation-play-state:paused]">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <LogoChip key={`${logo.name}-${i}`} {...logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
