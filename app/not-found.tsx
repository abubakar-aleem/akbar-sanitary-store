import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="section page-top">
      <div className="container center">
        <span className="eyebrow">404</span>
        <h1 className="display" style={{ margin: '18px 0 24px' }}>Lost the thread.</h1>
        <p className="lead" style={{ margin: '0 auto 30px' }}>That page does not exist. Try the shop or the categories.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}><Link className="btn btn-primary" href="/shop">Shop</Link><Link className="btn" href="/categories">Categories</Link></div>
      </div>
    </section>
  );
}
