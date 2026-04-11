/** Keep key/value pairs suitable for display (non-null, non-empty strings, non-empty arrays/objects). */
export function filterRecordToNonEmptyEntries(
  data: Record<string, unknown> | null,
): [string, unknown][] {
  if (!data || typeof data !== 'object') {
    return [];
  }
  return Object.entries(data).filter(([, value]) => valueHasRenderableContent(value));
}

function valueHasRenderableContent(value: unknown): boolean {
  if (value == null) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>).length > 0;
  }
  return true;
}
