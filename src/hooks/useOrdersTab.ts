import { useCallback, useEffect, useState } from 'react';
import type { KanbanOrder } from '@/mock/ordersDashData';
import { getOrders } from '@/services/orderService';
import {
  extractOrdersList,
  mapOrdersForActiveTab,
  type OrderListTab,
} from '@/utils/mapOrdersResponse';

export function useOrdersTab(activeTab: OrderListTab) {
  const [orders, setOrders] = useState<KanbanOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [refetchNonce, setRefetchNonce] = useState(0);

  const refetch = useCallback(() => {
    setRefetchNonce((previous) => previous + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getOrders(activeTab);
        if (cancelled) {
          return;
        }
        const list = extractOrdersList(res);
        setOrders(mapOrdersForActiveTab(list));
      } catch {
        if (!cancelled) {
          setOrders([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchOrders();
    return () => {
      cancelled = true;
    };
  }, [activeTab, refetchNonce]);

  return { orders, loading, refetch };
}
