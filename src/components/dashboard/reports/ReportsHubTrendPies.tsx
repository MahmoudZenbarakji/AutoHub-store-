import { useMemo } from 'react';
import { ReportsHubDonut } from '@/components/dashboard/reports/ReportsHubDonut';
import type { TrendPoint } from '@/utils/mapReportsHubApi';

type ReportsHubTrendPiesProps = {
  data: TrendPoint[];
};

export function ReportsHubTrendPies({ data }: ReportsHubTrendPiesProps) {
  const { seriesA, seriesB } = useMemo(() => {
    return {
      seriesA: data.map((p) => ({ name: p.label, value: Math.max(0, p.a) })),
      seriesB: data.map((p) => ({ name: p.label, value: Math.max(0, p.b) })),
    };
  }, [data]);

  return (
    <div className="grid min-h-[240px] w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6">
      <div className="rounded-xl border border-border/60 bg-linear-to-b from-muted/25 to-transparent p-2">
        <ReportsHubDonut data={seriesA} subtitle="Series A" />
      </div>
      <div className="rounded-xl border border-border/60 bg-linear-to-b from-muted/25 to-transparent p-2">
        <ReportsHubDonut data={seriesB} subtitle="Series B" />
      </div>
    </div>
  );
}
