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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Merge root, `data`, and API sections (`general_info`, `operating_hours`, `profile_menu`)
 * so the form can read flat keys regardless of response shape.
 */
function flattenSettingsSource(raw: Record<string, unknown>): Record<string, unknown> {
  const fromData = isPlainObject(raw.data) ? (raw.data as Record<string, unknown>) : {};
  const generalInfo = isPlainObject(raw.general_info)
    ? (raw.general_info as Record<string, unknown>)
    : isPlainObject(fromData.general_info)
      ? (fromData.general_info as Record<string, unknown>)
      : {};
  const operatingHours = isPlainObject(raw.operating_hours)
    ? (raw.operating_hours as Record<string, unknown>)
    : isPlainObject(fromData.operating_hours)
      ? (fromData.operating_hours as Record<string, unknown>)
      : {};
  const profileMenu = isPlainObject(raw.profile_menu)
    ? (raw.profile_menu as Record<string, unknown>)
    : isPlainObject(fromData.profile_menu)
      ? (fromData.profile_menu as Record<string, unknown>)
      : {};
  return {
    ...fromData,
    ...profileMenu,
    ...operatingHours,
    ...generalInfo,
    ...raw,
  };
}

function specializationFromSource(src: Record<string, unknown>): string {
  const direct = src.specialization;
  if (typeof direct === 'string' && direct.trim() !== '') {
    return direct.trim();
  }
  const brands = src.specialization_brands;
  if (!Array.isArray(brands)) {
    return '';
  }
  const names: string[] = [];
  for (const item of brands) {
    if (isPlainObject(item) && typeof item.name === 'string' && item.name.trim() !== '') {
      names.push(item.name.trim());
    }
  }
  return names.join(', ');
}

export function generalFormFromSettings(
  settings: Record<string, unknown> | null,
): GeneralSettingsFormState {
  const base = emptyGeneralForm();
  if (!settings) {
    return base;
  }
  const src = flattenSettingsSource(settings);
  const pick = (key: keyof GeneralSettingsFormState, ...alts: string[]) => {
    const keys = [key, ...alts];
    for (const k of keys) {
      const v = src[k as string];
      if (v != null && String(v).trim() !== '') {
        return String(v);
      }
    }
    return '';
  };
  const lat = pick('latitude', 'lat', 'location_lat');
  const lng = pick('longitude', 'lng', 'location_lng');
  let location = pick('location');
  if (!location && lat && lng) {
    location = `${lat}, ${lng}`;
  }
  return {
    store_name: pick('store_name'),
    logo: pick('logo', 'logo_url', 'store_logo'),
    cover: pick('cover', 'cover_url', 'store_cover'),
    specialization: specializationFromSource(src),
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

/** Local preview only (object URL or legacy data URL) — not sent as a string; use multipart file instead. */
export function isLocalImagePreview(value: string): boolean {
  const t = value.trim();
  return t.startsWith('blob:') || t.startsWith('data:');
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
  if (!isLocalImagePreview(form.logo)) {
    put('logo', form.logo);
  }
  if (!isLocalImagePreview(form.cover)) {
    put('cover', form.cover);
  }
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

export function isGeneralSubmitEmpty(
  payload: Record<string, string>,
  logoFile: File | null,
  coverFile: File | null,
): boolean {
  return isGeneralPayloadEmpty(payload) && !logoFile && !coverFile;
}

/** Multipart body: text fields plus logo/cover files when the user picked new images. */
export function buildGeneralSettingsFormData(
  form: GeneralSettingsFormState,
  logoFile: File | null,
  coverFile: File | null,
): FormData {
  const fd = new FormData();
  const payload = buildGeneralSettingsPayload(form);
  for (const [key, value] of Object.entries(payload)) {
    fd.append(key, value);
  }
  if (logoFile) {
    fd.append('logo', logoFile, logoFile.name);
  }
  if (coverFile) {
    fd.append('cover', coverFile, coverFile.name);
  }
  return fd;
}

function sortDaysByWeekOrder(days: string[]): string[] {
  const order = new Map<string, number>(weekDays.map((d, i) => [d, i]));
  return [...new Set(days)].sort((a, b) => (order.get(a) ?? 99) - (order.get(b) ?? 99));
}

/** Maps API off-day strings to canonical weekday labels and sorts Mon–Sun. */
export function normalizeOffDaysFromApi(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== 'string' || item.trim() === '') {
      continue;
    }
    const match = weekDays.find((d) => d.toLowerCase() === item.toLowerCase());
    out.push(match ?? item);
  }
  return sortDaysByWeekOrder(out);
}

export function readHoursFromSettings(
  settings: Record<string, unknown> | null,
): {
  dailyFrom: string;
  dailyTo: string;
  offDays: string[];
  twentyFourHours: boolean;
} {
  if (!settings) {
    return {
      dailyFrom: '06:00',
      dailyTo: '18:00',
      offDays: ['Friday'],
      twentyFourHours: false,
    };
  }
  const src = flattenSettingsSource(settings);
  const from =
    typeof src.daily_from === 'string'
      ? src.daily_from.slice(0, 5)
      : '06:00';
  const to =
    typeof src.daily_to === 'string' ? src.daily_to.slice(0, 5) : '18:00';
  const off = src.off_days;
  const offDays = Array.isArray(off) ? normalizeOffDaysFromApi(off) : ['Friday'];
  const twentyFourHours = Boolean(src.is_24_hours);
  return { dailyFrom: from, dailyTo: to, offDays, twentyFourHours };
}
