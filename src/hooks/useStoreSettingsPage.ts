import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import {
  getSettings,
  updateGeneralSettings,
  updateWorkingHours,
} from '@/services/settingsService';
import { getAxiosErrorMessage } from '@/utils/apiError';
import {
  buildGeneralSettingsFormData,
  buildGeneralSettingsPayload,
  emptyGeneralForm,
  generalFormFromSettings,
  isGeneralSubmitEmpty,
  normalizePayload,
  normalizeOffDaysFromApi,
  readHoursFromSettings,
  type GeneralSettingsFormState,
} from '@/utils/mapStoreSettings';

export function useStoreSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [general, setGeneral] = useState<GeneralSettingsFormState>(emptyGeneralForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const logoBlobUrlRef = useRef<string | null>(null);
  const coverBlobUrlRef = useRef<string | null>(null);
  const [dailyFrom, setDailyFrom] = useState('06:00');
  const [dailyTo, setDailyTo] = useState('18:00');
  const [offDays, setOffDays] = useState<string[]>(['Friday']);
  const [twentyFourHours, setTwentyFourHours] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [generalSuccess, setGeneralSuccess] = useState('');
  const [hoursError, setHoursError] = useState('');
  const [hoursSuccess, setHoursSuccess] = useState('');
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingHours, setSavingHours] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const raw = await getSettings();
        if (cancelled) {
          return;
        }
        const data = normalizePayload<Record<string, unknown>>(raw);
        if (data) {
          if (logoBlobUrlRef.current) {
            URL.revokeObjectURL(logoBlobUrlRef.current);
            logoBlobUrlRef.current = null;
          }
          if (coverBlobUrlRef.current) {
            URL.revokeObjectURL(coverBlobUrlRef.current);
            coverBlobUrlRef.current = null;
          }
          setLogoFile(null);
          setCoverFile(null);
          setGeneral(generalFormFromSettings(data));
          const hours = readHoursFromSettings(data);
          setDailyFrom(hours.dailyFrom);
          setDailyTo(hours.dailyTo);
          setOffDays(hours.offDays);
          setTwentyFourHours(hours.twentyFourHours);
        }
      } catch {
        // Failed to load settings; form keeps initial defaults.
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const setGeneralField = useCallback(
    (key: keyof GeneralSettingsFormState, value: string) => {
      setGeneral((previous) => ({ ...previous, [key]: value }));
      setGeneralError('');
      setGeneralSuccess('');
    },
    [],
  );

  const setStoreImage = useCallback((key: 'logo' | 'cover', file: File | null) => {
    const ref = key === 'logo' ? logoBlobUrlRef : coverBlobUrlRef;
    const setFile = key === 'logo' ? setLogoFile : setCoverFile;
    if (ref.current) {
      URL.revokeObjectURL(ref.current);
      ref.current = null;
    }
    if (file) {
      const url = URL.createObjectURL(file);
      ref.current = url;
      setGeneral((previous) => ({ ...previous, [key]: url }));
      setFile(file);
    } else {
      setGeneral((previous) => ({ ...previous, [key]: '' }));
      setFile(null);
    }
    setGeneralError('');
    setGeneralSuccess('');
  }, []);

  useEffect(() => {
    return () => {
      if (logoBlobUrlRef.current) {
        URL.revokeObjectURL(logoBlobUrlRef.current);
      }
      if (coverBlobUrlRef.current) {
        URL.revokeObjectURL(coverBlobUrlRef.current);
      }
    };
  }, []);

  const toggleOffDay = useCallback((day: string) => {
    setOffDays((previous) => {
      const next = previous.includes(day)
        ? previous.filter((d) => d !== day)
        : [...previous, day];
      return normalizeOffDaysFromApi(next);
    });
  }, []);

  const applyLocationFromMap = useCallback(
    (latitude: string, longitude: string, locationLabel: string) => {
      setGeneral((previous) => ({
        ...previous,
        latitude,
        longitude,
        location: locationLabel,
      }));
      setGeneralError('');
      setGeneralSuccess('');
    },
    [],
  );

  const handleGeneralSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setGeneralError('');
      setGeneralSuccess('');
      setSavingGeneral(true);
      try {
        const payload = buildGeneralSettingsPayload(general);
        if (isGeneralSubmitEmpty(payload, logoFile, coverFile)) {
          setGeneralError('Add at least one field with a value before saving.');
          setSavingGeneral(false);
          return;
        }
        const hasImageFiles = logoFile != null || coverFile != null;
        if (hasImageFiles) {
          const formData = buildGeneralSettingsFormData(general, logoFile, coverFile);
          await updateGeneralSettings(formData);
          const raw = await getSettings();
          const data = normalizePayload<Record<string, unknown>>(raw);
          if (data) {
            if (logoBlobUrlRef.current) {
              URL.revokeObjectURL(logoBlobUrlRef.current);
              logoBlobUrlRef.current = null;
            }
            if (coverBlobUrlRef.current) {
              URL.revokeObjectURL(coverBlobUrlRef.current);
              coverBlobUrlRef.current = null;
            }
            setLogoFile(null);
            setCoverFile(null);
            setGeneral((previous) => ({
              ...generalFormFromSettings(data),
              password: '',
            }));
          }
        } else {
          await updateGeneralSettings(payload);
          setGeneral((previous) => ({ ...previous, password: '' }));
        }
        setGeneralSuccess('Saved.');
      } catch (error) {
        setGeneralError(getAxiosErrorMessage(error));
      } finally {
        setSavingGeneral(false);
      }
    },
    [general, logoFile, coverFile],
  );

  const handleHoursSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setHoursError('');
      setHoursSuccess('');
      setSavingHours(true);
      try {
        await updateWorkingHours({
          daily_from: dailyFrom,
          daily_to: dailyTo,
          off_days: offDays,
          is_24_hours: twentyFourHours,
        });
        setHoursSuccess('Saved.');
      } catch (error) {
        setHoursError(getAxiosErrorMessage(error));
      } finally {
        setSavingHours(false);
      }
    },
    [dailyFrom, dailyTo, offDays, twentyFourHours],
  );

  return {
    loading,
    general,
    setGeneralField,
    setStoreImage,
    applyLocationFromMap,
    dailyFrom,
    setDailyFrom,
    dailyTo,
    setDailyTo,
    offDays,
    setOffDays,
    toggleOffDay,
    twentyFourHours,
    setTwentyFourHours,
    generalError,
    generalSuccess,
    hoursError,
    hoursSuccess,
    savingGeneral,
    savingHours,
    handleGeneralSubmit,
    handleHoursSubmit,
  };
}
