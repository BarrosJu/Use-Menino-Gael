/*
# Enable live catalog updates

Plain-English summary: lets the public catalog refresh automatically when a product, photo or category changes, so visitors see new or hidden products without reloading the page.

## 1. Modified Publications
- Adds `categories`, `products` and `product_images` to the realtime change feed (supabase_realtime). Only the notification of a change is sent; each visitor still receives only the rows their access rules allow.

## 2. Security
- No policy or grant changes. Existing row level security continues to decide which rows are visible.

## 3. Important Notes
1. Every step checks whether the table is already in the publication first, so re-running the migration is safe.
*/

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['categories', 'products', 'product_images'] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = table_name
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', table_name);
    END IF;
  END LOOP;
END $$;
