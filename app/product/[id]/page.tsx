import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductStory from '@/components/ProductStory';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import { categories, categoryTitle, getProduct, objectKind, productImage, products, related } from '@/lib/data';

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = getProduct(id);
  return p ? { title: p.name, description: p.desc || `${p.name} at Akbar Sanitary Store, Lahore.` } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) notFound();
  const cat = p.category ? categories[p.category] : null;
  const rel = related(p, 4);
  return (
    <>
      <ProductStory
        p={{ id: p.id, name: p.name, desc: p.desc, price: p.price, oldPrice: p.oldPrice, sale: p.sale, sizes: p.sizes }}
        kind={objectKind(p.name, p.category)}
        image={productImage(p.id)}
        categoryTitle={cat ? categoryTitle(cat) : undefined}
        categoryHref={cat ? `/category/${cat.slug}` : undefined}
      />
      {rel.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="head">
              <div>
                <span className="eyebrow">You may also need</span>
                <h2 className="h2">Related items.</h2>
              </div>
              {cat && <Link href={`/category/${cat.slug}`} className="btn">See all in {categoryTitle(cat)}</Link>}
            </div>
            <div className="pgrid">{rel.map((r, i) => <Reveal key={r.id} delay={i * 0.06}><ProductCard p={r} /></Reveal>)}</div>
          </div>
        </section>
      )}
    </>
  );
}
