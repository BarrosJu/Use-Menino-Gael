import { Loader2 } from 'lucide-react';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';

export function LoadingState({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-primary-700" role="status">
      <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mx-auto max-w-lg space-y-4 py-12">
      <Alert tone="error">{message}</Alert>
      {onRetry && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={onRetry}>
            Tentar novamente
          </Button>
        </div>
      )}
    </div>
  );
}
