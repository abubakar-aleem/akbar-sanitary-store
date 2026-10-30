'use client';
import { useEffect, useRef, useState } from 'react';
import LazyScene from './LazyScene';
import type { ObjectKind } from '@/lib/data';

const CHAPTERS: { kind: ObjectKind; kicker: string; title: string; body: string; chips: string[] }[] = [
  { kind: 'pipe', kicker: 'Chapter 01', title: 'Pipes that last decades.', body: 'PPR-C, PVC and GI from Dura, Popular, Turk Plast and IIL. Hot and cold water, drainage, gas and electrical.', chips: ['PPR-C', 'UPVC', 'GI', 'Gas'] },
  { kind: 'faucet', kicker: 'Chapter 02', title: 'Faucets with finish.', body: 'Basin and kitchen mixers, wall mixers, bib cocks and showers in chrome, brass and steel.', chips: ['Mixers', 'Bib cocks', 'Showers', 'Spindles'] },
  { kind: 'tank', kicker: 'Chapter 03', title: 'Storage you can trust.', body: 'Water tanks from 125 to 3,000 litres and above, with fittings and covers to match.', chips: ['Dura', 'Prime Master', 'Suntuff', 'Master'] },
  { kind: 'bowl', kicker: 'Chapter 04', title: 'Sanitary ware, complete.', body: 'Commodes, wash basins, flush systems and kitchen sinks, plus every fitting to install them.', chips: ['Commodes', 'Basins', 'Flush', 'Sinks'] },
];

export default function HomeStory() {
  const [active, setActive] = useState(0);
  const progress = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const chapterEls = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = root.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      progress.current = Math.min(1, Math.max(0, -r.top / (total || 1)));
      const mid = window.innerWidth <= 900 ? window.innerHeight * 0.74 : window.innerHeight * 0.5;
      let best = 0, bd = Infinity;
      chapterEls.current.forEach((c, i) => {
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
  }, []);

  return (
    <section className="story" ref={root} aria-label="What we supply">
      <div className="container story-inner">
        <div className="story-stage">
          <div className="frame">
            <span className="badge-3d">3D · scroll to rotate</span>
            <LazyScene key={CHAPTERS[active].kind} kind={CHAPTERS[active].kind} progress={progress} scale={1.1} />
          </div>
        </div>
        <div>
          {CHAPTERS.map((c, i) => (
            <div key={c.title} ref={(el) => { chapterEls.current[i] = el; }} className={`chapter ${active === i ? 'active' : ''}`}>
              <span className="ghost" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="kicker">{c.kicker}</span>
              <h2>{c.title}</h2>
              <p>{c.body}</p>
              <div className="chips">{c.chips.map((x) => <span className="chip" key={x}>{x}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
