import { Globe, Info, LogOut, UserRound } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type ProfileDropdownProps = {
  className?: string;
};

export function ProfileDropdown({ className }: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted/80 text-[10px] font-semibold uppercase tracking-wide text-foreground shadow-sm transition hover:bg-muted',
            className,
          )}
          aria-label="Open profile menu"
        >
          Logo
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <DropdownMenuItem className="gap-2">
          <UserRound className="size-4" />
          Profile management
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Globe className="size-4" />
          Language
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Info className="size-4" />
          About App
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" className="gap-2">
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
