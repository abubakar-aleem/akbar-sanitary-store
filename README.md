# Akbar Sanitary Store - new website (Phase 1: frontend)

Next.js + GSAP-free scroll chapters + Three.js 3D. Orders go through WhatsApp. No backend yet (Phase 2).

## Run it
```bash
npm install
npm run dev        # http://localhost:3000   (data is rebuilt automatically first)
npm run build && npm start
```

## Add your pictures (placeholders are shown until you do)
Drop files into `public/images/` using the product / category id as the file name, any of `.jpg .jpeg .png .webp .avif`:

| Folder                     | File name                         | Example                                        |
| -------------------------- | --------------------------------- | ---------------------------------------------- |
| `public/images/products/`   | `<product-id>.jpg`                | `dura-ppr-c-25mmpipe-pn-16.jpg`                |
| `public/images/categories/` | `<category-slug>.jpg`             | `faucets.jpg`                                  |
| `public/images/site/`       | `about.jpg`, `certificate-dura-flow.jpg`, `certificate-turk-plast.jpg`, `certificate-popular-pipes.jpg`, `certificate-iil.jpg` |

The full list of ids is in `data/images-checklist.csv` (open in Excel). Restart `npm run dev` (or rebuild) after adding files.
A product with a photo shows the photo (tilting as you scroll); without one it shows a placeholder and a 3D stand-in object.

## Change prices
Edit `data/price-sheet.csv` (Excel is fine) - the single place for all prices:
- `price_pkr`, `old_price_pkr`, `on_sale` (yes/blank) are what the site uses.
- Set `price_status` to `confirmed` once you have checked a price. Rows marked `approximate` show as approximate and
  rows whose `basis` is `market-guess` are rough estimates made by Claude, NOT from your old site - please review them.
- Then run `npm run data` (or just `npm run dev` / `npm run build`). The sheet is never overwritten by the build.

## Colours
`app/globals.css`, top of the file: `--black`, `--cobalt`, `--lime` (+ soft greys). Change them there.

## Layout of the code
- `app/` pages: `/`, `/shop`, `/categories`, `/category/[slug]`, `/product/[id]`, `/cart`, `/about`, `/contact`, `/faq`, `/partners/[slug]`, `/policy/[slug]`
- `components/ProductStory.tsx` the 3D scroll chapters on each product page; `components/Scene3D.tsx` the Three.js scene
- `lib/three-objects.ts` the stand-in 3D shapes; `lib/cart.tsx` cart + WhatsApp order message
- `scripts/` data pipeline (`extract-old-site.mjs` ran once against the old site; `build-data.mjs` builds the JSON the site reads)
