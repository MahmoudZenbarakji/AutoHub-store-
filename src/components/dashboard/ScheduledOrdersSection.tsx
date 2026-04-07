import { Clock } from 'lucide-react';
import { Card } from '@/components/common/Card';
import type { ScheduledOrder } from '@/mock/dashboardData';
import { cn } from '@/lib/utils';

const stateBadge: Record<string, string> = {
  scheduled: 'bg-sky-500/15 text-sky-800 dark:text-sky-300',
  out_for_delivery: 'bg-violet-500/15 text-violet-800 dark:text-violet-300',
  packing: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
  pending: 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300',
};

type ScheduledOrdersSectionProps = {
  orders: ScheduledOrder[];
};

export function ScheduledOrdersSection({ orders }: ScheduledOrdersSectionProps) {
  return (
    <section aria-label="Scheduled orders">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Scheduled orders</h2>
        <p className="text-xs text-muted-foreground">Count of orders in this list</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {orders.map((order) => (
          <Card key={order.id} className="border shadow-xs transition-shadow hover:shadow-md">
            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{order.statusLabel}</p>
                  {order.openUntil ? (
                    <p className="text-xs text-muted-foreground">{order.openUntil}</p>
                  ) : null}
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                    stateBadge[order.state] ?? stateBadge.pending,
                  )}
                >
                  {order.state.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                Order ready {order.orderReadyTime}
              </div>
              <p className="text-xs text-muted-foreground">Items count {order.itemsCount}</p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Net total {order.netTotal}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
