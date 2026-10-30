'use client';
import { useEffect, useState } from 'react';
import LazyScene from './LazyScene';
import type { ObjectKind } from '@/lib/data';

const KINDS: { k: ObjectKind; label: string }[] = [
  { k: 'faucet', label: 'Faucets & mixers' },
  { k: 'valve', label: 'Valves & cocks' },
  { k: 'pipe', label: 'PPR-C & PVC pipes' },
  { k: 'tank', label: 'Water tanks' },
  { k: 'bowl', label: 'Sanitary ware' },
];

export default function HeroScene() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % KINDS.length), 5200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="stage">
      <LazyScene key={KINDS[i].k} kind={KINDS[i].k} idle scale={1.05} />
      <span className="tag">{KINDS[i].label}</span>
      <span className="tag r">3D · move your mouse</span>
    </div>
  );
}
