## Goal
Add admin controls for **Categories** and **Menu management** (main nav + sub-header) with drag-and-drop reordering.

## New DB tables

**`categories`**
- `slug` (unique), `name`, `blurb`, `banner_url`, `sort_order`, `is_active`
- Public SELECT (active only); admin full CRUD via `has_role('admin')`

**`menu_items`**
- `menu_key` ('main' | 'sub'), `label`, `href`, `sort_order`, `is_active`, `parent_id` (nullable, for dropdowns later)
- Public SELECT (active only); admin full CRUD

Seed with current hardcoded values (Fine Jewelry, Engagement Rings, Bespoke, Hip Hop Jewelry, Diamonds + sub-menu Home/About/Contact + 6 existing categories).

## Admin pages

**`/admin/categories`**
- List with drag handle (dnd-kit) to reorder → updates `sort_order`
- Add/Edit dialog: slug, name, blurb, banner upload, active toggle
- Delete (soft: `is_active=false` if products reference it, else hard delete)

**`/admin/menu`**
- Two tabs: **Main Menu** and **Top Sub-header**
- Drag to reorder rows, inline edit label + href, toggle active, add/delete
- Href picker suggests category slugs + static routes

## Frontend wiring

- `src/components/site/SiteHeader.tsx`: replace hardcoded `NAV`/subnav with `useQuery` fetching `menu_items` (fallback to defaults if empty)
- `src/lib/products.ts`: `CATEGORY_DETAILS` becomes a Supabase-hydrated map via a `useCategories()` hook; keep static defaults as fallback
- `collections.$category.tsx`: validate against DB categories
- Admin product form category dropdown: pull from `categories` table

## Deps
- `bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

## Admin sidebar
- Add "Categories" and "Menu" entries in `/admin` layout

## Order of execution
1. Migration (tables + grants + RLS + seed rows)
2. Install dnd-kit
3. Build admin pages
4. Wire SiteHeader to DB
5. Wire product form + collection routes to DB categories
