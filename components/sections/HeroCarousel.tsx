"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CLIPS = [
  "/hero-clips/1",
  "/hero-clips/0719(10)-2",
  "/hero-clips/0719(10)-3",
  "/hero-clips/0719(10)-4",
  "/hero-clips/0719(10)-5",
  "/hero-clips/0719(10)-6",
  "/hero-clips/0719(10)-7",
];

// Clips are ~1.35s each and intentionally not set to loop: looping caused a
// black flash on every seek-back-to-0. Instead each clip plays once and
// freezes on its last frame until the next rotation swaps it out.
const INTERVAL_MS = 3400;

const EASE = [0.16, 1, 0.3, 1] as const;

// The whole rig drifts left on every rotation instead of just cross-fading:
// new content enters from the right, outgoing content exits to the left.
const centerVariants = {
  enter: { opacity: 0, x: 40, scale: 0.94 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -40, scale: 0.94 },
};

function CenterVideo({ src }: { src: string }) {
  const [ready, setReady] = useState(false);

  // WebM primero y MP4 de respaldo: Safari en iOS no decodifica VP9 antes de
  // iOS 17.4, así que sin el MP4 el carrusel se queda congelado en el poster.
  return (
    <video
      key={src}
      poster={`${src}.webp`}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      onCanPlay={() => setReady(true)}
      className={`h-full w-full object-cover transition-opacity duration-500 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <source src={`${src}.webm`} type='video/webm; codecs="vp9"' />
      <source src={`${src}.mp4`} type="video/mp4" />
    </video>
  );
}

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [playVideo, setPlayVideo] = useState(false);

  // El primer render pinta sólo el poster (~5kb) para no retrasar el LCP del
  // hero; el video arranca apenas monta el componente, en todos los tamaños y
  // también con `prefers-reduced-motion` activo (ver la nota en globals.css:
  // en Android esa preferencia la enciende el ahorro de batería).
  useEffect(() => {
    setPlayVideo(true);

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CLIPS.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const prev = CLIPS[(index - 1 + CLIPS.length) % CLIPS.length];
  const current = CLIPS[index];
  const next = CLIPS[(index + 1) % CLIPS.length];

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[78%] sm:max-w-[85%] lg:max-w-[60%]">
      {/*
        Las dos tarjetas laterales son contexto decorativo (blur 3px, brillo
        0.65, 55% opacidad fija por CSS) — a ese nivel un frame estático es
        indistinguible del video, así que van con los posters (~5kb) en vez
        de dos videos en loop. Sin framer-motion acá a propósito: que su
        visibilidad dependiera de que una animación de entrada termine es
        justo lo que las hacía desaparecer en algunos celulares (rAF
        throttleado en background, o MotionConfig reducedMotion="user" en
        MotionProvider recortando las animaciones de transform del sistema).
        La imagen cambia de src en cada rotación sin transición — es un
        salto, no un fundido — pero nunca puede quedar trabada en opacity:0.

        El filter (blur/brightness) va en la imagen, no en el contenedor
        recortado: puesto en un elemento con overflow-hidden + rounded-*, se
        calcula antes del recorte en varios motores móviles y deja un borde
        duro sin difuminar justo en el límite del clip (se veía como una
        línea negra). El mask-image lleva su variante -webkit- explícita
        porque Safari/iOS no resuelve la propiedad sin prefijo.

        Las proporciones (52%/88%/64%, rotación 6°) son las mismas en todos
        los tamaños a propósito: sólo el contenedor exterior se achica con el
        viewport (max-w-[78%] más arriba). Achicar además el porcentaje de
        cada tarjeta en mobile —como probamos antes— las dejaba tan chicas y
        tan poco rotadas que se perdían contra el fondo oscuro, como un hueco
        negro en vez de un blur con contenido detrás.
      */}
      <div className="absolute left-0 top-1/2 h-[75%] w-[52%] -translate-y-1/2 -rotate-6 overflow-hidden rounded-3xl bg-base-800 [-webkit-mask-image:linear-gradient(to_right,transparent,black_30%)] [mask-image:linear-gradient(to_right,transparent,black_30%)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${prev}.webp`}
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-105 object-cover opacity-55 blur-[3px] brightness-[0.65]"
        />
      </div>

      <div className="absolute right-0 top-1/2 h-[75%] w-[52%] -translate-y-1/2 rotate-6 overflow-hidden rounded-3xl bg-base-800 [-webkit-mask-image:linear-gradient(to_left,transparent,black_30%)] [mask-image:linear-gradient(to_left,transparent,black_30%)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${next}.webp`}
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-105 object-cover opacity-55 blur-[3px] brightness-[0.65]"
        />
      </div>

      <div className="absolute left-1/2 top-1/2 h-[88%] w-[64%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-base-800 shadow-lift">
        <AnimatePresence initial={false}>
          <motion.div
            key={`center-${current}`}
            variants={centerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute inset-0"
          >
            {playVideo ? (
              <CenterVideo src={current} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${current}.webp`}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
