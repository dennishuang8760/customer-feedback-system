/**
 * Cloudflare Workers entry point.
 * Uses Hono (native Fetch API) and @neondatabase/serverless for Postgres.
 * Requires the `nodejs_compat` compatibility flag in wrangler.toml.
 */
import { neon } from '@neondatabase/serverless';
import { initDb, SCHEMA } from './db.js';
import app from './app.js';

let initialized = false;

export default {
  async fetch(request, env, ctx) {
    // Initialize DB and run migration once per cold-start.
    if (!initialized) {
      const sql = neon(env.DATABASE_URL);
      initDb(async (text, params) => ({ rows: await sql(text, params || []) }));
      await sql(SCHEMA);
      initialized = true;
    }

    return app.fetch(request, env, ctx);
  },
};
