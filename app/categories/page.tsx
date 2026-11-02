import Link from 'next/link';
import type { Metadata } from 'next';
import Pic from '@/components/Pic';
import Reveal from '@/components/Reveal';
import { Arrow } from '@/components/Icons';
import { categoryObjectKind, countProducts, topCategories } from '@/lib/data';
import { pad2 } from '@/lib/format';

export const metadata: Metadata = { title: 'Categories', description: 'All product categories at Akbar Sanitary Store.' };

export default function Categories() {
  return (
    <section className="section page-top">
      <div className="container">
        <div className="head">
          <div>
            <span className="eyebrow">Product catalog</span>
            <h1 className="h2">Pick a category.</h1>
          </div>
        </div>
        <div className="cat-grid">
          {topCategories.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 4) * 0.05}>
              <Link href={`/category/${c.slug}`} className="cat-card">
                <div className="no"><span>{pad2(i + 1)}</span><span>{countProducts(c.slug)} items</span></div>
                <div className="thumb"><Pic category={c.slug} alt={c.title} kind={categoryObjectKind(c.slug)} label={false} /></div>
                <h3>{c.shortTitle || c.title}</h3>
                <div className="meta"><span>Explore</span><span className="go"><Arrow width={18} height={18} /></span></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
