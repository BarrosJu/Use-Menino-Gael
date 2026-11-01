import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Brand from '@/components/layout/Brand';
import { STORE } from '@/config/store';
import { buildWhatsAppLink } from '@/lib/format';

export default function SiteFooter() {
  return (
    <footer className="bg-primary-900 text-primary-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <Brand tone="light" />
          <p className="max-w-xs text-sm leading-normal text-primary-100">{STORE.tagline}</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-white">Fale com a loja</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full transition hover:text-white"
              >
                <Phone className="h-4 w-4 text-primary-300" aria-hidden="true" />
                WhatsApp: {STORE.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={STORE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full transition hover:text-white"
              >
                <Instagram className="h-4 w-4 text-primary-300" aria-hidden="true" />
                Instagram: {STORE.instagramHandle}
              </a>
            </li>
            <li>
              <Link to="/contato" className="inline-flex items-center gap-2 rounded-full transition hover:text-white">
                <Mail className="h-4 w-4 text-primary-300" aria-hidden="true" />
                Formulário de contato
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-white">Navegação</h2>
          <ul className="grid grid-cols-2 gap-3 text-sm">
            <li>
              <Link to="/" className="transition hover:text-white">Início</Link>
            </li>
            <li>
              <Link to="/sobre" className="transition hover:text-white">Sobre a loja</Link>
            </li>
            <li>
              <Link to="/catalogo" className="transition hover:text-white">Catálogo</Link>
            </li>
            <li>
              <Link to="/contato" className="transition hover:text-white">Contato</Link>
            </li>
          </ul>
          <p className="flex items-start gap-2 text-sm text-primary-100">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" aria-hidden="true" />
            Atendimento pelo WhatsApp e Instagram.
          </p>
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-primary-900 transition hover:bg-primary-100"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Chamar no WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-primary-100 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {STORE.name}. Todos os direitos reservados.</p>
          <Link to="/admin/login" className="rounded-full px-2 py-1 transition hover:text-white">
            Área da loja
          </Link>
        </div>
      </div>
    </footer>
  );
}
