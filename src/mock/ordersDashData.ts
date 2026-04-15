export type OrderColumnId = 'pending' | 'packing' | 'out_for_delivery' | 'completed';

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
  { id: 'completed', title: 'Completed' },
];
