/*
# Create store catalog schema with admin-only management

Plain-English summary: creates the tables that hold the store's categories, products, product photos and the list of administrators. Visitors can read the public catalog; only signed-in administrators can change anything.

## 1. New Tables
- `admins`: one row per administrator. `user_id` points to a real sign-in account (auth.users). No public sign-up exists, so rows are created only by the secure setup script that uses the service key.
- `categories`: product categories (name and URL-friendly slug). Names are unique.
- `products`: name, description, price (BRL), sizes (list of text), `available` (in stock / sold out) and `active` (shown in the public catalog or hidden). Each product belongs to one category.
- `product_images`: photos attached to a product. Stores the storage path; position 0 is the cover photo.

## 2. Modified Tables
- None.

## 3. Security
- Row Level Security enabled on every table.
- Helper function `is_admin()` (SECURITY DEFINER, fixed search_path) tells whether the current signed-in user is an administrator. Only signed-in users may run it.
- Public (anon + signed-in) can READ categories, active products and images of active products.
- Hidden (inactive) products are readable only by administrators.
- Only administrators can INSERT, UPDATE or DELETE categories, products and product images.
- `admins` rows can be read only by the owner of that row. Nobody can write them through the API.
- Grants are given only to the roles that need each verb.

## 4. Important Notes
1. Foreign keys: deleting a product removes its photo records (cascade). Deleting a category is blocked while products still use it (restrict).
2. Indexes are added on the foreign keys used for filtering and joining.
3. Every statement is idempotent so the migration can be safely re-run.
*/

CREATE TABLE IF NOT EXISTS admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 60),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS categories_name_key ON categories (lower(name));

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 120),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 2000),
  price numeric(10,2) NOT NULL CHECK (price >= 0 AND price < 100000),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  sizes text[] NOT NULL DEFAULT '{}',
  available boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_category_id_idx ON products (category_id);
CREATE INDEX IF NOT EXISTS products_active_idx ON products (active);

CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  position integer NOT NULL DEFAULT 0 CHECK (position >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS product_images_product_id_idx ON product_images (product_id, position);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON admins TO authenticated;
GRANT SELECT ON categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON categories TO authenticated;
GRANT SELECT ON products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON products TO authenticated;
GRANT SELECT ON product_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON product_images TO authenticated;

DROP POLICY IF EXISTS "admins_select_own_row" ON admins;
CREATE POLICY "admins_select_own_row" ON admins FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "categories_public_select" ON categories;
CREATE POLICY "categories_public_select" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "categories_admin_insert" ON categories;
CREATE POLICY "categories_admin_insert" ON categories FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "categories_admin_update" ON categories;
CREATE POLICY "categories_admin_update" ON categories FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "categories_admin_delete" ON categories;
CREATE POLICY "categories_admin_delete" ON categories FOR DELETE
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "products_select_active_or_admin" ON products;
CREATE POLICY "products_select_active_or_admin" ON products FOR SELECT
  TO anon, authenticated USING (active OR public.is_admin());

DROP POLICY IF EXISTS "products_admin_insert" ON products;
CREATE POLICY "products_admin_insert" ON products FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "products_admin_update" ON products;
CREATE POLICY "products_admin_update" ON products FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "products_admin_delete" ON products;
CREATE POLICY "products_admin_delete" ON products FOR DELETE
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "product_images_select_visible_product" ON product_images;
CREATE POLICY "product_images_select_visible_product" ON product_images FOR SELECT
  TO anon, authenticated USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_images.product_id
        AND (p.active OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "product_images_admin_insert" ON product_images;
CREATE POLICY "product_images_admin_insert" ON product_images FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "product_images_admin_update" ON product_images;
CREATE POLICY "product_images_admin_update" ON product_images FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "product_images_admin_delete" ON product_images;
CREATE POLICY "product_images_admin_delete" ON product_images FOR DELETE
  TO authenticated USING (public.is_admin());
