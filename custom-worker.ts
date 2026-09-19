// @ts-ignore `.open-next/worker.js` is generated at build time
import { default as handler } from "./.open-next/worker.js";
import { runLeadsDigest } from "./lib/leads-digest";

export default {
  fetch: handler.fetch,

  async scheduled(_event: unknown, env: any, ctx: { waitUntil: (p: Promise<unknown>) => void }) {
    ctx.waitUntil(runLeadsDigest(env));
  },
};

// Requerido para las features de DO Queue / DO Tag Cache de OpenNext.
// @ts-ignore `.open-next/worker.js` is generated at build time
export { DOQueueHandler, DOShardedTagCache } from "./.open-next/worker.js";
