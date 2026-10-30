'use client';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { Cart, Check } from './Icons';

type P = { id: string; name: string; price: number; sizes?: string[] };

export default function AddToCart({ p, className = 'btn btn-primary btn-sm add', label = 'Add to cart' }: { p: P; className?: string; label?: string }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  const size = p.sizes && p.sizes.length === 1 ? p.sizes[0] : undefined;
  return (
    <button
      className={className}
      onClick={() => {
        add({ id: p.id, name: p.name, price: p.price, size });
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? <Check width={16} height={16} /> : <Cart width={16} height={16} />}
      {done ? 'Added' : label}
    </button>
  );
}
