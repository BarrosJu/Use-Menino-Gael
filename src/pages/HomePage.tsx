import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Instagram, MessageCircle, ShieldCheck, Sparkles, Store, Tag } from 'lucide-react';
import EmptyCatalogNotice from '@/components/catalog/EmptyCatalogNotice';
import ProductCard from '@/components/catalog/ProductCard';
import { ErrorState, LoadingState } from '@/components/ui/StateMessages';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { STORE } from '@/config/store';
import { buildWhatsAppLink } from '@/lib/format';
import { listSiteImages } from '@/services/siteImageService';
import { listCategories, listPublicProducts } from '@/services/catalogService';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useLiveRefresh } from '@/hooks/useLiveRefresh';
import type { Category, Product } from '@/types/store';

const TRUST_POINTS = [
  { icon: Heart, title: 'Feito para o conforto', text: 'Peças leves e macias pensadas para o dia a dia da criança.' },
  { icon: ShieldCheck, title: 'Atendimento direto', text: 'Tire dúvidas e combine a compra diretamente com a loja.' },
  { icon: Sparkles, title: 'Estilo delicado', text: 'Cores suaves e modelagens que combinam com cada ocasião.' },
];

export default function HomePage() {
  const products = useAsyncData(listPublicProducts, []);
  const categories = useAsyncData(listCategories, []);
  const siteImages = useAsyncData(listSiteImages, []);
  const reloadProducts = products.reload;
  const reloadCategories = categories.reload;
  const reloadSiteImages = siteImages.reload;
  const handleChange = useCallback(() => {
    reloadProducts();
    reloadCategories();
  }, [reloadProducts, reloadCategories]);
  useLiveRefresh(['products', 'product_images', 'categories'], handleChange);
  useLiveRefresh(['site_images'], reloadSiteImages);

  const featured: Product[] = products.data?.slice(0, 4) ?? [];
  const heroUrl = siteImages.data?.hero ?? null;
  const aboutUrl = siteImages.data?.about ?? null;

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-100">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
          <div className="animate-fade-up space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-primary-700 shadow-soft">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Moda infantil com carinho
            </p>
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Roupinhas que acompanham cada descoberta da infância
            </h1>
            <p className="max-w-xl text-lg leading-normal text-stone-700">
              {STORE.tagline} Conheça o catálogo da {STORE.name} e encontre peças com conforto, delicadeza e
              muito estilo.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/catalogo" className={buttonClasses('primary', 'lg')}>
                Ver catálogo
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses('outline', 'lg')}
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
            <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-lift sm:aspect-[5/4] lg:aspect-[4/5]">
              <SitePhoto url={heroUrl} alt={`Banner principal da ${STORE.name}`} />
            </div>
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-lift sm:left-auto sm:-right-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                <Tag className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-sm font-bold text-primary-900">Novidades no catálogo digital</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="categorias-titulo" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-2 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">Categorias</p>
          <h2 id="categorias-titulo" className="section-title">Encontre o look ideal</h2>
        </div>
        <CategoryGrid state={categories} />
      </section>

      <section aria-labelledby="destaques-titulo" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">Destaques</p>
              <h2 id="destaques-titulo" className="section-title">Produtos em destaque</h2>
            </div>
            <Link to="/catalogo" className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-900">
              Ver todo o catálogo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {products.loading && <LoadingState label="Carregando produtos..." />}
          {!products.loading && products.error && <ErrorState message={products.error} onRetry={products.reload} />}
          {!products.loading && !products.error && featured.length === 0 && <EmptyCatalogNotice />}
          {!products.loading && !products.error && featured.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="sobre-titulo" className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] shadow-soft">
          <SitePhoto url={aboutUrl} alt={`Foto da ${STORE.name}`} className="aspect-[4/3] w-full" />
        </div>
        <div className="space-y-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">Sobre a loja</p>
          <h2 id="sobre-titulo" className="section-title">Cada peça escolhida com cuidado para a sua família</h2>
          <p className="text-base leading-normal text-stone-700">
            A {STORE.name} nasceu para oferecer moda infantil com delicadeza e qualidade, com um atendimento próximo,
            que ajuda cada família a escolher o look certo para cada momento.
          </p>
          <ul className="grid gap-4">
            {TRUST_POINTS.map((point) => (
              <li key={point.title} className="flex gap-4 rounded-2xl bg-white p-4 shadow-soft">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                  <point.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-primary-900">{point.title}</h3>
                  <p className="text-sm leading-normal text-stone-600">{point.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/sobre" className={buttonClasses('secondary', 'md')}>
            Conheça a história da loja
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-[2.5rem] bg-primary-700 px-6 py-14 text-center text-white shadow-lift sm:px-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Tem alguma dúvida? Fale com a gente</h2>
          <p className="max-w-2xl text-base leading-normal text-primary-50">
            Envie uma mensagem pelo WhatsApp ou acompanhe as novidades no Instagram.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-lg font-bold text-primary-900 transition hover:bg-primary-50"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href={STORE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/80 px-7 py-3.5 text-lg font-bold text-white transition hover:bg-white/10"
            >
              <Instagram className="h-5 w-5" aria-hidden="true" />
              Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function SitePhoto({ url, alt, className = 'h-full w-full' }: { url: string | null; alt: string; className?: string }) {
  if (url) {
    return <img src={url} alt={alt} loading="lazy" className={`${className} object-cover`} />;
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={`${className} flex items-center justify-center bg-gradient-to-br from-primary-100 via-white to-secondary-100`}
    >
      <Store className="h-20 w-20 text-primary-300" aria-hidden="true" />
    </div>
  );
}

function CategoryGrid({ state }: { state: { data: Category[] | null; error: string | null; loading: boolean; reload: () => void } }) {
  if (state.loading) return <LoadingState label="Carregando categorias..." />;
  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />;
  if (!state.data || state.data.length === 0) return null;

  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {state.data.map((category) => (
        <li key={category.id}>
          <Link
            to={`/catalogo?categoria=${category.slug}`}
            className="group flex h-full min-h-28 flex-col justify-between rounded-3xl border border-primary-100 bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:bg-primary-600 hover:shadow-lift"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 transition group-hover:bg-white/20 group-hover:text-white">
              <Tag className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="mt-4 text-base font-bold text-primary-900 transition group-hover:text-white">
              {category.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
