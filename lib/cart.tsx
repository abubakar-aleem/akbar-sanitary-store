'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STORE } from './data';

export type CartLine = { key: string; id: string; name: string; size?: string; price: number; qty: number };
type Ctx = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (l: Omit<CartLine, 'key' | 'qty'>, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  ready: boolean;
};
const CartCtx = createContext<Ctx | null>(null);
const KEY = 'akbar_store_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback<Ctx['add']>((l, qty = 1) => {
    const key = l.id + '|' + (l.size || '');
    setLines((cur) => {
      const f = cur.find((x) => x.key === key);
      if (f) return cur.map((x) => (x.key === key ? { ...x, qty: Math.min(999, x.qty + qty) } : x));
      return [...cur, { ...l, key, qty }];
    });
  }, []);
  const setQty = useCallback((key: string, qty: number) => setLines((c) => c.map((x) => (x.key === key ? { ...x, qty: Math.max(1, Math.min(999, qty)) } : x))), []);
  const remove = useCallback((key: string) => setLines((c) => c.filter((x) => x.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<Ctx>(
    () => ({
      lines,
      count: lines.reduce((a, l) => a + l.qty, 0),
      total: lines.reduce((a, l) => a + l.qty * l.price, 0),
      add,
      setQty,
      remove,
      clear,
      ready,
    }),
    [lines, add, setQty, remove, clear, ready],
  );
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error('useCart outside CartProvider');
  return c;
}

export function whatsappUrl(text: string) {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function orderMessage(lines: CartLine[], total: number, who: { name?: string; phone?: string; address?: string; notes?: string }) {
  const rows = lines.map((l, i) => `${i + 1}. ${l.name}${l.size && l.size !== 'Standard' ? ` (${l.size})` : ''} x ${l.qty} - approx Rs. ${Math.round(l.price * l.qty).toLocaleString('en-PK')}`);
  const parts = [
    `Hello ${STORE.short}! I would like to order:`,
    '',
    ...rows,
    '',
    `Approx. total: Rs. ${Math.round(total).toLocaleString('en-PK')} (please confirm final prices and availability)`,
  ];
  if (who.name) parts.push('', `Name: ${who.name}`);
  if (who.phone) parts.push(`Phone: ${who.phone}`);
  if (who.address) parts.push(`Address: ${who.address}`);
  if (who.notes) parts.push(`Notes: ${who.notes}`);
  return parts.join('\n');
}
