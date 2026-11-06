import { Resend } from "resend";

/**
 * Lazily-built Resend client.
 *
 * Every route used to do `const resend = new Resend(process.env.RESEND_API_KEY)`
 * at module scope. The Resend constructor throws when the key is missing, and
 * `next build` imports every route to collect its page data — so a build in any
 * environment without RESEND_API_KEY died with "Missing API key" before a single
 * line of the route ever ran. Production has the key, so this only ever bit
 * Preview deployments, and only for routes that were not already in the build
 * cache.
 *
 * Building should never require a runtime secret. The client is created on the
 * first send instead, which moves a missing key from "the deploy fails" to "this
 * one request returns a clear error".
 */
let client: Resend | null = null;

export function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured, so no email could be sent.");
  }
  if (!client) client = new Resend(apiKey);
  return client;
}
