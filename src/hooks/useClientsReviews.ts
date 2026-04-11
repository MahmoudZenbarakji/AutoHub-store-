import { useEffect, useState } from 'react';
import { getReviews } from '@/services/reportService';
import { getAxiosErrorMessage } from '@/utils/apiError';
import { mapReviewsPayload, type ReviewsViewModel } from '@/utils/mapReviewsResponse';

export function useClientsReviews() {
  const [data, setData] = useState<ReviewsViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getReviews();
        if (cancelled) {
          return;
        }
        setData(mapReviewsPayload(res));
      } catch (err) {
        if (!cancelled) {
          setData(null);
          setError(getAxiosErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
