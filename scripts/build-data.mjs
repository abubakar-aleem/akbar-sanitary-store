// Builds the data files the Next.js site reads, from data/raw (extracted from the old site).
//   node scripts/extract-old-site.mjs <old-site-folder>   (one time)
//   node scripts/build-data.mjs                           (runs automatically before build)
//
// PRICES: data/price-sheet.csv is the single place to edit prices. It is created the first time this
// runs (existing prices from the old site + approximate estimates) and is NEVER overwritten afterwards.
// New products are appended to it. Edit a price there, run `npm run data`, done.
import fs from 'node:fs';
import path from 'node:path';
import { ruleEstimate } from './price-rules.mjs';

const RAW = path.resolve('data/raw');
const OUT = path.resolve('data');
const j = (n) => JSON.parse(fs.readFileSync(path.join(RAW, n + '.json'), 'utf8'));

const shop = j('shop-products');
const catalogue = j('price-catalogue');
const topLevelRaw = j('top-level');
const groupsRaw = j('groups');
const listsRaw = j('lists');

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['"”“’`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- category tree
const pageToSlug = (p) => slugify(p.replace(/^(products-|sub-)/, ''));
const fixTargets = {
  'products-faucet-Tap and Mixers Head': 'products-faucet-Tap and Mixtures Head',
};
const nodes = {};
const knownPages = new Set([...Object.values(groupsRaw).map((g) => g.page), ...Object.values(listsRaw).map((l) => l.page)]);
const dropped = [];

for (const l of Object.values(listsRaw)) {
  const slug = slugify(l.slug);
  nodes[slug] = { slug, title: l.title, blurb: l.blurb, kind: 'list', children: [], page: l.page };
}
for (const g of Object.values(groupsRaw)) {
  const slug = slugify(g.slug);
  const children = [];
  for (const c of g.cards) {
    const target = fixTargets[c.target] || c.target;
    if (!knownPages.has(target)) {
      dropped.push(`${g.page} -> ${c.target}`);
      continue;
    }
    children.push({ slug: pageToSlug(target), title: c.title });
  }
  nodes[slug] = { slug, title: g.title, blurb: g.blurb, kind: 'group', children: children.map((c) => c.slug), childTitles: Object.fromEntries(children.map((c) => [c.slug, c.title])), page: g.page };
}
// parents + titles from card labels
for (const n of Object.values(nodes)) for (const c of n.children || []) if (nodes[c]) { nodes[c].parent = nodes[c].parent || n.slug; if (!nodes[c].title) nodes[c].title = n.childTitles[c]; }
const top = [];
for (const t of topLevelRaw) {
  const slug = pageToSlug(t.target);
  if (!nodes[slug]) { dropped.push(`products -> ${t.target}`); continue; }
  top.push(slug);
  nodes[slug].top = true;
  if (!nodes[slug].shortTitle) nodes[slug].shortTitle = t.title;
}
const titleFallback = (slug) => slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
for (const n of Object.values(nodes)) {
  if (!n.title) n.title = n.shortTitle || titleFallback(n.slug);
  // a group's cards link to it with a nicer short title
  if (n.parent && nodes[n.parent]?.childTitles?.[n.slug]) n.cardTitle = nodes[n.parent].childTitles[n.slug];
}
const topOf = (slug) => {
  let n = nodes[slug];
  while (n && n.parent) n = nodes[n.parent];
  return n?.slug;
};
const orphans = Object.values(nodes).filter((n) => !n.parent && !n.top).map((n) => n.slug);
// pages reachable from nowhere: attach under the closest sensible top category by name, else keep as extra top
const orphanParent = { pprc: 'pprc-companies', pvc: 'pvc-companies' };
for (const o of orphans) {
  const par = orphanParent[o];
  if (par && nodes[par]) {
    nodes[o].parent = par;
    nodes[o].cardTitle = nodes[o].title;
    nodes[par].children.push(o);
  } else { nodes[o].top = true; top.push(o); }
}

// ---------------------------------------------------------------- products
const products = [];
const byKey = new Map(); // normalized name -> product
const usedSlugs = new Set();
const uniqueSlug = (base) => {
  let s = slugify(base) || 'item';
  let k = 2;
  const o = s;
  while (usedSlugs.has(s)) s = `${o}-${k++}`;
  usedSlugs.add(s);
  return s;
};

const shopCatToTop = { pipes: 'pprc-pvc', faucets: 'faucets', showers: 'faucets', taps: 'faucets', accessories: 'mirror-accessory', 'sanitary wares': 'sanitary', fittings: 'gi' };

// 1) shop products first (they carry sizes / description / old price)
for (const p of shop) {
  const prod = {
    id: uniqueSlug(p.name),
    legacyId: p.id,
    name: p.name,
    desc: p.description || '',
    lists: [],
    shopCategory: p.category,
    price: typeof p.price === 'number' ? p.price : null,
    oldPrice: typeof p.oldPrice === 'number' ? p.oldPrice : null,
    sale: !!p.sale,
    sizes: (p.sizes || []).map((s) => (typeof s === 'string' ? s : s.name)),
    featured: true,
    priceBasis: 'old-site',
  };
  products.push(prod);
  byKey.set(norm(p.name), prod);
}
// 2) every item on category pages
for (const l of Object.values(listsRaw)) {
  const listSlug = slugify(l.slug);
  for (const it of l.items) {
    const key = norm(it.name);
    let prod = byKey.get(key);
    if (!prod) {
      const c = catalogue[key];
      prod = {
        id: uniqueSlug(it.name),
        name: it.name,
        desc: (c && c.desc) || it.desc || '',
        lists: [],
        price: c && typeof c.price === 'number' ? c.price : null,
        oldPrice: c && typeof c.oldPrice === 'number' ? c.oldPrice : null,
        sale: !!(c && c.sale),
        sizes: c && Array.isArray(c.sizes) ? c.sizes.map((s) => (typeof s === 'string' ? s : s.name)) : [],
        featured: false,
        priceBasis: c && typeof c.price === 'number' ? 'old-site' : null,
      };
      products.push(prod);
      byKey.set(key, prod);
    } else if (!prod.desc && it.desc) prod.desc = it.desc;
    if (!prod.lists.includes(listSlug)) prod.lists.push(listSlug);
  }
}
for (const p of products) {
  p.category = p.lists[0] || null;
  p.top = p.category ? topOf(p.category) : shopCatToTop[p.shopCategory] || null;
  if (!p.category && p.top) p.category = null;
}

// ---------------------------------------------------------------- approximate prices
const FRAC = /(?:(\d+)\s*[- ]\s*)?(\d+)\s*\/\s*(\d+)/;
function sizeMM(text, material) {
  let m;
  if ((m = text.match(/(\d+(?:\.\d+)?)\s*mm/i))) return +m[1];
  if ((m = text.match(/(\d+(?:\.\d+)?)\s*(?:foot|feet|ft)\b/i))) return +m[1] * 304.8;
  // "25 x 1/2" on PPR-C / PVC pages = 25 mm pipe size first
  if ((material === 'pprc' || material === 'pvc') && (m = text.match(/(?:^|[^\d./])(\d{2,3})\s*x\s*[\d/]/i)) && +m[1] >= 15 && +m[1] <= 200) return +m[1];
  if ((m = text.match(FRAC)) && +m[3] >= 2 && +m[2] < +m[3]) return ((m[1] ? +m[1] : 0) + +m[2] / +m[3]) * 25.4;
  if ((m = text.match(/(\d+(?:\.\d+)?)\s*(?:"|''|”|inch(?:es)?\b|in\b)/i))) return +m[1] * 25.4;
  return null;
}
const MATERIALS = ['pprc', 'ppr', 'pvc', 'upvc', 'cpvc', 'gi', 'ss', 'brass', 'plastic'];
const STOP = new Set('inch inches in mm size sizes x the and with for of a an to pn pn16 pn20 pn25 hp kw premium quality new item set pcs pc piece no nos china he standard heavy duty'.split(' '));
const BRANDS = new Set('dura popular iil turk turkplast plast terebela suntuff master prime primemaster jij faisal asia super sehzad rite winner decent fine agk ags civic pell'.split(' '));
function materialOf(p) {
  const l = p.lists[0] || '';
  if (l.startsWith('pprc')) return 'pprc';
  if (l.startsWith('pvc')) return 'pvc';
  if (l === 'gi' || l.startsWith('gi-')) return 'gi';
  const t = p.name.toLowerCase().split(/[^a-z]+/);
  for (const m of MATERIALS) if (t.includes(m)) return m === 'ppr' ? 'pprc' : m === 'upvc' ? 'pvc' : m;
  if (p.top === 'pprc-pvc') return /pvc/i.test(p.name) ? 'pvc' : 'pprc';
  return null;
}
function toks(p) {
  return new Set(
    p.name
      .toLowerCase()
      .replace(FRAC, ' ')
      .replace(/\d+(\.\d+)?/g, ' ')
      .split(/[^a-z]+/)
      .filter((w) => w.length > 1 && !STOP.has(w) && !BRANDS.has(w) && !MATERIALS.includes(w)),
  );
}
const jacc = (a, b) => {
  let i = 0;
  for (const x of a) if (b.has(x)) i++;
  const u = a.size + b.size - i;
  return u ? i / u : 0;
};
const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const roundPrice = (v) => (v < 100 ? Math.max(5, Math.round(v / 5) * 5) : v < 1000 ? Math.round(v / 10) * 10 : Math.round(v / 50) * 50);
const fit = (pts, sz) => {
  pts = [...pts].sort((a, b) => Math.abs(Math.log(a.s / sz)) - Math.abs(Math.log(b.s / sz)));
  const [a, b] = pts;
  if (!b || a.s === b.s) return a.v * Math.min(3, Math.max(0.3, Math.pow(sz / a.s, 0.8)));
  let slope = (Math.log(b.v) - Math.log(a.v)) / (Math.log(b.s) - Math.log(a.s));
  slope = Math.min(1.6, Math.max(0.3, slope));
  const v = Math.exp(Math.log(a.v) + slope * (Math.log(sz) - Math.log(a.s)));
  return Math.min(Math.max(...pts.map((x) => x.v)) * 3, Math.max(Math.min(...pts.map((x) => x.v)) * 0.4, v));
};

// last-resort defaults per top category (rough PKR guesses, only where nothing similar is priced in the old data)
const topDefaults = { motor: 18000, geysers: 22000, ladder: 6500, 'door-locks': 2500, tanks: 6000, filters: 3500, sanitary: 12000, curtain: 400, 'plastic-sheets': 800 };
const globalDefault = 500;

for (const p of products) { p._mat = materialOf(p); p._tok = toks(p); p._size = sizeMM(p.name + ' ' + (p.desc || ''), p._mat); }

// Which already-priced items can we trust as a reference for others?
//  - not the demo items p48..p77 (placeholder pictures, invented-looking products)
//  - not groups where every size has the very same price (e.g. Dura sockets/elbows all Rs 1,850)
const isDemo = (p) => /^p(4[89]|[5-7]\d)$/.test(p.legacyId || '');
const flat = new Set();
{
  const g = {};
  for (const p of products) if (p.price != null) (g[family2(p)] ||= []).push(p.price);
  for (const [k, v] of Object.entries(g)) if (v.length >= 3 && new Set(v).size === 1) flat.add(k);
}
function family2(p) {
  return (p.top || '') + '|' + p._tok.size + '|' + [...p._tok].sort().join(' ');
}
const anchors = products.filter((p) => p.price != null && !isDemo(p) && !flat.has(family2(p)));
const pricedByTop = {};
for (const p of anchors) if (p.top) (pricedByTop[p.top] ||= []).push(p.price);

function simPool(p, minScore, samePageOnly) {
  return anchors
    .filter((q) => (!p._mat || !q._mat || q._mat === p._mat) && (!samePageOnly || (q.lists[0] && q.lists[0] === p.lists[0])))
    .map((q) => ({ q, sc: jacc(p._tok, q._tok) + (q.top === p.top ? 0.1 : 0) + (q._mat && q._mat === p._mat ? 0.1 : 0) }))
    .filter((x) => x.sc >= minScore)
    .sort((a, b) => b.sc - a.sc);
}
function fromCands(p, cands, label) {
  const best = cands[0].sc;
  const group = cands.filter((x) => x.sc >= best - 0.12).map((x) => x.q);
  const pts = group.filter((q) => q._size).map((q) => ({ s: q._size, v: q.price }));
  if (p._size && pts.length >= 2) return { v: fit(pts, p._size), basis: label + '-by-size' };
  if (p._size && pts.length === 1) return { v: fit(pts, p._size), basis: label + '-scaled' };
  return { v: median(group.map((q) => q.price)), basis: label };
}
function estimate(p) {
  // 1) same page, nearly the same item type, already priced on the old site
  const same = simPool(p, 0.9, true);
  if (same.length) return fromCands(p, same, 'same-page-similar');
  // 2) rule of thumb by product type (market guess)
  const r = ruleEstimate(p, p._size);
  if (r != null) return { v: r, basis: 'market-guess' };
  // 3) similar priced items elsewhere on the old site
  const sim = simPool(p, 0.5, false);
  if (sim.length) return fromCands(p, sim, 'similar-items');
  // 4) median of the category, else a flat default
  const same2 = anchors.filter((q) => q.top === p.top && (!p._mat || !q._mat || q._mat === p._mat));
  if (same2.length) return { v: median(same2.map((q) => q.price)), basis: 'category-median' };
  const t = p.top;
  return { v: (t && topDefaults[t]) || globalDefault, basis: 'rough-default' };
}
for (const p of products) {
  if (p.price == null) {
    const e = estimate(p);
    p.price = roundPrice(e.v);
    p.priceBasis = e.basis;
  }
}
for (const p of products) { delete p._mat; delete p._tok; delete p._size; }

// ---------------------------------------------------------------- price sheet (edit this file!)
const sheetPath = path.join(OUT, 'price-sheet.csv');
const csvEsc = (s) => (/[",\n]/.test(String(s)) ? `"${String(s).replace(/"/g, '""')}"` : String(s));
const parseCsv = (txt) => {
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (q) { if (c === '"') { if (txt[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
};
const header = ['id', 'name', 'category', 'price_pkr', 'old_price_pkr', 'on_sale', 'price_status', 'basis'];
const sheet = new Map();
if (fs.existsSync(sheetPath)) {
  const rows = parseCsv(fs.readFileSync(sheetPath, 'utf8'));
  const h = rows[0];
  for (const r of rows.slice(1)) if (r[0]) sheet.set(r[0], Object.fromEntries(h.map((k, i) => [k, r[i]])));
}
let added = 0;
for (const p of products) {
  if (!sheet.has(p.id)) {
    added++;
    sheet.set(p.id, {
      id: p.id,
      name: p.name,
      category: p.category || p.shopCategory || '',
      price_pkr: p.price,
      old_price_pkr: p.oldPrice || '',
      on_sale: p.sale ? 'yes' : '',
      price_status: p.priceBasis === 'old-site' ? 'from old site' : 'approximate',
      basis: p.priceBasis,
    });
  }
}
// always keep sheet rows in sync with product names; write sheet back
const lines = [header.join(',')];
for (const p of products) {
  const r = sheet.get(p.id);
  r.name = p.name;
  r.category = p.category || p.shopCategory || '';
  lines.push(header.map((k) => csvEsc(r[k] ?? '')).join(','));
}
fs.writeFileSync(sheetPath, lines.join('\n') + '\n');

// apply sheet to products (sheet wins)
for (const p of products) {
  const r = sheet.get(p.id);
  const pr = Number(String(r.price_pkr).replace(/[^\d.]/g, ''));
  if (pr > 0) p.price = pr;
  const op = Number(String(r.old_price_pkr || '').replace(/[^\d.]/g, ''));
  p.oldPrice = op > p.price ? op : null;
  p.sale = String(r.on_sale || '').toLowerCase().startsWith('y') && !!p.oldPrice;
  p.approx = r.price_status !== 'from old site' && r.price_status !== 'confirmed';
  delete p.priceBasis;
  delete p.shopCategory;
  delete p.legacyId;
}

// ---------------------------------------------------------------- write
const catOut = { top, nodes };
for (const n of Object.values(nodes)) {
  delete n.childTitles;
  if (n.kind === 'list') n.productIds = products.filter((p) => p.lists.includes(n.slug)).map((p) => p.id);
  n.topSlug = topOf(n.slug);
}
fs.writeFileSync(path.join(OUT, 'categories.json'), JSON.stringify(catOut));
fs.writeFileSync(path.join(OUT, 'products.json'), JSON.stringify(products));

// image checklist: where to drop pictures
const imgRows = ['kind,file_name_without_extension,folder,label'];
for (const p of products) imgRows.push(`product,${p.id},public/images/products,${csvEsc(p.name)}`);
for (const n of Object.values(nodes)) imgRows.push(`category,${n.slug},public/images/categories,${csvEsc(n.title)}`);
fs.writeFileSync(path.join(OUT, 'images-checklist.csv'), imgRows.join('\n') + '\n');

const basisCount = {};
for (const r of sheet.values()) basisCount[r.basis || r.price_status] = (basisCount[r.basis || r.price_status] || 0) + 1;
console.log({
  products: products.length,
  fromOldSite: products.filter((p) => !p.approx).length,
  approximate: products.filter((p) => p.approx).length,
  newSheetRows: added,
  basis: basisCount,
  categories: Object.keys(nodes).length,
  top: top.length,
  droppedLinks: dropped,
  orphansPromoted: orphans,
  noTop: products.filter((p) => !p.top).length,
});

// ---------------------------------------------------------------- site text (partners, policies, FAQ)
{
  const partnersRaw = j('partners');
  const partners = Object.values(partnersRaw).map((p) => ({
    slug: p.slug,
    title: p.title,
    intro: p.paras.find((t) => /choose a product/i.test(t)) || '',
    cards: p.cards.map((c) => ({ title: c.title, blurb: c.blurb, category: pageToSlug(c.target) })).filter((c) => nodes[c.category]),
  }));
  const policies = Object.values(j('policies')).map((p) => ({ slug: p.slug, title: p.title, blocks: p.blocks.filter((b) => b.type !== 'h1') }));
  fs.writeFileSync(path.join(OUT, 'site.json'), JSON.stringify({ partners, policies, faq: j('faq') }, null, 1));
  console.log('site.json written:', { partners: partners.length, policies: policies.length, faq: j('faq').length });
}
