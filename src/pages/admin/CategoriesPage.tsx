import { useState, type FormEvent } from 'react';
import { FolderTree, Pencil, Plus, Trash2 } from 'lucide-react';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Modal from '@/components/ui/Modal';
import { ErrorState, LoadingState } from '@/components/ui/StateMessages';
import { useAsyncData } from '@/hooks/useAsyncData';
import { validateCategoryName } from '@/lib/validation';
import { listCategories } from '@/services/catalogService';
import {
  countProductsByCategory,
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/services/adminService';
import type { Category } from '@/types/store';

interface CategoriesData {
  categories: Category[];
  counts: Map<string, number>;
}

async function loadCategories(): Promise<CategoriesData> {
  const [categories, counts] = await Promise.all([listCategories(), countProductsByCategory()]);
  return { categories, counts };
}

type CategoryDialog = { mode: 'create' } | { mode: 'edit'; category: Category };

export default function CategoriesPage() {
  const data = useAsyncData(loadCategories, []);
  const [dialog, setDialog] = useState<CategoryDialog | null>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  const handleDelete = async () => {
    if (!toDelete) return;
    setBusy(true);
    try {
      await deleteCategory(toDelete.id);
      setNotice({ tone: 'success', text: `A categoria "${toDelete.name}" foi excluída.` });
      data.reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err instanceof Error ? err.message : 'Não foi possível excluir a categoria.' });
    } finally {
      setBusy(false);
      setToDelete(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">Organização</p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Categorias</h1>
          <p className="text-base text-stone-600">
            As categorias organizam o catálogo. Uma categoria só pode ser excluída quando não tiver produtos.
          </p>
        </div>
        <Button onClick={() => setDialog({ mode: 'create' })}>
          <Plus className="h-5 w-5" aria-hidden="true" />
          Nova categoria
        </Button>
      </header>

      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}

      {data.loading && <LoadingState label="Carregando categorias..." />}
      {!data.loading && data.error && <ErrorState message={data.error} onRetry={data.reload} />}

      {!data.loading && !data.error && data.data && (
        <ul className="divide-y divide-primary-50 overflow-hidden rounded-3xl bg-white shadow-soft">
          {data.data.categories.length === 0 && (
            <li className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <FolderTree className="h-10 w-10 text-primary-300" aria-hidden="true" />
              <p className="font-bold text-primary-900">Nenhuma categoria cadastrada</p>
            </li>
          )}
          {data.data.categories.map((category) => {
            const count = data.data?.counts.get(category.id) ?? 0;
            return (
              <li key={category.id} className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-primary-900">{category.name}</p>
                  <p className="text-sm text-stone-500">
                    {count === 0 ? 'Sem produtos vinculados' : `${count} ${count === 1 ? 'produto' : 'produtos'}`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setDialog({ mode: 'edit', category })}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-primary-600 px-4 py-2 text-sm font-bold text-primary-700 transition hover:bg-primary-50"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setToDelete(category)}
                    disabled={count > 0}
                    title={count > 0 ? 'Remova ou mova os produtos desta categoria antes de excluí-la.' : undefined}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-error-600 transition hover:bg-error-50 disabled:cursor-not-allowed disabled:text-stone-400 disabled:hover:bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Excluir
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {dialog && (
        <CategoryFormModal
          key={dialog.mode === 'edit' ? dialog.category.id : 'new'}
          dialog={dialog}
          onClose={() => setDialog(null)}
          onSaved={(message) => {
            setDialog(null);
            setNotice({ tone: 'success', text: message });
            data.reload();
          }}
        />
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Excluir categoria?"
        message={`A categoria "${toDelete?.name ?? ''}" será removida. Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir categoria"
        loading={busy}
        onConfirm={() => void handleDelete()}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

function CategoryFormModal({
  dialog,
  onClose,
  onSaved,
}: {
  dialog: CategoryDialog;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const initialName = dialog.mode === 'edit' ? dialog.category.name : '';
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateCategoryName(name);
    if (validation) {
      setError(validation);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const trimmed = name.trim();
      if (dialog.mode === 'edit') {
        await updateCategory(dialog.category.id, trimmed);
        onSaved(`A categoria foi renomeada para "${trimmed}".`);
      } else {
        await createCategory(trimmed);
        onSaved(`A categoria "${trimmed}" foi criada.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a categoria.');
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title={dialog.mode === 'edit' ? 'Editar categoria' : 'Nova categoria'}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" form="category-form" loading={saving}>
            Salvar
          </Button>
        </>
      }
    >
      <form id="category-form" onSubmit={(event) => void handleSubmit(event)} noValidate className="space-y-3">
        <label htmlFor="categoria-nome" className="block text-sm font-bold text-stone-800">
          Nome da categoria
        </label>
        <input
          id="categoria-nome"
          value={name}
          maxLength={60}
          autoFocus
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'categoria-nome-erro' : undefined}
          placeholder="Ex.: Conjuntos infantis"
          className="w-full rounded-2xl border border-primary-100 px-4 py-3 text-base text-stone-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
        {error && (
          <p id="categoria-nome-erro" className="text-sm font-semibold text-error-600">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
