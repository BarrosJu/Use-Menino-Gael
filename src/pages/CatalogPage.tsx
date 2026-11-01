import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import CatalogFilters, { type SortOrder } from '@/components/catalog/CatalogFilters';
import EmptyCatalogNotice from '@/components/catalog/EmptyCatalogNotice';
import ProductCard from '@/components/catalog/ProductCard';
import { ErrorState, LoadingState } from '@/components/ui/StateMessages';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useLiveRefresh } from '@/hooks/useLiveRefresh';
import { listCategories, listPublicProducts } from '@/services/catalogService';
import type { Category, Product } from '@/types/store';

interface CatalogData {
  products: Product[];
  categories: Category[];
}

async function loadCatalog(): Promise<CatalogData> {
  const [products, categories] = await Promise.all([listPublicProducts(), listCategories()]);
  return { products, categories };
}

function filterAndSort(products: Product[], categorySlug: string, search: string, sort: SortOrder): Product[] {
  const term = search.trim().toLowerCase();

  const filtered = products.filter((product) => {
    if (categorySlug && product.category.slug !== categorySlug) return false;
    if (!term) return true;
    return product.name.toLowerCase().includes(term) || product.description.toLowerCase().includes(term);
  });

  if (sort === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price);
  return filtered;
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOrder>('recent');
  const categorySlug = searchParams.get('categoria') ?? '';

  const catalog = useAsyncData(loadCatalog, []);
  const reload = catalog.reload;
  const handleChange = useCallback(() => reload(), [reload]);
  useLiveRefresh(['products', 'product_images', 'categories'], handleChange);

  const visibleProducts = useMemo(
    () => (catalog.data ? filterAndSort(catalog.data.products, categorySlug, search, sort) : []),
    [catalog.data, categorySlug, search, sort]
  );

  const handleCategoryChange = (slug: string) => {
    setSearchParams(slug ? { categoria: slug } : {}, { replace: true });
  };

  const activeCategoryName = catalog.data?.categories.find((category) => category.slug === categorySlug)?.name;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-2xl space-y-3">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">Catálogo digital</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl">Nossos produtos</h1>
        <p className="text-base leading-normal text-stone-600">
          Explore as categorias, pesquise por nome e compare preços. Para comprar, toque em "Quero comprar" e
          converse com a loja pelo WhatsApp.
        </p>
      </header>

      {catalog.loading && <LoadingState label="Carregando catálogo..." />}
      {!catalog.loading && catalog.error && <ErrorState message={catalog.error} onRetry={catalog.reload} />}

      {!catalog.loading && !catalog.error && catalog.data && (
        <div className="space-y-8">
          <CatalogFilters
            categories={catalog.data.categories}
            activeCategory={categorySlug}
            search={search}
            sort={sort}
            onCategoryChange={handleCategoryChange}
            onSearchChange={setSearch}
            onSortChange={setSort}
          />

          {catalog.data.products.length === 0 ? (
            <EmptyCatalogNotice />
          ) : visibleProducts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl bg-white py-16 text-center shadow-soft">
              <SearchX className="h-10 w-10 text-primary-400" aria-hidden="true" />
              <p className="text-lg font-bold text-primary-900">Nenhum produto encontrado</p>
              <p className="text-sm text-stone-600">
                {activeCategoryName ? `Não há produtos em ${activeCategoryName} com esta busca.` : 'Tente outro termo de busca.'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-stone-600" aria-live="polite">
                {visibleProducts.length} {visibleProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
