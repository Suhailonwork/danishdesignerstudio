# Danish Designer Studio

A production-ready e-commerce platform for premium Indian menswear — storefront,
admin CMS, inventory, orders and SEO — built on Next.js 16 (App Router),
TypeScript, Tailwind CSS v4 and Supabase.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # optional: fill in Supabase keys
npm run dev                    # http://localhost:3000
```

The site runs immediately. Until Supabase credentials are present it serves a
complete bundled demo catalogue (24 products, 6 categories, 6 collections, blog,
testimonials, orders) so every page, filter and admin screen is browsable. The
admin panel is read-only in that mode and says so.

### Commands

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Development server                            |
| `npm run build`     | Production build                              |
| `npm start`         | Serve the production build                    |
| `npm run typecheck` | `tsc --noEmit`                                |
| `npm run lint`      | ESLint over `src`                             |
| `npm run check`     | Typecheck → lint → build (use before deploys) |

---

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → paste and run `supabase/migrations/0001_init.sql`.
   This creates every table, index, RLS policy, storage bucket, the
   `adjust_stock()` function and the auth triggers.
3. Run `supabase/seed.sql` to load the demo catalogue (optional but recommended —
   it is generated from the same data the demo mode uses, so nothing changes
   visually when you switch over).
4. Copy **Project Settings → API** values into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # server-only, never exposed
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

5. Restart the dev server.

### Creating the first administrator

1. Register on the storefront at `/account`.
2. In Supabase → **Table editor → `profiles`**, find your row and set
   `is_admin = true` and `role = 'admin'`.
3. Sign in at `/admin/sign-in`. From then on you can promote other accounts from
   **Admin → Users**.

---

## Routes

### Storefront

| Route                | Purpose                                             |
| -------------------- | --------------------------------------------------- |
| `/`                  | Database-driven homepage (13 orderable sections)    |
| `/shop`              | Full catalogue with filters, sorting, pagination    |
| `/category/[slug]`   | Category listing                                    |
| `/collections`       | All collections                                     |
| `/collection/[slug]` | One collection                                      |
| `/product/[slug]`    | Gallery, variants, reviews, related, recently viewed|
| `/search`            | Search results with the same filter rail            |
| `/cart`              | Full bag                                            |
| `/checkout`          | Address, coupon, payment                            |
| `/checkout/success`  | Order confirmation                                  |
| `/wishlist`          | Saved pieces                                        |
| `/account`           | Overview + sign-in / register                       |
| `/account/orders`    | Order history with tracking                         |
| `/account/profile`   | Profile and address book                            |
| `/account/sign-in`, `/account/sign-out`, `/account/forgot-password`, `/account/reset-password` | Auth |
| `/about`, `/contact` | Brand story with timeline; contact form + FAQ       |
| `/blog`, `/blog/[slug]` | The journal                                      |
| `/privacy-policy`, `/terms`, `/shipping-policy`, `/return-policy` | Admin-editable pages |
| `/sitemap.xml`, `/robots.txt` | Generated from live data                   |

### Admin (`/admin`, protected)

Dashboard · Products · Inventory · Categories · Collections · Orders ·
Customers · Coupons · Reviews · Homepage builder · Banners · Testimonials ·
Blog · Pages · Navigation · Media library · SEO · Settings · Users

### API

| Route                    | Purpose                                       |
| ------------------------ | --------------------------------------------- |
| `/api/search`            | Search suggestions for the header panel       |
| `/api/newsletter`        | Newsletter sign-up                            |
| `/api/payments/razorpay` | Create / verify a Razorpay payment (optional) |

---

## Architecture

```
src/
  app/
    (store)/        storefront routes + layout
    admin/          protected CMS
    api/            route handlers
  actions/          server actions (checkout, reviews, contact, admin/*)
  components/
    admin/          CMS UI (tables, editors, builders)
    home/           homepage section renderers
    product/        gallery, purchase panel, reviews
    store/          header, footer, cart, drawers, forms
    ui/             design-system primitives
  hooks/            useLocalArray (external-store cart/wishlist)
  lib/
    data/           seed dataset, mappers, queries
    payments/       Razorpay seam
    seo/            metadata + JSON-LD builders
    supabase/       browser / server / admin clients
  types/            shared domain model
supabase/
  migrations/0001_init.sql
  seed.sql
```

### Everything an owner can change

| Surface | Where |
| ------- | ----- |
| Hero image **or background video**, side cards, buttons | Admin → Homepage → Hero |
| Every homepage section's images, copy, links, counts | Admin → Homepage (form fields, no JSON) |
| Product gallery (reorder, upload, library) + product video | Admin → Products → Images |
| Category / collection artwork | Admin → Categories / Collections |
| Banner, testimonial and blog-cover images | Admin → Banners / Testimonials / Blog |
| About and Contact page imagery | Admin → Settings → Page imagery |
| Logo, default social share image | Admin → Settings / SEO |

Every image and video field offers the same three routes: **upload** to Supabase
Storage, **pick from the media library**, or **paste a URL**. Uploads are
catalogued in Admin → Media automatically, so they are reusable everywhere.

### Key decisions

- **One data layer, two sources.** `src/lib/data/queries.ts` reads from Supabase
  and falls back to the bundled dataset on any failure, so the site never 500s
  on a database hiccup and `next build` works without credentials.
- **Nothing hard-coded on the homepage.** Every band is a `home_sections` row
  with a JSON payload, reorderable and hideable from the admin panel.
- **Prices and stock are re-checked server-side** at checkout; client values are
  never trusted.
- **Writes are gated twice** — middleware guards `/admin` routes, and every
  admin server action re-verifies the caller through `getWritableClient()`.

---

## SEO

- Per-page metadata generated from Supabase, editable in the admin panel with a
  live Google-style preview (title, description, canonical, OG title/description/
  image, index/follow switches).
- Global SEO: site title, title template, keywords, default OG image, Twitter
  card, organisation details, Google verification, site-wide index switch.
- JSON-LD: Organization, WebSite + SearchAction, Product (with offers, shipping
  and aggregate rating), Review, BreadcrumbList, CollectionPage, ItemList,
  BlogPosting, FAQPage, Order.
- Dynamic `sitemap.xml` (products, categories, collections, posts, pages —
  `noIndex` rows excluded) and `robots.txt` driven by the admin index switch.
- Semantic headings, image alt text, `next/image` with AVIF/WebP, SEO-friendly
  slugs, canonical URLs, `rel=prev/next` pagination links, a real 404.

---

## Security

- Row Level Security on every table. Public reads are limited to published rows;
  writes require `public.is_admin()`.
- The service-role key is read only in server modules (`server-only` imported)
  and never reaches the browser.
- Guests may insert an order but can only read their own; admins read all.
- Reviews insert as `pending` and appear only after moderation.
- Zod validates every form and action payload; honeypot fields on the public
  review and contact forms.
- Storage buckets are public-read, admin-write.

---

## Remaining manual configuration

1. Run the migration and seed in Supabase (above).
2. Promote your first admin account (above).
3. Set `NEXT_PUBLIC_SITE_URL` to the production domain — canonical URLs,
   `sitemap.xml` and OG tags derive from it.
4. **Replace the placeholder imagery.** `public/media/` ships two kinds of
   placeholder, both temporary:
   - **Banners and blog covers** use real Creative-Commons photographs from
     Wikimedia Commons. Credits and licences are in
     `public/media/PHOTO-CREDITS.md`. They show people who are **not** your
     models — replace them before going live, or keep them only with the
     attribution the licence requires.
   - **Products, categories, collections, Instagram tiles and avatars** are
     rendered studio artwork generated by `.photo-tools/studio.mjs`, not
     photography. They are deliberately not passed off as real product shots.

   Swap either kind through **Admin → Media** (upload) or the image picker on
   each record. Use 3:4 portrait for products, 16:9 for banners and blog
   covers, 1:1 for Instagram tiles.
5. Optional: add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`,
   `NEXT_PUBLIC_RAZORPAY_KEY_ID` (and `RAZORPAY_WEBHOOK_SECRET`) to enable the
   gateway. Without them checkout offers Cash on Delivery and manual
   confirmation.
6. Optional: wire the newsletter table to your email provider.
