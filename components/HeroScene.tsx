'use client';
import { useEffect, useState } from 'react';
import LazyScene from './LazyScene';
import type { ObjectKind } from '@/lib/data';

const KINDS: { k: ObjectKind; label: string; pic: string }[] = [
  { k: 'faucet', label: 'Faucets & mixers', pic: 'hero-faucet' },
  { k: 'valve', label: 'Valves & cocks', pic: 'hero-valve' },
  { k: 'pipe', label: 'PPR-C & PVC pipes', pic: 'hero-pipe' },
  { k: 'tank', label: 'Water tanks', pic: 'hero-tank' },
  { k: 'bowl', label: 'Sanitary ware', pic: 'hero-bowl' },
];

// images = { 'hero-faucet': '/images/site/hero-faucet.jpg', ... } (only the ones that exist).
// A slide with a picture shows the picture; a slide without one shows the 3D stand-in.
export default function HeroScene({ images = {} }: { images?: Record<string, string> }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % KINDS.length), 5200);
    return () => clearInterval(t);
  }, []);
  const cur = KINDS[i];
  const src = images[cur.pic];
  return (
    <div className="stage">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={cur.pic} className="hero-pic" src={src} alt={cur.label} />
      ) : (
        <LazyScene key={cur.k} kind={cur.k} idle scale={1.05} />
      )}
      <span className="tag">{cur.label}</span>
      <span className="tag r">{src ? 'Akbar Sanitary Store' : '3D · move your mouse'}</span>
    </div>
  );
}
