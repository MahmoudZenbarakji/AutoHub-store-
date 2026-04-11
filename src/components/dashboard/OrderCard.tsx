import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import type { KanbanOrder } from '@/mock/ordersDashData';
import { cn } from '@/lib/utils';

type OrderCardProps = {
  order: KanbanOrder;
  selected?: boolean;
  onSelect?: (order: KanbanOrder) => void;
};

export function OrderCard({ order, selected, onSelect }: OrderCardProps) {
  return (
    <Card
      className={cn(
        'h-full border shadow-xs transition-shadow',
        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        onSelect && 'hover:shadow-md',
      )}
    >
      {order.scheduled ? (
        <div className="border-b border-primary/30 bg-primary/10 px-3 py-2 text-center text-xs font-medium text-primary">
          {order.scheduledExtra ?? 'Scheduled'}
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => onSelect?.(order)}
        className="w-full cursor-pointer text-start outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="space-y-3 p-4">
          <div>
            <p className="text-xs text-muted-foreground">{order.storeLabel}</p>
            <p className="text-sm font-medium text-foreground">{order.storeName}</p>
          </div>
          <p className="font-mono text-sm text-foreground">#{order.orderNumber}</p>
          <p className="text-xs text-muted-foreground">{order.orderReadyTime}</p>
          <p className="text-xs text-muted-foreground">Items Count {order.itemsCount}</p>
          <div className="flex justify-end border-t border-border pt-3">
            <span className="text-sm font-semibold text-green-600 dark:text-green-500">
              Net Total {order.netTotal}
            </span>
          </div>
        </div>
      </button>
      <div className="border-t border-border px-4 pb-3 pt-0">
        <Link
          to={`/dashboard/orders/${order.id}`}
          className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Open full page
        </Link>
      </div>
    </Card>
  );
}
