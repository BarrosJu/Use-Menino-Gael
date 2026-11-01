import { Search } from 'lucide-react';
import type { Category } from '@/types/store';

export type SortOrder = 'recent' | 'price-asc' | 'price-desc';

interface CatalogFiltersProps {
  categories: Category[];
  activeCategory: string;
  search: string;
  sort: SortOrder;
  onCategoryChange: (slug: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOrder) => void;
}

const selectClass =
  'w-full rounded-2xl border border-primary-100 bg-white px-4 py-3 text-sm font-semibold text-stone-800 shadow-soft transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200';

export default function CatalogFilters({
  categories,
  activeCategory,
  search,
  sort,
  onCategoryChange,
  onSearchChange,
  onSortChange,
}: CatalogFiltersProps) {
  return (
    <div className="space-y-5 rounded-3xl border border-primary-100 bg-white p-5 shadow-soft sm:p-6">
      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <label className="relative block">
          <span className="sr-only">Pesquisar produtos</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-500" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Pesquisar por nome ou descrição"
            className="w-full rounded-2xl border border-primary-100 bg-white py-3 pl-12 pr-4 text-sm text-stone-800 shadow-soft placeholder:text-stone-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </label>

        <label className="block">
          <span className="sr-only">Ordenar produtos</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOrder)}
            className={selectClass}
          >
            <option value="recent">Mais recentes</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
        <CategoryChip label="Todos" active={activeCategory === ''} onClick={() => onCategoryChange('')} />
        {categories.map((category) => (
          <CategoryChip
            key={category.id}
            label={category.name}
            active={activeCategory === category.slug}
            onClick={() => onCategoryChange(category.slug)}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-primary-600 text-white shadow-soft'
          : 'bg-primary-50 text-primary-800 hover:bg-primary-100'
      }`}
    >
      {label}
    </button>
  );
}
