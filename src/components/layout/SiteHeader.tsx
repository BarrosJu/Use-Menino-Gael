import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, MessageCircle, X } from 'lucide-react';
import Brand from '@/components/layout/Brand';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { buildWhatsAppLink } from '@/lib/format';

const NAV_ITEMS = [
  { to: '/', label: 'Início', end: true },
  { to: '/sobre', label: 'Sobre a loja' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/contato', label: 'Contato' },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'bg-primary-100 text-primary-900' : 'text-stone-700 hover:bg-primary-50 hover:text-primary-800'
  }`;

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled || menuOpen ? 'bg-white/95 shadow-soft backdrop-blur-md' : 'bg-white/70 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="Use Menino Gael - página inicial" onClick={() => setMenuOpen(false)}>
          <Brand />
        </Link>

        <nav aria-label="Menu principal" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses('primary', 'sm')}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="rounded-full p-2.5 text-primary-900 transition hover:bg-primary-50 md:hidden"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-primary-100 bg-white transition-all duration-300 md:hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 border-transparent opacity-0'
        }`}
      >
        <nav aria-label="Menu móvel" className="flex flex-col gap-1 px-4 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-3 text-base font-semibold ${
                  isActive ? 'bg-primary-100 text-primary-900' : 'text-stone-700 hover:bg-primary-50'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses('primary', 'md', 'mt-2')}
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Falar no WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
