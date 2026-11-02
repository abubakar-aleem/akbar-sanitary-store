import Link from 'next/link';
import { STORE, site } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h5>Akbar Sanitary Store</h5>
            <p>The leading supplier of premium sanitary ware and plumbing solutions in Lahore since {STORE.since}. Quality you can build on.</p>
            <div className="social" aria-label="Social links">
              <a href={STORE.social.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer">Fb</a>
              <a href={STORE.social.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer">Ig</a>
              <a href={STORE.social.tiktok} aria-label="TikTok" target="_blank" rel="noopener noreferrer">Tk</a>
              <a href={`https://wa.me/${STORE.whatsapp}`} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">Wa</a>
            </div>
          </div>
          <div>
            <h5>Explore</h5>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/shop">Shop</Link></li>
              <li><Link href="/categories">Product Catalog</Link></li>
              <li><Link href="/about">Our History</Link></li>
              <li><Link href="/faq">FAQs</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h5>Support</h5>
            <ul>
              {site.policies.map((p) => (
                <li key={p.slug}><Link href={`/policy/${p.slug}`}>{p.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Premium Partners</h5>
            <ul>
              {site.partners.map((p) => (
                <li key={p.slug}><Link href={`/partners/${p.slug}`}>{p.title.replace('International Industries Limited (IIL)', 'IIL')}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Visit us</h5>
            <p>{STORE.address}</p>
            <p style={{ marginTop: 12 }}>{STORE.phones.join(' · ')}</p>
            <p style={{ marginTop: 12 }}>{STORE.hours.join(' · ')}</p>
          </div>
        </div>
        <div className="giant" aria-hidden="true">Akbar Sanitary Store<i>.</i></div>
        <div className="copy">
          <span>© {new Date().getFullYear()} {STORE.name}. All rights reserved.</span>
          <span>Prices shown are approximate. Please confirm on WhatsApp.</span>
        </div>
      </div>
    </footer>
  );
}
