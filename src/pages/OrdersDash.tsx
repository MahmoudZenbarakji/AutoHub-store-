import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { OrdersDashToolbar } from '@/components/dashboard/OrdersDashToolbar';
import { OrdersKanbanBoard } from '@/components/dashboard/OrdersKanbanBoard';
import { kanbanOrders, orderColumns } from '@/mock/ordersDashData';
import { storeOverview } from '@/mock/dashboardData';
import type { StoreStatus } from '@/mock/dashboardData';

export function OrdersDash() {
  const [scheduledFilterActive, setScheduledFilterActive] = useState(false);
  const [storeStatus, setStoreStatus] = useState<StoreStatus>(storeOverview.storeStatus);

  const orders = useMemo(() => kanbanOrders, []);

  return (
    <>
      <Helmet>
        <title>AutoHub — Orders Dash</title>
      </Helmet>
      <div className="flex w-full min-w-0 flex-col gap-6">
        <OrdersDashToolbar
          scheduledFilterActive={scheduledFilterActive}
          onScheduledToggle={() => setScheduledFilterActive((previous) => !previous)}
          storeStatus={storeStatus}
          onStoreStatusChange={setStoreStatus}
        />
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <OrdersKanbanBoard
            columns={orderColumns}
            orders={orders}
            scheduledFilterActive={scheduledFilterActive}
          />
        </motion.div>
      </div>
    </>
  );
}
