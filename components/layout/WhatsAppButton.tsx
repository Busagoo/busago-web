"use client";

import { FaWhatsapp } from "react-icons/fa";

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491100000000";
const DEFAULT_MESSAGE = "Hola! Estuve viendo la web de Busago y me gustaría recibir información sobre automatizaciones con IA para mi empresa.";

export default function WhatsAppButton() {
  if (!PHONE) return null;

  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-0 overflow-hidden rounded-full bg-[#25D366] py-3.5 pl-3.5 pr-3.5 text-white shadow-xl shadow-black/40 transition-all duration-300 hover:gap-2.5 hover:pr-5 hover:shadow-[0_0_35px_-2px_#25D366]"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/60 [animation-duration:3s]" />
      <FaWhatsapp className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:scale-110" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold tracking-wide transition-all duration-300 group-hover:max-w-xs">
        Hablá con un Asesor
      </span>
    </a>
  );
}
