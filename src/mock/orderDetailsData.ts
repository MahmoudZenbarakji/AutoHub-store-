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

const orderDetailsById: Record<string, OrderDetailFull> = {
  o1: {
    id: 'o1',
    orderNumber: '043440',
    storeName: 'Downtown Auto',
    column: 'pending',
    statusLabel: 'Pending',
    customerName: 'John Smith',
    deliveryType: 'Express',
    orderReadyTimeDisplay: '1:00 PM',
    subTotal: '29$',
    tax: '1',
    netTotal: '30$',
    lineItems: [
      {
        id: 'li1',
        quantity: 2,
        productName: 'Spark Plug',
        details: 'BMW X5 2022',
        discount: '1$',
        price: '9$',
      },
      {
        id: 'li2',
        quantity: 1,
        productName: 'Headlight 13W',
        details: '—',
        discount: null,
        price: '20',
      },
    ],
  },
  o2: {
    id: 'o2',
    orderNumber: '043441',
    storeName: 'North Branch',
    column: 'packing',
    statusLabel: 'Packing & Handling',
    customerName: 'Jane Doe',
    deliveryType: 'Standard',
    orderReadyTimeDisplay: '1:00 PM',
    subTotal: '34$',
    tax: '0',
    netTotal: '34$',
    lineItems: [
      {
        id: 'li1',
        quantity: 3,
        productName: 'Oil filter',
        details: 'OEM spec',
        discount: null,
        price: '34$',
      },
    ],
  },
  o3: {
    id: 'o3',
    orderNumber: '043442',
    storeName: 'West Garage',
    column: 'packing',
    statusLabel: 'Packing & Handling',
    customerName: 'Fleet Co.',
    deliveryType: 'Pickup',
    orderReadyTimeDisplay: '2:30 PM',
    subTotal: '120$',
    tax: '0',
    netTotal: '120$',
    lineItems: [
      {
        id: 'li1',
        quantity: 1,
        productName: 'Brake pads',
        details: 'Front axle',
        discount: '5$',
        price: '120$',
      },
    ],
  },
  o4: {
    id: 'o4',
    orderNumber: '043443',
    storeName: 'Express Lane',
    column: 'out_for_delivery',
    statusLabel: 'Out for delivery',
    customerName: 'Alex R.',
    deliveryType: 'Express',
    orderReadyTimeDisplay: '3:30 PM',
    subTotal: '58$',
    tax: '0',
    netTotal: '58$',
    lineItems: [
      {
        id: 'li1',
        quantity: 2,
        productName: 'Wiper blades',
        details: 'Pair',
        discount: null,
        price: '58$',
      },
    ],
  },
};

export function getOrderDetail(orderId: string | undefined): OrderDetailFull | null {
  if (!orderId) return null;
  return orderDetailsById[orderId] ?? null;
}
