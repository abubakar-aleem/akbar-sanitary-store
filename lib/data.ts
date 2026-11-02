import productsJson from '@/data/products.json';
import categoriesJson from '@/data/categories.json';
import siteJson from '@/data/site.json';
import manifest from '@/data/images-manifest.json';

export type Product = {
  id: string;
  name: string;
  desc: string;
  lists: string[];
  category: string | null;
  top: string | null;
  price: number;
  oldPrice: number | null;
  sale: boolean;
  approx: boolean;
  sizes: string[];
  featured: boolean;
};

export type CategoryNode = {
  slug: string;
  title: string;
  cardTitle?: string;
  shortTitle?: string;
  blurb?: string;
  kind: 'group' | 'list';
  children: string[];
  productIds?: string[];
  parent?: string;
  topSlug?: string;
  top?: boolean;
};

export const STORE = {
  name: 'Akbar Sanitary Store',
  short: 'Akbar Sanitary Store',
  since: 1994,
  whatsapp: '923211306560',
  phones: ['+92 321 471 5974', '+92 321 110 6560', '+92 321 130 6560'],
  email: 'akbar.santary.store84@gmail.com',
  address: 'Main Defence Ghazi Road, Exit 23 Ferozepur Road, Lahore, Pakistan',
  hours: ['Mon – Sat: 9:00 AM – 8:00 PM', 'Sunday: 9:00 AM – 3:00 PM', 'Friday break: 12:30 PM – 2:30 PM'],
  social: {
    facebook: 'https://www.facebook.com/akbarsons',
    instagram: 'https://www.instagram.com/akbar__sanitary__store',
    tiktok: 'https://www.tiktok.com/@akbarsons',
  },
};

export const products = productsJson as unknown as Product[];
const byId = new Map(products.map((p) => [p.id, p]));
export const getProduct = (id: string) => byId.get(id);

const cats = categoriesJson as unknown as { top: string[]; nodes: Record<string, CategoryNode> };
export const categories = cats.nodes;
export const topCategories = cats.top.map((s) => cats.nodes[s]).filter(Boolean);
export const getCategory = (slug: string) => cats.nodes[slug];

export const site = siteJson as unknown as {
  partners: { slug: string; title: string; intro: string; cards: { title: string; blurb: string; category: string }[] }[];
  policies: { slug: string; title: string; blocks: { type: string; text: string }[] }[];
  faq: { q: string; a: string }[];
};

export function trail(slug: string): CategoryNode[] {
  const out: CategoryNode[] = [];
  let n = cats.nodes[slug];
  while (n) {
    out.unshift(n);
    n = n.parent ? cats.nodes[n.parent] : (undefined as any);
  }
  return out;
}

export const categoryTitle = (n: CategoryNode) => n.cardTitle || n.title;

/** how many products sit under a category (recursively) */
const countCache = new Map<string, number>();
export function countProducts(slug: string): number {
  if (countCache.has(slug)) return countCache.get(slug)!;
  const n = cats.nodes[slug];
  let c = 0;
  if (n) c = n.kind === 'list' ? n.productIds?.length || 0 : n.children.reduce((a, s) => a + countProducts(s), 0);
  countCache.set(slug, c);
  return c;
}

export function related(p: Product, limit = 4): Product[] {
  const pool = p.category ? products.filter((x) => x.id !== p.id && x.lists.includes(p.category!)) : products.filter((x) => x.id !== p.id && x.top === p.top);
  return pool.slice(0, limit);
}

// ---------------------------------------------------------------- images (your own pictures)
const m = manifest as { products: Record<string, string>; categories: Record<string, string>; site: Record<string, string> };
export const productImage = (id: string) => (m.products[id] ? `/images/products/${m.products[id]}` : null);
export const categoryImage = (slug: string) => (m.categories[slug] ? `/images/categories/${m.categories[slug]}` : null);
export const siteImage = (name: string) => (m.site[name] ? `/images/site/${m.site[name]}` : null);

// ---------------------------------------------------------------- 3D object kind for a product
export type ObjectKind = 'pipe' | 'elbow' | 'tee' | 'valve' | 'faucet' | 'tank' | 'socket' | 'bowl' | 'lock' | 'box';
export function objectKind(name: string, category?: string | null): ObjectKind {
  const t = `${name} ${category || ''}`.toLowerCase();
  if (/tank/.test(t)) return 'tank';
  if (/lock/.test(t)) return 'lock';
  if (/elbow|bend/.test(t)) return 'elbow';
  if (/\btee\b|cross|yee|tee-cock/.test(t) && !/cock/.test(t)) return 'tee';
  if (/valve|cock|spindle|nozz?el|tap\b/.test(t)) return 'valve';
  if (/mixer|faucet|shower|neck|basin mixer/.test(t)) return 'faucet';
  if (/commode|wash|sink|basin|flush|bowl|trap/.test(t)) return 'bowl';
  if (/socket|union|coupling|bush|nipple|reducer|cap\b|plug/.test(t)) return 'socket';
  if (/pipe|hose|conduit/.test(t)) return 'pipe';
  return 'box';
}

const CAT_KIND: Record<string, ObjectKind> = {
  'pprc-pvc': 'pipe', pprc: 'pipe', pvc: 'pipe', 'pprc-companies': 'pipe', 'pvc-companies': 'pipe', gi: 'elbow', gas: 'pipe', 'gas-pipes': 'pipe', 'gas-fittings': 'tee',
  faucets: 'faucet', sanitary: 'bowl', tanks: 'tank', geysers: 'tank', curtain: 'pipe', motor: 'box', 'garden-pipes': 'pipe', ladder: 'box',
  'mirror-accessory': 'box', 'door-locks': 'lock', 'manhole-covers': 'box', 'plastic-sheets': 'box', filters: 'tank', 'automatic-machine-pipe': 'pipe',
  'kitchen-hood-pipe': 'pipe', 'wall-cover': 'box', 'floor-waste': 'bowl', 'brass-gate-valve': 'valve', 'handle-valve': 'valve', 'check-valve': 'valve',
  'no-return-valve': 'valve', 'pvc-solutions': 'socket', 'silicones-adhesives': 'box',
};
export const categoryObjectKind = (slug: string): ObjectKind => {
  if (CAT_KIND[slug]) return CAT_KIND[slug];
  const n = cats.nodes[slug];
  const top = n?.topSlug && CAT_KIND[n.topSlug];
  const own = objectKind(slug.replace(/-/g, ' '), slug);
  return own !== 'box' ? own : top || 'box';
};
