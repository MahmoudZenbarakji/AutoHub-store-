import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Card } from '@/components/common/Card';
import { OrderDetailsPanel } from '@/components/dashboard/OrderDetailsPanel';
import { OrdersDashToolbar } from '@/components/dashboard/OrdersDashToolbar';
import { useOrderDetails } from '@/hooks/useOrderDetails';
import { storeOverview } from '@/mock/dashboardData';
import type { StoreStatus } from '@/mock/dashboardData';

export function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const [scheduledFilterActive, setScheduledFilterActive] = useState(false);
  const [storeStatus, setStoreStatus] = useState<StoreStatus>(storeOverview.storeStatus);

  const { order, loading, error, submitStatusUpdate } = useOrderDetails(orderId);

  if (!orderId) {
    return <Navigate to="/dashboard/orders" replace />;
  }

  const titleSuffix = order?.orderNumber ?? orderId;

  return (
    <>
      <Helmet>
        <title>AutoHub — Order #{titleSuffix}</title>
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
          {loading ? (
            <Card className="w-full min-w-0 overflow-hidden border shadow-xs">
              <p className="p-8 text-center text-sm text-muted-foreground">Loading…</p>
            </Card>
          ) : error ? (
            <Card className="w-full min-w-0 overflow-hidden border shadow-xs">
              <p className="p-8 text-center text-sm text-destructive" role="alert">
                {error}
              </p>
            </Card>
          ) : order ? (
            <OrderDetailsPanel
              order={order}
              onAccept={() => void submitStatusUpdate('store_accept')}
              onReject={() => void submitStatusUpdate('store_reject')}
            />
          ) : (
            <Navigate to="/dashboard/orders" replace />
          )}
        </motion.div>
      </div>
    </>
  );
}
