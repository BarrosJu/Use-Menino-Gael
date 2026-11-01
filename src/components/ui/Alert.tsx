import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { ReactNode } from 'react';

type AlertTone = 'error' | 'success' | 'info';

const TONES: Record<AlertTone, { box: string; icon: typeof Info }> = {
  error: { box: 'border-error-100 bg-error-50 text-error-700', icon: AlertCircle },
  success: { box: 'border-success-100 bg-success-50 text-success-700', icon: CheckCircle2 },
  info: { box: 'border-primary-100 bg-primary-50 text-primary-800', icon: Info },
};

export default function Alert({ tone = 'info', children }: { tone?: AlertTone; children: ReactNode }) {
  const { box, icon: Icon } = TONES[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold ${box}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="leading-normal">{children}</div>
    </div>
  );
}
