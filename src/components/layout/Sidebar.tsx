import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Package,
  Settings,
  ShoppingCart,
  Star,
} from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/mock/dashboardData';

const iconMap: Record<string, typeof ShoppingCart> = {
  orders: ShoppingCart,
  reports: BarChart3,
  stock: Package,
  reviews: Star,
  settings: Settings,
};

type SidebarProps = {
  items: NavItem[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({
  items,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={cn(
          'fixed top-0 z-50 flex h-full flex-col border-r border-border bg-card transition-[width,transform] duration-200 ease-out md:static',
          collapsed ? 'w-[4.25rem]' : 'w-60',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div
          className={cn(
            'flex h-14 shrink-0 items-center border-b border-border px-3',
            collapsed ? 'justify-center' : 'justify-between gap-2',
          )}
        >
          <div className={cn('flex min-w-0 items-center gap-2', collapsed && 'justify-center')}>
            <NavLink
              to="/dashboard"
              end
              className="flex min-w-0 shrink-0 items-center outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="SparesHub home"
            >
              <BrandLogo variant={collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} />
            </NavLink>
          </div>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground md:inline-flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2" aria-label="Main">
          {items.map((item) => {
            const Icon = iconMap[item.id] ?? ShoppingCart;
            return (
              <NavLink
                key={item.id}
                to={item.href}
                end={
                  item.id !== 'orders' &&
                  item.id !== 'stock' &&
                  item.id !== 'reviews' &&
                  item.id !== 'settings'
                }
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                    collapsed && 'justify-center px-0',
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="size-[18px] shrink-0 opacity-90 group-hover:opacity-100" />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-border p-2">
          <a
            href="mailto:support@autohub.example"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
              collapsed && 'justify-center px-0',
            )}
            title={collapsed ? 'Need support?' : undefined}
          >
            <Headphones className="size-[18px] shrink-0" />
            {!collapsed ? 'Need support?' : null}
          </a>
        </div>
      </aside>
    </>
  );
}
