import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingDisplayProps = {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeMap = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-7',
};

export function StarRatingDisplay({ value, max = 5, size = 'md', className }: StarRatingDisplayProps) {
  const iconClass = sizeMap[size];
  return (
    <div className={cn('flex items-center gap-0.5', className)} role="img" aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }, (_, index) => {
        const filled = index < Math.round(value);
        return (
          <Star
            key={index}
            className={cn(
              iconClass,
              filled ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-muted-foreground/50',
            )}
            strokeWidth={filled ? 0 : 1.5}
          />
        );
      })}
    </div>
  );
}
