import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Pic from '@/components/Pic';
import Reveal from '@/components/Reveal';
import ProductCard from '@/components/ProductCard';
import ShopClient from '@/components/ShopClient';
import { Suspense } from 'react';
import { Arrow } from '@/components/Icons';
import { categories, categoryObjectKind, categoryTitle, countProducts, getProduct, trail } from '@/lib/data';
import { pad2 } from '@/lib/format';

export function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = categories[slug];
  return c ? { title: c.title, description: `${c.title} at Akbar Sanitary Store, Lahore.` } : {};
}

export default async function Category({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = categories[slug];
  if (!c) notFound();
  const crumbs = trail(slug);
  const items = c.kind === 'list' ? (c.productIds || []).map((id) => getProduct(id)!).filter(Boolean) : [];
  return (
    <section className="section page-top">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/categories">Categories</Link>
          {crumbs.map((n, i) => (
            <span key={n.slug} style={{ display: 'contents' }}>
              <span className="sep">/</span>
              {i === crumbs.length - 1 ? <span>{categoryTitle(n)}</span> : <Link href={`/category/${n.slug}`}>{categoryTitle(n)}</Link>}
            </span>
          ))}
        </nav>
        <div className="head" style={{ marginTop: 22 }}>
          <div>
            <span className="eyebrow">{c.kind === 'group' ? `${c.children.length} ranges` : `${items.length} products`}</span>
            <h1 className="h2">{c.title}</h1>
            {c.blurb && <p className="lead" style={{ marginTop: 14 }}>{c.blurb}</p>}
          </div>
        </div>

        {c.kind === 'group' ? (
          <div className="cat-grid">
            {c.children.map((s, i) => {
              const k = categories[s];
              if (!k) return null;
              return (
                <Reveal key={s} delay={(i % 4) * 0.05}>
                  <Link href={`/category/${s}`} className="cat-card">
                    <div className="no"><span>{pad2(i + 1)}</span><span>{countProducts(s)} items</span></div>
                    <div className="thumb"><Pic category={s} alt={k.title} kind={categoryObjectKind(s)} label={false} /></div>
                    <h3>{categoryTitle(k)}</h3>
                    <div className="meta"><span>Explore</span><span className="go"><Arrow width={18} height={18} /></span></div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <>
            <p className="note" style={{ marginBottom: 34 }}><span><b>Approximate prices.</b> We confirm the exact price and stock on WhatsApp.</span></p>
            {items.length > 24 ? (
              <Suspense fallback={null}><ShopClient items={items} cats={[]} initialCat="all" /></Suspense>
            ) : (
              <div className="pgrid">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
