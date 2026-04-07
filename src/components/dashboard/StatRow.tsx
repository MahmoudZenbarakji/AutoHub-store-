import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type StatRowProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function StatRow({ label, children, className }: StatRowProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-wrap items-center justify-between gap-3 border-b border-border py-3 text-sm last:border-b-0',
        className,
      )}
    >
      <span className="text-muted-foreground">{label}</span>
      <div className="flex min-w-0 items-center justify-end font-medium text-foreground">{children}</div>
    </div>
  );
}
