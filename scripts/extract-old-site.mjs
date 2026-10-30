// Reads the OLD static site and writes raw JSON into data/raw/.
// Usage: node scripts/extract-old-site.mjs /path/to/shop-website
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const SRC = process.argv[2] || '/home/claude/abubakar-aleem/shop-website';
const OUT = path.resolve('data/raw');
fs.mkdirSync(OUT, { recursive: true });

const read = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');
const clean = (s) =>
  (s || '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

// ---------- helpers to pull a JS literal out of a source file ----------
function extractLiteral(src, startMarker, open, close) {
  const start = src.indexOf(startMarker);
  if (start < 0) throw new Error('marker not found: ' + startMarker);
  const i = src.indexOf(open, start);
  let depth = 0,
    inStr = null;
  for (let k = i; k < src.length; k++) {
    const c = src[k];
    if (inStr) {
      if (c === '\\') {
        k++;
        continue;
      }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '/' && src[k + 1] === '/') {
      k = src.indexOf('\n', k);
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      inStr = c;
      continue;
    }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return (0, eval)('(' + src.slice(i, k + 1) + ')');
    }
  }
  throw new Error('unterminated literal');
}

// ---------- 1. shop products (77, with prices) ----------
const shopProducts = extractLiteral(read('shop.html'), 'const PRODUCTS = [', '[', ']');
fs.writeFileSync(path.join(OUT, 'shop-products.json'), JSON.stringify(shopProducts, null, 1));

// ---------- 2. price catalogue used on category pages ----------
const catalogue = extractLiteral(read('product-enhancer.js'), 'const PRICE_CATALOGUE', '{', '}');
fs.writeFileSync(path.join(OUT, 'price-catalogue.json'), JSON.stringify(catalogue, null, 1));

// ---------- 3. top-level categories (products.html) ----------
const subMap = {
  'pprc-pvc': 'sub-pprc-pvc',
  faucets: 'sub-faucets',
  sanitary: 'sub-sanitary',
  tanks: 'sub-tanks',
  ladder: 'sub-ladder',
  gas: 'sub-gas',
  'mirror-accessory': 'sub-mirror-accessory',
  'door-locks': 'sub-door-locks',
  'manhole-covers': 'sub-manhole-covers',
  garden: 'sub-garden-pipes',
};
const targetOf = (onclick) => {
  if (!onclick) return null;
  let m = onclick.match(/openSub\('([^']+)'\)/);
  if (m) return subMap[m[1]] || null;
  m = onclick.match(/showPage\('([^']+)'\)/);
  return m ? m[1] : null;
};
const toSlug = (page) => page.replace(/^(products-|sub-)/, '');

function parseCards(file) {
  const $ = cheerio.load(read(file));
  const cards = [];
  $('.product-card, .sub-card').each((_, el) => {
    const $el = $(el);
    const target = targetOf($el.attr('onclick'));
    if (!target) return;
    cards.push({
      target,
      title: clean($el.find('h3, h4').first().text()),
      blurb: clean($el.find('p').first().text()),
    });
  });
  return cards;
}

const topCards = parseCards('products.html');
const topLevel = topCards.map((c) => ({ ...c, slug: toSlug(c.target) }));

// ---------- 4. group pages (sub-*.html) ----------
const groups = {};
for (const f of fs.readdirSync(SRC).filter((f) => /^sub-.*\.html$/.test(f))) {
  const $ = cheerio.load(read(f));
  const title = clean($('h1').first().text()) || clean($('.section-title').first().text());
  const blurb = clean($('.products-header p').first().text());
  const cards = parseCards(f);
  groups[toSlug(f.replace('.html', ''))] = { slug: toSlug(f.replace('.html', '')), page: f.replace('.html', ''), title, blurb, cards };
}

// ---------- 5. list pages (products-*.html) + ladders ----------
const lists = {};
function parseItems($) {
  const items = [];
  $('.prod-item').each((_, el) => {
    const $el = $(el);
    const name = clean($el.find('h3').first().text());
    if (!name) return;
    items.push({ name, desc: clean($el.find('p').first().text()) });
  });
  return items;
}
for (const f of fs.readdirSync(SRC).filter((f) => /^products-.*\.html$/.test(f))) {
  const $ = cheerio.load(read(f));
  const slug = toSlug(f.replace('.html', ''));
  const title = clean($('h1').first().text());
  const blurb = clean($('.products-header p').first().text());
  lists[slug] = { slug, page: f.replace('.html', ''), title, blurb, items: parseItems($) };
}
// ladder page uses different markup (h2 sections + cards)
{
  const $ = cheerio.load(read('sub-ladder.html'));
  const items = [];
  $('h3').each((_, el) => {
    const name = clean($(el).text());
    if (!/ladder/i.test(name)) return;
    const $card = $(el).parent();
    items.push({ name, desc: clean($card.find('p').first().text()) });
  });
  lists['ladder'] = { slug: 'ladder', page: 'sub-ladder', title: 'Folding Ladders', blurb: clean($('.products-header p').first().text()), items };
  delete groups['ladder'];
}

// ---------- 6. partners ----------
const partners = {};
for (const f of fs.readdirSync(SRC).filter((f) => /^partner-.*\.html$/.test(f))) {
  const $ = cheerio.load(read(f));
  const slug = f.replace(/^partner-|\.html$/g, '');
  const title = clean($('h1').first().text()) || clean($('.section-title').first().text());
  // main content = everything between </header> and <footer>
  const main = $('header').nextUntil('footer');
  const paras = [];
  main.find('p').each((_, p) => {
    const t = clean($(p).text());
    if (t) paras.push(t);
  });
  const cards = [];
  main.find('[onclick]').each((_, el) => {
    const t = targetOf($(el).attr('onclick'));
    const h = clean($(el).find('h3,h4').first().text());
    if (t && h) cards.push({ title: h, blurb: clean($(el).find('p').first().text()), target: t });
  });
  partners[slug] = { slug, title, paras, cards };
}

// ---------- 7. policies ----------
const policyFiles = {
  'privacy-policy': 'Privacy Policy',
  'terms-conditions': 'Terms & Conditions',
  'exchange-return': 'Exchange & Return',
  'refund-policy': 'Refund Policy',
  'cancellation-policy': 'Cancellation Policy',
};
const policies = {};
for (const [slug, fallback] of Object.entries(policyFiles)) {
  const $ = cheerio.load(read(slug + '.html'));
  const blocks = [];
  const main = $('header').nextUntil('footer');
  main.find('h1,h2,h3,h4,p,li').each((_, el) => {
    const tag = el.tagName.toLowerCase();
    const text = clean($(el).text());
    if (text) blocks.push({ type: tag, text });
  });
  policies[slug] = { slug, title: clean($('h1').first().text()) || fallback, blocks };
}

// ---------- 8. FAQ ----------
const $faq = cheerio.load(read('faq.html'));
const faq = [];
$faq('.faq-q').each((_, el) => {
  const q = clean($faq(el).find('b').first().text());
  const a = clean($faq(el).next('.faq-a').text());
  if (q && a) faq.push({ q, a });
});

// ---------- 9. about + contact (text only, rendered by hand in the new site) ----------
function mainText(file) {
  const $ = cheerio.load(read(file));
  const out = [];
  $('header').nextUntil('footer').find('h1,h2,h3,h4,h5,p,li,span,label,a').each((_, el) => {
    const t = clean($(el).text());
    if (t) out.push(t);
  });
  return [...new Set(out)];
}
const about = mainText('about.html');
const contact = mainText('contact.html');

const write = (name, data) => fs.writeFileSync(path.join(OUT, name + '.json'), JSON.stringify(data, null, 1));
write('top-level', topLevel);
write('groups', groups);
write('lists', lists);
write('partners', partners);
write('policies', policies);
write('faq', faq);
write('about-text', about);
write('contact-text', contact);

const itemCount = Object.values(lists).reduce((n, l) => n + l.items.length, 0);
console.log({
  shopProducts: shopProducts.length,
  catalogue: Object.keys(catalogue).length,
  topLevel: topLevel.length,
  groups: Object.keys(groups).length,
  lists: Object.keys(lists).length,
  listItems: itemCount,
  emptyLists: Object.values(lists).filter((l) => !l.items.length).map((l) => l.slug),
  partners: Object.keys(partners).length,
  policies: Object.keys(policies).length,
  faq: faq.length,
});
