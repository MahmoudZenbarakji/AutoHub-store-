import { Helmet } from 'react-helmet-async';
import { UserRound } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '@/components/common/Card';
import { RatingDistributionChart } from '@/components/reviews/RatingDistributionChart';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { StarRatingDisplay } from '@/components/reviews/StarRatingDisplay';
import {
  ratingDistribution,
  reviewsSummary,
  sampleReviews,
} from '@/mock/clientsReviewsData';

export function ClientsReviews() {
  return (
    <>
      <Helmet>
        <title>AutoHub — Clients reviews</title>
      </Helmet>
      <div className="flex w-full min-w-0 flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="w-full min-w-0 border p-4 shadow-xs sm:p-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm font-medium text-foreground">Reviews</p>
                <p className="text-5xl font-semibold tabular-nums tracking-tight text-foreground sm:text-6xl">
                  {reviewsSummary.averageRating.toFixed(1)}
                </p>
                <StarRatingDisplay value={reviewsSummary.averageRating} size="lg" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserRound className="size-4" aria-hidden />
                  <span>{reviewsSummary.totalReviews.toLocaleString()} review</span>
                </div>
              </div>
              <div className="min-w-0">
                <RatingDistributionChart data={ratingDistribution} />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          {sampleReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </motion.div>
      </div>
    </>
  );
}
