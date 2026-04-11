import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { OrderDetailFull } from '@/mock/orderDetailsData';
import { getOrderById, updateOrderStatus } from '@/services/orderService';
import { getAxiosErrorMessage } from '@/utils/apiError';
import { mapApiOrderDetailToViewModel } from '@/utils/mapOrderDetailResponse';

export function useOrderDetails(orderId: string | undefined) {
  const [order, setOrder] = useState<OrderDetailFull | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchNonce, setRefetchNonce] = useState(0);

  const refetch = useCallback(() => {
    setRefetchNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getOrderById(orderId);
        if (cancelled) {
          return;
        }
        const mapped = mapApiOrderDetailToViewModel(res, orderId);
        setOrder(mapped);
      } catch (err) {
        if (!cancelled) {
          setOrder(null);
          setError(getAxiosErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId, refetchNonce]);

  const submitStatusUpdate = useCallback(
    async (status: string): Promise<boolean> => {
      if (!orderId) {
        return false;
      }
      try {
        await updateOrderStatus(orderId, status);
        refetch();
        return true;
      } catch (err) {
        toast.error(getAxiosErrorMessage(err));
        return false;
      }
    },
    [orderId, refetch],
  );

  return { order, loading, error, refetch, submitStatusUpdate };
}
