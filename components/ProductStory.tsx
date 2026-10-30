'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import LazyScene from './LazyScene';
import Placeholder from './Placeholder';
import { useCart, whatsappUrl } from '@/lib/cart';
import { Cart, Check, Minus, Plus, Whatsapp } from './Icons';
import { rs } from '@/lib/format';
import type { ObjectKind } from '@/lib/data';

type P = { id: string; name: string; desc: string; price: number; oldPrice: number | null; sale: boolean; sizes: string[] };

export default function ProductStory({ p, kind, image, categoryTitle, categoryHref }: { p: P; kind: ObjectKind; image: string | null; categoryTitle?: string; categoryHref?: string }) {
  const { add } = useCart();
  const [size, setSize] = useState(p.sizes[0] || '');
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const [active, setActive] = useState(0);
  const progress = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = root.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const pr = Math.min(1, Math.max(0, -r.top / (total || 1)));
      progress.current = pr;
      if (image && frame.current) {
        // photo: tilt and zoom with the scroll, same feel as the 3D object
        frame.current.style.setProperty('--ry', `${(pr - 0.5) * 34}deg`);
        frame.current.style.setProperty('--sc', `${0.94 + Math.sin(pr * Math.PI) * 0.12}`);
      }
      const mid = window.innerWidth <= 900 ? window.innerHeight * 0.74 : window.innerHeight * 0.5;
      let best = 0, bd = Infinity;
      els.current.forEach((c, i) => {
        if (!c) return;
        const b = c.getBoundingClientRect();
        const d = Math.abs(b.top + b.height / 2 - mid);
        if (d < bd) { bd = d; best = i; }
      });
      setActive((a) => (a === best ? a : best));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [image]);

  const addNow = () => {
    add({ id: p.id, name: p.name, price: p.price, size: size || undefined }, qty);
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  };
  const waText = `Hello Akbar & Sons! I want to order:\n${p.name}${size && size !== 'Standard' ? ` (${size})` : ''} x ${qty}\nApprox. Rs. ${Math.round(p.price * qty).toLocaleString('en-PK')}. Please confirm price and availability.`;

  const chapters = [
    (
      <>
        <span className="kicker">{categoryTitle ? <Link href={categoryHref || '/categories'}>{categoryTitle}</Link> : 'Product'}</span>
        <h1>{p.name}</h1>
        <p>{p.desc || 'Quality product from Akbar & Sons Sanitary Store. Ask us on WhatsApp for full details.'}</p>
        <div className="chips"><span className="chip on">In our catalog</span>{p.sale && <span className="chip on">On sale</span>}</div>
      </>
    ),
    (
      <>
        <span className="kicker">Sizes &amp; options</span>
        <h2>{p.sizes.length > 1 ? 'Pick your size.' : 'Built for the job.'}</h2>
        {p.sizes.length > 1 ? (
          <>
            <p>Choose the size you need. We confirm the exact rate for each size when you order.</p>
            <div className="chips" role="group" aria-label="Size">
              {p.sizes.map((s) => (
                <button key={s} className={`chip ${size === s ? 'on' : ''}`} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
          </>
        ) : (
          <p>Authorized stock from trusted brands, checked before it leaves our Lahore store. Need a different size or brand? Just ask us on WhatsApp.</p>
        )}
      </>
    ),
    (
      <>
        <span className="kicker">Approx. price</span>
        <div className="bigprice">{rs(p.price)}</div>
        {p.sale && p.oldPrice && <p style={{ textDecoration: 'line-through', fontSize: 20 }}>{rs(p.oldPrice)}</p>}
        <p>Approximate. The final price and availability are confirmed when you order on WhatsApp.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', marginTop: 6 }}>
          <div className="qty" role="group" aria-label="Quantity">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Less"><Minus width={18} height={18} /></button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => Math.min(999, q + 1))} aria-label="More"><Plus width={18} height={18} /></button>
          </div>
          <button className="btn btn-lime" onClick={addNow}>{done ? <Check width={18} height={18} /> : <Cart width={18} height={18} />}{done ? 'Added to cart' : 'Add to cart'}</button>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="btn" href={whatsappUrl(waText)} target="_blank" rel="noopener noreferrer"><Whatsapp width={18} height={18} /> Order on WhatsApp</a>
          <Link className="btn" href="/cart">View cart</Link>
        </div>
      </>
    ),
  ];

  return (
    <section className="story" ref={root} style={{ paddingTop: 'var(--nav-h)' }}>
      <div className="container story-inner">
        <div className="story-stage">
          <div className="frame" ref={frame} style={image ? ({ perspective: 900 } as React.CSSProperties) : undefined}>
            <span className="badge-3d">{image ? 'Scroll to turn' : '3D · scroll to rotate'}</span>
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', padding: 36, transform: 'rotateY(var(--ry,0deg)) scale(var(--sc,1))', transition: 'transform 0.15s linear' }} />
            ) : (
              <LazyScene kind={kind} progress={progress} scale={1.1} />
            )}
          </div>
        </div>
        <div>
          {chapters.map((c, i) => (
            <div key={i} ref={(el) => { els.current[i] = el; }} className={`chapter ${active === i ? 'active' : ''}`}>
              <span className="ghost" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              {c}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
