import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { OrdersDashDetailPanel } from '@/components/dashboard/OrdersDashDetailPanel';
import { OrdersDashToolbar } from '@/components/dashboard/OrdersDashToolbar';
import { OrdersKanbanBoard } from '@/components/dashboard/OrdersKanbanBoard';
import { Card } from '@/components/common/Card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrdersTab } from '@/hooks/useOrdersTab';
import { orderColumns } from '@/mock/ordersDashData';
import { storeOverview } from '@/mock/dashboardData';
import type { StoreStatus } from '@/mock/dashboardData';
import type { KanbanOrder } from '@/mock/ordersDashData';
import type { OrderListTab } from '@/utils/mapOrdersResponse';

export function OrdersDash() {
  const [scheduledFilterActive, setScheduledFilterActive] = useState(false);
  const [storeStatus, setStoreStatus] = useState<StoreStatus>(storeOverview.storeStatus);
  const [activeTab, setActiveTab] = useState<OrderListTab>('pending');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { orders, loading, refetch } = useOrdersTab(activeTab);

  useEffect(() => {
    setSelectedOrderId(null);
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as OrderListTab);
  };

  const handleSelectOrder = (order: KanbanOrder) => {
    setSelectedOrderId(order.id);
  };

  return (
    <>
      <Helmet>
        <title>AutoHub — Orders Dash</title>
      </Helmet>
      <div className="flex w-full min-w-0 flex-col gap-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList variant="line" size="sm" className="w-full justify-start">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
        <OrdersDashToolbar
          scheduledFilterActive={scheduledFilterActive}
          onScheduledToggle={() => setScheduledFilterActive((previous) => !previous)}
          storeStatus={storeStatus}
          onStoreStatusChange={setStoreStatus}
          onRefresh={refetch}
        />
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex min-w-0 flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,400px)] lg:items-start lg:gap-6"
        >
          <div className="min-w-0">
            {loading ? (
              <p className="mb-2 text-center text-sm text-muted-foreground lg:text-start">Loading…</p>
            ) : null}
            <OrdersKanbanBoard
              columns={orderColumns}
              orders={orders}
              scheduledFilterActive={scheduledFilterActive}
              selectedOrderId={selectedOrderId}
              onSelectOrder={handleSelectOrder}
            />
          </div>

          <aside className="min-h-0 min-w-0 lg:sticky lg:top-4 lg:max-h-[calc(100vh-8rem)] lg:overflow-hidden">
            {selectedOrderId ? (
              <OrdersDashDetailPanel
                orderId={selectedOrderId}
                onClose={() => setSelectedOrderId(null)}
                onOrderUpdated={refetch}
              />
            ) : (
              <Card className="border border-dashed border-border bg-muted/20 p-6 shadow-none">
                <p className="text-center text-sm text-muted-foreground">
                  Select an order in the board to view details, accept, or decline.
                </p>
              </Card>
            )}
          </aside>
        </motion.div>
      </div>
    </>
  );
}
