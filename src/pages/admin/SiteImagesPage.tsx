import { useId, useState, type ChangeEvent } from 'react';
import { ImagePlus, ImageOff } from 'lucide-react';
import Alert from '@/components/ui/Alert';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { ErrorState, LoadingState } from '@/components/ui/StateMessages';
import { useAsyncData } from '@/hooks/useAsyncData';
import { listSiteImages, replaceSiteImage } from '@/services/siteImageService';
import { validateImageFile } from '@/services/storageService';
import type { SiteImageSlot } from '@/types/store';

const ACCEPT = 'image/jpeg,image/png,image/webp';

const SLOTS: { slot: SiteImageSlot; title: string; description: string; where: string }[] = [
  {
    slot: 'hero',
    title: 'Banner principal',
    description: 'A foto grande que aparece logo no topo da página inicial.',
    where: 'Página inicial, ao lado do texto de apresentação',
  },
  {
    slot: 'about',
    title: 'Foto da seção sobre a loja',
    description: 'A foto que acompanha o texto sobre a loja na página inicial.',
    where: 'Página inicial, seção "Sobre a loja"',
  },
];

export default function SiteImagesPage() {
  const images = useAsyncData(listSiteImages, []);
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">Site</p>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Imagens do site</h1>
        <p className="text-base text-stone-600">
          Escolha as fotos que aparecem na página inicial. Enquanto uma foto não for enviada, o espaço fica
          vazio, sem imagem de exemplo.
        </p>
      </header>

      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}

      {images.loading && <LoadingState label="Carregando imagens..." />}
      {!images.loading && images.error && <ErrorState message={images.error} onRetry={images.reload} />}

      {!images.loading && !images.error && images.data && (
        <div className="grid gap-6">
          {SLOTS.map((item) => (
            <SiteImageCard
              key={item.slot}
              slot={item.slot}
              title={item.title}
              description={item.description}
              where={item.where}
              url={images.data?.[item.slot] ?? null}
              onSaved={(text) => {
                setNotice({ tone: 'success', text });
                images.reload();
              }}
              onError={(text) => setNotice({ tone: 'error', text })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SiteImageCard({
  slot,
  title,
  description,
  where,
  url,
  onSaved,
  onError,
}: {
  slot: SiteImageSlot;
  title: string;
  description: string;
  where: string;
  url: string | null;
  onSaved: (message: string) => void;
  onError: (message: string) => void;
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const validation = validateImageFile(file);
    if (validation) {
      onError(validation);
      return;
    }

    setUploading(true);
    try {
      await replaceSiteImage(slot, file);
      onSaved(`"${title}" foi atualizada no site.`);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Não foi possível enviar a imagem.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <article className="grid gap-6 rounded-3xl bg-white p-6 shadow-soft md:grid-cols-[1fr_1.2fr] md:items-center">
      <div className="space-y-3">
        <h2 className="text-xl font-extrabold text-primary-900">{title}</h2>
        <p className="text-sm leading-normal text-stone-600">{description}</p>
        <p className="text-xs font-semibold text-stone-500">Onde aparece: {where}</p>
        <label
          htmlFor={inputId}
          className={`${buttonClasses('primary', 'md')} ${uploading ? 'pointer-events-none opacity-70' : 'cursor-pointer'}`}
        >
          <ImagePlus className="h-5 w-5" aria-hidden="true" />
          {uploading ? 'Enviando...' : url ? 'Trocar foto' : 'Enviar foto'}
          <input
            id={inputId}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            disabled={uploading}
            onChange={(event) => void handleChange(event)}
          />
        </label>
        <p className="text-xs text-stone-500">JPEG, PNG ou WEBP, até 5 MB.</p>
      </div>

      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-primary-50">
        {url ? (
          <img src={url} alt={`Prévia da imagem: ${title}`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-primary-700">
            <ImageOff className="h-10 w-10" aria-hidden="true" />
            <p className="text-sm font-semibold">Nenhuma foto enviada</p>
          </div>
        )}
      </div>
    </article>
  );
}
