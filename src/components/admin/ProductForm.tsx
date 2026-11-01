import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Save } from 'lucide-react';
import ProductImagesField, { type ExistingPhoto, type NewPhoto } from '@/components/admin/ProductImagesField';
import SizePicker from '@/components/admin/SizePicker';
import Button from '@/components/ui/Button';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { MAX_IMAGES_PER_PRODUCT } from '@/config/store';
import { getProductImageUrl, validateImageFile } from '@/services/storageService';
import { validateProductForm, type ProductFormErrors, type ProductFormValues } from '@/lib/validation';
import type { Category, Product, ProductImage, ProductInput } from '@/types/store';

export interface ProductSubmitPayload {
  input: ProductInput;
  newFiles: File[];
  removedImages: ProductImage[];
}

interface ProductFormProps {
  initial?: Product;
  categories: Category[];
  saving: boolean;
  submitLabel: string;
  onSubmit: (payload: ProductSubmitPayload) => void;
}

const inputClass =
  'w-full rounded-2xl border border-primary-100 bg-white px-4 py-3 text-base text-stone-800 placeholder:text-stone-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200';

export default function ProductForm({ initial, categories, saving, submitLabel, onSubmit }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(() => ({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    priceText: initial ? String(initial.price).replace('.', ',') : '',
    categoryId: initial?.category.id ?? '',
    sizes: initial?.sizes ?? [],
    available: initial?.available ?? true,
    active: initial?.active ?? true,
  }));
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<NewPhoto[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  useEffect(() => {
    const next = newFiles.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }));
    setPreviews(next);
    return () => next.forEach((photo) => URL.revokeObjectURL(photo.url));
  }, [newFiles]);

  const existingPhotos: ExistingPhoto[] = (initial?.images ?? [])
    .filter((image) => !removedIds.includes(image.id))
    .map((image) => ({ id: image.id, url: getProductImageUrl(image.storagePath) }));

  const setField = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleAddFiles = (files: File[]) => {
    const problem = files.map(validateImageFile).find((message) => message !== null);
    if (problem) {
      setErrors((current) => ({ ...current, images: problem }));
      return;
    }

    const total = existingPhotos.length + newFiles.length + files.length;
    if (total > MAX_IMAGES_PER_PRODUCT) {
      setErrors((current) => ({ ...current, images: `Cada produto aceita até ${MAX_IMAGES_PER_PRODUCT} fotos.` }));
      return;
    }

    setErrors((current) => ({ ...current, images: undefined }));
    setNewFiles((current) => [...current, ...files]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { errors: validationErrors, price } = validateProductForm(
      values,
      existingPhotos.length + newFiles.length
    );
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0 || price === null) return;

    onSubmit({
      input: {
        name: values.name.trim(),
        description: values.description.trim(),
        price,
        categoryId: values.categoryId,
        sizes: values.sizes,
        available: values.available,
        active: values.active,
      },
      newFiles,
      removedImages: (initial?.images ?? []).filter((image) => removedIds.includes(image.id)),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-6">
        <section className="space-y-5 rounded-3xl bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-lg font-extrabold text-primary-900">Informações do produto</h2>

          <Field id="produto-nome" label="Nome do produto" error={errors.name}>
            <input
              id="produto-nome"
              value={values.name}
              maxLength={120}
              onChange={(event) => setField('name', event.target.value)}
              placeholder="Ex.: Conjunto de algodão listrado"
              className={inputClass}
              aria-invalid={Boolean(errors.name)}
            />
          </Field>

          <Field id="produto-descricao" label="Descrição" error={errors.description} hint="Materiais, cuidados e detalhes do produto.">
            <textarea
              id="produto-descricao"
              rows={5}
              value={values.description}
              maxLength={2000}
              onChange={(event) => setField('description', event.target.value)}
              className={`${inputClass} resize-y`}
              aria-invalid={Boolean(errors.description)}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="produto-preco" label="Preço (R$)" error={errors.price} hint="Use vírgula, como 59,90.">
              <input
                id="produto-preco"
                inputMode="decimal"
                value={values.priceText}
                onChange={(event) => setField('priceText', event.target.value)}
                placeholder="0,00"
                className={inputClass}
                aria-invalid={Boolean(errors.price)}
              />
            </Field>

            <Field id="produto-categoria" label="Categoria" error={errors.categoryId}>
              <select
                id="produto-categoria"
                value={values.categoryId}
                onChange={(event) => setField('categoryId', event.target.value)}
                className={inputClass}
                aria-invalid={Boolean(errors.categoryId)}
              >
                <option value="">Escolha uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <Link to="/admin/categorias" className="text-sm font-bold text-primary-700 hover:text-primary-900">
                  Criar uma categoria primeiro
                </Link>
              )}
            </Field>
          </div>

          <SizePicker selected={values.sizes} onChange={(sizes) => setField('sizes', sizes)} error={errors.sizes} />
        </section>

        <section className="space-y-5 rounded-3xl bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-lg font-extrabold text-primary-900">Fotos</h2>
          <ProductImagesField
            existing={existingPhotos}
            added={previews}
            error={errors.images}
            onAddFiles={handleAddFiles}
            onRemoveExisting={(id) => setRemovedIds((current) => [...current, id])}
            onRemoveAdded={(index) => setNewFiles((current) => current.filter((_, i) => i !== index))}
          />
        </section>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
        <section className="space-y-5 rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="text-lg font-extrabold text-primary-900">Publicação</h2>
          <ToggleRow
            label="Disponível para compra"
            description="Quando desligado, o produto aparece como esgotado."
            checked={values.available}
            onChange={(checked) => setField('available', checked)}
          />
          <ToggleRow
            label="Visível no catálogo"
            description="Quando desligado, o produto fica oculto para os clientes."
            checked={values.active}
            onChange={(checked) => setField('active', checked)}
          />
        </section>

        <div className="flex flex-col gap-3">
          <Button type="submit" size="lg" loading={saving} className="w-full">
            <Save className="h-5 w-5" aria-hidden="true" />
            {submitLabel}
          </Button>
          <Link to="/admin/produtos" className={buttonClasses('ghost', 'md', 'w-full')}>
            Cancelar
          </Link>
        </div>
      </aside>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-bold text-stone-800">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-stone-500">{hint}</p>}
      {error && <p className="text-sm font-semibold text-error-600">{error}</p>}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-stone-800">{label}</p>
        <p className="text-xs leading-normal text-stone-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-primary-600' : 'bg-stone-300'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
