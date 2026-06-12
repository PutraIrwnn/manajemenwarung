import { ReceiptText, Search, X } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '../components/EmptyState.jsx';
import { SectionCard } from '../components/SectionCard.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { formatCurrency, getDebtRemaining } from '../utils/formatters.js';

export function TransactionsPage({ debts, transactions }) {
  const [query, setQuery] = useState('');
  const [method, setMethod] = useState('Semua');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const filteredTransactions = transactions.filter((transaction) => {
    const text = `${transaction.id} ${transaction.customer} ${transaction.cashier}`.toLowerCase();
    const matchSearch = text.includes(query.toLowerCase());
    const matchMethod = method === 'Semua' || transaction.method === method;
    return matchSearch && matchMethod;
  });

  const selectedDebt = selectedTransaction?.method === 'Utang'
    ? debts.find((debt) => debt.customer === selectedTransaction.customer)
    : null;
  const subtotal = selectedTransaction?.items.reduce((sum, item) => sum + item.qty * item.price, 0) ?? 0;

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-50 text-brand-700">
              <ReceiptText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-950">Transaksi Terakhir</h2>
              <p className="mt-1 text-lg leading-7 text-slate-500">
                Lihat transaksi yang baru disimpan.
              </p>
            </div>
          </div>
          <p className="rounded-lg bg-slate-50 px-4 py-3 text-base font-black text-slate-700">
            {filteredTransactions.length} data
          </p>
        </div>
      </section>

      <SectionCard
        helper="Lihat transaksi yang baru saja disimpan dari kasir."
        title="Daftar Transaksi"
      >
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-base font-medium text-slate-900 placeholder:text-slate-400"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari ID, pelanggan, atau kasir..."
              value={query}
            />
          </label>
          <select
            className="h-12 rounded-lg border border-slate-200 bg-slate-50 px-3 text-base font-bold text-slate-700"
            onChange={(event) => setMethod(event.target.value)}
            value={method}
          >
            <option>Semua</option>
            <option>Tunai</option>
            <option>Utang</option>
          </select>
        </div>

        {filteredTransactions.length === 0 ? (
          <EmptyState
            helper="Belum ada transaksi yang cocok dengan pencarian."
            icon={ReceiptText}
            title="Tidak ada transaksi"
          />
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <button
                className="block w-full rounded-lg border border-slate-200 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-soft"
                key={transaction.id}
                onClick={() => setSelectedTransaction(transaction)}
                type="button"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-black text-slate-950">{transaction.id}</h3>
                      <StatusBadge tone={transaction.method === 'Tunai' ? 'success' : 'warning'}>
                        {transaction.method}
                      </StatusBadge>
                    </div>
                    <p className="mt-1 text-base text-slate-500">
                      {transaction.date} - Kasir {transaction.cashier} - {transaction.customer}
                    </p>
                  </div>
                  <p className="text-2xl font-black text-brand-700">{formatCurrency(transaction.total)}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {transaction.items.map((item) => (
                    <p className="text-sm font-semibold text-slate-600" key={`${transaction.id}-${item.name}`}>
                      - {item.name} x{item.qty}
                    </p>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </SectionCard>

      {selectedTransaction && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/40 p-4">
          <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Detail Transaksi</h2>
                <p className="mt-1 text-base text-slate-500">{selectedTransaction.id}</p>
              </div>
              <button
                aria-label="Tutup detail transaksi"
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                onClick={() => setSelectedTransaction(null)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500">Tanggal</p>
                  <p className="text-lg font-black text-slate-950">{selectedTransaction.date}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500">Kasir</p>
                  <p className="text-lg font-black text-slate-950">{selectedTransaction.cashier}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500">Metode pembayaran</p>
                  <StatusBadge tone={selectedTransaction.method === 'Tunai' ? 'success' : 'warning'}>
                    {selectedTransaction.method}
                  </StatusBadge>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500">Pelanggan</p>
                  <p className="text-lg font-black text-slate-950">{selectedTransaction.customer}</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 p-4">
                <p className="text-lg font-black text-slate-950">Barang</p>
                <div className="mt-3 space-y-3">
                  {selectedTransaction.items.map((item) => (
                    <div className="flex justify-between gap-3 text-base" key={`detail-${item.name}`}>
                      <span>{item.name} x{item.qty}</span>
                      <span className="font-black">{formatCurrency(item.qty * item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTransaction.method === 'Utang' && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-lg font-black text-slate-950">Status pembayaran utang</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-bold text-slate-500">Nama pelanggan</p>
                      <p className="text-lg font-black text-slate-950">{selectedTransaction.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-500">Sisa utang</p>
                      <p className="text-lg font-black text-amber-800">
                        {formatCurrency(selectedDebt ? getDebtRemaining(selectedDebt) : selectedTransaction.total)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-brand-50 p-4">
                <div className="flex items-center justify-between text-base">
                  <span>Subtotal</span>
                  <span className="font-black">{formatCurrency(subtotal)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xl font-black text-brand-700">
                  <span>Total pembayaran</span>
                  <span>{formatCurrency(selectedTransaction.total)}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
