import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';

const LOGO_LIGHT = '/media/G_SLogo-01-02.png';
const LOGO_DARK = '/media/P_SLogo-02.png';
/** Square mark when the sidebar rail is collapsed */
const LOGO_SIDEBAR_COLLAPSED = '/media/P_SLogo-01.png';

export type BrandLogoProps = {
  /** Wide logo in expanded sidebar */
  variant?: 'sidebar-expanded' | 'sidebar-collapsed' | 'mark';
  className?: string;
};

export function BrandLogo({ variant = 'mark', className }: BrandLogoProps) {
  const light = toAbsoluteUrl(LOGO_LIGHT);
  const dark = toAbsoluteUrl(LOGO_DARK);
  const collapsedSrc = toAbsoluteUrl(LOGO_SIDEBAR_COLLAPSED);

  const sizeClass =
    variant === 'sidebar-expanded'
      ? 'h-10 w-auto max-w-[200px] object-contain object-left'
      : variant === 'sidebar-collapsed'
        ? 'size-5 shrink-0 object-contain object-center'
        : 'h-7 w-auto max-w-[5.5rem] object-contain';

  if (variant === 'sidebar-collapsed') {
    return (
      <img
        src={collapsedSrc}
        alt="SparesHub"
        className={cn(sizeClass, className)}
      />
    );
  }

  return (
    <>
      <img
        src={light}
        alt="SparesHub"
        className={cn(sizeClass, 'dark:hidden', className)}
      />
      <img
        src={dark}
        alt=""
        aria-hidden
        className={cn(sizeClass, 'hidden dark:block', className)}
      />
    </>
  );
}
