import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import { changeLanguage } from '@/services/settingsService';
import { getAxiosErrorMessage } from '@/utils/apiError';
import {
  applyLanguageToDocument,
  getStoredLanguage,
  persistLanguage,
} from '@/utils/language';

function readInitialLanguage(): 'en' | 'ar' {
  const stored = getStoredLanguage();
  if (stored === 'ar' || stored === 'en') {
    return stored;
  }
  return 'en';
}

type LanguageContextValue = {
  currentLanguage: 'en' | 'ar';
  selectLanguage: (lang: string) => Promise<void>;
  pending: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>(readInitialLanguage);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    applyLanguageToDocument(currentLanguage);
  }, [currentLanguage]);

  const selectLanguage = useCallback(async (lang: string) => {
    const next: 'en' | 'ar' = lang === 'ar' ? 'ar' : 'en';
    setPending(true);
    try {
      await changeLanguage(next);
      persistLanguage(next);
      setCurrentLanguage(next);
      applyLanguageToDocument(next);
      toast.success('Language updated');
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    } finally {
      setPending(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      currentLanguage,
      selectLanguage,
      pending,
    }),
    [currentLanguage, selectLanguage, pending],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
