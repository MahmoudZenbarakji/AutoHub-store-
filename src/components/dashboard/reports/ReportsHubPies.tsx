import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type PieDatum = { name: string; value: number };

type ReportsHubPiesProps = {
  leftData: PieDatum[];
  rightData: PieDatum[];
};

const FILLS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'];

export function ReportsHubPies({ leftData, rightData }: ReportsHubPiesProps) {
  return (
    <div className="grid min-h-[220px] w-full grid-cols-2 gap-4">
      {[leftData, rightData].map((data, chartIndex) => (
        <div key={chartIndex} className="min-h-[200px] w-full min-w-0">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--popover-foreground)',
                }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="52%"
                outerRadius="78%"
                paddingAngle={2}
                stroke="var(--chart-1)"
                strokeWidth={2}
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={FILLS[index % FILLS.length]}
                    fillOpacity={0.2}
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
