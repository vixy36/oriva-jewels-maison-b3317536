# Plan

Big scope — grouping into phases so you can approve or trim. Ask me to skip any phase.

## Phase 1 — Quick UI fixes (small)
- Remove the "Chapter 0X" eyebrow from category/collection page hero (`src/routes/collections.$category.tsx`) and tighten the hero width so the first section starts sooner.
- Keep chapters on homepage intact.

## Phase 2 — Enquiry → Order pipeline (core)
When a user clicks "Enquire on WhatsApp" on a product page, capture it as an enquiry row BEFORE opening WhatsApp:
- Extend `enquiries` table: add `product_slug`, `product_name`, `configuration` (jsonb: diamond/metal/carat/size/etc), `source` ('whatsapp_product'|'contact'|'bespoke'), `status` enum (`new`, `confirmed`, `in_production`, `shipped`, `delivered`, `cancelled`), `tracking_number`, `carrier`, `shipping_address` jsonb, `total_amount`, `currency`, `notes`.
- Public insert policy for anon (product enquiries), admin full access.
- Product page: on WhatsApp click, insert row (fire-and-forget), then open wa.me link.
- Admin Enquiries page (`admin.enquiries.tsx`): status dropdown, tracking fields, timeline notes, "Convert to Order" action.

## Phase 3 — Orders module
- New `orders` table (customer info, items jsonb, status, shipping, totals, payment_status, tracking) with same status pipeline.
- Admin route `admin.orders.tsx`:
  - List / filter by status.
  - **Create order manually** (customer email/phone/address, add products from catalog with qty & price, save).
  - Update shipping status, tracking number, carrier, ETA.
  - Link back to originating enquiry.
- Public **Order Status page** at `/order/$orderCode` — customer enters order code + email to see status timeline, tracking link, items. No auth required.

## Phase 4 — Inventory management
- Add `stock_quantity`, `low_stock_threshold`, `track_inventory` to `products`.
- Admin products page: stock column, edit stock inline, low-stock badge.
- Auto-decrement when admin marks an order `confirmed` (optional — will confirm during build).
- Dashboard widget: "Low stock" list.

## Phase 5 — Gift Ideas
- New `gift_ideas` table (title, description, price_range, occasion, image, linked product slugs, sort_order, is_active).
- Admin CRUD at `admin.gifts.tsx`.
- Public page `/gifts` with occasion filter (Anniversary, Birthday, Wedding, Him, Her, Under $X).
- Header nav entry.

## Phase 6 — Enhanced search
Upgrade `SearchDialog`:
- Search DB products (name, code, category, description) + static products together.
- Category chips, recent searches (localStorage), keyboard nav (↑↓ enter), instant thumbnails, "no results → browse suggestions".
- Debounced Supabase query with `ilike`.

## Phase 7 — Marketing automations
- New `automation_triggers` table (name, event: `order_shipped`|`order_confirmed`|`order_cancelled`|`enquiry_new`|`abandoned_enquiry_24h`|`birthday`, audience filter jsonb, email subject, email body template with `{{variables}}`, is_active).
- Admin `admin.automations.tsx`: CRUD, preview, test-send.
- Server function fires matching automation when a status changes; uses Lovable Emails (`sendTemplateEmail`) with a generic dynamic template that renders admin-authored subject/body.
- Scheduled automations (abandoned/birthday) via pg_cron → public API route `/api/public/automations/tick`.

## Phase 8 — Shipping label generator
- Admin action on order row: "Generate shipping label" → opens a print-ready PDF page (`/admin/orders/$id/label`) with sender (Oriva HK), recipient address, order code, barcode (`bwip-js` CODE128), weight/dimensions fields, "Print" button.
- No carrier API integration in v1 — pure printable label. Can integrate ShipStation/EasyPost later if you want.

---

## Technical notes
- All new tables get GRANT + RLS + admin-only policies (except gift_ideas SELECT anon, orders SELECT via order-code+email lookup server fn).
- Order status changes fire a Postgres trigger → NOTIFY, or simpler: server fn checks automations after status update.
- Email templates use existing `sendTemplateEmail` scaffold; add `generic-notification` template driven by admin body.
- All server writes via `createServerFn` + `requireSupabaseAuth` + admin role check.

---

## Suggested execution order
This is 8 phases and ~2-3 hours of build. I recommend doing them in **two batches**:

**Batch A (do now):** Phase 1 (quick fix) + Phase 2 (enquiry capture) + Phase 3 (orders + status page) + Phase 4 (inventory) — this is the core commerce loop.

**Batch B (next turn):** Phase 5 (gifts) + Phase 6 (search) + Phase 7 (automations) + Phase 8 (labels).

Reply with:
- **"go"** to build Batch A now, then Batch B next.
- **"all"** to build everything in one go (longer, more migration approvals).
- Or list specific phases to keep/drop.