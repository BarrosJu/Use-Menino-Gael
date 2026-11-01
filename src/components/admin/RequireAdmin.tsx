import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/StateMessages';
import { useAuth } from '@/hooks/useAuth';

export default function RequireAdmin() {
  const { session, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState label="Verificando acesso..." />;

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-5 px-4 py-24">
        <Alert tone="error">Esta conta não tem permissão para acessar o painel administrativo.</Alert>
        <Button variant="outline" onClick={() => void signOut()}>
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sair e usar outra conta
        </Button>
      </div>
    );
  }

  return <Outlet />;
}
