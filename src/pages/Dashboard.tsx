import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { AnnouncementCarousel } from '@/components/dashboard/AnnouncementCarousel';
import { DashboardChart } from '@/components/dashboard/DashboardChart';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { StatRow } from '@/components/dashboard/StatRow';
import { StoreStatusToggle } from '@/components/dashboard/StoreStatusToggle';
import {
  announcementItems,
  ordersLast7DaysChart,
  salesLast7DaysChart,
  storeOverview,
} from '@/mock/dashboardData';
import type { StoreStatus } from '@/mock/dashboardData';

export function Dashboard() {
  const [storeStatus, setStoreStatus] = useState<StoreStatus>(storeOverview.storeStatus);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>AutoHub — Stores Dashboard</title>
        </Helmet>
        <DashboardSkeleton />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>AutoHub — Stores Dashboard</title>
      </Helmet>
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-8"
        >
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <StatRow label="Current Store status">
                <StoreStatusToggle value={storeStatus} onChange={setStoreStatus} />
              </StatRow>
              <StatRow label="Current Store rate">
                {storeOverview.storeRating} ★
              </StatRow>
              <StatRow label="Out of Stock items">
                {storeOverview.outOfStockCount} 🚨
              </StatRow>
              <StatRow label="Active Discounts">
                {storeOverview.activeDiscounts} 🎯
              </StatRow>
              <StatRow label="Active Orders">{storeOverview.activeOrders}</StatRow>
            </div>
            <AnnouncementCarousel items={announcementItems} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <DashboardChart title="order in last 7 days" data={ordersLast7DaysChart} />
            <DashboardChart
              title="Total Sales in last 7 days"
              data={salesLast7DaysChart}
              valueFormatter={(value) => `$${value.toLocaleString()}`}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}
