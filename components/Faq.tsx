'use client';
import { useRef, useState } from 'react';
import { Plus } from './Icons';

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  return (
    <div className="faq">
      {items.map((f, i) => (
        <div key={f.q} className={`faq-item ${open === i ? 'open' : ''}`}>
          <button className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            <span>{f.q}</span><span className="pm"><Plus width={16} height={16} /></span>
          </button>
          <div className="faq-a" ref={(el) => { refs.current[i] = el; }} style={{ maxHeight: open === i ? (refs.current[i]?.scrollHeight ?? 400) : 0 }}>
            <p>{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
