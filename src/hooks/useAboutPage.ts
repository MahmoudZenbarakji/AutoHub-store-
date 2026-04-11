import { useEffect, useState } from 'react';
import { getAbout } from '@/services/settingsService';
import { getAxiosErrorMessage } from '@/utils/apiError';
import { normalizePayload } from '@/utils/mapStoreSettings';

export function useAboutPage() {
  const [aboutData, setAboutData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function fetchAbout() {
      try {
        setLoading(true);
        const raw = await getAbout();
        if (cancelled) {
          return;
        }
        const data = normalizePayload<Record<string, unknown>>(raw);
        setAboutData(data ?? (typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : null));
      } catch (err) {
        if (!cancelled) {
          setError(getAxiosErrorMessage(err));
          setAboutData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void fetchAbout();
    return () => {
      cancelled = true;
    };
  }, []);

  return { aboutData, loading, error };
}
