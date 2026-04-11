import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { exportReports, getReportsOrders, getReportsSummary } from '@/services/reportService';
import { getAxiosErrorMessage } from '@/utils/apiError';
import {
  mapOrdersReportToBarRows,
  mapSummaryToPieData,
  mapSummaryToTrend,
  type BarRow,
  type PieDatum,
  type TrendPoint,
} from '@/utils/mapReportsHubApi';

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function useReportsHub(dateFrom: string, dateTo: string) {
  const [pieLeft, setPieLeft] = useState<PieDatum[]>([]);
  const [pieRight, setPieRight] = useState<PieDatum[]>([]);
  const [trendLine, setTrendLine] = useState<TrendPoint[]>([]);
  const [barRows, setBarRows] = useState<BarRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    if (!dateFrom || !dateTo) {
      toast.error('Select both from and to dates.');
      return;
    }
    setLoading(true);
    try {
      const [summaryRes, ordersRes] = await Promise.all([
        getReportsSummary(dateFrom, dateTo),
        getReportsOrders(dateFrom, dateTo),
      ]);
      const pies = mapSummaryToPieData(summaryRes);
      setPieLeft(pies.left);
      setPieRight(pies.right);
      setTrendLine(mapSummaryToTrend(summaryRes));
      setBarRows(mapOrdersReportToBarRows(ordersRes));
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    if (dateFrom && dateTo) {
      void fetchReports();
    }
  }, [dateFrom, dateTo, fetchReports]);

  const handleExport = useCallback(async () => {
    if (!dateFrom || !dateTo) {
      toast.error('Select both from and to dates.');
      return;
    }
    try {
      const res = await exportReports(dateFrom, dateTo);
      const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
      const headers = res.headers;
      const disposition =
        typeof headers?.get === 'function'
          ? headers.get('content-disposition') ?? undefined
          : (headers as Record<string, string | undefined>)?.['content-disposition'];
      let filename = 'reports-export.xlsx';
      if (disposition) {
        const m = /filename\*?=(?:UTF-8'')?["']?([^"';]+)/i.exec(disposition);
        if (m?.[1]) {
          filename = decodeURIComponent(m[1].trim());
        }
      }
      triggerBlobDownload(blob, filename);
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  }, [dateFrom, dateTo]);

  return {
    pieLeft,
    pieRight,
    trendLine,
    barRows,
    loading,
    fetchReports,
    handleExport,
  };
}
