import { Helmet } from 'react-helmet-async';
import { UserRound } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '@/components/common/Card';
import { RatingDistributionChart } from '@/components/reviews/RatingDistributionChart';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { StarRatingDisplay } from '@/components/reviews/StarRatingDisplay';
import { useClientsReviews } from '@/hooks/useClientsReviews';

export function ClientsReviews() {
  const { data, loading, error } = useClientsReviews();

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
            {loading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
            ) : error ? (
              <p className="py-8 text-center text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : data ? (
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <p className="text-sm font-medium text-foreground">Reviews</p>
                  <p className="text-5xl font-semibold tabular-nums tracking-tight text-foreground sm:text-6xl">
                    {data.averageRating.toFixed(1)}
                  </p>
                  <StarRatingDisplay value={data.averageRating} size="lg" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserRound className="size-4" aria-hidden />
                    <span>{data.totalReviews.toLocaleString()} review</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <RatingDistributionChart data={data.ratingDistribution} />
                </div>
              </div>
            ) : null}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          {loading || error ? null : data && data.reviews.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">No reviews yet.</p>
          ) : (
            data?.reviews.map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </motion.div>
      </div>
    </>
  );
}
