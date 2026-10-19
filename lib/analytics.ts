/**
 * Thin wrapper over gtag. Every call is a no-op when GA has not loaded
 * (no NEXT_PUBLIC_GA_ID, an ad blocker, or during SSR), so call sites never
 * need to guard.
 */

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: string, params: GtagParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  // Drop undefined so GA doesn't record empty dimensions.
  const clean: GtagParams = {};
  for (const [k, v] of Object.entries(params)) if (v !== undefined) clean[k] = v;
  window.gtag("event", event, clean);
}

/**
 * Referrers that mean the visit came out of an AI assistant rather than a
 * classic search result. Recorded as an event parameter so GA can segment on
 * it without needing a custom channel group.
 */
const AI_REFERRERS: Array<[RegExp, string]> = [
  [/(^|\.)chatgpt\.com$/, "chatgpt"],
  [/(^|\.)chat\.openai\.com$/, "chatgpt"],
  [/(^|\.)perplexity\.ai$/, "perplexity"],
  [/(^|\.)gemini\.google\.com$/, "gemini"],
  [/(^|\.)copilot\.microsoft\.com$/, "copilot"],
  [/(^|\.)claude\.ai$/, "claude"],
];

export function aiReferrer(): string | undefined {
  if (typeof document === "undefined" || !document.referrer) return undefined;
  try {
    const host = new URL(document.referrer).hostname;
    return AI_REFERRERS.find(([re]) => re.test(host))?.[1];
  } catch {
    return undefined;
  }
}
