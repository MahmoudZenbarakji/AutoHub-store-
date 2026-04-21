import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StockGuidePhase = 'home' | 'parent' | 'sub' | 'product';

type StockFlowGuideProps = {
  phase: StockGuidePhase;
  parentName?: string;
  subName?: string;
  productName?: string;
  className?: string;
};

const hints: Record<StockGuidePhase, string> = {
  home:
    'Click a parent in the tree, or use Add Parent Category. You will open a sub-category next, then products.',
  parent:
    'Open a sub-category under this parent, or use + Add Sub. Then pick a product or add one.',
  sub: 'Select a product in the tree, or use Add product. Then edit details on the right.',
  product: 'Update fields as needed, then Save changes or Delete product.',
};

type Segment = { key: string; level: string; name?: string; state: 'done' | 'current' | 'upcoming' };

function segmentsForPhase(
  phase: StockGuidePhase,
  parentName?: string,
  subName?: string,
  productName?: string,
): Segment[] {
  const p = parentName?.trim();
  const s = subName?.trim();
  const pr = productName?.trim();

  const levels: Segment[] = [
    { key: 'cat', level: 'Categories', state: 'upcoming' },
    { key: 'par', level: 'Parent', name: p, state: 'upcoming' },
    { key: 'sub', level: 'Sub', name: s, state: 'upcoming' },
    { key: 'prod', level: 'Product', name: pr, state: 'upcoming' },
  ];

  if (phase === 'home') {
    levels[0].state = 'current';
    return levels;
  }
  if (phase === 'parent') {
    levels[0].state = 'done';
    levels[1].state = 'current';
    return levels;
  }
  if (phase === 'sub') {
    levels[0].state = 'done';
    levels[1].state = 'done';
    levels[2].state = 'current';
    return levels;
  }
  levels[0].state = 'done';
  levels[1].state = 'done';
  levels[2].state = 'done';
  levels[3].state = 'current';
  return levels;
}

export function StockFlowGuide({
  phase,
  parentName,
  subName,
  productName,
  className,
}: StockFlowGuideProps) {
  const segments = segmentsForPhase(phase, parentName, subName, productName);

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card px-4 py-3 shadow-xs sm:px-5 sm:py-4',
        className,
      )}
    >
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Stock structure
      </p>
      <nav
        className="mb-3 flex flex-wrap items-center gap-x-1 gap-y-1 text-sm"
        aria-label="Category path"
      >
        {segments.map((seg, index) => (
          <div key={seg.key} className="flex min-w-0 flex-wrap items-center gap-x-1">
            {index > 0 ? (
              <ChevronRight className="size-4 shrink-0 text-muted-foreground/80" aria-hidden />
            ) : null}
            <span
              className={cn(
                'inline-flex min-w-0 max-w-full items-baseline gap-1.5 rounded-md px-2 py-1',
                seg.state === 'current' &&
                  'bg-primary/12 font-semibold text-foreground ring-1 ring-primary/25',
                seg.state === 'done' && 'bg-muted/80 text-foreground',
                seg.state === 'upcoming' && 'text-muted-foreground',
              )}
              aria-current={seg.state === 'current' ? 'step' : undefined}
            >
              <span className="shrink-0">{seg.level}</span>
              {seg.name ? (
                <span className="truncate font-medium text-foreground/90" title={seg.name}>
                  · {seg.name}
                </span>
              ) : null}
            </span>
          </div>
        ))}
      </nav>
      <div className="border-t border-border pt-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Next: </span>
          {hints[phase]}
        </p>
      </div>
    </div>
  );
}
