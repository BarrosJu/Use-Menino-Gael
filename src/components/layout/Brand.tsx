import { Baby } from 'lucide-react';
import { STORE } from '@/config/store';

export default function Brand({ tone = 'default' }: { tone?: 'default' | 'light' }) {
  const isLight = tone === 'light';
  return (
    <div className="flex items-center gap-3">
      {STORE.logoUrl ? (
        <img src={STORE.logoUrl} alt={`Logotipo ${STORE.name}`} className="h-11 w-11 rounded-2xl object-contain" />
      ) : (
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            isLight ? 'bg-white/15 text-white' : 'bg-primary-100 text-primary-700'
          }`}
          aria-hidden="true"
        >
          <Baby className="h-6 w-6" />
        </span>
      )}
      <div className="leading-tight">
        <p className={`text-lg font-extrabold ${isLight ? 'text-white' : 'text-primary-900'}`}>{STORE.name}</p>
        <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isLight ? 'text-primary-100' : 'text-primary-600'}`}>
          Moda infantil
        </p>
      </div>
    </div>
  );
}
