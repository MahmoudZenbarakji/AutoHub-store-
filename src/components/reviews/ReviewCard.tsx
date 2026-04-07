import { UserRound } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { StarRatingDisplay } from '@/components/reviews/StarRatingDisplay';
import type { ClientReview } from '@/mock/clientsReviewsData';

type ReviewCardProps = {
  review: ClientReview;
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="border p-4 shadow-xs sm:p-5">
      <div className="mb-4 flex flex-wrap items-start gap-3 sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted/50">
            <UserRound className="size-5 text-muted-foreground" aria-hidden />
          </div>
          <span className="truncate font-medium text-foreground">{review.userName}</span>
          <StarRatingDisplay value={review.rating} size="sm" />
        </div>
        <div className="text-end text-sm sm:shrink-0">
          <span className="block text-xs text-muted-foreground">Date of Rate</span>
          <span className="text-foreground">{review.dateOfRate}</span>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="min-h-[100px] rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-foreground">
          {review.body}
        </div>
        <div className="flex min-h-[100px] items-center justify-center rounded-lg border border-border bg-muted/20 p-4 text-center text-sm font-medium text-foreground">
          Products in this order
        </div>
      </div>
    </Card>
  );
}
