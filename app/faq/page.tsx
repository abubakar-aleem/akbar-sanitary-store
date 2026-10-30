import type { Metadata } from 'next';
import Faq from '@/components/Faq';
import { site } from '@/lib/data';

export const metadata: Metadata = { title: 'FAQs', description: 'Answers to common questions about our products, brands and services.' };

export default function FaqPage() {
  return (
    <section className="section page-top">
      <div className="container two" style={{ alignItems: 'start' }}>
        <div style={{ position: 'sticky', top: 120 }}>
          <span className="eyebrow">FAQs</span>
          <h1 className="h2" style={{ margin: '16px 0 18px' }}>Answers to your questions.</h1>
          <p className="lead">Everything you need to know about our products, brands and service. Cannot find it? Message us on WhatsApp.</p>
        </div>
        <Faq items={site.faq} />
      </div>
    </section>
  );
}
