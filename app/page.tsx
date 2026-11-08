import Link from 'next/link';
import HeroScene from '@/components/HeroScene';
import Marquee from '@/components/Marquee';
import Reveal from '@/components/Reveal';
import Pic from '@/components/Pic';
import ProductCard from '@/components/ProductCard';
import HomeStory from '@/components/HomeStory';
import { Arrow } from '@/components/Icons';
import { STORE, siteImage, countProducts, products, site, topCategories, categoryObjectKind } from '@/lib/data';
import { pad2 } from '@/lib/format';

export default function Home() {
  const featured = products.filter((p) => p.featured && p.sale).slice(0, 8);
  const cats = topCategories.slice(0, 8);
  const yrs = new Date().getFullYear() - STORE.since;
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Lahore · since {STORE.since}</span>
            <h1 className="display" style={{ marginTop: 20 }}>
              <span className="l">Everything</span>
              <span className="l accent-cobalt">that flows,</span>
              <span className="l">delivered.</span>
            </h1>
            <p className="lead" style={{ marginTop: 26 }}>
              Pipes, fittings, faucets, tanks and sanitary ware from authorized dealers of Dura, Popular, Turk Plast and IIL. Pick your items, send the list on WhatsApp, and we confirm price and stock.
            </p>
            <div className="cta">
              <Link href="/shop" className="btn btn-primary">Shop now <Arrow width={18} height={18} /></Link>
              <Link href="/categories" className="btn">Browse categories</Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><b>{yrs}+</b><span>Years trading</span></div>
              <div className="stat"><b>{products.length.toLocaleString('en-PK')}</b><span>Products listed</span></div>
              <div className="stat"><b>4</b><span>Authorized brands</span></div>
            </div>
          </div>
          <HeroScene images={Object.fromEntries(['hero-faucet', 'hero-valve', 'hero-pipe', 'hero-tank', 'hero-bowl'].map((n) => [n, siteImage(n)]).filter(([, v]) => v))} />
        </div>
      </section>

      <Marquee items={['Dura Flow', 'Popular Pipes', 'Turk Plast', 'IIL', 'PPR-C', 'PVC', 'Faucets', 'Sanitary Ware']} />

      <section className="section">
        <div className="container">
          <div className="head">
            <div>
              <span className="eyebrow">Browse by category</span>
              <h2 className="h2">Find it fast.</h2>
            </div>
            <Link href="/categories" className="btn">All categories <Arrow width={18} height={18} /></Link>
          </div>
          <div className="cat-grid">
            {cats.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 4) * 0.06}>
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

      <HomeStory />

      <section className="section">
        <div className="container">
          <div className="head">
            <div>
              <span className="eyebrow">On sale now</span>
              <h2 className="h2">Featured picks.</h2>
            </div>
            <Link href="/shop" className="btn">View the shop <Arrow width={18} height={18} /></Link>
          </div>
          <div className="pgrid">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.06}><ProductCard p={p} /></Reveal>
            ))}
          </div>
          <p className="note" style={{ marginTop: 34 }}>
            <span><b>About prices:</b> prices shown are approximate and can change with the market. Send your list on WhatsApp and we confirm the exact price and stock.</span>
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="head">
            <div>
              <span className="eyebrow">Authorized dealer</span>
              <h2 className="h2">Brands we stand behind.</h2>
            </div>
          </div>
          <div className="tri">
            {site.partners.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <Link href={`/partners/${p.slug}`} className="tcard">
                  <span className="n">{pad2(i + 1)}</span>
                  <h3 className="h3">{p.title.replace('International Industries Limited (IIL)', 'IIL')}</h3>
                  <p>{p.cards.length} product ranges</p>
                  <span className="pill-link">See ranges <Arrow width={16} height={16} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="cta-band">
              <span className="eyebrow" style={{ color: 'var(--lime)' }}>Need a quote?</span>
              <h2 className="h2" style={{ margin: '16px 0 18px', maxWidth: '14ch' }}>Send your list. We reply fast.</h2>
              <p style={{ color: '#aab2c5', maxWidth: '50ch', marginBottom: 28 }}>Share what you need on WhatsApp, quantities and sizes included, and we will confirm availability and the best price.</p>
              <a className="btn btn-lime" href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp <Arrow width={18} height={18} /></a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
