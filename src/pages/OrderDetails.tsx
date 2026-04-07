import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { OrderDetailsPanel } from '@/components/dashboard/OrderDetailsPanel';
import { OrdersDashToolbar } from '@/components/dashboard/OrdersDashToolbar';
import { getOrderDetail } from '@/mock/orderDetailsData';
import { storeOverview } from '@/mock/dashboardData';
import type { StoreStatus } from '@/mock/dashboardData';

export function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const [scheduledFilterActive, setScheduledFilterActive] = useState(false);
  const [storeStatus, setStoreStatus] = useState<StoreStatus>(storeOverview.storeStatus);

  const order = useMemo(() => getOrderDetail(orderId), [orderId]);

  if (!order) {
    return <Navigate to="/dashboard/orders" replace />;
  }

  return (
    <>
      <Helmet>
        <title>AutoHub — Order #{order.orderNumber}</title>
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
          <OrderDetailsPanel
            order={order}
            onAccept={() => undefined}
            onReject={() => undefined}
          />
        </motion.div>
      </div>
    </>
  );
}
