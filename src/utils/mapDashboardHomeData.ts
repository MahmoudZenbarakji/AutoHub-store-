import type { AnnouncementItem, ChartPoint, StoreStatus } from '@/mock/dashboardData';

export type DashboardHomePayload = {
  orders_last_7_days?: Array<{ day?: string; count?: number }>;
  total_sales_last_7_days?: Array<{ day?: string; total?: number }>;
  store_rate?: number | string | null;
  out_of_stock_items_count?: number | null;
  active_discounts_count?: number | null;
  active_orders_count?: number | null;
  current_store_status?: { is_online?: boolean } | null;
  announcement_banners?: Array<{
    id?: string | number;
    title?: string;
    heading?: string;
    preview?: string;
    description?: string;
    body?: string;
  }>;
};

function normalizePayload(raw: unknown): DashboardHomePayload | null {
  if (raw == null || typeof raw !== 'object') {
    return null;
  }
  const record = raw as Record<string, unknown>;
  const inner = record.data;
  if (inner != null && typeof inner === 'object') {
    return inner as DashboardHomePayload;
  }
  return record as DashboardHomePayload;
}

export function parseDashboardHomeResponse(raw: unknown): DashboardHomePayload | null {
  return normalizePayload(raw);
}

export function mapOrdersChartData(payload: DashboardHomePayload | null): ChartPoint[] {
  const list = payload?.orders_last_7_days;
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }
  return list.map((item) => ({
    day: item?.day != null ? String(item.day) : '',
    value: Number(item?.count ?? 0),
  }));
}

export function mapSalesChartData(payload: DashboardHomePayload | null): ChartPoint[] {
  const list = payload?.total_sales_last_7_days;
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }
  return list.map((item) => ({
    day: item?.day != null ? String(item.day) : '',
    value: Number(item?.total ?? 0),
  }));
}

export function mapAnnouncementBanners(payload: DashboardHomePayload | null): AnnouncementItem[] {
  const list = payload?.announcement_banners;
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }
  return list.map((item, index) => ({
    id: item?.id != null ? String(item.id) : `banner-${index}`,
    title: String(item?.title ?? item?.heading ?? ''),
    preview: String(item?.preview ?? item?.description ?? item?.body ?? ''),
  }));
}

export function mapStoreStatusFromPayload(payload: DashboardHomePayload | null): StoreStatus | null {
  const online = payload?.current_store_status?.is_online;
  if (typeof online !== 'boolean') {
    return null;
  }
  return online ? 'on' : 'off';
}

export function formatStatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  const text = String(value).trim();
  return text.length > 0 ? text : '—';
}
