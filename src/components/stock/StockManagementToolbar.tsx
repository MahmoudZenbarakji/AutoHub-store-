import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

type StockManagementToolbarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onExportAll?: () => void;
  onImport?: () => void;
};

export function StockManagementToolbar({
  searchQuery,
  onSearchChange,
  onExportAll,
  onImport,
}: StockManagementToolbarProps) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:gap-4">
      <div className="min-w-0 flex-1">
        <label className="sr-only" htmlFor="stock-search">
          Search bar
        </label>
        <Input
          id="stock-search"
          placeholder="Search categories, products, SKUs…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onExportAll}>
          <Download className="size-4" />
          Export All
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onImport}>
          <Upload className="size-4" />
          Import
        </Button>
      </div>
    </div>
  );
}
