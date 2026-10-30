'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ProductCard from './ProductCard';
import { Search } from './Icons';
import type { Product } from '@/lib/data';

type Cat = { slug: string; title: string; count: number };
const PAGE = 48;

export default function ShopClient({ items, cats, initialCat }: { items: Product[]; cats: Cat[]; initialCat?: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const [q, setQ] = useState(sp.get('q') || '');
  const [cat, setCat] = useState(initialCat || sp.get('cat') || 'all');
  const [sort, setSort] = useState('featured');
  const [shown, setShown] = useState(PAGE);

  useEffect(() => { setQ(sp.get('q') || ''); }, [sp]);
  useEffect(() => { setShown(PAGE); }, [q, cat, sort]);

  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    let r = items.filter((p) => (cat === 'all' ? true : cat === 'sale' ? p.sale : p.top === cat));
    if (words.length) r = r.filter((p) => { const h = (p.name + ' ' + p.desc).toLowerCase(); return words.every((w) => h.includes(w)); });
    if (sort === 'low') r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === 'high') r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === 'az') r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [items, q, cat, sort]);

  const setQuery = (v: string) => {
    setQ(v);
    const u = new URLSearchParams(sp.toString());
    if (v) u.set('q', v); else u.delete('q');
    router.replace(u.toString() ? `${path}?${u}` : path, { scroll: false });
  };

  return (
    <>
      <div className="shop-ctl">
        <label className="search-big">
          <Search />
          <input value={q} onChange={(e) => setQuery(e.target.value)} placeholder="Search 1,000+ products, e.g. elbow, mixer, 25mm" aria-label="Search products" />
        </label>
        <div className="chip-row" role="group" aria-label="Filter by category">
          <button className={`light-chip ${cat === 'all' ? 'on' : ''}`} onClick={() => setCat('all')}>All</button>
          <button className={`light-chip ${cat === 'sale' ? 'on' : ''}`} onClick={() => setCat('sale')}>On sale</button>
          {cats.map((c) => (
            <button key={c.slug} className={`light-chip ${cat === c.slug ? 'on' : ''}`} onClick={() => setCat(c.slug)}>
              {c.title} <span style={{ opacity: 0.6 }}>· {c.count}</span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span className="results-meta">{list.length.toLocaleString('en-PK')} products</span>
          <select className="sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="az">Name: A to Z</option>
          </select>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="empty"><h3 className="h3">No matches</h3><p className="lead" style={{ margin: '10px auto 0' }}>Try a shorter word, or ask us on WhatsApp. We stock far more than we can list.</p></div>
      ) : (
        <div className="pgrid">{list.slice(0, shown).map((p) => <ProductCard key={p.id} p={p} />)}</div>
      )}
      {shown < list.length && (
        <div className="loadmore"><button className="btn" onClick={() => setShown((s) => s + PAGE)}>Show more ({list.length - shown} left)</button></div>
      )}
    </>
  );
}
