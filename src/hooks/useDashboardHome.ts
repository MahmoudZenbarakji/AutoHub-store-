import { useEffect, useState } from 'react';
import { getDashboardHome } from '@/services/dashboardService';
import type { DashboardHomePayload } from '@/utils/mapDashboardHomeData';
import { parseDashboardHomeResponse } from '@/utils/mapDashboardHomeData';

export function useDashboardHome() {
  const [dashboardData, setDashboardData] = useState<DashboardHomePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getDashboardHome();
        if (cancelled) {
          return;
        }
        const parsed = parseDashboardHomeResponse(res);
        setDashboardData(parsed);
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  return { dashboardData, loading, error };
}
