import { CircleCheck, CircleX } from 'lucide-react';

export default function AvailabilityBadge({ available }: { available: boolean }) {
  return available ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-success-700 shadow-soft">
      <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />
      Disponível
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700 shadow-soft">
      <CircleX className="h-3.5 w-3.5" aria-hidden="true" />
      Esgotado
    </span>
  );
}
