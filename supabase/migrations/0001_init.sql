-- =============================================================================
-- Danish Designer Studio — initial schema
-- Run this in the Supabase SQL editor (or `supabase db push`) before seeding.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Profiles (mirrors auth.users)
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'staff', 'admin')),
  is_admin boolean not null default false,
  orders_count integer not null default 0,
  total_spent numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep profiles in step with auth.users automatically.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Reusable admin check used by every write policy.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.is_admin or p.role in ('admin', 'staff')
       from public.profiles p
      where p.id = auth.uid()),
    false
  );
$$;

-- -----------------------------------------------------------------------------
-- Catalogue
-- -----------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image text,
  parent_id uuid references public.categories (id) on delete set null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  seo jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  banner_image text,
  thumbnail text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  seo jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sku text not null,
  category_id uuid references public.categories (id) on delete set null,
  brand text not null default 'Danish Designer Studio',
  short_description text,
  description text,
  price numeric(12, 2) not null default 0 check (price >= 0),
  sale_price numeric(12, 2) check (sale_price >= 0),
  cost_price numeric(12, 2) check (cost_price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  low_stock_threshold integer not null default 5,
  stock_status text not null default 'in_stock'
    check (stock_status in ('in_stock', 'low_stock', 'out_of_stock', 'preorder')),
  material text,
  fabric text,
  care_instructions text,
  tags text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  video_url text,
  is_featured boolean not null default false,
  is_trending boolean not null default false,
  is_best_seller boolean not null default false,
  is_new_arrival boolean not null default false,
  is_published boolean not null default true,
  display_order integer not null default 0,
  related_product_ids uuid[] not null default '{}',
  rating_average numeric(3, 2) not null default 0,
  rating_count integer not null default 0,
  sold_count integer not null default 0,
  seo jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_published_idx on public.products (is_published);
create index if not exists products_flags_idx
  on public.products (is_featured, is_trending, is_best_seller, is_new_arrival);
create index if not exists products_created_idx on public.products (created_at desc);
create index if not exists products_tags_idx on public.products using gin (tags);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  alt text,
  display_order integer not null default 0
);
create index if not exists product_images_product_idx on public.product_images (product_id);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  sku text not null,
  size text,
  color text,
  color_hex text,
  price numeric(12, 2),
  sale_price numeric(12, 2),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  unique (product_id, size, color)
);
create index if not exists product_variants_product_idx on public.product_variants (product_id);

create table if not exists public.collection_products (
  collection_id uuid not null references public.collections (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  display_order integer not null default 0,
  primary key (collection_id, product_id)
);
create index if not exists collection_products_product_idx on public.collection_products (product_id);

-- -----------------------------------------------------------------------------
-- Inventory
-- -----------------------------------------------------------------------------
create table if not exists public.inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  variant_id uuid references public.product_variants (id) on delete set null,
  change_type text not null
    check (change_type in ('restock', 'sale', 'adjustment', 'return', 'damage')),
  quantity_change integer not null,
  quantity_after integer not null,
  reason text,
  created_by text,
  created_at timestamptz not null default now()
);
create index if not exists inventory_product_idx on public.inventory_transactions (product_id);
create index if not exists inventory_created_idx on public.inventory_transactions (created_at desc);

-- Single entry point for stock movements: keeps the level, the status and the
-- audit trail consistent no matter who calls it.
create or replace function public.adjust_stock(
  p_product_id uuid,
  p_variant_id uuid,
  p_quantity_change integer,
  p_change_type text,
  p_reason text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_threshold integer;
  v_after integer;
  v_has_variants boolean;
begin
  if p_variant_id is not null then
    update public.product_variants
       set stock_quantity = greatest(0, stock_quantity + p_quantity_change)
     where id = p_variant_id;
  end if;

  select exists (select 1 from public.product_variants where product_id = p_product_id)
    into v_has_variants;

  if v_has_variants then
    select coalesce(sum(stock_quantity), 0)
      into v_after
      from public.product_variants
     where product_id = p_product_id;
  else
    select greatest(0, stock_quantity + p_quantity_change)
      into v_after
      from public.products
     where id = p_product_id;
  end if;

  select low_stock_threshold into v_threshold from public.products where id = p_product_id;

  update public.products
     set stock_quantity = v_after,
         stock_status = case
           when v_after <= 0 then 'out_of_stock'
           when v_after <= coalesce(v_threshold, 5) then 'low_stock'
           else 'in_stock'
         end,
         sold_count = case
           when p_change_type = 'sale' then sold_count + abs(p_quantity_change)
           else sold_count
         end,
         updated_at = now()
   where id = p_product_id;

  insert into public.inventory_transactions
    (product_id, variant_id, change_type, quantity_change, quantity_after, reason, created_by)
  values
    (p_product_id, p_variant_id, p_change_type, p_quantity_change, v_after, p_reason,
     coalesce(auth.jwt() ->> 'email', 'system'));

  return v_after;
end;
$$;

-- -----------------------------------------------------------------------------
-- Commerce
-- -----------------------------------------------------------------------------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text not null default 'Home',
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists addresses_user_idx on public.addresses (user_id);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null default 'percentage' check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(12, 2) not null default 0,
  min_order_value numeric(12, 2) not null default 0,
  max_discount numeric(12, 2),
  usage_limit integer,
  used_count integer not null default 0,
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references public.profiles (id) on delete set null,
  email text not null,
  phone text not null,
  customer_name text not null,
  status text not null default 'pending'
    check (status in ('pending','confirmed','processing','shipped','delivered','cancelled','returned','refunded')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','paid','failed','refunded','partially_refunded')),
  payment_method text not null default 'Razorpay',
  payment_reference text,
  shipping_address jsonb not null,
  subtotal numeric(12, 2) not null default 0,
  discount numeric(12, 2) not null default 0,
  shipping numeric(12, 2) not null default 0,
  tax numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  coupon_code text,
  tracking_number text,
  courier text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists orders_email_idx on public.orders (email);
create index if not exists orders_created_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  variant_id uuid references public.product_variants (id) on delete set null,
  name text not null,
  slug text not null,
  image text,
  sku text not null,
  size text,
  color text,
  unit_price numeric(12, 2) not null,
  quantity integer not null check (quantity > 0),
  total numeric(12, 2) not null
);
create index if not exists order_items_order_idx on public.order_items (order_id);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references public.wishlists (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (wishlist_id, product_id)
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  session_id text,
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  variant_id uuid references public.product_variants (id) on delete set null,
  quantity integer not null default 1 check (quantity > 0),
  unique (cart_id, product_id, variant_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text,
  content text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_featured boolean not null default false,
  is_verified_purchase boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists reviews_product_idx on public.reviews (product_id);
create index if not exists reviews_status_idx on public.reviews (status);

-- Keep the denormalised rating on products accurate.
create or replace function public.refresh_product_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_product uuid := coalesce(new.product_id, old.product_id);
begin
  update public.products p
     set rating_average = coalesce((
           select round(avg(r.rating)::numeric, 2) from public.reviews r
            where r.product_id = v_product and r.status = 'approved'), 0),
         rating_count = coalesce((
           select count(*) from public.reviews r
            where r.product_id = v_product and r.status = 'approved'), 0)
   where p.id = v_product;
  return null;
end;
$$;

drop trigger if exists reviews_rating_sync on public.reviews;
create trigger reviews_rating_sync
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_product_rating();

-- -----------------------------------------------------------------------------
-- Content
-- -----------------------------------------------------------------------------
create table if not exists public.home_sections (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text,
  subtitle text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  eyebrow text,
  image text not null,
  mobile_image text,
  link_url text not null default '/shop',
  button_text text not null default 'Shop now',
  placement text not null default 'home_hero',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  location text,
  rating integer not null default 5 check (rating between 1 and 5),
  content text not null,
  image text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  cover_image text,
  author_name text not null default 'Danish Designer Studio Studio',
  category_id uuid references public.blog_categories (id) on delete set null,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz not null default now(),
  reading_minutes integer not null default 4,
  faqs jsonb not null default '[]'::jsonb,
  seo jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists blog_posts_status_idx on public.blog_posts (status, published_at desc);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  is_published boolean not null default true,
  seo jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null default '/',
  parent_id uuid references public.navigation_items (id) on delete cascade,
  badge text,
  location text not null default 'main',
  display_order integer not null default 0,
  is_active boolean not null default true
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  bucket text not null default 'site-assets',
  path text not null,
  mime_type text not null default 'image/jpeg',
  size_bytes bigint not null default 0,
  alt text,
  folder text,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text default 'site',
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Singleton settings documents.
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.global_seo (
  id integer primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Per-page SEO overrides for routes that are not backed by another table.
create table if not exists public.seo_metadata (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.collection_products enable row level security;
alter table public.inventory_transactions enable row level security;
alter table public.addresses enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.reviews enable row level security;
alter table public.home_sections enable row level security;
alter table public.banners enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.pages enable row level security;
alter table public.navigation_items enable row level security;
alter table public.media enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;
alter table public.global_seo enable row level security;
alter table public.seo_metadata enable row level security;

-- Profiles ---------------------------------------------------------------
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert with check (auth.uid() = id);

-- Public catalogue: readable by everyone, writable by admins ---------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'categories', 'collections', 'product_images', 'product_variants',
    'collection_products', 'home_sections', 'banners', 'testimonials',
    'blog_categories', 'navigation_items', 'media', 'site_settings',
    'global_seo', 'seo_metadata'
  ]
  loop
    execute format('drop policy if exists "%s_public_read" on public.%I', t, t);
    execute format('create policy "%s_public_read" on public.%I for select using (true)', t, t);

    execute format('drop policy if exists "%s_admin_write" on public.%I', t, t);
    execute format(
      'create policy "%s_admin_write" on public.%I for all using (public.is_admin()) with check (public.is_admin())',
      t, t
    );
  end loop;
end;
$$;

-- Products: only published rows are visible to the public -----------------
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (is_published or public.is_admin());

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- Pages and posts: published only ------------------------------------------
drop policy if exists "pages_public_read" on public.pages;
create policy "pages_public_read" on public.pages
  for select using (is_published or public.is_admin());

drop policy if exists "pages_admin_write" on public.pages;
create policy "pages_admin_write" on public.pages
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "blog_posts_public_read" on public.blog_posts;
create policy "blog_posts_public_read" on public.blog_posts
  for select using (status = 'published' or public.is_admin());

drop policy if exists "blog_posts_admin_write" on public.blog_posts;
create policy "blog_posts_admin_write" on public.blog_posts
  for all using (public.is_admin()) with check (public.is_admin());

-- Coupons: readable so the storefront can validate a code, admin-managed ---
drop policy if exists "coupons_public_read" on public.coupons;
create policy "coupons_public_read" on public.coupons
  for select using (is_active or public.is_admin());

drop policy if exists "coupons_admin_write" on public.coupons;
create policy "coupons_admin_write" on public.coupons
  for all using (public.is_admin()) with check (public.is_admin());

-- Reviews: approved reviews are public; anyone may submit for moderation ---
drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (status = 'approved' or public.is_admin() or auth.uid() = user_id);

drop policy if exists "reviews_insert_any" on public.reviews;
create policy "reviews_insert_any" on public.reviews
  for insert with check (status = 'pending');

drop policy if exists "reviews_admin_write" on public.reviews;
create policy "reviews_admin_write" on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- Inventory history: admins only -------------------------------------------
drop policy if exists "inventory_admin_all" on public.inventory_transactions;
create policy "inventory_admin_all" on public.inventory_transactions
  for all using (public.is_admin()) with check (public.is_admin());

-- Addresses: strictly the owner --------------------------------------------
drop policy if exists "addresses_own" on public.addresses;
create policy "addresses_own" on public.addresses
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- Orders: guests may create, customers read their own, admins read all -----
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "orders_insert_any" on public.orders;
create policy "orders_insert_any" on public.orders
  for insert with check (true);

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "orders_admin_delete" on public.orders;
create policy "orders_admin_delete" on public.orders
  for delete using (public.is_admin());

drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own" on public.order_items
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
       where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_insert_any" on public.order_items;
create policy "order_items_insert_any" on public.order_items
  for insert with check (true);

drop policy if exists "order_items_admin_write" on public.order_items;
create policy "order_items_admin_write" on public.order_items
  for update using (public.is_admin()) with check (public.is_admin());

-- Wishlists and carts: owner only ------------------------------------------
drop policy if exists "wishlists_own" on public.wishlists;
create policy "wishlists_own" on public.wishlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "wishlist_items_own" on public.wishlist_items;
create policy "wishlist_items_own" on public.wishlist_items
  for all using (
    exists (select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = auth.uid())
  );

drop policy if exists "carts_own" on public.carts;
create policy "carts_own" on public.carts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "cart_items_own" on public.cart_items;
create policy "cart_items_own" on public.cart_items
  for all using (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
  );

-- Newsletter and contact: write-only for the public, admins can read -------
drop policy if exists "newsletter_insert_any" on public.newsletter_subscribers;
create policy "newsletter_insert_any" on public.newsletter_subscribers
  for insert with check (true);

drop policy if exists "newsletter_admin_read" on public.newsletter_subscribers;
create policy "newsletter_admin_read" on public.newsletter_subscribers
  for select using (public.is_admin());

drop policy if exists "contact_insert_any" on public.contact_messages;
create policy "contact_insert_any" on public.contact_messages
  for insert with check (true);

drop policy if exists "contact_admin_read" on public.contact_messages;
create policy "contact_admin_read" on public.contact_messages
  for all using (public.is_admin()) with check (public.is_admin());

-- =============================================================================
-- Storage buckets
-- =============================================================================
insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('category-images', 'category-images', true),
  ('collection-images', 'collection-images', true),
  ('blog-images', 'blog-images', true),
  ('site-assets', 'site-assets', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "storage_public_read" on storage.objects;
create policy "storage_public_read" on storage.objects
  for select using (
    bucket_id in ('product-images','category-images','collection-images','blog-images','site-assets','avatars')
  );

drop policy if exists "storage_admin_write" on storage.objects;
create policy "storage_admin_write" on storage.objects
  for insert with check (
    bucket_id in ('product-images','category-images','collection-images','blog-images','site-assets')
    and public.is_admin()
  );

drop policy if exists "storage_admin_update" on storage.objects;
create policy "storage_admin_update" on storage.objects
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "storage_admin_delete" on storage.objects;
create policy "storage_admin_delete" on storage.objects
  for delete using (public.is_admin());

-- Signed-in users may manage their own avatar.
drop policy if exists "storage_avatar_own" on storage.objects;
create policy "storage_avatar_own" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid() is not null);
