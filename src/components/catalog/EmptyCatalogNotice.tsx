import { Sparkles } from 'lucide-react';

export default function EmptyCatalogNotice({ title = 'Nossos produtos chegam em breve' }: { title?: string }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-dashed border-primary-200 bg-primary-50/50 px-6 py-12 text-center">
      <Sparkles className="h-10 w-10 text-primary-500" aria-hidden="true" />
      <h3 className="text-xl font-extrabold text-primary-900">{title}</h3>
      <p className="text-base leading-normal text-stone-600">
        O catálogo digital está sendo preparado. Enquanto isso, fale com a loja pelo WhatsApp para saber as novidades.
      </p>
    </div>
  );
}
