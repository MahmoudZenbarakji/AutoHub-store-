export type OrderColumnId = 'pending' | 'packing' | 'out_for_delivery';

export type KanbanOrder = {
  id: string;
  orderNumber: string;
  storeLabel: string;
  storeName: string;
  orderReadyTime: string;
  itemsCount: number;
  netTotal: string;
  column: OrderColumnId;
  scheduled?: boolean;
  scheduledExtra?: string;
};

export const orderColumns: { id: OrderColumnId; title: string }[] = [
  { id: 'pending', title: 'Pending' },
  { id: 'packing', title: 'Packing & Handling' },
  { id: 'out_for_delivery', title: 'Out for delivery' },
];

export const kanbanOrders: KanbanOrder[] = [
  {
    id: 'o1',
    orderNumber: '043440',
    storeLabel: 'Store',
    storeName: 'Downtown Auto',
    orderReadyTime: 'Order ready time 1:00 PM',
    itemsCount: 3,
    netTotal: '34$',
    column: 'pending',
  },
  {
    id: 'o2',
    orderNumber: '043441',
    storeLabel: 'Store',
    storeName: 'North Branch',
    orderReadyTime: 'Order ready time 1:00 PM (+ Date for Scheduled)',
    itemsCount: 3,
    netTotal: '34$',
    column: 'packing',
    scheduled: true,
    scheduledExtra: 'Scheduled',
  },
  {
    id: 'o3',
    orderNumber: '043442',
    storeLabel: 'Store',
    storeName: 'West Garage',
    orderReadyTime: 'Order ready time 2:30 PM',
    itemsCount: 1,
    netTotal: '120$',
    column: 'packing',
  },
  {
    id: 'o4',
    orderNumber: '043443',
    storeLabel: 'Store',
    storeName: 'Express Lane',
    orderReadyTime: 'Order ready time 3:30 PM',
    itemsCount: 2,
    netTotal: '58$',
    column: 'out_for_delivery',
  },
];
