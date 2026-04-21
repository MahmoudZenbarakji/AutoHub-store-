import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type {
  StockParent,
  StockProduct,
  StockProductOption,
  StockSub,
  StockVehicleFit,
} from '@/mock/stockManagementData';
import { cn } from '@/lib/utils';

type StockDetailEmptyProps = {
  /** When route id does not match loaded tree */
  variant?: 'home' | 'not-found';
};

export function StockDetailEmpty({ variant = 'home' }: StockDetailEmptyProps) {
  const isNotFound = variant === 'not-found';
  return (
    <Card className="flex min-h-[min(70vh,560px)] flex-1 items-center justify-center border border-dashed p-8 shadow-none">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Categories → Parent → Sub → Product
        </p>
        <p className="mt-3 text-lg font-medium text-foreground">
          {isNotFound ? 'This item was not found' : 'Choose where to start'}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {isNotFound
            ? 'Pick another row in the tree, or go back to a parent category. The path is Categories, then Parent, then Sub, then Product.'
            : 'Open a parent category in the tree, or use Add Parent Category. Then open a sub-category (+ Add Sub), pick or add a product, and edit it on the right.'}
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
  /** Products are created under a sub-category — same handler as on the sub detail screen */
  onAddProduct?: (parent: StockParent, sub: StockSub) => void | Promise<void>;
};

export function StockParentDetail({
  parent,
  basePath,
  onStatusChange,
  onDelete,
  onUpdate,
  onAddSub,
  onAddProduct,
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
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Categories <span className="text-muted-foreground/60">›</span> Parent
            <span className="font-normal normal-case text-foreground"> · {parent.name}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">{parent.name}</h2>
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

      <div className="flex flex-1 flex-col gap-3 border-b border-border p-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Sub-categories and products</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            New products are attached to a <strong className="font-medium text-foreground">sub-category</strong>.
            Pick a sub below and use <strong className="font-medium text-foreground">+ Add product</strong>, or open
            the sub first and add from there.
          </p>
        </div>
        {parent.subs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/15 px-4 py-6 text-center text-sm text-muted-foreground">
            <p>No sub-categories yet.</p>
            <p className="mt-2">
              Use <span className="font-medium text-foreground">+ Add Sub</span> above — then you can add products
              under that sub.
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() => {
                if (onAddSub) void onAddSub(parent);
              }}
            >
              + Add Sub
            </Button>
          </div>
        ) : (
          <ul className="space-y-2" aria-label="Sub-categories">
            {parent.subs.map((sub) => (
              <li
                key={sub.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/80 bg-muted/20 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{sub.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {sub.totalProducts} product{sub.totalProducts === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`${basePath}/parent/${parent.id}/sub/${sub.id}`)}
                  >
                    Open
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => void onAddProduct?.(parent, sub)}
                  >
                    + Add product
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-auto flex flex-wrap justify-between gap-2 border-t border-border p-4">
        <Button type="button" variant="outline" onClick={() => void onDelete?.(parent.id)}>
          Delete parent category
        </Button>
        <Button type="button" variant="primary" onClick={() => void onUpdate?.(parent)}>
          Update parent
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
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Categories <span className="text-muted-foreground/60">›</span> Parent{' '}
            <span className="font-normal normal-case text-foreground">· {parent.name}</span>{' '}
            <span className="text-muted-foreground/60">›</span> Sub
            <span className="font-normal normal-case text-foreground"> · {sub.name}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">{sub.name}</h2>
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
              + Add product
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
      <div className="mt-auto flex flex-col gap-3 border-t border-border p-4">
        <div className="rounded-lg border border-border/80 bg-muted/15 px-3 py-2.5">
          <p className="text-xs text-muted-foreground">
            Products are created in <span className="font-medium text-foreground">this sub-category</span> (
            {sub.name}).
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="mt-2 w-full sm:w-auto"
            onClick={() => {
              if (onAddProduct) void onAddProduct(parent, sub);
            }}
          >
            + Add product here
          </Button>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <Button type="button" variant="outline" onClick={() => void onDelete?.(parent.id, sub.id)}>
            Delete sub-category
          </Button>
          <Button type="button" variant="primary" onClick={() => void onUpdate?.(parent, sub)}>
            Update sub-category
          </Button>
        </div>
      </div>
    </Card>
  );
}

type StockProductDetailProps = {
  product: StockProduct;
  parentName?: string;
  subName?: string;
  onStatusChange?: (product: StockProduct, checked: boolean) => void | Promise<void>;
  onDelete?: (productId: string) => void | Promise<void>;
  onUpdate?: (product: StockProduct) => void | Promise<void>;
};

function cloneProduct(p: StockProduct): StockProduct {
  return {
    ...p,
    tags: [...p.tags],
    features: [...p.features],
    options: p.options.map((o) => ({ ...o })),
    vehicleFits: p.vehicleFits.map((v) => ({ ...v })),
    categoryIds: [...p.categoryIds],
    dynamicLabelIds: [...p.dynamicLabelIds],
    imageUrls: [...p.imageUrls],
  };
}

function emptyOption(): StockProductOption {
  return { option_name: '', option_value: '' };
}

function emptyVehicleFit(): StockVehicleFit {
  const y = new Date().getFullYear();
  return {
    vehicle_make: '',
    vehicle_model: '',
    vehicle_trim: null,
    year_from: y,
    year_to: y,
  };
}

export function StockProductDetail({
  product,
  parentName,
  subName,
  onStatusChange,
  onDelete,
  onUpdate,
}: StockProductDetailProps) {
  const [draft, setDraft] = useState(() => cloneProduct(product));

  useEffect(() => {
    setDraft(cloneProduct(product));
  }, [product]);

  const previewUrl = draft.imageUrls.find((u) => u.trim())?.trim();

  const patch = (partial: Partial<StockProduct>) => setDraft((d) => ({ ...d, ...partial }));

  const save = () => {
    onUpdate?.(draft);
  };

  return (
    <Card className="flex min-h-[min(70vh,560px)] flex-1 flex-col border shadow-xs">
      <div className="border-b border-border p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex size-20 shrink-0 overflow-hidden rounded-full border-2 border-border bg-muted/40">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt=""
                className="size-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="flex size-full items-center justify-center text-[10px] text-muted-foreground">
                Image
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Categories
              {parentName ? (
                <>
                  {' '}
                  <span className="text-muted-foreground/60">›</span> Parent
                  <span className="font-normal normal-case text-foreground"> · {parentName}</span>
                </>
              ) : null}
              {subName ? (
                <>
                  {' '}
                  <span className="text-muted-foreground/60">›</span> Sub
                  <span className="font-normal normal-case text-foreground"> · {subName}</span>
                </>
              ) : null}
              <span className="text-muted-foreground/60"> › </span>
              Product
              <span className="font-normal normal-case text-foreground"> · {product.name}</span>
            </p>
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-xs text-muted-foreground">
              Edit below, then Save changes. API: POST/PUT /store/stock/products.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Name (AR)</Label>
            <Input
              value={draft.nameAr}
              onChange={(e) => patch({ nameAr: e.target.value })}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Name (EN)</Label>
            <Input
              value={draft.nameEn}
              onChange={(e) => patch({ nameEn: e.target.value })}
              className="h-9"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-xs text-muted-foreground">Display name</Label>
            <Input
              value={draft.name}
              onChange={(e) => patch({ name: e.target.value })}
              className="h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <textarea
              className={cn(
                'min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                'focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none',
              )}
              value={draft.description}
              onChange={(e) => patch({ description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Description (AR)</Label>
            <textarea
              className={cn(
                'min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                'focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none',
              )}
              value={draft.descriptionAr}
              onChange={(e) => patch({ descriptionAr: e.target.value })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs text-muted-foreground">Description (EN)</Label>
            <textarea
              className={cn(
                'min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                'focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none',
              )}
              value={draft.descriptionEn}
              onChange={(e) => patch({ descriptionEn: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-y border-border py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active</span>
            <Switch
              checked={draft.statusOn}
              onCheckedChange={(v) => {
                setDraft((d) => {
                  const next = { ...d, statusOn: v };
                  void onStatusChange?.(next, v);
                  return next;
                });
              }}
              size="sm"
              aria-label="Status"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Queue</Label>
              <Input
                type="number"
                value={draft.queue}
                onChange={(e) => patch({ queue: Number(e.target.value) || 0 })}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Price</Label>
              <Input
                type="number"
                step="0.01"
                value={draft.price}
                onChange={(e) => patch({ price: e.target.value })}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Quantity</Label>
              <Input
                type="number"
                value={draft.quantity}
                onChange={(e) => patch({ quantity: Number(e.target.value) || 0 })}
                className="h-9"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Tags (comma-separated)</Label>
            <Input
              value={draft.tags.join(', ')}
              onChange={(e) =>
                patch({
                  tags: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Features (comma-separated)</Label>
            <Input
              value={draft.features.join(', ')}
              onChange={(e) =>
                patch({
                  features: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="h-9"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs text-muted-foreground">Category IDs (comma-separated)</Label>
            <Input
              value={draft.categoryIds.join(', ')}
              onChange={(e) =>
                patch({
                  categoryIds: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="h-9"
              placeholder="e.g. 1, 2"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs text-muted-foreground">Dynamic label IDs (comma-separated)</Label>
            <Input
              value={draft.dynamicLabelIds.join(', ')}
              onChange={(e) =>
                patch({
                  dynamicLabelIds: e.target.value
                    .split(/[\s,]+/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((s) => Number(s))
                    .filter((n) => Number.isFinite(n)),
                })
              }
              className="h-9"
              placeholder="e.g. 1"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs text-muted-foreground">Image URLs (one per line)</Label>
            <textarea
              className={cn(
                'min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs',
                'focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none',
              )}
              value={draft.imageUrls.join('\n')}
              onChange={(e) =>
                patch({
                  imageUrls: e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs text-muted-foreground">Options</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => patch({ options: [...draft.options, emptyOption()] })}
            >
              Add option
            </Button>
          </div>
          <div className="space-y-2">
            {(draft.options.length ? draft.options : [emptyOption()]).map((opt, i) => (
              <div key={i} className="flex flex-wrap gap-2">
                <Input
                  placeholder="Option name"
                  value={opt.option_name}
                  onChange={(e) => {
                    const next = [...(draft.options.length ? draft.options : [emptyOption()])];
                    next[i] = { ...next[i], option_name: e.target.value };
                    patch({ options: next });
                  }}
                  className="h-9 min-w-[120px] flex-1"
                />
                <Input
                  placeholder="Value"
                  value={opt.option_value}
                  onChange={(e) => {
                    const next = [...(draft.options.length ? draft.options : [emptyOption()])];
                    next[i] = { ...next[i], option_value: e.target.value };
                    patch({ options: next });
                  }}
                  className="h-9 min-w-[120px] flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 shrink-0"
                  onClick={() => {
                    const base = draft.options.length ? draft.options : [emptyOption()];
                    patch({ options: base.filter((_, j) => j !== i) });
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs text-muted-foreground">Vehicle fits</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => patch({ vehicleFits: [...draft.vehicleFits, emptyVehicleFit()] })}
            >
              Add row
            </Button>
          </div>
          <div className="space-y-3">
            {(draft.vehicleFits.length ? draft.vehicleFits : [emptyVehicleFit()]).map((vf, i) => (
              <div
                key={i}
                className="grid grid-cols-1 gap-2 rounded-lg border border-border/80 p-3 sm:grid-cols-2 lg:grid-cols-3"
              >
                <Input
                  placeholder="Make"
                  value={vf.vehicle_make}
                  onChange={(e) => {
                    const list = [...(draft.vehicleFits.length ? draft.vehicleFits : [emptyVehicleFit()])];
                    list[i] = { ...list[i], vehicle_make: e.target.value };
                    patch({ vehicleFits: list });
                  }}
                  className="h-9"
                />
                <Input
                  placeholder="Model"
                  value={vf.vehicle_model}
                  onChange={(e) => {
                    const list = [...(draft.vehicleFits.length ? draft.vehicleFits : [emptyVehicleFit()])];
                    list[i] = { ...list[i], vehicle_model: e.target.value };
                    patch({ vehicleFits: list });
                  }}
                  className="h-9"
                />
                <Input
                  placeholder="Trim (optional)"
                  value={vf.vehicle_trim ?? ''}
                  onChange={(e) => {
                    const list = [...(draft.vehicleFits.length ? draft.vehicleFits : [emptyVehicleFit()])];
                    const v = e.target.value.trim();
                    list[i] = { ...list[i], vehicle_trim: v === '' ? null : v };
                    patch({ vehicleFits: list });
                  }}
                  className="h-9"
                />
                <Input
                  type="number"
                  placeholder="Year from"
                  value={vf.year_from}
                  onChange={(e) => {
                    const list = [...(draft.vehicleFits.length ? draft.vehicleFits : [emptyVehicleFit()])];
                    list[i] = { ...list[i], year_from: Number(e.target.value) || 0 };
                    patch({ vehicleFits: list });
                  }}
                  className="h-9"
                />
                <Input
                  type="number"
                  placeholder="Year to"
                  value={vf.year_to}
                  onChange={(e) => {
                    const list = [...(draft.vehicleFits.length ? draft.vehicleFits : [emptyVehicleFit()])];
                    list[i] = { ...list[i], year_to: Number(e.target.value) || 0 };
                    patch({ vehicleFits: list });
                  }}
                  className="h-9"
                />
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9"
                    onClick={() => {
                      const base = draft.vehicleFits.length ? draft.vehicleFits : [emptyVehicleFit()];
                      patch({ vehicleFits: base.filter((_, j) => j !== i) });
                    }}
                  >
                    Remove row
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap justify-between gap-2 border-t border-border p-4">
        <Button type="button" variant="outline" onClick={() => void onDelete?.(product.id)}>
          Delete product
        </Button>
        <Button type="button" variant="primary" onClick={() => void save()}>
          Save changes
        </Button>
      </div>
    </Card>
  );
}
