import { BarChart3, CalendarDays, ReceiptText, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { EmptyState } from '../components/EmptyState.jsx';
import { MetricCard } from '../components/MetricCard.jsx';
import { SectionCard } from '../components/SectionCard.jsx';
import { formatCompactCurrency, formatCurrency, getTodayDate } from '../utils/formatters.js';

function BarSeries({ data, labelKey = 'label', valueKey = 'sales' }) {
  const maxValue = Math.max(1, ...data.map((item) => item[valueKey]));

  return (
    <div className="flex h-80 items-end gap-3">
      {data.map((item) => (
        <div className="group relative flex flex-1 flex-col items-center gap-2" key={item[labelKey]}>
          <span
            className={[
              'text-xs font-black',
              item[valueKey] === maxValue && maxValue > 0 ? 'text-brand-700' : 'text-slate-500',
            ].join(' ')}
          >
            {formatCompactCurrency(item[valueKey])}
          </span>
          <div className="flex h-52 w-full items-end rounded-lg bg-slate-100 px-1.5 pb-1.5">
            <div
              className={[
                'w-full rounded-md transition duration-200 group-hover:scale-[1.03]',
                item[valueKey] === maxValue && maxValue > 0 ? 'bg-brand-700 shadow-lg shadow-brand-600/20' : 'bg-brand-600',
              ].join(' ')}
              style={{ height: `${maxValue > 0 ? Math.max(14, (item[valueKey] / maxValue) * 100) : 14}%` }}
              title={formatCurrency(item[valueKey])}
            />
          </div>
          <span className="text-xs font-black text-slate-500">{item[labelKey]}</span>
          <span className="pointer-events-none absolute -top-8 hidden rounded-md bg-slate-950 px-2 py-1 text-xs font-bold text-white shadow-lg group-hover:block">
            {formatCurrency(item[valueKey])}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ReportsPage({ transactions }) {
  const todayPrefix = getTodayDate();
  const todayTransactions = transactions.filter((transaction) => transaction.date.startsWith(todayPrefix));
  const todaySales = todayTransactions.reduce((sum, transaction) => sum + transaction.total, 0);

  // Hitung penjualan 7 hari terakhir secara dinamis
  const dailySalesData = useMemo(() => {
    const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayTrx = transactions.filter((t) => t.date.startsWith(dateStr));
      days.push({
        label: dayLabels[d.getDay()],
        sales: dayTrx.reduce((sum, t) => sum + t.total, 0),
        transactions: dayTrx.length,
      });
    }
    return days;
  }, [transactions]);

  // Hitung penjualan 6 bulan terakhir secara dinamis
  const monthlySalesData = useMemo(() => {
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthTrx = transactions.filter((t) => t.date.startsWith(prefix));
      months.push({
        label: monthLabels[d.getMonth()],
        sales: monthTrx.reduce((sum, t) => sum + t.total, 0),
      });
    }
    return months;
  }, [transactions]);

  const weeklySales = dailySalesData.reduce((sum, item) => sum + item.sales, 0);
  const averageDaily = dailySalesData.length > 0 ? Math.round(weeklySales / dailySalesData.length) : 0;
  const monthSales = monthlySalesData.length > 0 ? monthlySalesData[monthlySalesData.length - 1].sales : 0;
  const hasReportData = transactions.length > 0;

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-brand-100 bg-white p-5 shadow-soft">
        <h2 className="text-3xl font-black text-slate-950">Laporan Penjualan</h2>
        <p className="mt-2 text-lg leading-7 text-slate-500">
          Laporan ini membantu melihat hasil penjualan secara dinamis dari data transaksi.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={CalendarDays}
          label="Penjualan Hari Ini"
          note={`${todayTransactions.length} transaksi tercatat`}
          value={formatCurrency(todaySales)}
        />
        <MetricCard
          icon={TrendingUp}
          label="Penjualan Bulan Ini"
          note="Dari data transaksi bulan ini"
          tone="success"
          value={formatCurrency(monthSales)}
        />
        <MetricCard
          icon={BarChart3}
          label="Rata-rata Penjualan Harian"
          note="Dari data 7 hari terakhir"
          tone="warning"
          value={formatCurrency(averageDaily)}
        />
        <MetricCard
          icon={ReceiptText}
          label="Jumlah Transaksi"
          note="Data transaksi tersimpan"
          value={`${transactions.length} transaksi`}
        />
      </section>

      {!hasReportData ? (
        <EmptyState
          helper="Belum ada laporan penjualan yang bisa ditampilkan."
          icon={BarChart3}
          title="Tidak ada laporan"
        />
      ) : (
      <section className="grid gap-5 xl:grid-cols-2">
        <SectionCard
          helper="Lihat omzet dan jumlah transaksi tiap hari."
          title="Penjualan 7 Hari Terakhir"
        >
          <BarSeries data={dailySalesData} />
          <div className="mt-4 overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[520px] text-left text-base">
              <thead className="text-sm font-black text-slate-500">
                <tr>
                  <th className="pb-3">Hari</th>
                  <th className="pb-3 text-right">Transaksi</th>
                  <th className="pb-3 text-right">Omzet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailySalesData.map((item) => (
                  <tr key={item.label}>
                    <td className="py-4 font-bold text-slate-950">{item.label}</td>
                    <td className="py-4 text-right text-slate-600">{item.transactions}</td>
                    <td className="py-3 text-right font-black text-brand-700">
                      {formatCurrency(item.sales)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          helper="Bandingkan hasil penjualan dari bulan ke bulan."
          title="Penjualan 6 Bulan Terakhir"
        >
          <BarSeries data={monthlySalesData} />
          <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
            <p className="text-base font-bold text-slate-500">Catatan</p>
            <p className="mt-2 text-base leading-7 text-slate-700">
              Data laporan dihitung otomatis dari transaksi yang tersimpan.
              Semakin banyak transaksi dicatat, semakin akurat tren penjualan yang terlihat.
            </p>
          </div>
        </SectionCard>
      </section>
      )}
    </div>
  );
}
