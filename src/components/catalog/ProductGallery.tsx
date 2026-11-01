import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { getProductImageUrl } from '@/services/storageService';
import type { ProductImage } from '@/types/store';

export default function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-3xl bg-primary-50 text-primary-300">
        <ImageOff className="h-16 w-16" aria-hidden="true" />
        <span className="sr-only">Produto sem foto</span>
      </div>
    );
  }

  const current = images[Math.min(selected, images.length - 1)];

  return (
    <div className="space-y-4">
      <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-soft">
        <img
          key={current.id}
          src={getProductImageUrl(current.storagePath)}
          alt={`${productName} - foto ${selected + 1} de ${images.length}`}
          className="h-full w-full animate-[fade-in_0.4s_ease-out] object-cover"
        />
      </div>
      {images.length > 1 && (
        <ul className="grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`Ver foto ${index + 1}`}
                aria-current={index === selected}
                className={`aspect-square w-full overflow-hidden rounded-2xl border-2 transition ${
                  index === selected ? 'border-primary-600' : 'border-transparent hover:border-primary-200'
                }`}
              >
                <img
                  src={getProductImageUrl(image.storagePath)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
