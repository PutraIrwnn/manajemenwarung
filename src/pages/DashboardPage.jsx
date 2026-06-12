import {
  AlertTriangle,
  BarChart3,
  Boxes,
  ClipboardList,
  CreditCard,
  PackageSearch,
  WalletCards,
} from 'lucide-react';
import { useMemo } from 'react';
import { MetricCard } from '../components/MetricCard.jsx';
import { SectionCard } from '../components/SectionCard.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { formatCompactCurrency, formatCurrency, formatFullDate, formatShortDate, getDaysUntil, getDebtRemaining, getTodayDate } from '../utils/formatters.js';

function ActionButton({ icon: Icon, label, note, onClick, primary = false, tone = 'brand' }) {
  const toneClasses = {
    brand: 'bg-brand-600 text-white hover:bg-brand-700',
    light: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
    warning: 'bg-amber-50 text-amber-800 hover:bg-amber-100',
  };

  return (
    <button
      className={[
        `flex items-center gap-4 rounded-lg text-left transition duration-200 ${toneClasses[tone]}`,
        primary
          ? 'min-h-32 p-6 shadow-lg shadow-brand-600/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-600/25'
          : 'min-h-28 p-5 shadow-soft hover:-translate-y-0.5',
      ].join(' ')}
      onClick={onClick}
      type="button"
    >
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white/90 text-brand-700">
        <Icon className="h-8 w-8" />
      </span>
      <span>
        <span className="block text-xl font-black leading-tight">{label}</span>
        <span className="mt-1 block text-base font-medium opacity-85">{note}</span>
      </span>
    </button>
  );
}

export function DashboardPage({ debts, onNavigate, products, transactions }) {
  const todayPrefix = getTodayDate();
  const todayTransactions = transactions.filter((transaction) => transaction.date.startsWith(todayPrefix));
  const todaySales = todayTransactions.reduce((sum, transaction) => sum + transaction.total, 0);
  const todayCash = todayTransactions
    .filter((transaction) => transaction.method === 'Tunai')
    .reduce((sum, transaction) => sum + transaction.total, 0);
  const lowStock = products.filter((product) => product.stock <= 8);
  const unpaidDebts = debts.filter((debt) => getDebtRemaining(debt) > 0);
  const unpaidDebt = unpaidDebts.reduce((sum, debt) => sum + getDebtRemaining(debt), 0);
  const expiringProducts = products
    .filter((product) => getDaysUntil(product.expiryDate) <= 45)
    .sort((a, b) => getDaysUntil(a.expiryDate) - getDaysUntil(b.expiryDate));

  // Hitung penjualan 7 hari terakhir secara dinamis dari data transaksi
  const dailySalesData = useMemo(() => {
    const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayTransactions = transactions.filter((t) => t.date.startsWith(dateStr));
      days.push({
        label: dayLabels[d.getDay()],
        sales: dayTransactions.reduce((sum, t) => sum + t.total, 0),
        transactions: dayTransactions.length,
      });
    }
    return days;
  }, [transactions]);

  const maxDailySales = Math.max(1, ...dailySalesData.map((item) => item.sales));
  const stockWarnings = [...lowStock].sort((a, b) => a.stock - b.stock).slice(0, 5);
  const lowStockExamples = [...lowStock]
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 3)
    .map((product) => product.name)
    .join(', ');

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-brand-100 bg-white p-5 shadow-soft">
        <p className="text-base font-bold text-brand-700">{formatFullDate()}</p>
        <h2 className="mt-1 text-3xl font-black text-slate-950 sm:text-4xl">
          Selamat datang, Uti
        </h2>
        <p className="mt-2 max-w-2xl text-lg leading-7 text-slate-500">
          Mulai dari tombol besar di bawah ini untuk jualan, cek stok, catat utang,
          atau melihat laporan hari ini.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ActionButton
          icon={CreditCard}
          label="Mulai Jualan"
          note="Buka kasir"
          onClick={() => onNavigate('pos')}
          primary
        />
        <ActionButton
          icon={Boxes}
          label="Cek Stok Barang"
          note="Lihat barang yang hampir habis"
          onClick={() => onNavigate('products')}
          tone="light"
        />
        <ActionButton
          icon={ClipboardList}
          label="Catat Utang"
          note="Pelanggan belum bayar"
          onClick={() => onNavigate('debts')}
          tone="warning"
        />
        <ActionButton
          icon={BarChart3}
          label="Lihat Laporan Hari Ini"
          note="Hasil penjualan"
          onClick={() => onNavigate('reports')}
          tone="light"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={WalletCards}
          label="Penjualan Hari Ini"
          note={`${todayTransactions.length} transaksi (tunai + utang)`}
          value={formatCurrency(todaySales)}
        />
        <MetricCard
          icon={CreditCard}
          label="Kas Tunai Hari Ini"
          note="Hanya dari transaksi tunai, tidak termasuk pelunasan utang"
          tone="success"
          value={formatCurrency(todayCash)}
        />
        <MetricCard
          icon={PackageSearch}
          label="Barang Hampir Habis"
          note={lowStockExamples ? `Stok ≤ 8 unit: ${lowStockExamples}` : 'Semua stok di atas 8 unit'}
          tone="warning"
          value={`${lowStock.length} barang`}
        />
        <MetricCard
          icon={ClipboardList}
          label="Total Utang Belum Lunas"
          note={`${unpaidDebts.length} pelanggan belum melunasi`}
          tone="danger"
          value={formatCurrency(unpaidDebt)}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          action={
            <button
              className="rounded-lg bg-brand-50 px-4 py-2.5 text-base font-black text-brand-700 hover:bg-brand-100"
              onClick={() => onNavigate('products')}
              type="button"
            >
              Lihat semua
            </button>
          }
          helper="Barang di bawah ini perlu dicek agar tidak kehabisan saat pelanggan membeli."
          title="Peringatan Stok"
        >
          <div className="space-y-3">
            {stockWarnings.map((product) => {
              const message =
                product.stock <= 3
                  ? `${product.name} tinggal ${product.stock} ${product.unit}. Stok sangat menipis.`
                  : `${product.name} tinggal ${product.stock} ${product.unit}. Segera restok.`;

              return (
                <div
                  className="flex items-start gap-3 rounded-lg border border-amber-100 bg-amber-50 p-4"
                  key={product.id}
                >
                  <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-lg font-black leading-6 text-slate-950">{message}</p>
                    <p className="mt-1 text-base text-slate-600">
                      Kategori {product.category}. Kadaluarsa {formatShortDate(product.expiryDate)}.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          helper="Lihat hari ramai dan hari sepi dengan cepat."
          title="Penjualan 7 Hari"
        >
          <div className="flex h-64 items-end gap-3">
            {dailySalesData.map((item) => (
              <div className="flex flex-1 flex-col items-center gap-2" key={item.label}>
                <div className="flex h-44 w-full items-end rounded-lg bg-slate-100 px-1.5 pb-1.5">
                  <div
                    className="w-full rounded-md bg-brand-600"
                    style={{ height: `${Math.max(18, (item.sales / maxDailySales) * 100)}%` }}
                    title={formatCurrency(item.sales)}
                  />
                </div>
                <span className="text-sm font-bold text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          action={
            <button
              className="rounded-lg bg-brand-50 px-4 py-2.5 text-base font-black text-brand-700 hover:bg-brand-100"
              onClick={() => onNavigate('debts')}
              type="button"
            >
              Buka catatan
            </button>
          }
          helper="Catatan pelanggan yang belum membayar."
          title="Utang Belum Lunas"
        >
          <div className="space-y-3">
            {debts
              .filter((debt) => getDebtRemaining(debt) > 0)
              .slice(0, 4)
              .map((debt) => (
                <div
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-4"
                  key={debt.id}
                >
                  <div>
                    <p className="text-lg font-black text-slate-950">{debt.customer}</p>
                    <p className="text-base text-slate-500">{formatShortDate(debt.date)} - {debt.note}</p>
                  </div>
                  <p className="text-lg font-black text-slate-950">{formatCurrency(getDebtRemaining(debt))}</p>
                </div>
              ))}
          </div>
        </SectionCard>

        <SectionCard
          action={
            <button
              className="rounded-lg bg-brand-50 px-4 py-2.5 text-base font-black text-brand-700 hover:bg-brand-100"
              onClick={() => onNavigate('transactions')}
              type="button"
            >
              Lihat semua
            </button>
          }
          helper="Transaksi terakhir yang masuk dari kasir."
          title="Transaksi Terakhir"
        >
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                className="flex flex-col gap-3 rounded-lg border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                key={transaction.id}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-black text-slate-950">{transaction.customer}</p>
                    <StatusBadge tone={transaction.method === 'Tunai' ? 'success' : 'warning'}>
                      {transaction.method}
                    </StatusBadge>
                  </div>
                  <p className="text-base text-slate-500">{transaction.date}</p>
                </div>
                <p className="text-xl font-black text-brand-700">{formatCurrency(transaction.total)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      {expiringProducts.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-base text-amber-800">
          <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0" />
          <p>
            {expiringProducts[0].name} perlu dicek lebih dulu karena tanggal kadaluarsanya paling dekat.
          </p>
        </div>
      )}

      <button
        className="fixed bottom-24 right-5 z-30 flex items-center gap-3 rounded-lg bg-brand-600 px-5 py-4 text-base font-black text-white shadow-xl shadow-brand-600/25 transition hover:-translate-y-1 hover:bg-brand-700 lg:bottom-6"
        onClick={() => onNavigate('pos')}
        type="button"
      >
        <CreditCard className="h-6 w-6" />
        Transaksi Baru
      </button>
    </div>
  );
}
