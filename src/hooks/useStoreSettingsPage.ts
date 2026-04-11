import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  getSettings,
  updateGeneralSettings,
  updateWorkingHours,
} from '@/services/settingsService';
import { getAxiosErrorMessage } from '@/utils/apiError';
import {
  buildGeneralSettingsPayload,
  emptyGeneralForm,
  generalFormFromSettings,
  isGeneralPayloadEmpty,
  normalizePayload,
  readHoursFromSettings,
  type GeneralSettingsFormState,
} from '@/utils/mapStoreSettings';

export function useStoreSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [general, setGeneral] = useState<GeneralSettingsFormState>(emptyGeneralForm);
  const [dailyFrom, setDailyFrom] = useState('06:00');
  const [dailyTo, setDailyTo] = useState('18:00');
  const [offDay, setOffDay] = useState('Friday');
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
          setGeneral(generalFormFromSettings(data));
          const hours = readHoursFromSettings(data);
          setDailyFrom(hours.dailyFrom);
          setDailyTo(hours.dailyTo);
          setOffDay(hours.offDay);
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
        if (isGeneralPayloadEmpty(payload)) {
          setGeneralError('Add at least one field with a value before saving.');
          setSavingGeneral(false);
          return;
        }
        await updateGeneralSettings(payload);
        setGeneralSuccess('Saved.');
        setGeneral((previous) => ({ ...previous, password: '' }));
      } catch (error) {
        setGeneralError(getAxiosErrorMessage(error));
      } finally {
        setSavingGeneral(false);
      }
    },
    [general],
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
          off_days: [offDay],
          is_24_hours: twentyFourHours,
        });
        setHoursSuccess('Saved.');
      } catch (error) {
        setHoursError(getAxiosErrorMessage(error));
      } finally {
        setSavingHours(false);
      }
    },
    [dailyFrom, dailyTo, offDay, twentyFourHours],
  );

  return {
    loading,
    general,
    setGeneralField,
    applyLocationFromMap,
    dailyFrom,
    setDailyFrom,
    dailyTo,
    setDailyTo,
    offDay,
    setOffDay,
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
