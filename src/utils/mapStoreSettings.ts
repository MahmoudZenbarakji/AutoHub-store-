import { weekDays } from '@/mock/storeSettingsData';

export type GeneralSettingsFormState = {
  store_name: string;
  logo: string;
  cover: string;
  specialization: string;
  location: string;
  latitude: string;
  longitude: string;
  address_details: string;
  store_description: string;
  contact_email: string;
  contact_phone: string;
  password: string;
};

export const emptyGeneralForm = (): GeneralSettingsFormState => ({
  store_name: '',
  logo: '',
  cover: '',
  specialization: '',
  location: '',
  latitude: '',
  longitude: '',
  address_details: '',
  store_description: '',
  contact_email: '',
  contact_phone: '',
  password: '',
});

export function normalizePayload<T extends Record<string, unknown>>(
  raw: unknown,
): T | null {
  if (raw == null || typeof raw !== 'object') {
    return null;
  }
  const record = raw as Record<string, unknown>;
  const inner = record.data;
  if (inner != null && typeof inner === 'object' && !Array.isArray(inner)) {
    return inner as T;
  }
  return record as T;
}

/** Merge root and nested `data` so values from either shape are picked up. */
function flattenSettingsSource(raw: Record<string, unknown>): Record<string, unknown> {
  const nested = raw.data;
  const fromData =
    nested != null && typeof nested === 'object' && !Array.isArray(nested)
      ? (nested as Record<string, unknown>)
      : {};
  return { ...fromData, ...raw };
}

export function generalFormFromSettings(
  settings: Record<string, unknown> | null,
): GeneralSettingsFormState {
  const base = emptyGeneralForm();
  if (!settings) {
    return base;
  }
  const src = flattenSettingsSource(settings);
  const pick = (key: keyof GeneralSettingsFormState, alt?: string) => {
    const v = src[key] ?? (alt ? src[alt] : undefined);
    return v != null && String(v).trim() !== '' ? String(v) : '';
  };
  const lat = pick('latitude', 'lat');
  const lng = pick('longitude', 'lng');
  let location = pick('location');
  if (!location && lat && lng) {
    location = `${lat}, ${lng}`;
  }
  return {
    store_name: pick('store_name'),
    logo: pick('logo', 'logo_url'),
    cover: pick('cover', 'cover_url'),
    specialization: pick('specialization'),
    location,
    latitude: lat,
    longitude: lng,
    address_details: pick('address_details', 'address'),
    store_description: pick('store_description', 'bio'),
    contact_email: pick('contact_email'),
    contact_phone: pick('contact_phone', 'phone'),
    password: '',
  };
}

/** Only non-empty values are sent so users can update a single field without clearing others server-side. */
export function buildGeneralSettingsPayload(form: GeneralSettingsFormState): Record<string, string> {
  const payload: Record<string, string> = {};
  const put = (key: string, value: string) => {
    const t = value.trim();
    if (t.length > 0) {
      payload[key] = t;
    }
  };
  put('store_name', form.store_name);
  put('logo', form.logo);
  put('cover', form.cover);
  put('specialization', form.specialization);
  put('location', form.location);
  put('latitude', form.latitude);
  put('longitude', form.longitude);
  put('address_details', form.address_details);
  put('store_description', form.store_description);
  put('contact_email', form.contact_email);
  put('contact_phone', form.contact_phone);
  const pw = form.password.trim();
  if (pw.length > 0) {
    payload.password = pw;
  }
  return payload;
}

export function isGeneralPayloadEmpty(payload: Record<string, string>): boolean {
  return Object.keys(payload).length === 0;
}

export function readHoursFromSettings(
  settings: Record<string, unknown> | null,
): {
  dailyFrom: string;
  dailyTo: string;
  offDay: string;
  twentyFourHours: boolean;
} {
  if (!settings) {
    return {
      dailyFrom: '06:00',
      dailyTo: '18:00',
      offDay: 'Friday',
      twentyFourHours: false,
    };
  }
  const from =
    typeof settings.daily_from === 'string'
      ? settings.daily_from.slice(0, 5)
      : '06:00';
  const to =
    typeof settings.daily_to === 'string' ? settings.daily_to.slice(0, 5) : '18:00';
  const off = settings.off_days;
  let offDay = 'Friday';
  if (Array.isArray(off) && off.length > 0 && typeof off[0] === 'string') {
    const raw = off[0];
    const match = weekDays.find((d) => d.toLowerCase() === raw.toLowerCase());
    offDay = match ?? raw;
  }
  const twentyFourHours = Boolean(settings.is_24_hours);
  return { dailyFrom: from, dailyTo: to, offDay, twentyFourHours };
}
