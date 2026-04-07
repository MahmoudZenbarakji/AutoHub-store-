import { motion } from 'motion/react';
import type { RecentTransaction, VoucherRow } from '@/mock/dashboardData';
import { cn } from '@/lib/utils';

type DashboardTableProps = {
  vouchers: VoucherRow[];
  transactions: RecentTransaction[];
  className?: string;
};

export function DashboardTable({ vouchers, transactions, className }: DashboardTableProps) {
  return (
    <div className={cn('grid gap-6 lg:grid-cols-2', className)}>
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-xs"
      >
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Vouchers details</h2>
          <p className="text-xs text-muted-foreground">Active codes and spend</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Vouchers details</th>
                <th className="px-4 py-3">Voucher value</th>
                <th className="px-4 py-3">Apply on</th>
                <th className="px-4 py-3">From \ To (date)</th>
                <th className="px-4 py-3">Total spend till now</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/80 transition-colors last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{row.details}</td>
                  <td className="px-4 py-3">{row.value}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.applyOn}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.dateRange}</td>
                  <td className="px-4 py-3">{row.totalSpend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-xs"
      >
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Recent activity</h2>
          <p className="text-xs text-muted-foreground">Latest store transactions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/80 transition-colors last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{row.customer}</td>
                  <td className="px-4 py-3">{row.amount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                        row.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-500/15 text-amber-800 dark:text-amber-400',
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
}
