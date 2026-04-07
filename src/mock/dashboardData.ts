export type StoreStatus = 'on' | 'off';

export type NavItem = {
  id: string;
  label: string;
  href: string;
};

export type StatMetric = {
  id: string;
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
};

export type AnnouncementItem = {
  id: string;
  title: string;
  preview: string;
};

export type VoucherRow = {
  id: string;
  details: string;
  value: string;
  applyOn: string;
  dateRange: string;
  totalSpend: string;
};

export type ScheduledOrder = {
  id: string;
  statusLabel: string;
  openUntil?: string;
  orderReadyTime: string;
  itemsCount: number;
  netTotal: string;
  state: 'scheduled' | 'out_for_delivery' | 'packing' | 'pending';
};

export type RecentTransaction = {
  id: string;
  customer: string;
  amount: string;
  status: 'completed' | 'pending';
  date: string;
};

export const navigationItems: NavItem[] = [
  { id: 'orders', label: 'Orders Dash', href: '/dashboard/orders' },
  { id: 'reports', label: 'Reports Hub', href: '/dashboard/reports-hub' },
  { id: 'stock', label: 'Stock Management', href: '/dashboard/stock-management' },
  { id: 'reviews', label: 'Clients Reviews', href: '/dashboard/clients-reviews' },
  { id: 'settings', label: 'Store settings', href: '/dashboard/store-settings' },
];

export const storeOverview = {
  welcomeMessage: 'Welcome back!',
  storeStatus: 'on' as StoreStatus,
  storeRating: 5,
  outOfStockCount: 15,
  ordersLast7Days: 5,
  totalSalesLast7Days: 12440,
  announcementBannerCount: 2,
  activeDiscounts: 1,
  activeOrders: 3,
};

export function buildStatMetrics(overview: typeof storeOverview): StatMetric[] {
  return [
    {
      id: 'status',
      label: 'Current Store status',
      value: overview.storeStatus === 'on' ? 'ON' : 'OFF',
      tone: overview.storeStatus === 'on' ? 'success' : 'danger',
    },
    {
      id: 'rate',
      label: 'Current Store rate',
      value: `${overview.storeRating} ★`,
      tone: 'success',
    },
    {
      id: 'stock',
      label: 'Out of Stock items',
      value: `${overview.outOfStockCount} 🚨`,
      tone: 'warning',
    },
    {
      id: 'orders7',
      label: 'Orders in last 7 days',
      value: String(overview.ordersLast7Days),
    },
    {
      id: 'sales7',
      label: 'Total Sales in last 7 days',
      value: `$${overview.totalSalesLast7Days.toLocaleString()}`,
      tone: 'success',
    },
    {
      id: 'banners',
      label: 'Announcement banners',
      value: String(overview.announcementBannerCount),
    },
    {
      id: 'discounts',
      label: 'Active Discounts',
      value: `${overview.activeDiscounts} 🎯`,
      tone: 'success',
    },
  ];
}

export const announcementItems: AnnouncementItem[] = [
  {
    id: 'a1',
    title: 'Spring service promo',
    preview: '15% off labor for bookings this week.',
  },
  {
    id: 'a2',
    title: 'New OEM parts shipment',
    preview: 'Headlights and filters restocked.',
  },
  {
    id: 'a3',
    title: 'Extended hours this Friday',
    preview: 'We are open until 9 PM for walk-ins.',
  },
];

export type ChartPoint = {
  day: string;
  value: number;
};

export const ordersLast7DaysChart: ChartPoint[] = [
  { day: 'Mon', value: 12 },
  { day: 'Tue', value: 18 },
  { day: 'Wed', value: 15 },
  { day: 'Thu', value: 22 },
  { day: 'Fri', value: 28 },
  { day: 'Sat', value: 32 },
  { day: 'Sun', value: 36 },
];

export const salesLast7DaysChart: ChartPoint[] = [
  { day: 'Mon', value: 820 },
  { day: 'Tue', value: 1100 },
  { day: 'Wed', value: 980 },
  { day: 'Thu', value: 1450 },
  { day: 'Fri', value: 1680 },
  { day: 'Sat', value: 1920 },
  { day: 'Sun', value: 2100 },
];

export const voucherRows: VoucherRow[] = [
  {
    id: 'v1',
    details: 'WELCOME10',
    value: '$10',
    applyOn: 'Store',
    dateRange: 'Jan 1 — Mar 31',
    totalSpend: '$2,400',
  },
  {
    id: 'v2',
    details: 'PARTS5',
    value: '5%',
    applyOn: 'Category · Brakes',
    dateRange: 'Feb 1 — Feb 28',
    totalSpend: '$890',
  },
];

export const scheduledOrders: ScheduledOrder[] = [
  {
    id: 's1',
    statusLabel: 'Scheduled Orders',
    openUntil: 'Open until 6:00 PM',
    orderReadyTime: '1:00 PM',
    itemsCount: 3,
    netTotal: '$34',
    state: 'scheduled',
  },
  {
    id: 's2',
    statusLabel: 'Out for delivery',
    orderReadyTime: '3:30 PM',
    itemsCount: 1,
    netTotal: '$120',
    state: 'out_for_delivery',
  },
  {
    id: 's3',
    statusLabel: 'Packing & Handling',
    orderReadyTime: '5:00 PM',
    itemsCount: 4,
    netTotal: '$58',
    state: 'packing',
  },
  {
    id: 's4',
    statusLabel: 'Pending',
    orderReadyTime: '—',
    itemsCount: 2,
    netTotal: '$30',
    state: 'pending',
  },
];

export const recentTransactions: RecentTransaction[] = [
  {
    id: 't1',
    customer: 'John Smith',
    amount: '$340',
    status: 'completed',
    date: 'Apr 5, 2026',
  },
  {
    id: 't2',
    customer: 'ACME Fleet',
    amount: '$1,120',
    status: 'pending',
    date: 'Apr 5, 2026',
  },
  {
    id: 't3',
    customer: 'Sara K.',
    amount: '$89',
    status: 'completed',
    date: 'Apr 4, 2026',
  },
];
