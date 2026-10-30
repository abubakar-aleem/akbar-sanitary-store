'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart, orderMessage, whatsappUrl } from '@/lib/cart';
import { getProduct, objectKind } from '@/lib/data';
import Pic from './Pic';
import { Minus, Plus, Whatsapp } from './Icons';
import { rs } from '@/lib/format';

export default function CartClient() {
  const { lines, total, setQty, remove, clear, ready } = useCart();
  const [who, setWho] = useState({ name: '', phone: '', address: '', notes: '' });
  const set = (k: keyof typeof who) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setWho((w) => ({ ...w, [k]: e.target.value }));

  if (!ready) return <div className="empty">Loading your cart…</div>;
  if (lines.length === 0)
    return (
      <div className="empty">
        <h2 className="h3">Your cart is empty</h2>
        <p className="lead" style={{ margin: '10px auto 26px' }}>Add products, then send the list to us on WhatsApp.</p>
        <Link href="/shop" className="btn btn-primary">Browse the shop</Link>
      </div>
    );

  const wa = whatsappUrl(orderMessage(lines, total, who));
  return (
    <div className="cart-layout">
      <div className="cart-lines">
        {lines.map((l) => {
          const p = getProduct(l.id);
          return (
            <div className="cline" key={l.key}>
              <div className="im">{p ? <Pic product={p} alt={l.name} label={false} /> : <Pic alt={l.name} kind={objectKind(l.name)} label={false} />}</div>
              <div>
                <h3><Link href={`/product/${l.id}`}>{l.name}</Link></h3>
                <div className="sub">{l.size && l.size !== 'Standard' ? `Size: ${l.size} · ` : ''}Approx. {rs(l.price)} each</div>
              </div>
              <div className="right">
                <b>{rs(l.price * l.qty)}</b>
                <div className="qty light" role="group" aria-label="Quantity">
                  <button onClick={() => setQty(l.key, l.qty - 1)} aria-label="Less"><Minus width={16} height={16} /></button>
                  <span>{l.qty}</span>
                  <button onClick={() => setQty(l.key, l.qty + 1)} aria-label="More"><Plus width={16} height={16} /></button>
                </div>
                <button className="rm" onClick={() => remove(l.key)}>Remove</button>
              </div>
            </div>
          );
        })}
        <button className="rm" style={{ alignSelf: 'flex-start' }} onClick={clear}>Clear cart</button>
      </div>

      <aside className="summary" aria-label="Order summary">
        <div className="row tot"><span className="eyebrow">Approx. total</span><b>{rs(total)}</b></div>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Prices are approximate. We confirm the final amount and availability on WhatsApp. Payment and delivery are arranged with us directly.</p>
        <div className="field"><label htmlFor="n">Your name (optional)</label><input id="n" value={who.name} onChange={set('name')} autoComplete="name" /></div>
        <div className="field"><label htmlFor="p">Phone (optional)</label><input id="p" value={who.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" /></div>
        <div className="field"><label htmlFor="a">Address / area (optional)</label><input id="a" value={who.address} onChange={set('address')} autoComplete="street-address" /></div>
        <div className="field"><label htmlFor="t">Notes (optional)</label><textarea id="t" rows={2} value={who.notes} onChange={set('notes')} /></div>
        <a className="btn btn-primary" href={wa} target="_blank" rel="noopener noreferrer"><Whatsapp width={20} height={20} /> Send order on WhatsApp</a>
      </aside>
    </div>
  );
}
