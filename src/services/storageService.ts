import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, PRODUCT_IMAGE_BUCKET } from '@/config/store';
import { supabase } from '@/lib/supabase';

const EXTENSION_BY_TYPE: Record<(typeof ALLOWED_IMAGE_TYPES)[number], string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function validateImageFile(file: File): string | null {
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return `"${file.name}" precisa ser JPEG, PNG ou WEBP.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `"${file.name}" é maior que 5 MB.`;
  }
  return null;
}

export function getProductImageUrl(storagePath: string): string {
  return supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

export async function uploadImageFile(folder: string, file: File): Promise<string> {
  const extension = EXTENSION_BY_TYPE[file.type as keyof typeof EXTENSION_BY_TYPE];
  const storagePath = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(storagePath, file, { contentType: file.type, cacheControl: '3600' });

  if (error) {
    throw new Error(`Não foi possível enviar a foto "${file.name}".`);
  }
  return storagePath;
}

export async function removeProductImageFiles(storagePaths: string[]): Promise<void> {
  if (storagePaths.length === 0) return;

  const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(storagePaths);
  if (error) {
    throw new Error('Não foi possível remover os arquivos das fotos.');
  }
}
