import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import type { KanbanOrder } from '@/mock/ordersDashData';
import { cn } from '@/lib/utils';

type OrderCardProps = {
  order: KanbanOrder;
};

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Link
      to={`/dashboard/orders/${order.id}`}
      className={cn(
        'block rounded-xl outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring',
        'hover:shadow-md',
      )}
    >
      <Card
        className={cn(
          'h-full border shadow-xs transition-shadow hover:shadow-md',
          order.scheduled && 'overflow-hidden pt-0',
        )}
      >
        {order.scheduled ? (
          <div className="border-b border-primary/30 bg-primary/10 px-3 py-2 text-center text-xs font-medium text-primary">
            {order.scheduledExtra ?? 'Scheduled'}
          </div>
        ) : null}
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
      </Card>
    </Link>
  );
}
