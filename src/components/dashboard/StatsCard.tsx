import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '@/components/common/Card';
import { cn } from '@/lib/utils';
import type { StatMetric } from '@/mock/dashboardData';

type StatsCardProps = {
  metric: StatMetric;
  icon?: LucideIcon;
  className?: string;
};

const toneStyles: Record<NonNullable<StatMetric['tone']>, string> = {
  default: 'border-border bg-card',
  success: 'border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-500/10',
  warning: 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10',
  danger: 'border-red-500/25 bg-red-500/5 dark:bg-red-500/10',
};

export function StatsCard({ metric, icon: Icon, className }: StatsCardProps) {
  const tone = metric.tone ?? 'default';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('h-full', className)}
    >
      <Card
        className={cn(
          'h-full border shadow-xs transition-shadow hover:shadow-md',
          toneStyles[tone],
        )}
      >
        <div className="flex flex-col gap-2 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium leading-snug text-muted-foreground sm:text-[13px]">
              {metric.label}
            </p>
            {Icon ? (
              <Icon className="size-4 shrink-0 text-muted-foreground opacity-80" aria-hidden />
            ) : null}
          </div>
          <p className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {metric.value}
          </p>
          {metric.hint ? (
            <p className="text-xs text-muted-foreground">{metric.hint}</p>
          ) : null}
        </div>
      </Card>
    </motion.div>
  );
}
