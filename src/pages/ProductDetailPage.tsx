import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Ruler, Tag } from 'lucide-react';
import AvailabilityBadge from '@/components/catalog/AvailabilityBadge';
import ProductGallery from '@/components/catalog/ProductGallery';
import WhatsAppBuyButton from '@/components/catalog/WhatsAppBuyButton';
import { ErrorState, LoadingState } from '@/components/ui/StateMessages';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useLiveRefresh } from '@/hooks/useLiveRefresh';
import { formatPrice } from '@/lib/format';
import { getPublicProduct } from '@/services/catalogService';

export default function ProductDetailPage() {
  const { id = '' } = useParams();
  const product = useAsyncData(() => getPublicProduct(id), [id]);
  useLiveRefresh(['products', 'product_images'], product.reload);

  if (product.loading) return <LoadingState label="Carregando produto..." />;
  if (product.error) return <ErrorState message={product.error} onRetry={product.reload} />;

  if (!product.data) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold">Produto não encontrado</h1>
        <p className="text-base leading-normal text-stone-600">
          Este produto pode ter sido removido ou não está disponível no momento.
        </p>
        <Link to="/catalogo" className={buttonClasses('primary', 'md')}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const item = product.data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Caminho da página" className="mb-8">
        <Link to={`/catalogo?categoria=${item.category.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar para {item.category.name}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={item.images} productName={item.name} />

        <article className="flex flex-col gap-6 lg:py-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary-800">
                <Tag className="h-4 w-4" aria-hidden="true" />
                {item.category.name}
              </span>
              <AvailabilityBadge available={item.available} />
            </div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">{item.name}</h1>
            <p className="text-3xl font-extrabold text-primary-700">{formatPrice(item.price)}</p>
          </div>

          <div className="space-y-3 rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-primary-900">
              <Ruler className="h-5 w-5 text-primary-600" aria-hidden="true" />
              Tamanhos disponíveis
            </h2>
            {item.sizes.length > 0 ? (
              <ul className="flex flex-wrap gap-2" aria-label="Lista de tamanhos">
                {item.sizes.map((size) => (
                  <li key={size} className="min-w-[3rem] rounded-xl border border-primary-200 bg-primary-50 px-4 py-2 text-center text-sm font-bold text-primary-900">
                    {size}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-stone-600">Consulte os tamanhos pelo WhatsApp.</p>
            )}
          </div>

          {item.description && (
            <div className="space-y-3">
              <h2 className="text-base font-extrabold text-primary-900">Descrição</h2>
              <p className="whitespace-pre-line text-base leading-normal text-stone-700">{item.description}</p>
            </div>
          )}

          <div className="rounded-3xl border border-primary-100 bg-primary-50/60 p-6">
            <p className="mb-4 flex items-center gap-2 text-sm text-stone-700">
              <CalendarDays className="h-4 w-4 text-primary-600" aria-hidden="true" />
              Tem interesse? Envie uma mensagem e a loja confirma disponibilidade e pagamento.
            </p>
            <WhatsAppBuyButton productName={item.name} />
          </div>
        </article>
      </div>
    </div>
  );
}
