import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/inter';
import '@fontsource/space-mono/400.css';
import './globals.css';
import { CartProvider } from '@/lib/cart';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export const metadata: Metadata = {
  title: { default: 'Akbar & Sons Sanitary Store | Premium Plumbing & Sanitary Ware, Lahore', template: '%s | Akbar & Sons' },
  description: 'Pipes, fittings, faucets, tanks and sanitary ware from authorized dealers of Dura, Popular, Turk Plast and IIL. Serving Lahore since 1994.',
};
export const viewport: Viewport = { themeColor: '#e3e6eb', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <ScrollProgress />
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}
