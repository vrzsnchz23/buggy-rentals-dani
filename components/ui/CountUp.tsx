"use client";
import { useEffect, useRef } from "react";

/**
 * A number that counts up the first time it comes into view.
 *
 * It writes to the DOM node directly instead of holding the running value in
 * state. A number animating at 60fps is sixty renders a second of a component
 * whose output is one text node — state would buy nothing and cost a re-render
 * per frame.
 *
 * The server renders the final value, so the figure is correct with no
 * JavaScript, for a crawler, and in the moment before this effect runs.
 * Reduced motion leaves it exactly there.
 */
export function CountUp({
  to,
  decimals = 0,
  durationMs = 1100,
  className,
}: {
  to: number;
  decimals?: number;
  durationMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const final = to.toFixed(decimals);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = final;
      return;
    }

    let frame = 0;
    let startedAt = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const tick = (now: number) => {
          if (!startedAt) startedAt = now;
          const progress = Math.min(1, (now - startedAt) / durationMs);
          /* Ease out, so it arrives rather than stopping dead. */
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = (to * eased).toFixed(decimals);
          if (progress < 1) frame = requestAnimationFrame(tick);
          else el.textContent = final;
        };

        el.textContent = (0).toFixed(decimals);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, decimals, durationMs]);

  return (
    <span ref={ref} className={className}>
      {to.toFixed(decimals)}
    </span>
  );
}
