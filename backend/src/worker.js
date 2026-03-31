/**
 * Cloudflare Workers entry point.
 * Wraps the Express app using @whatwg-node/server to bridge the Fetch API
 * and Node.js HTTP interfaces. Requires the `nodejs_compat` compatibility flag.
 */
import { createServerAdapter } from '@whatwg-node/server';
import { migrate } from './db.js';
import app from './app.js';

let migrated = false;

const adapter = createServerAdapter(app);

export default {
  async fetch(request, env, ctx) {
    // Inject Cloudflare Workers bindings into process.env so that
    // the existing db.js and other modules pick them up transparently.
    process.env.DATABASE_URL = env.DATABASE_URL;
    process.env.S3_ACCESS_KEY_ID = env.S3_ACCESS_KEY_ID;
    process.env.S3_SECRET_ACCESS_KEY = env.S3_SECRET_ACCESS_KEY;
    process.env.S3_ENDPOINT = env.S3_ENDPOINT;
    process.env.S3_BUCKET_NAME = env.S3_BUCKET_NAME;

    // Run DB migration once per Worker cold-start.
    if (!migrated) {
      await migrate();
      migrated = true;
    }

    return adapter.fetch(request, env, ctx);
  },
};
