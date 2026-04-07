import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { ProfileDropdown } from '@/components/layout/ProfileDropdown';
import { ReportsHubBarChart } from '@/components/dashboard/reports/ReportsHubBarChart';
import { ReportsHubChartCard } from '@/components/dashboard/reports/ReportsHubChartCard';
import { ReportsHubPies } from '@/components/dashboard/reports/ReportsHubPies';
import { ReportsHubTrendLine } from '@/components/dashboard/reports/ReportsHubTrendLine';
import {
  horizontalBarGroups,
  lineSeriesShared,
  pieSegmentsA,
  pieSegmentsB,
} from '@/mock/reportsHubData';

export function ReportsHub() {
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-06-30');

  return (
    <>
      <Helmet>
        <title>AutoHub — Reports Hub</title>
      </Helmet>
      <div className="flex w-full min-w-0 max-w-none flex-1 flex-col">
        <motion.div
          className="w-full min-w-0 max-w-none"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="w-full min-w-0 max-w-none border p-4 shadow-xs sm:p-6">
            <div className="mb-6 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <Button type="button" variant="outline" size="sm" className="w-fit shrink-0">
                  Select a date range
                </Button>
                <div className="flex flex-wrap items-center gap-2">
                  <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                  <span className="text-xs text-muted-foreground">to</span>
                  <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </div>
              </div>
              <div className="flex items-center justify-end">
                <ProfileDropdown />
              </div>
            </div>

            <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
              <Card className="min-w-0 border border-border/80 p-3 shadow-none">
                <ReportsHubPies leftData={pieSegmentsA} rightData={pieSegmentsB} />
              </Card>

              <ReportsHubChartCard onExport={() => undefined}>
                <ReportsHubTrendLine data={lineSeriesShared} />
              </ReportsHubChartCard>

              <ReportsHubChartCard onExport={() => undefined}>
                <ReportsHubBarChart data={horizontalBarGroups} />
              </ReportsHubChartCard>

              <ReportsHubChartCard onExport={() => undefined}>
                <ReportsHubTrendLine data={lineSeriesShared} />
              </ReportsHubChartCard>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
