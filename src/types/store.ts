export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  storagePath: string;
  position: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sizes: string[];
  available: boolean;
  active: boolean;
  category: Category;
  images: ProductImage[];
  createdAt: string;
}

export type SiteImageSlot = 'hero' | 'about';

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  sizes: string[];
  available: boolean;
  active: boolean;
}
