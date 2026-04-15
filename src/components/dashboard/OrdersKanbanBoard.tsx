import { OrderCard } from '@/components/dashboard/OrderCard';
import type { KanbanOrder, OrderColumnId } from '@/mock/ordersDashData';
import { cn } from '@/lib/utils';

type OrdersKanbanBoardProps = {
  columns: { id: OrderColumnId; title: string }[];
  orders: KanbanOrder[];
  scheduledFilterActive: boolean;
  selectedOrderId?: string | null;
  onSelectOrder?: (order: KanbanOrder) => void;
};

export function OrdersKanbanBoard({
  columns,
  orders,
  scheduledFilterActive,
  selectedOrderId,
  onSelectOrder,
}: OrdersKanbanBoardProps) {
  return (
    <div className="grid min-h-[min(70vh,720px)] w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
      {columns.map((column) => {
        const columnOrders = orders.filter((order) => {
          if (order.column !== column.id) return false;
          if (scheduledFilterActive) return order.scheduled === true;
          return true;
        });

        return (
          <section
            key={column.id}
            className="flex min-h-0 min-w-0 flex-col rounded-xl border border-border bg-card/50"
            aria-labelledby={`column-${column.id}`}
          >
            <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
              <h2 id={`column-${column.id}`} className="text-sm font-semibold text-foreground">
                {column.title}
              </h2>
              <span
                className={cn(
                  'min-w-8 rounded-md border border-border bg-muted/60 px-2 py-0.5 text-center text-xs font-medium tabular-nums text-muted-foreground',
                )}
                title="Count of orders in this list"
              >
                {columnOrders.length}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
              {columnOrders.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No orders</p>
              ) : (
                columnOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    selected={selectedOrderId === order.id}
                    onSelect={onSelectOrder}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
