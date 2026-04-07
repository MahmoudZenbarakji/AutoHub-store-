import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartPoint } from '@/mock/dashboardData';
import { cn } from '@/lib/utils';

type DashboardChartProps = {
  title: string;
  data: ChartPoint[];
  valueFormatter?: (value: number) => string;
  className?: string;
};

export function DashboardChart({ title, data, valueFormatter, className }: DashboardChartProps) {
  const format = valueFormatter ?? ((value: number) => String(value));

  return (
    <div
      className={cn(
        'flex min-h-[280px] flex-col rounded-xl border border-border bg-card p-4 shadow-xs',
        className,
      )}
    >
      <h3 className="mb-4 text-sm font-semibold capitalize text-foreground">{title}</h3>
      <div className="min-h-[220px] w-full flex-1 [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11 }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={(value) => format(Number(value))}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--popover-foreground)',
              }}
              labelStyle={{ color: 'var(--muted-foreground)' }}
              formatter={(value: number | string) => [format(Number(value)), title]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--chart-1)"
              strokeWidth={2}
              strokeDasharray="6 5"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--chart-1)', stroke: 'var(--card)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
