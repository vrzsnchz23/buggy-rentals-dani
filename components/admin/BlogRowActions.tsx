"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, EyeOff, Loader2, Trash2 } from "lucide-react";

/**
 * Takes an article off the site.
 *
 * Two different actions wearing one button would be a trap here, so they are
 * labelled for what they actually do. An article written in the admin is
 * deleted. One of the five that live in the site's code cannot be deleted —
 * the text is in the bundle — so it is hidden, which is reversible from the
 * editor. The wording says which one is about to happen.
 *
 * Confirmation is inline rather than `window.confirm` so it says what will
 * happen to this specific article, and a failure is shown instead of leaving
 * a row that looks changed but is not.
 */
export function BlogRowActions({
  slug,
  title,
  isSeed,
}: {
  slug: string;
  title: string;
  /** Lives in lib/blog/posts.ts, so it can only be hidden. */
  isSeed: boolean;
}) {
  const router = useRouter();
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, { method: "DELETE" });
      if (!res.ok) {
        let detail = `${res.status} ${res.statusText}`;
        try {
          const json = await res.json();
          if (json?.error) detail = String(json.error);
        } catch {}
        throw new Error(detail);
      }
      setAsking(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nothing was changed.");
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[#b91c1c]" role="alert">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        {error}
      </span>
    );
  }

  if (asking) {
    return (
      <span className="inline-flex items-center gap-2 text-xs">
        <span className="text-[#44505E]">{isSeed ? "Hide it?" : "Delete for good?"}</span>
        <button
          type="button"
          onClick={() => void run()}
          disabled={busy}
          className="inline-flex items-center gap-1 font-bold text-[#b91c1c] hover:underline disabled:text-[#55606E] disabled:no-underline"
        >
          {busy && <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />}
          Yes
        </button>
        <button type="button" onClick={() => setAsking(false)} className="font-bold text-[#44505E] hover:underline">
          No
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setAsking(true)}
      aria-label={isSeed ? `Hide ${title}` : `Delete ${title}`}
      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#55606E] hover:text-[#b91c1c] transition-colors"
    >
      {isSeed ? <EyeOff className="w-3.5 h-3.5" aria-hidden="true" /> : <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />}
      {isSeed ? "Hide" : "Delete"}
    </button>
  );
}
