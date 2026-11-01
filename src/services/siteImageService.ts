import { supabase } from '@/lib/supabase';
import { getProductImageUrl, removeProductImageFiles, uploadImageFile } from '@/services/storageService';
import type { SiteImageSlot } from '@/types/store';

export type SiteImageUrls = Record<SiteImageSlot, string | null>;

const SITE_IMAGE_FOLDER = 'site';

export async function listSiteImages(): Promise<SiteImageUrls> {
  const { data, error } = await supabase.from('site_images').select('slot, storage_path');

  if (error) {
    console.error(error);
    throw new Error('Não foi possível carregar as imagens do site.');
  }

  const urls: SiteImageUrls = { hero: null, about: null };
  for (const row of (data ?? []) as { slot: string; storage_path: string }[]) {
    if (row.slot === 'hero' || row.slot === 'about') {
      urls[row.slot] = getProductImageUrl(row.storage_path);
    }
  }
  return urls;
}

export async function replaceSiteImage(slot: SiteImageSlot, file: File): Promise<void> {
  const { data: current, error: currentError } = await supabase
    .from('site_images')
    .select('storage_path')
    .eq('slot', slot)
    .maybeSingle();

  if (currentError) {
    console.error(currentError);
    throw new Error('Não foi possível verificar a imagem atual.');
  }

  const storagePath = await uploadImageFile(SITE_IMAGE_FOLDER, file);

  const { error } = await supabase
    .from('site_images')
    .upsert({ slot, storage_path: storagePath, updated_at: new Date().toISOString() }, { onConflict: 'slot' });

  if (error) {
    console.error(error);
    await removeProductImageFiles([storagePath]).catch(() => undefined);
    throw new Error('Não foi possível salvar a nova imagem.');
  }

  if (current) {
    await removeProductImageFiles([current.storage_path]).catch(() => undefined);
  }
}
