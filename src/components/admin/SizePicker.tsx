import { SIZE_OPTIONS } from '@/config/store';

export default function SizePicker({
  selected,
  onChange,
  error,
}: {
  selected: string[];
  onChange: (sizes: string[]) => void;
  error?: string;
}) {
  const toggle = (size: string) => {
    onChange(selected.includes(size) ? selected.filter((item) => item !== size) : [...selected, size]);
  };

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-bold text-stone-800">Tamanhos disponíveis</legend>
      <div className="flex flex-wrap gap-2">
        {SIZE_OPTIONS.map((size) => {
          const active = selected.includes(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() => toggle(size)}
              aria-pressed={active}
              className={`min-w-[3rem] rounded-xl border-2 px-3 py-2 text-sm font-bold transition ${
                active
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-primary-100 bg-white text-stone-700 hover:border-primary-300'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm font-semibold text-error-600">{error}</p>}
    </fieldset>
  );
}
