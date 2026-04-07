import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import type { AnnouncementItem } from '@/mock/dashboardData';

type AnnouncementBannerProps = {
  items: AnnouncementItem[];
};

export function AnnouncementBanner({ items }: AnnouncementBannerProps) {
  return (
    <section aria-label="Announcements">
      <Card className="overflow-hidden border shadow-xs transition-shadow hover:shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">Announcement banners</h2>
            <p className="text-xs text-muted-foreground">Highlights for your customers</p>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" asChild>
            <Link to="/dashboard">
              See more
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="px-4 py-3 transition-colors hover:bg-muted/40">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.preview}</p>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
