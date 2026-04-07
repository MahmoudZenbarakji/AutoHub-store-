import { cn } from '@/lib/utils';
import type { StoreStatus } from '@/mock/dashboardData';

type StoreStatusToggleProps = {
  value: StoreStatus;
  onChange: (next: StoreStatus) => void;
};

export function StoreStatusToggle({ value, onChange }: StoreStatusToggleProps) {
  return (
    <div
      className="inline-flex rounded-md border border-border bg-muted/40 p-0.5"
      role="group"
      aria-label="Current store status"
    >
      {(['off', 'on'] as const).map((state) => (
        <button
          key={state}
          type="button"
          onClick={() => onChange(state)}
          className={cn(
            'min-w-[3rem] rounded px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors',
            value === state
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-background hover:text-foreground',
          )}
        >
          {state}
        </button>
      ))}
    </div>
  );
}
