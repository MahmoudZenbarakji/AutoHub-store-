import type { StockParent, StockProduct, StockSub } from '@/mock/stockManagementData';

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

export function unwrapPayload<T = unknown>(payload: unknown): T | undefined {
  if (payload == null) return undefined;
  if (Array.isArray(payload)) return payload as T;
  if (isRecord(payload) && 'data' in payload && payload.data !== undefined) {
    return unwrapPayload<T>(payload.data);
  }
  return payload as T;
}

export function unwrapList(payload: unknown): unknown[] {
  const u = unwrapPayload<unknown>(payload);
  if (Array.isArray(u)) return u;
  return [];
}

export function mapProduct(raw: unknown): StockProduct {
  const r = isRecord(raw) ? raw : {};
  const price = r.price;
  const priceStr = typeof price === 'number' ? String(price) : String(price ?? '');
  return {
    id: String(r.id ?? ''),
    name: String(r.name ?? r.title ?? ''),
    description: String(r.description ?? ''),
    queue: Number(r.queue ?? r.order ?? 0),
    price: priceStr,
    quantity: Number(r.quantity ?? r.qty ?? 0),
    tags: String(r.tags ?? ''),
    features: String(r.features ?? ''),
    vehiclesFit: String(r.vehicles_fit ?? r.vehiclesFit ?? ''),
    statusOn: Boolean(r.status_on ?? r.statusOn ?? r.is_active ?? true),
  };
}

function mapSub(raw: unknown): StockSub {
  const r = isRecord(raw) ? raw : {};
  const subsProducts = r.products ?? r.items;
  const productsRaw = Array.isArray(subsProducts) ? subsProducts : [];
  const products = productsRaw.map(mapProduct);
  return {
    id: String(r.id ?? ''),
    name: String(r.name ?? r.title ?? ''),
    queue: Number(r.queue ?? r.order ?? 0),
    totalProducts: Number(r.total_products ?? r.totalProducts ?? products.length),
    statusOn: Boolean(r.status_on ?? r.statusOn ?? r.is_active ?? true),
    products,
  };
}

export function mapParent(raw: unknown): StockParent {
  const r = isRecord(raw) ? raw : {};
  const subsRaw = r.subs ?? r.children ?? [];
  const subsList = Array.isArray(subsRaw) ? subsRaw : [];
  const subs = subsList.map(mapSub);
  return {
    id: String(r.id ?? ''),
    name: String(r.name ?? r.title ?? ''),
    queue: Number(r.queue ?? r.order ?? 0),
    totalProducts: Number(r.total_products ?? r.totalProducts ?? 0),
    totalSubs: Number(r.total_subs ?? r.totalSubs ?? subs.length),
    statusOn: Boolean(r.status_on ?? r.statusOn ?? r.is_active ?? true),
    subs,
  };
}

export function normalizeStockTreePayload(payload: unknown): StockParent[] {
  const raw = unwrapPayload<unknown>(payload);
  if (!raw) return [];
  if (!Array.isArray(raw)) return [];
  if (raw.length === 0) return [];
  const first = raw[0];
  if (isRecord(first) && ('subs' in first || 'children' in first)) {
    return raw.map(mapParent);
  }
  return [];
}

export function isProductRow(raw: unknown): boolean {
  if (!isRecord(raw)) return false;
  if ('subs' in raw || 'children' in raw) return false;
  return raw.id !== undefined;
}

export function mergeProductsIntoTree(
  tree: StockParent[],
  categoryId: string,
  products: StockProduct[],
): StockParent[] {
  if (!categoryId) return tree;
  return tree.map((p) => ({
    ...p,
    subs: p.subs.map((s) =>
      s.id === categoryId ? { ...s, products, totalProducts: products.length } : s,
    ),
  }));
}

export function unwrapIdFromCreateResponse(res: unknown): string {
  const u = unwrapPayload(res);
  if (isRecord(u) && u.id != null) return String(u.id);
  if (isRecord(res) && res.id != null) return String(res.id);
  return '';
}
