import { X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { OrderDetailsPanel } from '@/components/dashboard/OrderDetailsPanel';
import { useOrderDetails } from '@/hooks/useOrderDetails';

type OrdersDashDetailPanelProps = {
  orderId: string;
  onClose: () => void;
  /** Called after a successful accept / decline so the kanban list can refresh. */
  onOrderUpdated?: () => void;
};

export function OrdersDashDetailPanel({ orderId, onClose, onOrderUpdated }: OrdersDashDetailPanelProps) {
  const { order, loading, error, submitStatusUpdate } = useOrderDetails(orderId);

  const handleAccept = async () => {
    const ok = await submitStatusUpdate('store_accept');
    if (ok) {
      onOrderUpdated?.();
    }
  };

  const handleDecline = async () => {
    const ok = await submitStatusUpdate('store_reject');
    if (ok) {
      onOrderUpdated?.();
    }
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">Order details</h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 shrink-0 p-0"
          onClick={onClose}
          aria-label="Close details"
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="min-h-0 min-w-0 overflow-y-auto overflow-x-hidden pb-1">
        {loading ? (
          <Card className="border-0 shadow-none">
            <p className="p-6 text-center text-sm text-muted-foreground">Loading…</p>
          </Card>
        ) : error ? (
          <Card className="border-0 shadow-none">
            <p className="p-6 text-center text-sm text-destructive" role="alert">
              {error}
            </p>
          </Card>
        ) : order ? (
          <OrderDetailsPanel order={order} onAccept={handleAccept} onReject={handleDecline} />
        ) : null}
      </div>
    </div>
  );
}
