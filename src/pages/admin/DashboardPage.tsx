import { Link } from 'react-router-dom';
import { ArrowRight, FolderTree, Package, PackageCheck, PackageX } from 'lucide-react';
import { LoadingState, ErrorState } from '@/components/ui/StateMessages';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { useAsyncData } from '@/hooks/useAsyncData';
import { formatPrice } from '@/lib/format';
import { listCategories } from '@/services/catalogService';
import { listAllProducts } from '@/services/adminService';

async function loadOverview() {
  const [products, categories] = await Promise.all([listAllProducts(), listCategories()]);
  return { products, categories };
}

export default function DashboardPage() {
  const overview = useAsyncData(loadOverview, []);

  if (overview.loading) return <LoadingState label="Carregando visão geral..." />;
  if (overview.error || !overview.data) {
    return <ErrorState message={overview.error ?? 'Não foi possível carregar a visão geral.'} onRetry={overview.reload} />;
  }

  const { products, categories } = overview.data;
  const activeCount = products.filter((product) => product.active).length;
  const soldOutCount = products.filter((product) => product.active && !product.available).length;

  const stats = [
    { label: 'Produtos cadastrados', value: products.length, icon: Package, tone: 'bg-primary-100 text-primary-700' },
    { label: 'Visíveis no catálogo', value: activeCount, icon: PackageCheck, tone: 'bg-success-100 text-success-700' },
    { label: 'Esgotados', value: soldOutCount, icon: PackageX, tone: 'bg-secondary-100 text-secondary-700' },
    { label: 'Categorias', value: categories.length, icon: FolderTree, tone: 'bg-accent-100 text-accent-700' },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">Painel</p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Visão geral</h1>
          <p className="text-base text-stone-600">Acompanhe o catálogo e faça alterações rapidamente.</p>
        </div>
        <Link to="/admin/produtos/novo" className={buttonClasses('primary', 'md')}>
          Cadastrar produto
        </Link>
      </header>

      <section aria-label="Indicadores" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-3xl bg-white p-6 shadow-soft">
            <span className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${stat.tone}`}>
              <stat.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-3xl font-extrabold text-primary-900">{stat.value}</p>
            <p className="mt-1 text-sm font-semibold text-stone-600">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-primary-900">Últimos produtos</h2>
          <Link to="/admin/produtos" className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 hover:text-primary-900">
            Ver todos
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-primary-200 bg-white p-10 text-center">
            <p className="text-base font-semibold text-stone-700">Nenhum produto cadastrado ainda.</p>
            <p className="mt-2 text-sm text-stone-500">Use o botão acima para cadastrar o primeiro produto da loja.</p>
          </div>
        ) : (
          <ul className="divide-y divide-primary-50 overflow-hidden rounded-3xl bg-white shadow-soft">
            {products.slice(0, 5).map((product) => (
              <li key={product.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <p className="truncate font-bold text-primary-900">{product.name}</p>
                  <p className="text-sm text-stone-500">
                    {product.category.name} · {product.active ? 'Visível' : 'Oculto'}
                  </p>
                </div>
                <p className="shrink-0 font-bold text-primary-800">{formatPrice(product.price)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
