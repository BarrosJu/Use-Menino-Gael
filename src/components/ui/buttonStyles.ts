export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white shadow-soft hover:bg-primary-700 hover:shadow-lift',
  secondary: 'bg-primary-100 text-primary-900 hover:bg-primary-200',
  outline: 'border-2 border-primary-600 text-primary-700 hover:bg-primary-50',
  ghost: 'text-primary-800 hover:bg-primary-50',
  danger: 'bg-error-600 text-white hover:bg-error-700',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra = ''): string {
  return [BASE, VARIANTS[variant], SIZES[size], extra].filter(Boolean).join(' ');
}
