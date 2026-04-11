import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Card } from '@/components/common/Card';
import { useAboutPage } from '@/hooks/useAboutPage';
import { filterRecordToNonEmptyEntries } from '@/utils/filterRecordEntries';
import { cn } from '@/lib/utils';

function renderEntries(data: Record<string, unknown> | null) {
  const entries = filterRecordToNonEmptyEntries(data);
  if (entries.length === 0) {
    return <p className="text-center text-sm text-muted-foreground">No about content available yet.</p>;
  }
  return entries.map(([key, value]) => (
    <div key={key} className="border-b border-border py-3 last:border-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{key}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{formatValue(value)}</p>
    </div>
  ));
}

function formatValue(value: unknown): string {
  if (value == null) {
    return '—';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

export function About() {
  const { aboutData, loading, error } = useAboutPage();

  return (
    <>
      <Helmet>
        <title>AutoHub — About</title>
      </Helmet>
      <div className="flex w-full min-w-0 flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="mx-auto w-full max-w-2xl border p-8 shadow-xs sm:p-10">
            {loading ? (
              <p className="text-center text-sm text-muted-foreground">Loading…</p>
            ) : error ? (
              <p className="text-center text-sm text-destructive">{error}</p>
            ) : (
              <div className={cn('space-y-1 text-center sm:text-start')}>{renderEntries(aboutData)}</div>
            )}
          </Card>
        </motion.div>
      </div>
    </>
  );
}
