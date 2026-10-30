import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { site } from '@/lib/data';

export function generateStaticParams() { return site.policies.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = site.policies.find((x) => x.slug === slug);
  return p ? { title: p.title } : {};
}

export default async function Policy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = site.policies.find((x) => x.slug === slug);
  if (!p) notFound();
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = () => { if (list.length) { out.push(<ul key={`u${out.length}`}>{list.map((t, i) => <li key={i}>{t}</li>)}</ul>); list = []; } };
  p.blocks.forEach((b, i) => {
    if (b.type === 'li') { list.push(b.text); return; }
    flush();
    if (b.type === 'p') out.push(<p key={i}>{b.text}</p>);
    else out.push(<h3 key={i}>{b.text}</h3>);
  });
  flush();
  return (
    <section className="section page-top">
      <div className="container">
        <span className="eyebrow">Policy</span>
        <h1 className="h2" style={{ margin: '16px 0 30px' }}>{p.title}</h1>
        <div className="prose">{out}</div>
      </div>
    </section>
  );
}
