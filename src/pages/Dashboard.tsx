import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { AnnouncementCarousel } from '@/components/dashboard/AnnouncementCarousel';
import { DashboardChart } from '@/components/dashboard/DashboardChart';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { StatRow } from '@/components/dashboard/StatRow';
import { StoreStatusToggle } from '@/components/dashboard/StoreStatusToggle';
import { useDashboardHome } from '@/hooks/useDashboardHome';
import { useDashboardStoreStatus } from '@/hooks/useDashboardStoreStatus';
import {
  formatStatNumber,
  mapAnnouncementBanners,
  mapOrdersChartData,
  mapSalesChartData,
} from '@/utils/mapDashboardHomeData';

export function Dashboard() {
  const { dashboardData, loading } = useDashboardHome();
  const { isStoreOnline, onStoreStatusChange } = useDashboardStoreStatus(dashboardData);

  const ordersChartData = useMemo(() => mapOrdersChartData(dashboardData), [dashboardData]);
  const salesChartData = useMemo(() => mapSalesChartData(dashboardData), [dashboardData]);
  const announcementItemsForCarousel = useMemo(() => {
    const mapped = mapAnnouncementBanners(dashboardData);
    return mapped.length > 0 ? mapped : [{ id: 'empty', title: '', preview: '' }];
  }, [dashboardData]);

  if (loading) {
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
      <div className="flex w-full flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-8"
        >
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <StatRow label="Current Store status">
                <StoreStatusToggle
                  value={isStoreOnline ? 'on' : 'off'}
                  onChange={onStoreStatusChange}
                />
              </StatRow>
              <StatRow label="Current Store rate">
                {formatStatNumber(dashboardData?.store_rate)} ★
              </StatRow>
              <StatRow label="Out of Stock items">
                {formatStatNumber(dashboardData?.out_of_stock_items_count)} 🚨
              </StatRow>
              <StatRow label="Active Discounts">
                {formatStatNumber(dashboardData?.active_discounts_count)} 🎯
              </StatRow>
              <StatRow label="Active Orders">
                {formatStatNumber(dashboardData?.active_orders_count)}
              </StatRow>
            </div>
            <AnnouncementCarousel items={announcementItemsForCarousel} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <DashboardChart title="order in last 7 days" data={ordersChartData} />
            <DashboardChart
              title="Total Sales in last 7 days"
              data={salesChartData}
              valueFormatter={(value) => `$${value.toLocaleString()}`}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}
