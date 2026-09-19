"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Video que no descarga un solo byte hasta que está por entrar en pantalla.
 *
 * `src` es la ruta SIN extensión: el componente arma `.webp` (poster), `.webm`
 * y `.mp4` a partir de ella.
 *
 * Los dos formatos son obligatorios, no un lujo: Safari en iOS no soportó
 * WebM hasta iOS 17.4, así que un sitio que sólo sirve VP9 no reproduce nada
 * en la mayoría de los iPhones. El navegador elige el primer <source> que
 * puede decodificar, de modo que Chrome y Firefox siguen bajando el WebM
 * (más chico) y Safari cae al MP4.
 *
 * El poster (~10kb) se pinta de entrada, así que el hueco nunca queda negro
 * ni provoca layout shift. Fuera de viewport se pausa: tres videos en loop
 * simultáneos eran la mayor fuente de consumo de CPU y batería en mobile.
 *
 * El video se reproduce también con `prefers-reduced-motion` activo: en
 * Android esa preferencia se enciende sola con el ahorro de batería, y
 * frenarlo dejaba las cards con un fotograma fijo que parecía un error.
 */
export default function LazyVideo({
  src,
  className = "",
  rootMargin = "300px",
  loop = true,
  onReady,
}: {
  src: string;
  className?: string;
  rootMargin?: string;
  loop?: boolean;
  onReady?: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          // Al volver a entrar en pantalla el <source> ya está montado.
          if (el.readyState > 0) void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, rootMargin]);

  // Los <source> se agregan después del montaje, así que hace falta un load()
  // explícito para que el navegador los vuelva a evaluar.
  useEffect(() => {
    const el = ref.current;
    if (!active || !el) return;
    el.load();
    void el.play().catch(() => {});
  }, [active]);

  return (
    <video
      ref={ref}
      poster={`${src}.webp`}
      autoPlay
      muted
      loop={loop}
      playsInline
      preload="none"
      tabIndex={-1}
      aria-hidden="true"
      onCanPlay={onReady}
      className={className}
    >
      {active && (
        <>
          <source src={`${src}.webm`} type='video/webm; codecs="vp9"' />
          <source src={`${src}.mp4`} type="video/mp4" />
        </>
      )}
    </video>
  );
}
