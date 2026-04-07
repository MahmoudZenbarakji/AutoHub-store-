import { Headphones } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import type { OrderDetailFull } from '@/mock/orderDetailsData';
import { cn } from '@/lib/utils';

type OrderDetailsPanelProps = {
  order: OrderDetailFull;
  onAccept?: () => void;
  onReject?: () => void;
};

export function OrderDetailsPanel({ order, onAccept, onReject }: OrderDetailsPanelProps) {
  const showActions = order.column === 'pending';

  return (
    <Card className="w-full min-w-0 overflow-hidden border shadow-xs">
      <div className="flex flex-col gap-4 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Store</p>
          <p className="truncate text-sm font-semibold text-foreground">{order.storeName}</p>
        </div>
        <p className="text-center text-sm font-medium text-foreground sm:flex-1">{order.statusLabel}</p>
        <p className="text-end font-mono text-sm font-medium text-foreground">#{order.orderNumber}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(240px,280px)]">
        <div className="min-w-0 border-b border-border lg:border-b-0 lg:border-e">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.lineItems.map((row) => (
                  <tr key={row.id} className="border-b border-border/80 last:border-0">
                    <td className="px-4 py-3 align-top tabular-nums">{row.quantity}</td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-start gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 text-[9px] leading-tight text-muted-foreground">
                          Product
                          <br />
                          Image
                        </div>
                        <span className="font-medium text-foreground">{row.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-muted-foreground">{row.details}</td>
                    <td className="px-4 py-3 align-top text-muted-foreground">
                      {row.discount ?? '—'}
                    </td>
                    <td className="px-4 py-3 align-top font-medium text-foreground">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
            Discount will appear when it is on the store.
          </p>
          <div className="flex flex-wrap items-baseline gap-6 border-t border-border px-4 py-4">
            <div>
              <span className="text-sm text-muted-foreground">Sub total </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-500">
                {order.subTotal}
              </span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Tax </span>
              <span className="text-sm font-medium text-foreground">{order.tax}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Net total </span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-500">
                {order.netTotal}
              </span>
            </div>
          </div>
        </div>

        <aside className="flex flex-col justify-between gap-6 p-4 lg:min-h-[200px]">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Customer name</p>
              <p className="text-sm font-medium text-foreground">{order.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Delivery type</p>
              <p className="text-sm font-medium text-foreground">{order.deliveryType}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Order ready time</p>
              <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {order.orderReadyTimeDisplay}
              </p>
            </div>
          </div>
          <a
            href="mailto:support@autohub.example"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Headphones className="size-4 shrink-0" />
            Need support?
          </a>
        </aside>
      </div>

      {showActions ? (
        <div className="flex flex-col gap-2 border-t border-border p-4 sm:flex-row sm:gap-3">
          <Button
            type="button"
            className={cn(
              'flex-1 border-0 bg-green-600 text-white shadow-sm hover:bg-green-700',
              'focus-visible:ring-green-600',
            )}
            onClick={onAccept}
          >
            Accept
          </Button>
          <Button type="button" variant="destructive" className="flex-1" onClick={onReject}>
            Reject
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
