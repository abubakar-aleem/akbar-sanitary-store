import type { Metadata } from 'next';
import CartClient from '@/components/CartClient';

export const metadata: Metadata = { title: 'Your cart' };

export default function CartPage() {
  return (
    <section className="section page-top">
      <div className="container">
        <div className="head">
          <div>
            <span className="eyebrow">Your order</span>
            <h1 className="h2">Cart.</h1>
          </div>
        </div>
        <CartClient />
      </div>
    </section>
  );
}
