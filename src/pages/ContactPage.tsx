import { useState, type FormEvent } from 'react';
import { Instagram, MessageCircle, Phone } from 'lucide-react';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { STORE } from '@/config/store';
import { buildWhatsAppLink } from '@/lib/format';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    const nextErrors: typeof errors = {};

    if (trimmedName.length < 2) nextErrors.name = 'Informe seu nome.';
    if (trimmedMessage.length < 5) nextErrors.message = 'Escreva uma mensagem com pelo menos 5 caracteres.';
    if (trimmedMessage.length > 1000) nextErrors.message = 'A mensagem pode ter no máximo 1000 caracteres.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFeedback(null);
      return;
    }

    window.open(
      buildWhatsAppLink(`Olá, meu nome é ${trimmedName}. ${trimmedMessage}`),
      '_blank',
      'noopener,noreferrer'
    );
    setFeedback('Abrimos o WhatsApp com a sua mensagem. Basta enviar para falar com a loja.');
    setName('');
    setMessage('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">Contato</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl">Fale com a {STORE.name}</h1>
        <p className="text-base leading-normal text-stone-600">
          Tire dúvidas sobre produtos, tamanhos e compras. Escolha o canal de sua preferência.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 rounded-3xl bg-primary-600 p-7 text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-primary-700"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <MessageCircle className="h-7 w-7" aria-hidden="true" />
            </span>
            <span className="space-y-1">
              <span className="block text-lg font-extrabold text-white">WhatsApp</span>
              <span className="flex items-center gap-2 text-sm text-primary-50">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {STORE.whatsappDisplay}
              </span>
            </span>
          </a>

          <a
            href={STORE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 rounded-3xl bg-white p-7 text-primary-900 shadow-soft ring-1 ring-primary-100 transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
              <Instagram className="h-7 w-7" aria-hidden="true" />
            </span>
            <span className="space-y-1">
              <span className="block text-lg font-extrabold">Instagram</span>
              <span className="text-sm text-stone-600">{STORE.instagramHandle}</span>
            </span>
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          aria-labelledby="form-titulo"
          className="space-y-5 rounded-3xl bg-white p-6 shadow-soft sm:p-8"
        >
          <div className="space-y-1">
            <h2 id="form-titulo" className="text-xl font-extrabold text-primary-900">Envie uma mensagem</h2>
            <p className="text-sm text-stone-600">Sua mensagem será enviada pelo WhatsApp da loja.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="contato-nome" className="block text-sm font-bold text-stone-800">
              Seu nome
            </label>
            <input
              id="contato-nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'contato-nome-erro' : undefined}
              className="w-full rounded-2xl border border-primary-100 px-4 py-3 text-base text-stone-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            {errors.name && <p id="contato-nome-erro" className="text-sm font-semibold text-error-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="contato-mensagem" className="block text-sm font-bold text-stone-800">
              Mensagem
            </label>
            <textarea
              id="contato-mensagem"
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'contato-mensagem-erro' : undefined}
              className="w-full resize-y rounded-2xl border border-primary-100 px-4 py-3 text-base text-stone-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            {errors.message && (
              <p id="contato-mensagem-erro" className="text-sm font-semibold text-error-600">{errors.message}</p>
            )}
          </div>

          {feedback && <Alert tone="success">{feedback}</Alert>}

          <Button type="submit" size="lg" className="w-full sm:w-auto">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Enviar pelo WhatsApp
          </Button>
        </form>
      </div>
    </div>
  );
}
