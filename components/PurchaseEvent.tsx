"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/**
 * Fires the GA4 `purchase` event once the confirmation page renders.
 *
 * Guarded by a ref and by sessionStorage so a refresh or a back-navigation to
 * the confirmation URL does not double-count the booking — Stripe sends people
 * back here with the same id, and GA has no built-in dedupe for this.
 */
export function PurchaseEvent({
  transactionId,
  value,
  currency = "USD",
}: {
  transactionId: string;
  value: number;
  currency?: string;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    const key = `purchase_sent_${transactionId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Private mode: fall back to the in-memory guard only.
    }
    sent.current = true;
    track("purchase", { transaction_id: transactionId, value, currency });
  }, [transactionId, value, currency]);

  return null;
}
