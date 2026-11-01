import { ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import AvailabilityBadge from '@/components/catalog/AvailabilityBadge';
import { formatPrice } from '@/lib/format';
import { getProductImageUrl } from '@/services/storageService';
import type { Product } from '@/types/store';

export default function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0];

  return (
    <Link
      to={`/produto/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-primary-50">
        {cover ? (
          <img
            src={getProductImageUrl(cover.storagePath)}
            alt={`${product.name} - ${product.category.name}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary-300">
            <ImageOff className="h-12 w-12" aria-hidden="true" />
            <span className="sr-only">Produto sem foto</span>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <AvailabilityBadge available={product.available} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary-600">{product.category.name}</p>
        <h3 className="line-clamp-2 text-lg font-bold text-primary-900 transition group-hover:text-primary-700">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="text-xl font-extrabold text-primary-800">{formatPrice(product.price)}</p>
          <span className="text-sm font-semibold text-primary-700 transition group-hover:translate-x-1">Ver detalhes</span>
        </div>
      </div>
    </Link>
  );
}
