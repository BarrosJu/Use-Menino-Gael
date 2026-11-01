import { useId } from 'react';
import { ImagePlus, ImageOff, X } from 'lucide-react';
import { MAX_IMAGES_PER_PRODUCT } from '@/config/store';

export interface ExistingPhoto {
  id: string;
  url: string;
}

export interface NewPhoto {
  url: string;
  name: string;
}

interface ProductImagesFieldProps {
  existing: ExistingPhoto[];
  added: NewPhoto[];
  error?: string;
  onAddFiles: (files: File[]) => void;
  onRemoveExisting: (id: string) => void;
  onRemoveAdded: (index: number) => void;
}

const ACCEPT = 'image/jpeg,image/png,image/webp';

export default function ProductImagesField({
  existing,
  added,
  error,
  onAddFiles,
  onRemoveExisting,
  onRemoveAdded,
}: ProductImagesFieldProps) {
  const inputId = useId();
  const total = existing.length + added.length;

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-bold text-stone-800">
        Fotos do produto <span className="font-semibold text-stone-500">(a primeira foto é a capa)</span>
      </legend>

      {total > 0 ? (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {existing.map((photo, index) => (
            <PhotoTile
              key={photo.id}
              src={photo.url}
              label={`Foto ${index + 1}`}
              isCover={index === 0}
              onRemove={() => onRemoveExisting(photo.id)}
            />
          ))}
          {added.map((photo, index) => (
            <PhotoTile
              key={`${photo.name}-${index}`}
              src={photo.url}
              label={`Nova foto ${index + 1}`}
              isCover={existing.length === 0 && index === 0}
              isNew
              onRemove={() => onRemoveAdded(index)}
            />
          ))}
        </ul>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl bg-primary-50 p-4 text-sm text-primary-800">
          <ImageOff className="h-5 w-5 shrink-0" aria-hidden="true" />
          Nenhuma foto adicionada ainda.
        </div>
      )}

      {total < MAX_IMAGES_PER_PRODUCT && (
        <label
          htmlFor={inputId}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary-200 bg-white px-4 py-6 text-center transition hover:border-primary-400 hover:bg-primary-50 focus-within:ring-2 focus-within:ring-primary-300"
        >
          <ImagePlus className="h-7 w-7 text-primary-600" aria-hidden="true" />
          <span className="text-sm font-bold text-primary-800">Adicionar fotos</span>
          <span className="text-xs text-stone-500">JPEG, PNG ou WEBP, até 5 MB cada</span>
          <input
            id={inputId}
            type="file"
            accept={ACCEPT}
            multiple
            className="sr-only"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = '';
              if (files.length > 0) onAddFiles(files);
            }}
          />
        </label>
      )}

      {error && <p className="text-sm font-semibold text-error-600">{error}</p>}
    </fieldset>
  );
}

function PhotoTile({
  src,
  label,
  isCover,
  isNew = false,
  onRemove,
}: {
  src: string;
  label: string;
  isCover: boolean;
  isNew?: boolean;
  onRemove: () => void;
}) {
  return (
    <li className="relative aspect-square overflow-hidden rounded-2xl bg-primary-50 shadow-soft">
      <img src={src} alt={label} className="h-full w-full object-cover" />
      {isCover && (
        <span className="absolute left-2 top-2 rounded-full bg-primary-700 px-2 py-0.5 text-[11px] font-bold text-white">
          Capa
        </span>
      )}
      {isNew && (
        <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-primary-800">
          Nova
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remover ${label.toLowerCase()}`}
        className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-error-600 shadow-soft transition hover:bg-error-50"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </li>
  );
}
