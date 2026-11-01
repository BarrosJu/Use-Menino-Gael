import type { Product } from '@/types/store';

export const PRODUCT_SELECT =
  'id, name, description, price, sizes, available, active, created_at, category:categories(id, name, slug), images:product_images(id, storage_path, position)';

export interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: string | number;
  sizes: string[];
  available: boolean;
  active: boolean;
  created_at: string;
  category: { id: string; name: string; slug: string } | null;
  images: { id: string; storage_path: string; position: number }[];
}

export function mapProduct(row: ProductRow): Product {
  if (!row.category) {
    throw new Error(`Produto "${row.name}" está sem categoria.`);
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    sizes: row.sizes ?? [],
    available: row.available,
    active: row.active,
    category: row.category,
    images: [...(row.images ?? [])]
      .sort((a, b) => a.position - b.position)
      .map((image) => ({ id: image.id, storagePath: image.storage_path, position: image.position })),
    createdAt: row.created_at,
  };
}
