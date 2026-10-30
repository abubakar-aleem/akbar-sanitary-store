import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import Marquee from '@/components/Marquee';
import Pic from '@/components/Pic';
import { STORE } from '@/lib/data';

export const metadata: Metadata = { title: 'About us', description: 'Akbar & Sons Sanitary Store: trusted plumbing and sanitary supplies in Lahore since 1994.' };

export default function About() {
  const yrs = new Date().getFullYear() - STORE.since;
  return (
    <>
      <section className="section page-top">
        <div className="container two">
          <div>
            <span className="eyebrow">Our story</span>
            <h1 className="display" style={{ fontSize: 'clamp(44px,7vw,96px)', margin: '18px 0 24px' }}>Legacy of trust since {STORE.since}.</h1>
            <p className="lead">For over three decades we have been a cornerstone of quality sanitary and plumbing supply in Lahore. Our commitment to excellence has made us a household name for homeowners, builders and plumbers.</p>
          </div>
          <div className="stage" style={{ aspectRatio: '1 / 0.85' }}>
            <Pic site="about" alt="Akbar & Sons Sanitary Store" kind="faucet" />
          </div>
        </div>
      </section>

      <Marquee items={['Authorized dealer', `${yrs}+ years`, 'Premium brands', 'Expert advice', 'Lahore']} />

      <section className="section">
        <div className="container">
          <div className="tri">
            {[
              { n: '01', t: 'Our mission', d: 'To give homeowners and builders premium, durable and good-looking sanitary ware that improves their spaces and keeps working for years.' },
              { n: '02', t: 'Our commitment', d: 'We source only from authorized distributors of top-tier brands such as Dura, Popular and Turk Plast. Quality is not just a promise, it is our heritage.' },
              { n: '03', t: 'Expert advice', d: 'Not sure what you need? Our team helps you choose the right size, material and brand for your project, and gives an honest quote.' },
            ].map((c, i) => (
              <Reveal key={c.n} delay={i * 0.08}>
                <div className="tcard"><span className="n">{c.n}</span><h2 className="h3">{c.t}</h2><p>{c.d}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="story" style={{ padding: '90px 0' }}>
        <div className="container" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 30 }}>
          {[[`${yrs}+`, 'Years of experience'], ['4', 'Authorized brands'], ['1,000+', 'Products listed'], ['1', 'Store, one promise']].map(([n, l]) => (
            <div key={l}><div className="bigprice">{n}</div><p style={{ color: '#98a1b5', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 8 }}>{l}</p></div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="head"><div><span className="eyebrow">Certificates &amp; approvals</span><h2 className="h2">Official partners.</h2></div></div>
          <div className="tri">
            {['Dura Flow', 'Turk Plast', 'Popular Pipes', 'IIL'].map((n, i) => (
              <Reveal key={n} delay={i * 0.06}>
                <div className="tcard"><div className="cert"><Pic site={`certificate-${n.toLowerCase().replace(/\s+/g, '-')}`} alt={`${n} certificate`} kind="box" /></div><h3 className="h3">{n}</h3><p>Authorized dealer certificate</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
