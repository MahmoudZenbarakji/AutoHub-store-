import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/common/Button';
import type { AnnouncementItem } from '@/mock/dashboardData';
import { cn } from '@/lib/utils';

type AnnouncementCarouselProps = {
  items: AnnouncementItem[];
  className?: string;
};

export function AnnouncementCarousel({ items, className }: AnnouncementCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = items.length;

  const go = useCallback(
    (delta: number) => {
      setIndex((previous) => (previous + delta + count) % count);
    },
    [count],
  );

  useEffect(() => {
    const id = window.setInterval(() => go(1), 8000);
    return () => window.clearInterval(id);
  }, [go]);

  const active = items[index];

  return (
    <div
      className={cn(
        'flex min-h-[280px] flex-col rounded-xl border border-border bg-card p-4 shadow-xs',
        className,
      )}
    >
      <h2 className="mb-4 text-sm font-semibold text-foreground">Announcement banners</h2>
      <div className="relative flex flex-1 flex-col">
        <div className="flex flex-1 items-stretch gap-2">
          <Button
            type="button"
            variant="outline"
            mode="icon"
            size="sm"
            className="shrink-0 self-center"
            aria-label="Previous announcement"
            onClick={() => go(-1)}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <div className="relative min-h-[160px] flex-1 overflow-hidden rounded-lg border border-border bg-muted/30 p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="flex h-full flex-col justify-center"
              >
                <p className="text-lg font-semibold text-foreground">{active.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{active.preview}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <Button
            type="button"
            variant="outline"
            mode="icon"
            size="sm"
            className="shrink-0 self-center"
            aria-label="Next announcement"
            onClick={() => go(1)}
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {items.map((item, dotIndex) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(dotIndex)}
              className={cn(
                'size-2.5 rounded-full transition-all',
                dotIndex === index
                  ? 'scale-125 bg-primary ring-2 ring-primary/30'
                  : 'bg-muted-foreground/35 hover:bg-muted-foreground/55',
              )}
              aria-label={`Go to announcement ${dotIndex + 1}`}
              aria-current={dotIndex === index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
