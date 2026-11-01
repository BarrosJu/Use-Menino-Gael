import { MAX_IMAGES_PER_PRODUCT } from '@/config/store';

export interface ProductFormValues {
  name: string;
  description: string;
  priceText: string;
  categoryId: string;
  sizes: string[];
  available: boolean;
  active: boolean;
}

export type ProductFormErrors = Partial<Record<'name' | 'description' | 'price' | 'categoryId' | 'sizes' | 'images', string>>;

export function parsePrice(text: string): number | null {
  const normalized = text.trim().replace(/\s/g, '').replace(',', '.');
  if (!/^\d{1,5}(\.\d{1,2})?$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export function validateProductForm(
  values: ProductFormValues,
  imageCount: number
): { errors: ProductFormErrors; price: number | null } {
  const errors: ProductFormErrors = {};
  const name = values.name.trim();
  const price = parsePrice(values.priceText);

  if (name.length < 2) errors.name = 'Informe um nome com pelo menos 2 letras.';
  else if (name.length > 120) errors.name = 'O nome pode ter no máximo 120 caracteres.';

  if (values.description.length > 2000) errors.description = 'A descrição pode ter no máximo 2000 caracteres.';

  if (price === null) errors.price = 'Informe um preço válido, por exemplo 59,90.';
  else if (price >= 100000) errors.price = 'O preço precisa ser menor que R$ 100.000.';

  if (!values.categoryId) errors.categoryId = 'Escolha uma categoria.';
  if (values.sizes.length === 0) errors.sizes = 'Selecione ao menos um tamanho.';
  if (imageCount === 0) errors.images = 'Adicione pelo menos uma foto do produto.';
  else if (imageCount > MAX_IMAGES_PER_PRODUCT) errors.images = `Cada produto aceita até ${MAX_IMAGES_PER_PRODUCT} fotos.`;

  return { errors, price };
}

export function validateCategoryName(value: string): string | null {
  const name = value.trim();
  if (name.length < 2) return 'Informe um nome com pelo menos 2 letras.';
  if (name.length > 60) return 'O nome pode ter no máximo 60 caracteres.';
  return null;
}
