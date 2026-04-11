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
