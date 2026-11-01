import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/format';
import { PRODUCT_SELECT, mapProduct, type ProductRow } from '@/services/productQueries';
import { removeProductImageFiles, uploadImageFile } from '@/services/storageService';
import type { Product, ProductImage, ProductInput } from '@/types/store';

const UNIQUE_VIOLATION = '23505';
const FOREIGN_KEY_VIOLATION = '23503';

export async function listAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    throw new Error('Não foi possível carregar os produtos.');
  }
  return ((data ?? []) as unknown as ProductRow[]).map(mapProduct);
}

export async function getAdminProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from('products').select(PRODUCT_SELECT).eq('id', id).maybeSingle();

  if (error) {
    console.error(error);
    throw new Error('Não foi possível carregar o produto.');
  }
  return data ? mapProduct(data as unknown as ProductRow) : null;
}

function toProductRecord(input: ProductInput) {
  return {
    name: input.name,
    description: input.description,
    price: input.price,
    category_id: input.categoryId,
    sizes: input.sizes,
    available: input.available,
    active: input.active,
  };
}

async function linkImages(productId: string, files: File[], startPosition: number): Promise<void> {
  const uploadedPaths: string[] = [];

  try {
    const rows: { product_id: string; storage_path: string; position: number }[] = [];
    for (const [index, file] of files.entries()) {
      const storagePath = await uploadImageFile(productId, file);
      uploadedPaths.push(storagePath);
      rows.push({ product_id: productId, storage_path: storagePath, position: startPosition + index });
    }

    if (rows.length === 0) return;

    const { error } = await supabase.from('product_images').insert(rows);
    if (error) {
      console.error(error);
      throw new Error('Não foi possível salvar as fotos do produto.');
    }
  } catch (err) {
    await removeProductImageFiles(uploadedPaths).catch(() => undefined);
    throw err;
  }
}

export async function createProduct(input: ProductInput, files: File[]): Promise<string> {
  const { data, error } = await supabase
    .from('products')
    .insert(toProductRecord(input))
    .select('id')
    .maybeSingle();

  if (error || !data) {
    console.error(error);
    throw new Error(
      error?.code === FOREIGN_KEY_VIOLATION
        ? 'A categoria escolhida não existe mais. Atualize a página e tente novamente.'
        : 'Não foi possível cadastrar o produto.'
    );
  }

  await linkImages(data.id, files, 0);
  return data.id;
}

export async function updateProduct(id: string, input: ProductInput, newFiles: File[], startPosition: number): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ ...toProductRecord(input), updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Não foi possível salvar as alterações do produto.');
  }

  await linkImages(id, newFiles, startPosition);
}

export async function setProductActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Não foi possível alterar a exibição do produto.');
  }
}

export async function removeProductImage(image: ProductImage): Promise<void> {
  const { error } = await supabase.from('product_images').delete().eq('id', image.id);
  if (error) {
    console.error(error);
    throw new Error('Não foi possível remover a foto.');
  }
  await removeProductImageFiles([image.storagePath]);
}

export async function deleteProduct(product: Product): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', product.id);
  if (error) {
    console.error(error);
    throw new Error('Não foi possível excluir o produto.');
  }

  await removeProductImageFiles(product.images.map((image) => image.storagePath)).catch(() => {
    throw new Error('O produto foi excluído, mas algumas fotos não puderam ser removidas do armazenamento.');
  });
}

export async function countProductsByCategory(): Promise<Map<string, number>> {
  const { data, error } = await supabase.from('products').select('category_id');
  if (error) {
    console.error(error);
    throw new Error('Não foi possível verificar os produtos das categorias.');
  }

  const counts = new Map<string, number>();
  for (const row of (data ?? []) as { category_id: string }[]) {
    counts.set(row.category_id, (counts.get(row.category_id) ?? 0) + 1);
  }
  return counts;
}

export async function createCategory(name: string): Promise<void> {
  const { error } = await supabase.from('categories').insert({ name, slug: slugify(name) });
  if (error) {
    console.error(error);
    throw new Error(
      error.code === UNIQUE_VIOLATION
        ? 'Já existe uma categoria com este nome.'
        : 'Não foi possível criar a categoria.'
    );
  }
}

export async function updateCategory(id: string, name: string): Promise<void> {
  const { error } = await supabase.from('categories').update({ name, slug: slugify(name) }).eq('id', id);
  if (error) {
    console.error(error);
    throw new Error(
      error.code === UNIQUE_VIOLATION
        ? 'Já existe uma categoria com este nome.'
        : 'Não foi possível salvar a categoria.'
    );
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const { count, error: countError } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id);

  if (countError) {
    console.error(countError);
    throw new Error('Não foi possível verificar os produtos desta categoria.');
  }
  if ((count ?? 0) > 0) {
    throw new Error('Esta categoria possui produtos vinculados. Mova ou exclua os produtos antes de removê-la.');
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    console.error(error);
    throw new Error('Não foi possível excluir a categoria.');
  }
}
