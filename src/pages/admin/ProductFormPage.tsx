import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductForm, { type ProductSubmitPayload } from '@/components/admin/ProductForm';
import Alert from '@/components/ui/Alert';
import { ErrorState, LoadingState } from '@/components/ui/StateMessages';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { useAsyncData } from '@/hooks/useAsyncData';
import { listCategories } from '@/services/catalogService';
import {
  createProduct,
  getAdminProduct,
  removeProductImage,
  updateProduct,
} from '@/services/adminService';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const categories = useAsyncData(listCategories, []);
  const product = useAsyncData(() => (id ? getAdminProduct(id) : Promise.resolve(null)), [id]);

  if (categories.loading || product.loading) return <LoadingState label="Carregando formulário..." />;
  if (categories.error) return <ErrorState message={categories.error} onRetry={categories.reload} />;
  if (product.error) return <ErrorState message={product.error} onRetry={product.reload} />;

  if (id && !product.data) {
    return (
      <div className="mx-auto max-w-md space-y-5 py-16 text-center">
        <h1 className="text-2xl font-extrabold">Produto não encontrado</h1>
        <p className="text-sm text-stone-600">Ele pode ter sido excluído.</p>
        <Link to="/admin/produtos" className={buttonClasses('primary', 'md')}>
          Voltar para produtos
        </Link>
      </div>
    );
  }

  const existing = product.data;
  const nextPosition = existing ? Math.max(-1, ...existing.images.map((image) => image.position)) + 1 : 0;

  const handleSubmit = async (payload: ProductSubmitPayload) => {
    setSaving(true);
    setSaveError(null);
    try {
      if (existing) {
        await updateProduct(existing.id, payload.input, payload.newFiles, nextPosition);
        for (const image of payload.removedImages) {
          await removeProductImage(image);
        }
      } else {
        await createProduct(payload.input, payload.newFiles);
      }
      navigate('/admin/produtos', {
        state: { notice: existing ? 'Alterações salvas com sucesso.' : 'Produto cadastrado com sucesso.' },
      });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Não foi possível salvar o produto.');
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-3">
        <Link to="/admin/produtos" className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar para produtos
        </Link>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">
          {existing ? 'Edição' : 'Cadastro'}
        </p>
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          {existing ? `Editar ${existing.name}` : 'Cadastrar produto'}
        </h1>
      </header>

      {saveError && <Alert tone="error">{saveError}</Alert>}

      <ProductForm
        key={existing?.id ?? 'novo'}
        initial={existing ?? undefined}
        categories={categories.data ?? []}
        saving={saving}
        submitLabel={existing ? 'Salvar alterações' : 'Cadastrar produto'}
        onSubmit={(payload) => void handleSubmit(payload)}
      />
    </div>
  );
}
