import { Download, Search, Upload } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

type DashboardFiltersProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onExport?: () => void;
  onImport?: () => void;
};

export function DashboardFilters({
  searchQuery,
  onSearchChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onExport,
  onImport,
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div className="flex w-full flex-col gap-2 sm:max-w-md sm:flex-1">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="dashboard-search">
          Search bar
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="dashboard-search"
            placeholder="Search orders, SKUs, customers…"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="ps-9"
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto">
        <span className="text-xs font-medium text-muted-foreground">Select a date range</span>
        <div className="flex flex-wrap items-center gap-2">
          <Input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} />
          <span className="text-xs text-muted-foreground">to</span>
          <Input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onExport}>
          <Download className="size-4" />
          Export
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onImport}>
          <Upload className="size-4" />
          Import
        </Button>
      </div>
    </div>
  );
}
