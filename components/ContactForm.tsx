'use client';
import { useState } from 'react';
import { whatsappUrl } from '@/lib/cart';
import { Whatsapp } from './Icons';

export default function ContactForm() {
  const [f, setF] = useState({ name: '', phone: '', need: '' });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((x) => ({ ...x, [k]: e.target.value }));
  const msg = `Hello Akbar Sanitary Store!\nName: ${f.name || '-'}\nPhone: ${f.phone || '-'}\nI need: ${f.need || '-'}`;
  return (
    <form className="summary" style={{ position: 'static' }} onSubmit={(e) => { e.preventDefault(); window.open(whatsappUrl(msg), '_blank', 'noopener'); }}>
      <h2 className="h3">Send us your requirement</h2>
      <div className="field"><label htmlFor="cn">Your name</label><input id="cn" value={f.name} onChange={set('name')} autoComplete="name" required /></div>
      <div className="field"><label htmlFor="cp">Phone number</label><input id="cp" value={f.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" /></div>
      <div className="field"><label htmlFor="cr">What do you need?</label><textarea id="cr" rows={4} value={f.need} onChange={set('need')} required placeholder="e.g. 20 x PPR-C pipe 25mm, 10 x elbows..." /></div>
      <button className="btn btn-primary" type="submit"><Whatsapp width={20} height={20} /> Send on WhatsApp</button>
    </form>
  );
}
