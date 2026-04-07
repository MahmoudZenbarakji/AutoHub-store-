import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { StoreStatusToggle } from '@/components/dashboard/StoreStatusToggle';
import type { StoreStatus } from '@/mock/dashboardData';

type OrdersDashToolbarProps = {
  openUntilLabel?: string;
  scheduledFilterActive: boolean;
  onScheduledToggle: () => void;
  storeStatus: StoreStatus;
  onStoreStatusChange: (value: StoreStatus) => void;
  onRefresh?: () => void;
};

export function OrdersDashToolbar({
  openUntilLabel = 'Open Until 6:00 PM',
  scheduledFilterActive,
  onScheduledToggle,
  storeStatus,
  onStoreStatusChange,
  onRefresh,
}: OrdersDashToolbarProps) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
        <Button type="button" variant="outline" size="sm" className="shrink-0">
          {openUntilLabel}
        </Button>
        <Button
          type="button"
          variant={scheduledFilterActive ? 'primary' : 'outline'}
          size="sm"
          className="shrink-0"
          onClick={onScheduledToggle}
          aria-pressed={scheduledFilterActive}
          title="When clicked filter on the scheduled orders only"
        >
          Scheduled Orders
        </Button>
        <span className="hidden h-6 w-px shrink-0 bg-border sm:block" aria-hidden />
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Current Store status</span>
          <StoreStatusToggle value={storeStatus} onChange={onStoreStatusChange} />
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          mode="icon"
          size="md"
          shape="circle"
          onClick={onRefresh}
          aria-label="Refresh"
        >
          <RefreshCw className="size-4" />
        </Button>
      </div>
    </div>
  );
}
