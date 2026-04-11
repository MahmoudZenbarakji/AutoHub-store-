import type { OrderDetailFull, OrderLineItem } from '@/mock/orderDetailsData';
import type { OrderColumnId } from '@/mock/ordersDashData';

function unwrapDetailPayload(payload: unknown): Record<string, unknown> | null {
  if (payload == null || typeof payload !== 'object') {
    return null;
  }
  const record = payload as Record<string, unknown>;
  const data = record.data;
  if (data != null && typeof data === 'object' && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return record;
}

function formatMoney(value: unknown): string {
  if (value == null || value === '') {
    return '—';
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value}$`;
  }
  const s = String(value).trim();
  if (s.includes('$') || s.includes('SAR') || s.includes('ر.س')) {
    return s;
  }
  return `${s}$`;
}

function formatDiscount(value: unknown): string | null {
  if (value == null || value === '' || value === 0 || value === '0') {
    return null;
  }
  return formatMoney(value);
}

function formatReadyTime(value: unknown): string {
  if (value == null || value === '') {
    return '—';
  }
  const d = new Date(String(value));
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }
  return String(value);
}

/** Maps API order status strings to kanban columns (list + detail). */
export function mapApiStatusToOrderColumn(status: unknown): OrderColumnId {
  const s = String(status ?? '').toLowerCase();
  if (s.includes('cancel') || s.includes('reject')) {
    return 'packing';
  }
  if (s.includes('complete') || s.includes('delivered')) {
    return 'out_for_delivery';
  }
  if (s.includes('store_accept') || s.includes('accepted')) {
    return 'packing';
  }
  if (s.includes('pending') || s === 'new' || s === '') {
    return 'pending';
  }
  if (s.includes('pack') || s.includes('handl')) {
    return 'packing';
  }
  if (s.includes('delivery') || s.includes('ship') || s.includes('out')) {
    return 'out_for_delivery';
  }
  return 'packing';
}

function humanizeStatus(status: unknown): string {
  const raw = String(status ?? '').trim();
  if (!raw) {
    return '—';
  }
  return raw.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractItemsArray(o: Record<string, unknown>): unknown[] {
  const items = o.items ?? o.order_items ?? o.line_items ?? o.products;
  if (Array.isArray(items)) {
    return items;
  }
  return [];
}

function extractCustomer(o: Record<string, unknown>): Record<string, unknown> {
  const c = o.customer;
  if (c != null && typeof c === 'object' && !Array.isArray(c)) {
    return c as Record<string, unknown>;
  }
  return {};
}

function mapLineItems(items: unknown[], orderId: string): OrderLineItem[] {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }
  return items.map((item, index) => {
    const row = item != null && typeof item === 'object' ? (item as Record<string, unknown>) : {};
    const id = String(row.id ?? row.product_id ?? `${orderId}-item-${index}`);
    const quantity = Number(row.quantity ?? row.qty ?? 1) || 1;
    const nestedProduct =
      row.product != null && typeof row.product === 'object'
        ? (row.product as Record<string, unknown>)
        : null;
    const productName = String(
      row.product_name ?? row.name ?? row.title ?? nestedProduct?.name ?? '—',
    );
    const details = String(
      row.details ?? row.description ?? row.sku ?? row.variant ?? '—',
    );
    const discount = formatDiscount(row.discount ?? row.discount_amount);
    const price = formatMoney(row.price ?? row.unit_price ?? row.line_total ?? row.total);
    return {
      id,
      quantity,
      productName,
      details,
      discount,
      price,
    };
  });
}

/**
 * Maps GET /api/store/orders/{id} (and common `{ data: {...} }` wrappers) to the shape expected by OrderDetailsPanel.
 */
export function mapApiOrderDetailToViewModel(raw: unknown, fallbackOrderId: string): OrderDetailFull {
  const o = unwrapDetailPayload(raw) ?? {};
  const id = String(o.id ?? o.order_id ?? fallbackOrderId);
  const orderNumber = String(
    o.order_number ?? o.orderNumber ?? o.number ?? o.id ?? fallbackOrderId,
  );
  const storeName = String(o.store_name ?? o.storeName ?? '—');
  const status = o.status ?? o.order_status;
  const column = mapApiStatusToOrderColumn(status);
  const statusLabel = String(o.status_label ?? o.statusLabel ?? humanizeStatus(status));

  const customer = extractCustomer(o);
  const customerName = String(
    customer.name ??
      customer.full_name ??
      o.customer_name ??
      o.customerName ??
      '—',
  );

  const deliveryType = String(
    o.delivery_type ?? o.deliveryType ?? o.shipping_method ?? o.delivery_method ?? '—',
  );

  const orderReadyTimeDisplay = formatReadyTime(
    o.order_ready_time ?? o.orderReadyTime ?? o.ready_at ?? o.ready_time ?? o.created_at,
  );

  const subTotal = formatMoney(o.sub_total ?? o.subTotal);
  const tax = formatMoney(o.tax ?? o.tax_amount ?? o.taxAmount);
  const netTotal = formatMoney(
    o.net_total ?? o.netTotal ?? o.total ?? o.grand_total ?? o.amount,
  );

  const lineItems = mapLineItems(extractItemsArray(o), id);

  return {
    id,
    orderNumber,
    storeName,
    column,
    statusLabel,
    customerName,
    deliveryType,
    orderReadyTimeDisplay,
    subTotal,
    tax,
    netTotal,
    lineItems,
  };
}
