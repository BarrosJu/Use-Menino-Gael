/*
# Seed store categories and create the product photo bucket

Plain-English summary: adds the eight clothing categories the store works with, and creates a public photo storage area for product pictures. Only administrators can upload, replace or remove photos.

## 1. New Data
- Eight categories: Conjuntos infantis, Camisetas, Bermudas, Calças, Vestidos, Pijamas, Moda bebê, Acessórios. No products are added.

## 2. New Storage
- Bucket `product-images`: public for reading (so photos load on the catalog), limited to 5 MB per file and to JPEG, PNG and WEBP images.

## 3. Security
- Storage policies allow INSERT, UPDATE and DELETE on this bucket only for administrators (checked with is_admin()). Anyone may read through the public photo address; listing the bucket is not allowed.

## 4. Important Notes
1. The insert uses ON CONFLICT DO NOTHING, so re-running the migration does not duplicate categories or change existing ones.
*/

INSERT INTO categories (name, slug) VALUES
  ('Conjuntos infantis', 'conjuntos-infantis'),
  ('Camisetas', 'camisetas'),
  ('Bermudas', 'bermudas'),
  ('Calças', 'calcas'),
  ('Vestidos', 'vestidos'),
  ('Pijamas', 'pijamas'),
  ('Moda bebê', 'moda-bebe'),
  ('Acessórios', 'acessorios')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "product_images_bucket_admin_insert" ON storage.objects;
CREATE POLICY "product_images_bucket_admin_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "product_images_bucket_admin_update" ON storage.objects;
CREATE POLICY "product_images_bucket_admin_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'product-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "product_images_bucket_admin_delete" ON storage.objects;
CREATE POLICY "product_images_bucket_admin_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'product-images' AND public.is_admin());
