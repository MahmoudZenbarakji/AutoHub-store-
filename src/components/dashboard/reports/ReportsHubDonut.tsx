import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export type DonutDatum = { name: string; value: number };

const SLICE_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

type ReportsHubDonutProps = {
  data: DonutDatum[];
  /** Short label above the chart (e.g. series name). */
  subtitle?: string;
  innerRadius?: string;
  outerRadius?: string;
};

const tooltipStyle = {
  background: 'var(--popover)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--popover-foreground)',
  boxShadow: '0 4px 12px oklch(0 0 0 / 0.08)',
};

export function ReportsHubDonut({
  data,
  subtitle,
  innerRadius = '48%',
  outerRadius = '76%',
}: ReportsHubDonutProps) {
  const safe =
    data.length > 0
      ? data
      : [
          { name: 'No data', value: 1 },
        ];

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-col gap-1">
      {subtitle ? (
        <p className="text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
      <div className="h-[200px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value: number) => [typeof value === 'number' ? value.toLocaleString() : value, '']}
              contentStyle={tooltipStyle}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            />
            <Pie
              data={safe}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="46%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2.5}
              stroke="var(--background)"
              strokeWidth={3}
            >
              {safe.map((_, index) => (
                <Cell key={index} fill={SLICE_COLORS[index % SLICE_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
