import { ArrowBigRight, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StockGuidePhase = 'home' | 'parent' | 'sub' | 'product';

type StockFlowGuideProps = {
  phase: StockGuidePhase;
  className?: string;
};

const steps: { id: StockGuidePhase; label: string }[] = [
  { id: 'home', label: 'Categories' },
  { id: 'parent', label: 'Parent' },
  { id: 'sub', label: 'Sub' },
  { id: 'product', label: 'Product' },
];

const hints: Record<StockGuidePhase, string> = {
  home:
    'Click a parent row in the tree (e.g. Parent n), or use Add Parent Category. Follow the blue arrows in the steps above.',
  parent:
    'Open a sub-category under this parent, or use + Add Sub. Then pick a product or add one.',
  sub: 'Select a product in the tree, or use Add product to create one. Then edit details on the right.',
  product: 'Update fields as needed, then use Update product or Delete product at the bottom.',
};

export function StockFlowGuide({ phase, className }: StockFlowGuideProps) {
  const activeIndex = steps.findIndex((s) => s.id === phase);

  return (
    <div
      className={cn(
        'rounded-lg border border-blue-500/30 bg-blue-500/5 px-3 py-3 sm:px-4',
        className,
      )}
    >
      <div className="mb-2 flex flex-wrap items-center justify-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-400 sm:gap-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-1">
            {index > 0 ? (
              <ChevronRight className="size-4 shrink-0 text-blue-500" aria-hidden />
            ) : null}
            <span
              className={cn(
                'rounded-md px-2 py-1',
                index <= activeIndex
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-3 text-sm text-foreground">
        <ArrowBigRight
          className="size-8 shrink-0 rotate-[-25deg] text-blue-500 dark:text-blue-400"
          aria-hidden
        />
        <p className="min-w-0 leading-snug text-muted-foreground">
          <span className="font-medium text-blue-600 dark:text-blue-400">Next: </span>
          {hints[phase]}
        </p>
      </div>
    </div>
  );
}
