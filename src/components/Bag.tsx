"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { products, type ProductKey } from "@/data/site";

// Preview-only bag: counts items and shows a toast. Checkout is not wired up yet.
type Bag = { count: number; add: (p: ProductKey) => void; say: (msg: string) => void };

const BagContext = createContext<Bag | null>(null);

export function useBag() {
  const bag = useContext(BagContext);
  if (!bag) throw new Error("useBag must be used inside <BagProvider>");
  return bag;
}

export function BagProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [toast, setToast] = useState({ msg: "", on: false });
  const timer = useRef<number | undefined>(undefined);

  const say = useCallback((msg: string) => {
    setToast({ msg, on: true });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast((t) => ({ ...t, on: false })), 2600);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const add = useCallback(
    (p: ProductKey) => {
      setCount((c) => c + 1);
      say(`${products[p].name} added to your bag`);
    },
    [say],
  );

  const value = useMemo(() => ({ count, add, say }), [count, add, say]);

  return (
    <BagContext.Provider value={value}>
      {children}
      <div className={`toast${toast.on ? " on" : ""}`} role="status" aria-live="polite">
        {toast.msg}
      </div>
    </BagContext.Provider>
  );
}

/** Any "Add to bag" style button. */
export function AddButton({ product, className, children }: { product: ProductKey; className: string; children: ReactNode }) {
  const { add } = useBag();
  return (
    <button type="button" className={className} onClick={() => add(product)}>
      {children}
    </button>
  );
}

export function WhatsAppButton({ className, label, children }: { className: string; label?: string; children: ReactNode }) {
  const { say } = useBag();
  return (
    <button type="button" className={className} aria-label={label} onClick={() => say("WhatsApp support connects at launch.")}>
      {children}
    </button>
  );
}
