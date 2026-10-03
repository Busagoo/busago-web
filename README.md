# Busago — Agencia de Automatizaciones con IA

Next.js 15 (App Router) + Supabase, desplegado en Cloudflare Workers vía OpenNext. Contenido de
servicios 100% dinámico: se administra desde la base de datos, no desde el código.

## Arquitectura de datos

- **Runtime (producción):** [`@supabase/supabase-js`](lib/supabase.ts) habla con Supabase por
  `fetch`/PostgREST (HTTP), no por conexión TCP directa. Esto es intencional: Cloudflare Workers
  no soporta bien los motores nativos/WASM de Prisma (ver nota abajo), pero `fetch` funciona
  nativamente sin fricción.
- **Schema y migraciones (solo local):** Prisma (`prisma/schema.prisma`) sigue siendo la fuente
  de verdad del schema de la base y se usa para `migrate`, `studio` y `seed`. Prisma **no corre
  en el Worker desplegado** — solo es tooling de desarrollo.

> Probamos primero Prisma con driver adapters directo en el Worker y nos encontramos con un bug
> abierto de Prisma 7 en Cloudflare Workers (generación dinámica de WASM bloqueada por el
> sandbox) y, aun bajando a Prisma 6.19, con el mismo problema por cómo `@prisma/client` resuelve
> la condición de import `workerd`. Supabase JS evita todo esto por diseño.

## 1. Setup

```bash
npm install
cp .env.example .env       # completar SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY y DATABASE_URL/DIRECT_URL (para Prisma)
npx prisma migrate dev --name init
npm run prisma:seed        # carga los 10 servicios destacados iniciales
cp .dev.vars.example .dev.vars   # mismas claves de Supabase, para `next dev` vía OpenNext
npm run dev
```

## 2. Árbol de directorios

```
busago-web/
├── app/
│   ├── layout.tsx                # Metadata global, fonts, Navbar/Footer
│   ├── page.tsx                  # Landing: Hero + Destacados + Plan a medida
│   ├── globals.css
│   ├── servicios/
│   │   └── page.tsx              # Catálogo completo, filtrable por área (?area=)
│   └── api/
│       ├── services/route.ts     # GET /api/services?area=&destacado=
│       ├── leads/route.ts        # POST /api/leads (form Plan Personalizado)
│       └── leads/voice/route.ts  # POST /api/leads/voice (webhook LiveKit Agent Builder)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Nav adaptativo + menú fullscreen mobile
│   │   ├── Footer.tsx
│   │   ├── WhatsAppButton.tsx    # Botón flotante de WhatsApp
│   │   └── LiveKitVoiceWidget.tsx # Widget flotante del agente de voz (script embed)
│   └── sections/
│       ├── Hero.tsx
│       ├── ServiciosDestacados.tsx
│       ├── ServiceCard.tsx       # Tarjeta con tilt 3D + borde gradiente
│       └── PlanPersonalizado.tsx # Cierre de embudo con formulario a Lead
├── lib/
│   ├── supabase.ts               # Cliente Supabase por-request (runtime, Workers-safe)
│   └── services.ts               # Data access layer (getFeaturedServices, etc.)
├── prisma/
│   ├── schema.prisma             # Modelos Service y LeadPersonalizado (schema/migrate/seed)
│   └── seed.ts                   # 10 servicios destacados (fuente de verdad inicial)
└── tailwind.config.ts            # Paleta navy/blue + animaciones fade-in-up
```

## 3. Administrar servicios sin tocar código

- **Supabase Studio / Prisma Studio:** editás filas directamente (título, descripción, ícono
  SVG, destacado, orden, keywords SEO) — `npm run prisma:studio` usa la misma base.
- **Airtable:** si preferís Airtable en vez de Postgres, reemplazá las funciones de
  `lib/services.ts` por llamadas a la API REST de Airtable manteniendo la misma forma de datos
  (`Service`) — el resto de la app no cambia.

## 4. Campo `destacado`

Solo los servicios con `destacado: true` y `area != A_MEDIDA` aparecen en la landing
(`/`). El resto vive únicamente en `/servicios`, que lee la tabla completa.

## 5. Agente de voz (LiveKit Agent Builder)

El agente se configura y despliega en [LiveKit Cloud](https://cloud.livekit.io) (Agent Builder,
no corre código de este repo). Dos puntos de integración:

- **Widget en la web:** [`LiveKitVoiceWidget.tsx`](components/layout/LiveKitVoiceWidget.tsx)
  inyecta el `<script>` de embed de LiveKit (`data-lk-agent`) usando la env var
  `NEXT_PUBLIC_LIVEKIT_AGENT_ID`. El id se consigue en LiveKit Cloud → Agents → el agente →
  "Embed drawer" (empieza con `CA_`). Restringí el dominio en el dashboard ("allowed domains")
  para que el widget solo cargue en `busago.studio`.
- **Guardado de leads:** en el builder, sección **Conversation → Call ending**, configurá la
  "Summary and data collection endpoint URL" apuntando a
  `https://busago.studio/api/leads/voice`, y agregá un header custom
  `x-livekit-webhook-secret: <mismo valor que LIVEKIT_WEBHOOK_SECRET>`. El endpoint
  ([`route.ts`](app/api/leads/voice/route.ts)) valida ese header, y guarda el payload
  (`results` + resumen + metadata de la sesión) en la tabla `leads_voz`. Como los campos
  configurados en "Data collection fields" pueden cambiar, se guardan tal cual en una columna
  `resultados` (jsonb) en vez de forzarlos a columnas fijas. El digest diario de leads
  ([`leads-digest.ts`](lib/leads-digest.ts)) ya incluye estos leads junto a los del formulario.

## 6. Deploy a Cloudflare Workers

El sitio usa [OpenNext para Cloudflare](https://opennext.js.org/cloudflare) (`@opennextjs/cloudflare`),
que soporta SSR y API routes completos (no es un export estático).

```bash
npx wrangler login          # una sola vez, abre el navegador para autenticar la cuenta de Cloudflare
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put LIVEKIT_WEBHOOK_SECRET   # mismo valor que el header en LiveKit
npm run cf:deploy           # build + deploy a Cloudflare Workers
```

Para previsualizar el build de Cloudflare en local antes de deployar: `npm run cf:preview`.

> `NEXT_PUBLIC_LIVEKIT_AGENT_ID` no es un secret de Worker: se inyecta en build-time (Next.js la
> inlinea desde `.env`), así que solo necesita estar seteada en `.env` antes de correr
> `npm run cf:deploy`.
