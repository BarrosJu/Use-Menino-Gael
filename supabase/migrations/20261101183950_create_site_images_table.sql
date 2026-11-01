/*
# Site images managed by the store owner

Plain-English summary: adds a small table that stores the photos shown on the home page (hero banner and "about" section). The owner chooses these photos from the admin panel. Until a photo is uploaded, the site shows a neutral placeholder instead of any stock picture.

## 1. New Tables
- `site_images`: one row per image slot.
  - `slot` (text, primary key): either 'hero' or 'about'.
  - `storage_path` (text, not null): location of the file in the product-images bucket.
  - `updated_at` (timestamptz): last time the photo was replaced.

## 2. Security
- Row Level Security enabled.
- Anyone (anon and signed-in users) may read the table, because the public site needs the photo addresses.
- Only administrators (checked with is_admin()) may insert, update or delete rows.
- Grants: SELECT for anon and authenticated; INSERT, UPDATE, DELETE for authenticated only.

## 3. Important Notes
1. The slot check constraint limits the table to the two supported image positions.
2. Re-running this migration does not change existing rows.
*/

CREATE TABLE IF NOT EXISTS site_images (
  slot text PRIMARY KEY CHECK (slot IN ('hero', 'about')),
  storage_path text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON site_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON site_images TO authenticated;

DROP POLICY IF EXISTS "site_images_public_select" ON site_images;
CREATE POLICY "site_images_public_select" ON site_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "site_images_admin_insert" ON site_images;
CREATE POLICY "site_images_admin_insert" ON site_images FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "site_images_admin_update" ON site_images;
CREATE POLICY "site_images_admin_update" ON site_images FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "site_images_admin_delete" ON site_images;
CREATE POLICY "site_images_admin_delete" ON site_images FOR DELETE
  TO authenticated USING (public.is_admin());

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'site_images'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE site_images;
  END IF;
END $$;
