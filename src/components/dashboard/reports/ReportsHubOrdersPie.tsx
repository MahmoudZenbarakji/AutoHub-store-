import { useMemo } from 'react';
import { ReportsHubDonut } from '@/components/dashboard/reports/ReportsHubDonut';
import type { BarRow } from '@/utils/mapReportsHubApi';

type ReportsHubOrdersPieProps = {
  data: BarRow[];
};

export function ReportsHubOrdersPie({ data }: ReportsHubOrdersPieProps) {
  const pieData = useMemo(
    () =>
      data.map((row) => ({
        name: row.name,
        value: Math.max(0, row.primary + row.secondary),
      })),
    [data],
  );

  return (
    <div className="min-h-[260px] w-full min-w-0 rounded-xl border border-border/60 bg-linear-to-br from-muted/20 via-transparent to-transparent p-2">
      <ReportsHubDonut data={pieData} subtitle="Top sold products (qty)" innerRadius="42%" outerRadius="70%" />
    </div>
  );
}
