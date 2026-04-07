import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { RatingDistributionRow } from '@/mock/clientsReviewsData';

type RatingDistributionChartProps = {
  data: RatingDistributionRow[];
};

export function RatingDistributionChart({ data }: RatingDistributionChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const chartData = [...data].sort((a, b) => b.stars - a.stars);

  return (
    <div className="h-[220px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
          barCategoryGap="12%"
        >
          <XAxis
            type="number"
            domain={[0, maxCount]}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis
            type="category"
            dataKey="stars"
            width={28}
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            axisLine={{ stroke: 'var(--border)' }}
            tickFormatter={(v) => String(v)}
          />
          <Tooltip
            cursor={{ fill: 'var(--muted)', opacity: 0.15 }}
            contentStyle={{
              background: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--popover-foreground)',
            }}
            formatter={(value: number) => [`${value} reviews`, 'Count']}
            labelFormatter={(label) => `${label} stars`}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={18}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.barColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
