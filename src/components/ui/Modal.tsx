import { useEffect, useId, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'lg';
}

export default function Modal({ open, title, onClose, children, footer, size = 'sm' }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Fechar janela"
        onClick={onClose}
        className="absolute inset-0 animate-[fade-in_0.2s_ease-out] bg-primary-900/40 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-10 max-h-[90vh] w-full animate-[slide-up_0.25s_ease-out] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-lift sm:rounded-3xl sm:p-8 ${
          size === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-md'
        }`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-extrabold text-primary-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-full p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
        {footer && <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  );
}
