import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { Clock, Mail, Phone, Pin } from '@/components/Icons';
import { STORE } from '@/lib/data';

export const metadata: Metadata = { title: 'Contact us', description: 'Visit, call or WhatsApp Akbar Sanitary Store in Lahore.' };

export default function Contact() {
  return (
    <section className="section page-top">
      <div className="container two" style={{ alignItems: 'start' }}>
        <div>
          <span className="eyebrow">Get in touch</span>
          <h1 className="display" style={{ fontSize: 'clamp(44px,7vw,96px)', margin: '18px 0 22px' }}>Talk to a human.</h1>
          <p className="lead" style={{ marginBottom: 38 }}>Reach out for orders, quotes or expert advice on your plumbing needs.</p>
          <div className="info-list">
            <div className="info"><span className="ic"><Pin /></span><div><b>Showroom</b>{STORE.address}</div></div>
            <div className="info"><span className="ic"><Phone /></span><div><b>Phone / WhatsApp</b>{STORE.phones.map((p) => <div key={p}><a href={`tel:${p.replace(/\s/g, '')}`}>{p}</a></div>)}</div></div>
            <div className="info"><span className="ic"><Mail /></span><div><b>Email</b><a href={`mailto:${STORE.email}`}>{STORE.email}</a></div></div>
            <div className="info"><span className="ic"><Clock /></span><div><b>Business hours</b>{STORE.hours.map((h) => <div key={h}>{h}</div>)}</div></div>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
