import { supabase } from '@/lib/supabase';
import { PRODUCT_SELECT, mapProduct, type ProductRow } from '@/services/productQueries';
import type { Category, Product } from '@/types/store';

export async function listCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name', { ascending: true });

  if (error) {
    console.error(error);
    throw new Error('Não foi possível carregar as categorias.');
  }
  return (data ?? []) as Category[];
}

export async function listPublicProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    throw new Error('Não foi possível carregar o catálogo. Tente novamente em instantes.');
  }
  return ((data ?? []) as unknown as ProductRow[]).map(mapProduct);
}

export async function getPublicProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error('Não foi possível carregar este produto.');
  }
  return data ? mapProduct(data as unknown as ProductRow) : null;
}
