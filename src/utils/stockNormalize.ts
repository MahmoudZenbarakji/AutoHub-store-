import type {
  StockParent,
  StockProduct,
  StockProductOption,
  StockSub,
  StockVehicleFit,
} from '@/mock/stockManagementData';

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

function num(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function parseStringArray(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v.map((x) => String(x ?? '').trim()).filter(Boolean);
  }
  if (typeof v === 'string' && v.trim()) {
    return v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function parseOptions(v: unknown): StockProductOption[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      if (!isRecord(item)) return null;
      return {
        option_name: String(item.option_name ?? item.optionName ?? ''),
        option_value: String(item.option_value ?? item.optionValue ?? ''),
      };
    })
    .filter((x): x is StockProductOption => x != null);
}

function parseVehicleFits(v: unknown): StockVehicleFit[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      if (!isRecord(item)) return null;
      const trim = item.vehicle_trim ?? item.vehicleTrim;
      return {
        vehicle_make: String(item.vehicle_make ?? item.vehicleMake ?? ''),
        vehicle_model: String(item.vehicle_model ?? item.vehicleModel ?? ''),
        vehicle_trim: trim === undefined || trim === null ? null : String(trim),
        year_from: num(item.year_from ?? item.yearFrom, 0),
        year_to: num(item.year_to ?? item.yearTo, 0),
      };
    })
    .filter((x): x is StockVehicleFit => x != null);
}

function parseCategoryIds(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x ?? '')).filter(Boolean);
}

function parseDynamicLabelIds(v: unknown): number[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => num(x, NaN)).filter((n) => Number.isFinite(n));
}

export function mapProduct(raw: unknown): StockProduct {
  const r = isRecord(raw) ? raw : {};
  const price = r.price;
  const priceStr = typeof price === 'number' ? String(price) : String(price ?? '');

  const status =
    r.status !== undefined
      ? Boolean(r.status)
      : Boolean(r.status_on ?? r.statusOn ?? r.is_active ?? true);

  return {
    id: String(r.id ?? ''),
    name: String(r.name ?? r.name_en ?? r.nameEn ?? ''),
    nameAr: String(r.name_ar ?? r.nameAr ?? ''),
    nameEn: String(r.name_en ?? r.nameEn ?? ''),
    description: String(r.description ?? ''),
    descriptionAr: String(r.description_ar ?? r.descriptionAr ?? ''),
    descriptionEn: String(r.description_en ?? r.descriptionEn ?? ''),
    queue: num(r.queue ?? r.order, 0),
    price: priceStr,
    quantity: num(r.quantity ?? r.qty, 0),
    tags: parseStringArray(r.tags),
    features: parseStringArray(r.features),
    options: parseOptions(r.options),
    vehicleFits: parseVehicleFits(r.vehicle_fits ?? r.vehicleFits),
    categoryIds: parseCategoryIds(r.category_ids ?? r.categoryIds),
    dynamicLabelIds: parseDynamicLabelIds(r.dynamic_label_ids ?? r.dynamicLabelIds),
    imageUrls: parseStringArray(r.image_urls ?? r.imageUrls),
    statusOn: status,
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

/** Place products under subs by category_ids[0] (GET /store/stock/products?q= search results). */
export function mergeProductsIntoTreeByCategoryIds(
  tree: StockParent[],
  products: StockProduct[],
): StockParent[] {
  const next = tree.map((p) => ({
    ...p,
    subs: p.subs.map((s) => ({ ...s, products: [] as StockProduct[], totalProducts: 0 })),
  }));

  for (const pr of products) {
    const cid = pr.categoryIds[0];
    if (!cid) continue;
    for (const p of next) {
      const sub = p.subs.find((s) => s.id === cid);
      if (sub) {
        sub.products.push(pr);
        break;
      }
    }
  }

  for (const p of next) {
    for (const s of p.subs) {
      const seen = new Set<string>();
      s.products = s.products.filter((pr) => {
        if (!pr.id || seen.has(pr.id)) return false;
        seen.add(pr.id);
        return true;
      });
      s.totalProducts = s.products.length;
    }
  }

  return next;
}

export function unwrapIdFromCreateResponse(res: unknown): string {
  const u = unwrapPayload(res);
  if (isRecord(u) && u.id != null) return String(u.id);
  if (isRecord(res) && res.id != null) return String(res.id);
  return '';
}

function toNumId(id: string): number | null {
  const n = Number(id);
  return Number.isFinite(n) ? n : null;
}

function cleanOptions(opts: StockProductOption[]): StockProductOption[] {
  return opts
    .filter((o) => o.option_name.trim() || o.option_value.trim())
    .map((o) => ({
      option_name: o.option_name.trim(),
      option_value: o.option_value.trim(),
    }));
}

function cleanVehicleFits(fits: StockVehicleFit[]): StockVehicleFit[] {
  return fits.filter((v) => v.vehicle_make.trim() || v.vehicle_model.trim());
}

/** POST /store/stock/products */
export function buildProductCreateBody(subCategoryId: string, p: StockProduct): Record<string, unknown> {
  const cid = toNumId(subCategoryId);
  const categoryIds =
    p.categoryIds.length > 0
      ? p.categoryIds.map((x) => toNumId(x)).filter((x): x is number => x != null)
      : cid != null
        ? [cid]
        : [];

  return {
    name_ar: p.nameAr || p.name,
    name_en: p.nameEn || p.name,
    name: p.name,
    description: p.description,
    description_ar: p.descriptionAr,
    description_en: p.descriptionEn,
    status: p.statusOn,
    quantity: p.quantity,
    price: num(p.price, 0),
    queue: p.queue,
    tags: p.tags,
    features: p.features,
    category_ids: categoryIds,
    dynamic_label_ids: p.dynamicLabelIds,
    image_urls: p.imageUrls.filter((u) => u.trim()),
    options: cleanOptions(p.options).map((o) => ({
      option_name: o.option_name,
      option_value: o.option_value,
    })),
    vehicle_fits: cleanVehicleFits(p.vehicleFits).map((v) => ({
      vehicle_make: v.vehicle_make,
      vehicle_model: v.vehicle_model,
      vehicle_trim: v.vehicle_trim,
      year_from: v.year_from,
      year_to: v.year_to,
    })),
  };
}

/** PUT /store/stock/products/:id — send fields the API accepts (aligned with example). */
export function buildProductUpdateBody(p: StockProduct): Record<string, unknown> {
  const categoryIds = p.categoryIds
    .map((x) => toNumId(x))
    .filter((x): x is number => x != null);

  return {
    name_ar: p.nameAr,
    name_en: p.nameEn,
    name: p.name,
    description: p.description,
    description_ar: p.descriptionAr,
    description_en: p.descriptionEn,
    status: p.statusOn,
    quantity: p.quantity,
    price: num(p.price, 0),
    queue: p.queue,
    tags: p.tags,
    features: p.features,
    ...(categoryIds.length > 0 ? { category_ids: categoryIds } : {}),
    dynamic_label_ids: p.dynamicLabelIds,
    image_urls: p.imageUrls.filter((u) => u.trim()),
    options: cleanOptions(p.options).map((o) => ({
      option_name: o.option_name,
      option_value: o.option_value,
    })),
    vehicle_fits: cleanVehicleFits(p.vehicleFits).map((v) => ({
      vehicle_make: v.vehicle_make,
      vehicle_model: v.vehicle_model,
      vehicle_trim: v.vehicle_trim,
      year_from: v.year_from,
      year_to: v.year_to,
    })),
  };
}
