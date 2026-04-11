const STORAGE_KEY = 'app_language';

export function getStoredLanguage(): string | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage.getItem(STORAGE_KEY);
}

export function persistLanguage(lang: string) {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, lang);
}

export function applyLanguageToDocument(lang: string) {
  if (typeof document === 'undefined') {
    return;
  }
  const root = document.documentElement;
  const code = lang === 'ar' ? 'ar' : 'en';
  root.lang = code;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
}
