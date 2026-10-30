// Looks in public/images/** and records which pictures exist, so the site shows your photo when
// the file is there and a clean placeholder when it is not (no broken-image requests).
//   public/images/products/<product-id>.jpg|jpeg|png|webp
//   public/images/categories/<category-slug>.jpg|jpeg|png|webp
//   public/images/site/<name>.jpg|jpeg|png|webp      (hero, certificates, brands, about ...)
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('public/images');
const exts = ['.webp', '.jpg', '.jpeg', '.png', '.avif'];
const out = { products: {}, categories: {}, site: {} };
for (const kind of Object.keys(out)) {
  const dir = path.join(root, kind);
  fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(dir)) {
    const ext = path.extname(f).toLowerCase();
    if (exts.includes(ext)) out[kind][f.slice(0, -ext.length)] = f;
  }
}
fs.writeFileSync(path.resolve('data/images-manifest.json'), JSON.stringify(out, null, 1));
console.log('images found:', Object.fromEntries(Object.entries(out).map(([k, v]) => [k, Object.keys(v).length])));
