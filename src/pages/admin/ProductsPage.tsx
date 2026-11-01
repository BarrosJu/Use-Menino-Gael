import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ImageOff, Pencil, Search, Trash2 } from 'lucide-react';
import Alert from '@/components/ui/Alert';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { ErrorState, LoadingState } from '@/components/ui/StateMessages';
import { buttonClasses } from '@/components/ui/buttonStyles';
import AvailabilityBadge from '@/components/catalog/AvailabilityBadge';
import { useAsyncData } from '@/hooks/useAsyncData';
import { formatPrice } from '@/lib/format';
import { deleteProduct, listAllProducts, setProductActive } from '@/services/adminService';
import { getProductImageUrl } from '@/services/storageService';
import type { Product } from '@/types/store';

export default function ProductsPage() {
  const products = useAsyncData(listAllProducts, []);
  const location = useLocation();
  const savedNotice = (location.state as { notice?: string } | null)?.notice;
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; text: string } | null>(
    savedNotice ? { tone: 'success', text: savedNotice } : null
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = products.data ?? [];
    if (!term) return list;
    return list.filter(
      (product) => product.name.toLowerCase().includes(term) || product.category.name.toLowerCase().includes(term)
    );
  }, [products.data, search]);

  const handleToggleActive = async (product: Product) => {
    setNotice(null);
    setBusyId(product.id);
    try {
      await setProductActive(product.id, !product.active);
      setNotice({
        tone: 'success',
        text: product.active ? `"${product.name}" foi ocultado do catálogo.` : `"${product.name}" está visível no catálogo.`,
      });
      products.reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err instanceof Error ? err.message : 'Não foi possível alterar o produto.' });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setBusyId(toDelete.id);
    try {
      await deleteProduct(toDelete);
      setNotice({ tone: 'success', text: `"${toDelete.name}" foi excluído.` });
      setToDelete(null);
      products.reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err instanceof Error ? err.message : 'Não foi possível excluir o produto.' });
      setToDelete(null);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">Gerenciamento</p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Produtos</h1>
          <p className="text-base text-stone-600">Ative, oculte, edite ou exclua os produtos do catálogo.</p>
        </div>
        <Link to="/admin/produtos/novo" className={buttonClasses('primary', 'md')}>
          Cadastrar produto
        </Link>
      </header>

      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}

      {products.loading && <LoadingState label="Carregando produtos..." />}
      {!products.loading && products.error && <ErrorState message={products.error} onRetry={products.reload} />}

      {!products.loading && !products.error && products.data && (
        <>
          {products.data.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-primary-200 bg-white p-12 text-center">
              <p className="text-lg font-bold text-primary-900">Nenhum produto cadastrado</p>
              <p className="mt-2 text-sm text-stone-600">Cadastre o primeiro produto para ele aparecer no catálogo.</p>
            </div>
          ) : (
            <>
              <label className="relative block max-w-md">
                <span className="sr-only">Buscar produtos</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-500" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nome ou categoria"
                  className="w-full rounded-2xl border border-primary-100 bg-white py-3 pl-12 pr-4 text-sm shadow-soft focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </label>

              {visible.length === 0 ? (
                <p className="text-sm text-stone-600">Nenhum produto corresponde à busca.</p>
              ) : (
                <ul className="grid gap-4">
                  {visible.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      busy={busyId === product.id}
                      onToggleActive={() => void handleToggleActive(product)}
                      onDelete={() => setToDelete(product)}
                    />
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Excluir produto?"
        message={`"${toDelete?.name ?? ''}" e suas fotos serão removidos permanentemente. Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir produto"
        loading={busyId !== null && toDelete !== null}
        onConfirm={() => void handleDelete()}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

function ProductRow({
  product,
  busy,
  onToggleActive,
  onDelete,
}: {
  product: Product;
  busy: boolean;
  onToggleActive: () => void;
  onDelete: () => void;
}) {
  const cover = product.images[0];

  return (
    <li className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:p-5">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-primary-50">
          {cover ? (
            <img src={getProductImageUrl(cover.storagePath)} alt={`Foto de ${product.name}`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-primary-300">
              <ImageOff className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">Sem foto</span>
            </div>
          )}
        </div>
        <div className="min-w-0 space-y-1">
          <p className="truncate font-bold text-primary-900">{product.name}</p>
          <p className="text-sm text-stone-600">
            {product.category.name} · {formatPrice(product.price)}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <AvailabilityBadge available={product.available} />
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                product.active ? 'bg-primary-100 text-primary-800' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {product.active ? 'Visível no catálogo' : 'Oculto'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <button
          type="button"
          onClick={onToggleActive}
          disabled={busy}
          aria-pressed={product.active}
          className={`rounded-full px-4 py-2 text-sm font-bold transition disabled:opacity-60 ${
            product.active ? 'bg-stone-100 text-stone-800 hover:bg-stone-200' : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {product.active ? 'Desativar' : 'Ativar'}
        </button>
        <Link
          to={`/admin/produtos/${product.id}/editar`}
          className="inline-flex items-center gap-2 rounded-full border-2 border-primary-600 px-4 py-2 text-sm font-bold text-primary-700 transition hover:bg-primary-50"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Editar
        </Link>
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-error-600 transition hover:bg-error-50 disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Excluir
        </button>
      </div>
    </li>
  );
}
