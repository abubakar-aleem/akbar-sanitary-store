'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart';
import { Cart, Close, Menu, Search } from './Icons';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQs' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const active = (href: string) => (href === '/' ? path === '/' : path.startsWith(href) || (href === '/categories' && path.startsWith('/category')));
  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      <div className="nav-wrap">
        <header className="nav">
          <Link href="/" className="logo" aria-label="Akbar Sanitary Store - home">
            Akbar <b>Sanitary</b> Store<i />
          </Link>
          <nav className="nav-links" aria-label="Main">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={active(l.href) ? 'on' : ''}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="nav-right">
            <form className="nav-search" onSubmit={go} role="search">
              <Search width={17} height={17} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" aria-label="Search products" />
            </form>
            <Link href="/cart" className="icon-btn" aria-label={`Cart, ${ready ? count : 0} items`}>
              <Cart />
              {ready && count > 0 && <span className="badge">{count}</span>}
            </Link>
            <button className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu />
            </button>
          </div>
        </header>
      </div>
      <div className={`drawer ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
          <button className="icon-btn" style={{ alignSelf: 'flex-end', marginBottom: 10 }} onClick={() => setOpen(false)} aria-label="Close menu">
            <Close />
          </button>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={active(l.href) ? 'on' : ''}>
              {l.label}
            </Link>
          ))}
          <Link href="/cart">Cart {ready && count > 0 ? `(${count})` : ''}</Link>
        </div>
      </div>
    </>
  );
}
