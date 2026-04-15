import { ReportsHubDonut } from '@/components/dashboard/reports/ReportsHubDonut';

type PieDatum = { name: string; value: number };

type ReportsHubPiesProps = {
  leftData: PieDatum[];
  rightData: PieDatum[];
};

export function ReportsHubPies({ leftData, rightData }: ReportsHubPiesProps) {
  return (
    <div className="grid min-h-[240px] w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
      <div className="rounded-xl border border-border/60 bg-linear-to-b from-muted/30 to-transparent p-3 pt-4">
        <ReportsHubDonut data={leftData} />
      </div>
      <div className="rounded-xl border border-border/60 bg-linear-to-b from-muted/30 to-transparent p-3 pt-4">
        <ReportsHubDonut data={rightData} />
      </div>
    </div>
  );
}
