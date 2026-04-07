import type { ReactNode } from 'react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { cn } from '@/lib/utils';

type ReportsHubChartCardProps = {
  children: ReactNode;
  onExport?: () => void;
  className?: string;
};

export function ReportsHubChartCard({ children, onExport, className }: ReportsHubChartCardProps) {
  return (
    <Card
      className={cn('relative min-h-0 w-full min-w-0 overflow-hidden border p-4 pt-12 shadow-xs', className)}
    >
      <div className="absolute end-3 top-3 z-10">
        <Button type="button" variant="primary" size="sm" onClick={onExport}>
          Export
        </Button>
      </div>
      {children}
    </Card>
  );
}
