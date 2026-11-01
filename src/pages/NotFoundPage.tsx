import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { buttonClasses } from '@/components/ui/buttonStyles';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-28 text-center">
      <SearchX className="h-12 w-12 text-primary-400" aria-hidden="true" />
      <h1 className="text-3xl font-extrabold">Página não encontrada</h1>
      <p className="text-base leading-normal text-stone-600">O endereço que você acessou não existe ou foi alterado.</p>
      <Link to="/" className={buttonClasses('primary', 'md')}>
        Voltar para o início
      </Link>
    </div>
  );
}
