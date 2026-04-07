export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-8 animate-pulse" aria-hidden>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-0 rounded-xl border border-border bg-card p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex justify-between gap-4 border-b border-border py-3 last:border-b-0"
            >
              <div className="h-4 w-40 rounded bg-muted" />
              <div className="h-4 w-16 rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="min-h-[280px] rounded-xl border border-border bg-card p-4">
          <div className="mb-4 h-4 w-40 rounded bg-muted" />
          <div className="h-40 rounded-lg bg-muted/60" />
          <div className="mt-4 flex justify-center gap-2">
            <div className="size-2.5 rounded-full bg-muted" />
            <div className="size-2.5 rounded-full bg-muted" />
            <div className="size-2.5 rounded-full bg-muted" />
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[280px] rounded-xl border border-border bg-card p-4">
          <div className="mb-4 h-4 w-48 rounded bg-muted" />
          <div className="h-[200px] rounded-lg bg-muted/50" />
        </div>
        <div className="h-[280px] rounded-xl border border-border bg-card p-4">
          <div className="mb-4 h-4 w-56 rounded bg-muted" />
          <div className="h-[200px] rounded-lg bg-muted/50" />
        </div>
      </div>
    </div>
  );
}
