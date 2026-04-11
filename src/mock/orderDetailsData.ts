import type { OrderColumnId } from '@/mock/ordersDashData';

export type OrderLineItem = {
  id: string;
  quantity: number;
  productName: string;
  details: string;
  discount: string | null;
  price: string;
};

export type OrderDetailFull = {
  id: string;
  orderNumber: string;
  storeName: string;
  column: OrderColumnId;
  statusLabel: string;
  customerName: string;
  deliveryType: string;
  orderReadyTimeDisplay: string;
  subTotal: string;
  tax: string;
  netTotal: string;
  lineItems: OrderLineItem[];
};
