import { useEffect, useState } from 'react';
import { getSupport } from '@/services/settingsService';
import { getAxiosErrorMessage } from '@/utils/apiError';
import { normalizePayload } from '@/utils/mapStoreSettings';

export function useSupportPage() {
  const [supportData, setSupportData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function fetchSupport() {
      try {
        setLoading(true);
        const raw = await getSupport();
        if (cancelled) {
          return;
        }
        const data = normalizePayload<Record<string, unknown>>(raw);
        setSupportData(data ?? (typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : null));
      } catch (err) {
        if (!cancelled) {
          setError(getAxiosErrorMessage(err));
          setSupportData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void fetchSupport();
    return () => {
      cancelled = true;
    };
  }, []);

  return { supportData, loading, error };
}
