import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FolderTree, Images, LayoutDashboard, LogOut, PackagePlus, Package, ExternalLink } from 'lucide-react';
import Brand from '@/components/layout/Brand';
import { useAuth } from '@/hooks/useAuth';

const MENU_ITEMS = [
  { to: '/admin', label: 'Visão geral', icon: LayoutDashboard, end: true },
  { to: '/admin/produtos', label: 'Produtos', icon: Package, end: false },
  { to: '/admin/produtos/novo', label: 'Cadastro de produtos', icon: PackagePlus, end: true },
  { to: '/admin/categorias', label: 'Categorias', icon: FolderTree, end: false },
  { to: '/admin/imagens', label: 'Imagens do site', icon: Images, end: false },
];

export default function AdminLayout() {
  const { signOut, session } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-secondary-50 lg:flex">
      <aside className="border-b border-primary-100 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 p-5 lg:p-6">
          <Brand />
        </div>

        <nav aria-label="Menu do painel" className="flex gap-2 overflow-x-auto px-4 pb-4 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  isActive ? 'bg-primary-600 text-white shadow-soft' : 'text-stone-700 hover:bg-primary-50 hover:text-primary-900'
                }`
              }
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-stone-700 transition hover:bg-primary-50 hover:text-primary-900"
          >
            <ExternalLink className="h-5 w-5" aria-hidden="true" />
            Ver site
          </Link>
        </nav>

        <div className="hidden border-t border-primary-100 p-6 lg:block">
          <p className="mb-3 truncate text-xs font-semibold text-stone-500">{session?.user.email}</p>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-error-600 transition hover:bg-error-50"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            Sair da conta
          </button>
        </div>
        <div className="px-4 pb-4 lg:hidden">
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-error-600 transition hover:bg-error-50"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            Sair da conta
          </button>
        </div>
      </aside>

      <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}
