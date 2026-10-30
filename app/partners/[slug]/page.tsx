import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Pic from '@/components/Pic';
import Reveal from '@/components/Reveal';
import { Arrow } from '@/components/Icons';
import { categoryObjectKind, countProducts, site } from '@/lib/data';

export function generateStaticParams() { return site.partners.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = site.partners.find((x) => x.slug === slug);
  return p ? { title: p.title } : {};
}

export default async function Partner({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = site.partners.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <section className="section page-top">
      <div className="container">
        <span className="eyebrow">Premium partner</span>
        <h1 className="display" style={{ fontSize: 'clamp(44px,7vw,96px)', margin: '18px 0 18px' }}>{p.title}</h1>
        <p className="lead" style={{ marginBottom: 44 }}>{p.intro || `Choose a product range by ${p.title}.`}</p>
        <div className="cat-grid">
          {p.cards.map((c, i) => (
            <Reveal key={c.category} delay={i * 0.06}>
              <Link href={`/category/${c.category}`} className="cat-card">
                <div className="no"><span>{String(i + 1).padStart(2, '0')}</span><span>{countProducts(c.category)} items</span></div>
                <div className="thumb"><Pic category={c.category} alt={c.title} kind={categoryObjectKind(c.category)} label={false} /></div>
                <h3>{c.title}</h3>
                <div className="meta"><span>{c.blurb || 'View collection'}</span><span className="go"><Arrow width={18} height={18} /></span></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
