import { Suspense } from 'react';
import type { Metadata } from 'next';
import ShopClient from '@/components/ShopClient';
import { countProducts, products, topCategories } from '@/lib/data';

export const metadata: Metadata = { title: 'Shop', description: 'Browse all pipes, fittings, faucets, tanks and sanitary ware with approximate prices.' };

export default function Shop() {
  const cats = topCategories.map((c) => ({ slug: c.slug, title: c.shortTitle || c.title, count: countProducts(c.slug) })).filter((c) => c.count > 0);
  return (
    <section className="section page-top">
      <div className="container">
        <div className="head">
          <div>
            <span className="eyebrow">The shop</span>
            <h1 className="h2">Everything in stock.</h1>
          </div>
        </div>
        <p className="note" style={{ marginBottom: 34 }}><span><b>Approximate prices.</b> Rates move with the market, so we confirm the exact price and availability when you send your order on WhatsApp.</span></p>
        <Suspense fallback={null}>
          <ShopClient items={products} cats={cats} />
        </Suspense>
      </div>
    </section>
  );
}
