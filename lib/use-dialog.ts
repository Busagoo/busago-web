"use client";

import { useEffect, useRef } from "react";

/**
 * Comportamiento base de cualquier modal del sitio: cerrar con Escape y
 * bloquear el scroll del fondo mientras está abierto (si no, en mobile el
 * dedo arrastra la página detrás del overlay).
 *
 * `onClose` va por ref para que el efecto dependa sólo de `open`: si se
 * re-ejecutara en cada render guardaría "hidden" como valor previo del body
 * y el scroll nunca volvería al cerrar.
 */
export function useDialog(open: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseRef.current();
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);
}
