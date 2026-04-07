import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Point = { label: string; a: number; b: number };

type ReportsHubTrendLineProps = {
  data: Point[];
};

export function ReportsHubTrendLine({ data }: ReportsHubTrendLineProps) {
  return (
    <div className="h-[220px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={{ stroke: 'var(--border)' }} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={{ stroke: 'var(--border)' }} />
          <Tooltip
            contentStyle={{
              background: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--popover-foreground)',
            }}
          />
          <Line type="monotone" dataKey="a" name="Series A" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
          <Line
            type="monotone"
            dataKey="b"
            name="Series B"
            stroke="var(--foreground)"
            strokeWidth={2}
            dot={false}
            opacity={0.85}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
