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

function defaultPiesFromTotals(o: Record<string, unknown>): { left: PieDatum[]; right: PieDatum[] } {
  const sales = num(o.total_sales ?? o.totalSales ?? o.revenue);
  const orders = num(o.orders_count ?? o.ordersCount ?? o.orders);
  const profit = num(o.profit ?? o.net_profit ?? o.netProfit);
  const rest = Math.max(0, sales - profit);

  const left: PieDatum[] =
    sales > 0 || profit > 0
      ? [
          { name: 'Profit', value: Math.max(profit, 0.0001) },
          { name: 'Balance', value: Math.max(rest, 0.0001) },
        ]
      : [{ name: '—', value: 1 }];

  const right: PieDatum[] =
    orders > 0 || sales > 0
      ? [
          { name: 'Orders', value: Math.max(orders, 0.0001) },
          { name: 'Sales', value: Math.max(sales, 0.0001) },
        ]
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
    const fallback = defaultPiesFromTotals(o);
    return { left: leftApi, right: fallback.right };
  }
  if (rightApi.length > 0) {
    const fallback = defaultPiesFromTotals(o);
    return { left: fallback.left, right: rightApi };
  }
  return defaultPiesFromTotals(o);
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
  const profit = num(o.profit);
  return [
    { label: 'Sales', a: sales, b: orders },
    { label: 'Profit', a: profit, b: Math.max(0, sales - profit) },
  ];
}

export function mapOrdersReportToBarRows(ordersPayload: unknown): BarRow[] {
  const list = extractArray(ordersPayload);
  if (list.length === 0) {
    return [{ name: '—', primary: 0, secondary: 0 }];
  }
  return list.map((item, index) => {
    const row = item != null && typeof item === 'object' ? (item as Record<string, unknown>) : {};
    const name = String(
      row.name ?? row.order_number ?? row.orderNumber ?? row.id ?? `Order ${index + 1}`,
    );
    const primary = num(row.subtotal ?? row.total ?? row.amount ?? row.net_total ?? row.netTotal);
    const secondary = num(row.tax ?? row.discount ?? row.items_count ?? row.itemsCount);
    return { name: name.slice(0, 24), primary, secondary };
  });
}
