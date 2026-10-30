import Placeholder from './Placeholder';
import { categoryImage, objectKind, productImage, siteImage, type ObjectKind } from '@/lib/data';

// One image slot. Shows YOUR picture if the file exists in public/images/..., else a placeholder.
export default function Pic({
  product,
  category,
  site,
  alt,
  kind,
  label = true,
}: {
  product?: { id: string; name: string; category?: string | null };
  category?: string;
  site?: string;
  alt: string;
  kind?: ObjectKind;
  label?: boolean;
}) {
  const src = product ? productImage(product.id) : category ? categoryImage(category) : site ? siteImage(site) : null;
  const k = kind || (product ? objectKind(product.name, product.category) : category ? objectKind(category.replace(/-/g, ' ')) : 'box');
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" decoding="async" />;
  }
  return <Placeholder kind={k} label={label} />;
}
