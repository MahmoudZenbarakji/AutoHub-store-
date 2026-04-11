import type { KanbanOrder } from '@/mock/ordersDashData';
import { mapApiStatusToOrderColumn } from '@/utils/mapOrderDetailResponse';

export type OrderListTab = 'pending' | 'completed' | 'cancelled';

function formatOrderListTime(value: unknown): string {
  if (value == null || value === '') {
    return '—';
  }
  const d = new Date(String(value));
  if (!Number.isNaN(d.getTime())) {
    return `Order ready time ${d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;
  }
  return String(value);
}

export function extractOrdersList(payload: unknown): unknown[] {
  if (payload == null) {
    return [];
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  if (typeof payload !== 'object') {
    return [];
  }
  const record = payload as Record<string, unknown>;
  const data = record.data;
  if (Array.isArray(data)) {
    return data;
  }
  if (data != null && typeof data === 'object') {
    const inner = data as Record<string, unknown>;
    if (Array.isArray(inner.data)) {
      return inner.data;
    }
    if (Array.isArray(inner.orders)) {
      return inner.orders;
    }
  }
  if (Array.isArray(record.orders)) {
    return record.orders;
  }
  return [];
}

export function mapApiOrderToKanban(item: unknown): KanbanOrder {
  const o = item != null && typeof item === 'object' ? (item as Record<string, unknown>) : {};
  const id = o.id ?? o.order_id ?? '';
  const orderNumber = o.order_number ?? o.orderNumber ?? o.number ?? '';
  const scheduled = Boolean(o.scheduled ?? o.is_scheduled);
  const scheduledExtra =
    o.scheduled_extra != null
      ? String(o.scheduled_extra)
      : o.scheduled_label != null
        ? String(o.scheduled_label)
        : undefined;

  const column = mapApiStatusToOrderColumn(o.status ?? o.order_status);

  const netRaw =
    o.net_total ?? o.netTotal ?? o.subtotal ?? o.sub_total ?? o.total ?? '';
  const netTotal = netRaw === '' || netRaw == null ? '—' : String(netRaw);

  const orderReadyTime = formatOrderListTime(
    o.order_ready_time ?? o.orderReadyTime ?? o.ready_time ?? o.created_at,
  );

  return {
    id: String(id),
    orderNumber: String(orderNumber),
    storeLabel: String(o.store_label ?? o.storeLabel ?? 'Store'),
    storeName: String(o.store_name ?? o.storeName ?? ''),
    orderReadyTime,
    itemsCount: Number(o.items_count ?? o.itemsCount ?? 0) || 0,
    netTotal,
    column,
    scheduled: scheduled ? true : undefined,
    scheduledExtra,
  };
}

export function mapOrdersForActiveTab(list: unknown[]): KanbanOrder[] {
  return list.map((item) => mapApiOrderToKanban(item));
}
