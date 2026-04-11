import type { ClientReview, RatingDistributionRow } from '@/mock/clientsReviewsData';

const DISTRIBUTION_COLORS: Record<number, string> = {
  5: '#5eead4',
  4: '#a3e635',
  3: '#facc15',
  2: '#fb923c',
  1: '#fb7185',
};

function extractReviewsArray(payload: unknown): unknown[] {
  if (payload == null) {
    return [];
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  if (typeof payload !== 'object') {
    return [];
  }
  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.data)) {
    return record.data;
  }
  if (Array.isArray(record.reviews)) {
    return record.reviews;
  }
  const inner = record.data;
  if (inner != null && typeof inner === 'object' && !Array.isArray(inner)) {
    const d = inner as Record<string, unknown>;
    if (Array.isArray(d.reviews)) {
      return d.reviews;
    }
  }
  return [];
}

function formatReviewDate(value: unknown): string {
  if (value == null || value === '') {
    return '—';
  }
  const d = new Date(String(value));
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  return String(value);
}

export function mapReviewItem(item: unknown, index: number): ClientReview {
  const o = item != null && typeof item === 'object' ? (item as Record<string, unknown>) : {};
  const id = o.id ?? o.review_id ?? index;
  const rating = Number(o.rating ?? o.stars ?? o.score ?? 0);
  return {
    id: String(id),
    userName: String(
      (o.user_name ??
        o.customer_name ??
        o.name ??
        (o.user != null && typeof o.user === 'object'
          ? String((o.user as Record<string, unknown>).name ?? '')
          : '')) ||
        '—',
    ),
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : 0,
    dateOfRate: formatReviewDate(o.created_at ?? o.date ?? o.date_of_rate),
    body: String(o.comment ?? o.body ?? o.review ?? o.text ?? ''),
  };
}

function countStarsFromReviews(reviews: ClientReview[]): RatingDistributionRow[] {
  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviews) {
    const s = Math.round(r.rating);
    if (s >= 1 && s <= 5) {
      counts[s] = (counts[s] ?? 0) + 1;
    }
  }
  return [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: counts[stars] ?? 0,
    barColor: DISTRIBUTION_COLORS[stars] ?? '#94a3b8',
  }));
}

function distributionFromApi(raw: unknown): RatingDistributionRow[] | null {
  if (raw == null) {
    return null;
  }
  if (Array.isArray(raw)) {
    const rows: RatingDistributionRow[] = [];
    for (const entry of raw) {
      if (entry != null && typeof entry === 'object') {
        const e = entry as Record<string, unknown>;
        const stars = Number(e.stars ?? e.star ?? e.rating ?? 0);
        const count = Number(e.count ?? e.total ?? 0);
        if (stars >= 1 && stars <= 5) {
          rows.push({
            stars,
            count: Number.isFinite(count) ? count : 0,
            barColor: DISTRIBUTION_COLORS[stars] ?? '#94a3b8',
          });
        }
      }
    }
    return rows.length > 0 ? rows : null;
  }
  if (typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    const rows: RatingDistributionRow[] = [];
    for (let stars = 5; stars >= 1; stars--) {
      const v = o[String(stars)] ?? o[`star_${stars}`];
      if (v != null) {
        rows.push({
          stars,
          count: Number(v) || 0,
          barColor: DISTRIBUTION_COLORS[stars] ?? '#94a3b8',
        });
      }
    }
    return rows.length > 0 ? rows : null;
  }
  return null;
}

export type ReviewsViewModel = {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistributionRow[];
  reviews: ClientReview[];
};

export function mapReviewsPayload(payload: unknown): ReviewsViewModel {
  const root = payload != null && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
  const data = root.data != null && typeof root.data === 'object' ? (root.data as Record<string, unknown>) : root;

  const listRaw = extractReviewsArray(payload);
  const reviews = listRaw.map((item, i) => mapReviewItem(item, i));

  const avgRaw = data.average_rating ?? data.averageRating ?? root.average_rating ?? root.averageRating;
  const totalRaw = data.total_reviews ?? data.totalReviews ?? root.total_reviews ?? root.totalReviews;

  let averageRating = Number(avgRaw);
  if (!Number.isFinite(averageRating) && reviews.length > 0) {
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    averageRating = sum / reviews.length;
  }
  if (!Number.isFinite(averageRating)) {
    averageRating = 0;
  }

  let totalReviews = Number(totalRaw);
  if (!Number.isFinite(totalReviews)) {
    totalReviews = reviews.length;
  }

  const distRaw =
    data.rating_distribution ??
    data.ratingDistribution ??
    data.distribution ??
    root.rating_distribution;
  const fromApi = distributionFromApi(distRaw);
  const ratingDistribution = fromApi ?? countStarsFromReviews(reviews);

  return {
    averageRating: Math.min(5, Math.max(0, averageRating)),
    totalReviews,
    ratingDistribution,
    reviews,
  };
}
