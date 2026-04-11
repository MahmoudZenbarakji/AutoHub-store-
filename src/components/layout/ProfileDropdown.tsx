import { Globe, Info, LogOut, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguageChange } from '@/hooks/useLanguageChange';
import { useLogout } from '@/hooks/useLogout';
import { cn } from '@/lib/utils';

type ProfileDropdownProps = {
  className?: string;
};

export function ProfileDropdown({ className }: ProfileDropdownProps) {
  const navigate = useNavigate();
  const { performLogout, loggingOut } = useLogout();
  const { selectLanguage, pending: languagePending, currentLanguage } = useLanguageChange();

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
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="size-4" />
          Language
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={currentLanguage}
          onValueChange={(value) => {
            void selectLanguage(value);
          }}
        >
          <DropdownMenuRadioItem value="en" disabled={languagePending}>
            English
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ar" disabled={languagePending}>
            العربية
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuItem
          className="gap-2"
          onSelect={() => {
            navigate('/dashboard/support');
          }}
        >
          Support
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2"
          onSelect={() => {
            navigate('/dashboard/about');
          }}
        >
          <Info className="size-4" />
          About App
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="gap-2"
          disabled={loggingOut}
          onSelect={() => {
            void performLogout();
          }}
        >
          <LogOut className="size-4" />
          {loggingOut ? 'Signing out…' : 'Log out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
