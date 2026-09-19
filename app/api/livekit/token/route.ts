import { NextResponse } from "next/server";
import { AccessToken, RoomAgentDispatch, RoomConfiguration } from "livekit-server-sdk";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type Env = {
  LIVEKIT_API_KEY: string;
  LIVEKIT_API_SECRET: string;
  LIVEKIT_URL: string;
  LIVEKIT_AGENT_NAME?: string;
};

// Genera un token de acceso de un solo uso para que el widget de demo del
// bento "Agentes de Voz" conecte directo con livekit-client a una room nueva.
// El agente tiene `agentName` configurado en el builder ("Advanced" → Agent
// name) = "Busaia", lo que lo pone en modo dispatch EXPLÍCITO: sin
// roomConfig.agents acá, la room queda vacía (nadie se une a escuchar/
// responder), por eso hay que pedirlo por nombre exacto al crear el token.
export async function POST() {
  const { env } = getCloudflareContext();
  const { LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL, LIVEKIT_AGENT_NAME } =
    env as unknown as Env;

  if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
    return NextResponse.json({ error: "LiveKit no está configurado." }, { status: 500 });
  }

  const roomName = `demo-voz-${crypto.randomUUID()}`;
  const identity = `visitante-${crypto.randomUUID().slice(0, 8)}`;

  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
    ttl: "30m",
  });
  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });
  token.roomConfig = new RoomConfiguration({
    agents: [new RoomAgentDispatch({ agentName: LIVEKIT_AGENT_NAME || "Busaia" })],
  });

  return NextResponse.json({
    serverUrl: LIVEKIT_URL,
    participantToken: await token.toJwt(),
    roomName,
  });
}
