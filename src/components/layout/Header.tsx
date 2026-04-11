import { Menu } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { ProfileDropdown } from '@/components/layout/ProfileDropdown';
import { cn } from '@/lib/utils';

type HeaderProps = {
  onOpenMobileSidebar: () => void;
};

function getHeaderTitle(pathname: string): string {
  if (/^\/dashboard\/orders\/[^/]+$/.test(pathname)) {
    return 'Order Details';
  }
  if (pathname === '/dashboard/orders') {
    return 'Orders Dash';
  }
  if (pathname === '/dashboard/reports-hub') {
    return 'Reports Hub';
  }
  if (pathname.startsWith('/dashboard/stock-management')) {
    return 'Stock Management';
  }
  if (pathname === '/dashboard/clients-reviews') {
    return 'Clients reviews';
  }
  if (pathname === '/dashboard/store-settings') {
    return 'Store Settings';
  }
  if (pathname === '/dashboard/support') {
    return 'Support';
  }
  if (pathname === '/dashboard/about') {
    return 'About';
  }
  return 'Home page';
}

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const title = getHeaderTitle(pathname);
  const isReportsHub = pathname === '/dashboard/reports-hub';
  const isClientsReviews = pathname === '/dashboard/clients-reviews';
  const isStoreSettings = pathname === '/dashboard/store-settings';

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <div className="flex min-w-0 items-center gap-2 justify-self-start">
          <Button
            type="button"
            variant="ghost"
            mode="icon"
            shape="circle"
            className="md:hidden"
            onClick={onOpenMobileSidebar}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              cn(
                'rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )
            }
          >
            Home
          </NavLink>
        </div>

        <h1
          className={cn(
            'col-start-2 min-w-0 justify-self-center truncate text-center text-xs font-medium sm:text-sm md:text-base',
            isReportsHub || isClientsReviews
              ? 'text-emerald-600 dark:text-emerald-500'
              : 'text-foreground',
          )}
        >
          {title}
        </h1>

        <div className="col-start-3 flex min-w-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          {isStoreSettings ? (
            <>
              <Button type="button" variant="outline" size="sm">
                Discard
              </Button>
              <Button type="button" variant="primary" size="sm">
                Save
              </Button>
            </>
          ) : null}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
