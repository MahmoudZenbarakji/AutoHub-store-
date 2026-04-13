import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Switch } from '@/components/ui/switch';
import type { StockParent, StockProduct, StockSub } from '@/mock/stockManagementData';
import { cn } from '@/lib/utils';

export function StockDetailEmpty() {
  return (
    <Card className="flex min-h-[min(70vh,560px)] flex-1 items-center justify-center border border-dashed p-8 shadow-none">
      <div className="max-w-md text-center">
        <p className="text-lg font-medium text-foreground">Select an item from the menu</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a category in the tree to view details, or add a parent category to get started.
        </p>
      </div>
    </Card>
  );
}

type StockParentDetailProps = {
  parent: StockParent;
  basePath: string;
  onStatusChange?: (parent: StockParent, checked: boolean) => void | Promise<void>;
  onDelete?: (parentId: string) => void | Promise<void>;
  onUpdate?: (parent: StockParent) => void | Promise<void>;
  onAddSub?: (parent: StockParent) => void | Promise<void>;
};

export function StockParentDetail({
  parent,
  basePath,
  onStatusChange,
  onDelete,
  onUpdate,
  onAddSub,
}: StockParentDetailProps) {
  const navigate = useNavigate();
  const firstSub = parent.subs[0];

  return (
    <Card className="flex min-h-[min(70vh,560px)] flex-1 flex-col border shadow-xs">
      <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-start">
        <div className="flex size-24 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-border bg-muted/40 text-xs text-muted-foreground">
          Image
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">Title (AR & EN)</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-primary underline"
              onClick={() => void onUpdate?.(parent)}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-primary underline"
              onClick={() => {
                if (onAddSub) {
                  void onAddSub(parent);
                  return;
                }
                if (firstSub) navigate(`${basePath}/parent/${parent.id}/sub/${firstSub.id}`);
              }}
            >
              + Add Sub
            </Button>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status (with toggle)</span>
              <Switch
                checked={parent.statusOn}
                onCheckedChange={(v) => void onStatusChange?.(parent, v)}
                size="sm"
                aria-label="Status"
              />
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Queue </span>
              <span className="font-medium">{parent.queue}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Total Products </span>
              <span className="font-medium">{parent.totalProducts}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Total Subs </span>
              <span className="font-medium">{parent.totalSubs}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap justify-between gap-2 border-t border-border p-4">
        <Button type="button" variant="outline" onClick={() => void onDelete?.(parent.id)}>
          Delete Sub
        </Button>
        <Button type="button" variant="primary" onClick={() => void onUpdate?.(parent)}>
          Update Sub
        </Button>
      </div>
    </Card>
  );
}

type StockSubDetailProps = {
  parent: StockParent;
  sub: StockSub;
  basePath: string;
  onStatusChange?: (parent: StockParent, sub: StockSub, checked: boolean) => void | Promise<void>;
  onDelete?: (parentId: string, subId: string) => void | Promise<void>;
  onUpdate?: (parent: StockParent, sub: StockSub) => void | Promise<void>;
  onAddProduct?: (parent: StockParent, sub: StockSub) => void | Promise<void>;
};

export function StockSubDetail({
  parent,
  sub,
  basePath,
  onStatusChange,
  onDelete,
  onUpdate,
  onAddProduct,
}: StockSubDetailProps) {
  const navigate = useNavigate();
  const firstProduct = sub.products[0];

  return (
    <Card className="flex min-h-[min(70vh,560px)] flex-1 flex-col border shadow-xs">
      <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-start">
        <div className="flex size-24 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-border bg-muted/40 text-xs text-muted-foreground">
          Image
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">Title (AR & EN)</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-primary underline"
              onClick={() => void onUpdate?.(parent, sub)}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-primary underline"
              onClick={() => {
                if (onAddProduct) {
                  void onAddProduct(parent, sub);
                  return;
                }
                if (firstProduct) {
                  navigate(
                    `${basePath}/parent/${parent.id}/sub/${sub.id}/product/${firstProduct.id}`,
                  );
                }
              }}
            >
              Add product
            </Button>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status (with toggle)</span>
              <Switch
                checked={sub.statusOn}
                onCheckedChange={(v) => void onStatusChange?.(parent, sub, v)}
                size="sm"
                aria-label="Status"
              />
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Queue </span>
              <span className="font-medium">{sub.queue}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Total products </span>
              <span className="font-medium">{sub.totalProducts}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap justify-between gap-2 border-t border-border p-4">
        <Button type="button" variant="outline" onClick={() => void onDelete?.(parent.id, sub.id)}>
          Delete product
        </Button>
        <Button type="button" variant="primary" onClick={() => void onUpdate?.(parent, sub)}>
          Update product
        </Button>
      </div>
    </Card>
  );
}

type StockProductDetailProps = {
  product: StockProduct;
  onStatusChange?: (product: StockProduct, checked: boolean) => void | Promise<void>;
  onDelete?: (productId: string) => void | Promise<void>;
  onUpdate?: (product: StockProduct) => void | Promise<void>;
};

export function StockProductDetail({
  product,
  onStatusChange,
  onDelete,
  onUpdate,
}: StockProductDetailProps) {
  return (
    <Card className="flex min-h-[min(70vh,560px)] flex-1 flex-col border shadow-xs">
      <div className="border-b border-border p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-border bg-muted/40 text-[10px] text-muted-foreground">
            Image
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">Name (AR & EN)</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-primary underline"
                onClick={() => void onUpdate?.(product)}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-6 p-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Description (AR & EN)</label>
            <textarea
              className={cn(
                'mt-1 min-h-[88px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                'focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none',
              )}
              readOnly
              defaultValue={product.description}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status (with toggle)</span>
            <Switch
              checked={product.statusOn}
              onCheckedChange={(v) => void onStatusChange?.(product, v)}
              size="sm"
              aria-label="Status"
            />
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <FieldRow label="Queue" value={String(product.queue)} />
          <FieldRow label="Price" value={product.price} />
          <FieldRow label="Quantity (if 0 out of stock)" value={String(product.quantity)} />
          <FieldRow label="Tags" value={product.tags} />
          <FieldRow label="Features (Color - Size)" value={product.features} />
          <FieldRow label="Vehicles fit" value={product.vehiclesFit} />
        </div>
      </div>
      <div className="mt-auto flex flex-wrap justify-between gap-2 border-t border-border p-4">
        <Button type="button" variant="outline" onClick={() => void onDelete?.(product.id)}>
          Delete product
        </Button>
        <Button type="button" variant="primary" onClick={() => void onUpdate?.(product)}>
          Update product
        </Button>
      </div>
    </Card>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}
