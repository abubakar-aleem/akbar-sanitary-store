import Link from 'next/link';
import Pic from './Pic';
import AddToCart from './AddToCart';
import { categories, type Product } from '@/lib/data';
import { rs } from '@/lib/format';

export default function ProductCard({ p }: { p: Product }) {
  const cat = p.category ? categories[p.category] : null;
  return (
    <article className="pcard">
      {p.sale && <span className="sale-tag">Sale</span>}
      <Link href={`/product/${p.id}`} className="pimg" aria-label={p.name}>
        <Pic product={p} alt={p.name} />
      </Link>
      <div className="body">
        {cat && <span className="cat">{cat.cardTitle || cat.title}</span>}
        <h3><Link href={`/product/${p.id}`}>{p.name}</Link></h3>
        <div className="price">
          <small>Approx. price</small>
          <b>{rs(p.price)}</b>
          {p.sale && p.oldPrice && <s>{rs(p.oldPrice)}</s>}
        </div>
        <AddToCart p={p} />
      </div>
    </article>
  );
}
