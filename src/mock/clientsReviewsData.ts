export type RatingDistributionRow = {
  stars: number;
  count: number;
  /** Bar fill — distinct per row to match wireframe */
  barColor: string;
};

export type ClientReview = {
  id: string;
  userName: string;
  rating: number;
  dateOfRate: string;
  body: string;
};

export const reviewsSummary = {
  averageRating: 4.0,
  totalReviews: 1244,
};

export const ratingDistribution: RatingDistributionRow[] = [
  { stars: 5, count: 620, barColor: '#5eead4' },
  { stars: 4, count: 380, barColor: '#a3e635' },
  { stars: 3, count: 120, barColor: '#facc15' },
  { stars: 2, count: 45, barColor: '#fb923c' },
  { stars: 1, count: 79, barColor: '#fb7185' },
];

export const sampleReviews: ClientReview[] = [
  {
    id: 'r1',
    userName: 'Test User Name',
    rating: 4,
    dateOfRate: 'Apr 7, 2026',
    body:
      'Rate text "Sample" Rate text "Sample" Rate text "Sample" Rate text "Sample" Rate text "Sample" Rate text "Sample"',
  },
];
