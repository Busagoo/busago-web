"use client";

import { MotionConfig } from "framer-motion";

/**
 * Las animaciones de entrada del sitio son de framer-motion, así que el
 * `@media (prefers-reduced-motion)` de globals.css no las alcanza: se apagan
 * desde acá.
 *
 * `reducedMotion="user"` hace que framer-motion descarte los desplazamientos
 * y escalados cuando el sistema pide menos movimiento —que es lo que dispara
 * el mareo— y conserve sólo el fundido de opacidad. El video y el marquee no
 * pasan por framer-motion, así que siguen corriendo.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
