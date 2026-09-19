import Script from "next/script";

// Widget flotante hosteado por LiveKit Cloud (Agent Builder → Embed drawer).
// El agent id no es secreto (queda visible en el HTML), pero el acceso real
// se restringe configurando "allowed domains" en el dashboard de LiveKit.
const AGENT_ID = process.env.NEXT_PUBLIC_LIVEKIT_AGENT_ID;

export default function LiveKitVoiceWidget() {
  if (!AGENT_ID) return null;

  // lazyOnload: el popup es un accesorio, no tiene por qué competir con la
  // hidratación de la home por ancho de banda ni por hilo principal.
  return (
    <Script
      src="https://cloud.livekit.io/embed-popup.js"
      data-lk-agent={AGENT_ID}
      strategy="lazyOnload"
    />
  );
}
