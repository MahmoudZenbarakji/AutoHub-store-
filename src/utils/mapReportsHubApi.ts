/** Map report API payloads to shapes expected by Reports Hub chart components (no UI changes). */

export type PieDatum = { name: string; value: number };
export type TrendPoint = { label: string; a: number; b: number };
export type BarRow = { name: string; primary: number; secondary: number };

function unwrap(payload: unknown): Record<string, unknown> {
  if (payload == null || typeof payload !== 'object') {
    return {};
  }
  const record = payload as Record<string, unknown>;
  const data = record.data;
  if (data != null && typeof data === 'object' && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return record;
}

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload != null && typeof payload === 'object') {
    const r = payload as Record<string, unknown>;
    if (Array.isArray(r.data)) {
      return r.data;
    }
    if (Array.isArray(r.orders)) {
      return r.orders;
    }
    const d = r.data;
    if (d != null && typeof d === 'object' && Array.isArray((d as Record<string, unknown>).orders)) {
      return (d as Record<string, unknown>).orders as unknown[];
    }
  }
  return [];
}

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function mapPieArray(raw: unknown): PieDatum[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: PieDatum[] = [];
  for (const item of raw) {
    if (item != null && typeof item === 'object') {
      const x = item as Record<string, unknown>;
      out.push({
        name: String(x.name ?? x.label ?? '—'),
        value: num(x.value ?? x.amount ?? x.count),
      });
    }
  }
  return out.length > 0 ? out : [];
}

/** Store reports summary: GET /store/reports/summary */
function defaultPiesFromStoreSummary(o: Record<string, unknown>): { left: PieDatum[]; right: PieDatum[] } {
  const sales = num(o.total_sales ?? o.totalSales ?? o.revenue);
  const orders = num(o.orders_count ?? o.ordersCount ?? o.orders);
  const soldProducts = num(o.number_of_sold_products ?? o.numberOfSoldProducts);
  const dh = num(o.total_discounts_paid_by_autohub ?? o.totalDiscountsPaidByAutohub);
  const ds = num(o.total_discounts_paid_by_store ?? o.totalDiscountsPaidByStore);

  const left: PieDatum[] =
    dh > 0 || ds > 0
      ? [
          { name: 'AutoHub discounts', value: Math.max(dh, 0.0001) },
          { name: 'Store discounts', value: Math.max(ds, 0.0001) },
        ]
      : sales > 0
        ? [
            { name: 'Total sales', value: Math.max(sales, 0.0001) },
            { name: 'Discounts', value: 0.0001 },
          ]
        : [{ name: '—', value: 1 }];

  const right: PieDatum[] =
    orders > 0 || soldProducts > 0
      ? [
          { name: 'Orders', value: Math.max(orders, 0.0001) },
          { name: 'Products sold', value: Math.max(soldProducts, 0.0001) },
        ]
      : sales > 0
        ? [{ name: 'Sales', value: Math.max(sales, 0.0001) }, { name: '—', value: 0.0001 }]
        : [{ name: '—', value: 1 }];

  return { left, right };
}

export function mapSummaryToPieData(summaryPayload: unknown): { left: PieDatum[]; right: PieDatum[] } {
  const o = unwrap(summaryPayload);
  const leftApi = mapPieArray(o.pie_left ?? o.pieLeft ?? o.breakdown_left);
  const rightApi = mapPieArray(o.pie_right ?? o.pieRight ?? o.breakdown_right);

  if (leftApi.length > 0 && rightApi.length > 0) {
    return { left: leftApi, right: rightApi };
  }
  if (leftApi.length > 0) {
    const fallback = defaultPiesFromStoreSummary(o);
    return { left: leftApi, right: fallback.right };
  }
  if (rightApi.length > 0) {
    const fallback = defaultPiesFromStoreSummary(o);
    return { left: fallback.left, right: rightApi };
  }
  return defaultPiesFromStoreSummary(o);
}

export function mapSummaryToTrend(summaryPayload: unknown): TrendPoint[] {
  const o = unwrap(summaryPayload);
  const series =
    o.trend ??
    o.monthly_trend ??
    o.monthlyTrend ??
    o.series ??
    o.chart_data ??
    o.chartData;
  if (Array.isArray(series) && series.length > 0) {
    return series.map((item, i) => {
      const row = item != null && typeof item === 'object' ? (item as Record<string, unknown>) : {};
      return {
        label: String(row.label ?? row.month ?? row.name ?? `M${i + 1}`),
        a: num(row.a ?? row.sales ?? row.primary ?? row.value),
        b: num(row.b ?? row.orders ?? row.secondary ?? row.count),
      };
    });
  }
  const sales = num(o.total_sales ?? o.totalSales);
  const orders = num(o.orders_count ?? o.ordersCount);
  return [
    { label: 'Period total', a: sales, b: orders },
  ];
}

/** GET /store/reports/orders — daily sales (a) and order count (b) from order_ready_time */
export function mapOrdersReportToTrendPoints(ordersPayload: unknown): TrendPoint[] {
  const list = extractArray(ordersPayload);
  const byDay = new Map<string, { sales: number; count: number }>();
  for (const item of list) {
    const row = item != null && typeof item === 'object' ? (item as Record<string, unknown>) : {};
    const t = row.order_ready_time ?? row.created_at;
    if (t == null || typeof t !== 'string') {
      continue;
    }
    const day = t.slice(0, 10);
    const bill = row.bill_details;
    let orderTotal = 0;
    if (bill != null && typeof bill === 'object') {
      orderTotal = num((bill as Record<string, unknown>).total);
    }
    const cur = byDay.get(day) ?? { sales: 0, count: 0 };
    cur.sales += orderTotal;
    cur.count += 1;
    byDay.set(day, cur);
  }
  const keys = [...byDay.keys()].sort();
  if (keys.length > 0) {
    return keys.map((label) => {
      const v = byDay.get(label)!;
      return { label, a: v.sales, b: v.count };
    });
  }
  return [];
}

function billDetails(row: Record<string, unknown>): Record<string, unknown> | null {
  const bill = row.bill_details ?? row.billDetails;
  if (bill != null && typeof bill === 'object' && !Array.isArray(bill)) {
    return bill as Record<string, unknown>;
  }
  return null;
}

/** Top sold products from GET /store/reports/summary data.top_sold_products */
export function mapSummaryTopSoldToBarRows(summaryPayload: unknown): BarRow[] {
  const o = unwrap(summaryPayload);
  const list = o.top_sold_products ?? o.topSoldProducts;
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }
  return list.map((item) => {
    const row = item != null && typeof item === 'object' ? (item as Record<string, unknown>) : {};
    return {
      name: String(row.product_name ?? row.productName ?? '—').slice(0, 24),
      primary: num(row.sold_quantity ?? row.soldQuantity),
      secondary: 0,
    };
  });
}

/** Aggregate quantities by product from GET /store/reports/orders when summary has no top list */
export function mapOrdersToProductBarRows(ordersPayload: unknown): BarRow[] {
  const list = extractArray(ordersPayload);
  const byProduct = new Map<string, number>();
  for (const item of list) {
    const row = item != null && typeof item === 'object' ? (item as Record<string, unknown>) : {};
    const products = row.products_in_order ?? row.productsInOrder;
    if (!Array.isArray(products)) {
      continue;
    }
    for (const p of products) {
      if (p == null || typeof p !== 'object') {
        continue;
      }
      const pr = p as Record<string, unknown>;
      const name = String(pr.product_name ?? pr.productName ?? '—');
      const q = num(pr.quantity);
      byProduct.set(name, (byProduct.get(name) ?? 0) + q);
    }
  }
  const rows = [...byProduct.entries()]
    .map(([name, qty]) => ({
      name: name.slice(0, 24),
      primary: qty,
      secondary: 0,
    }))
    .sort((x, y) => y.primary - x.primary)
    .slice(0, 20);
  return rows.length > 0 ? rows : [{ name: '—', primary: 0, secondary: 0 }];
}

export function mapOrdersReportToBarRows(ordersPayload: unknown): BarRow[] {
  const list = extractArray(ordersPayload);
  if (list.length === 0) {
    return [{ name: '—', primary: 0, secondary: 0 }];
  }
  return list.map((item, index) => {
    const row = item != null && typeof item === 'object' ? (item as Record<string, unknown>) : {};
    const bill = billDetails(row);
    const name = String(
      row.name ?? row.order_number ?? row.orderNumber ?? row.id ?? `Order ${index + 1}`,
    );
    const primary = num(
      bill?.subtotal ?? row.subtotal ?? row.total ?? row.amount ?? row.net_total ?? row.netTotal,
    );
    const secondary = num(
      bill?.tax ?? bill?.discount_total ?? row.tax ?? row.discount ?? row.items_count ?? row.itemsCount,
    );
    return { name: name.slice(0, 24), primary, secondary };
  });
}
