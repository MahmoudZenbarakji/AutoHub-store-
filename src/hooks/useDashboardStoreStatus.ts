import { useCallback, useEffect, useState } from 'react';
import type { StoreStatus } from '@/mock/dashboardData';
import { updateStoreStatus } from '@/services/dashboardService';
import type { DashboardHomePayload } from '@/utils/mapDashboardHomeData';

export function useDashboardStoreStatus(dashboardData: DashboardHomePayload | null) {
  const [isStoreOnline, setIsStoreOnline] = useState(false);

  useEffect(() => {
    if (dashboardData) {
      const online = dashboardData.current_store_status?.is_online;
      if (typeof online === 'boolean') {
        setIsStoreOnline(online);
      }
    }
  }, [dashboardData]);

  const onStoreStatusChange = useCallback(async (next: StoreStatus) => {
    const newOnline = next === 'on';
    if (newOnline === isStoreOnline) {
      return;
    }
    const previousOnline = isStoreOnline;
    try {
      setIsStoreOnline(newOnline);
      await updateStoreStatus(newOnline);
    } catch {
      setIsStoreOnline(previousOnline);
    }
  }, [isStoreOnline]);

  return { isStoreOnline, onStoreStatusChange };
}
