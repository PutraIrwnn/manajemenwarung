import { CircleDollarSign, Search, UsersRound, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState.jsx';
import { SectionCard } from '../components/SectionCard.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import {
  formatCurrency,
  formatShortDate,
  getDebtOriginal,
  getDebtPaid,
  getDebtRemaining,
} from '../utils/formatters.js';

export function DebtsPage({ debts, onPayDebt }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Semua');
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [paymentValue, setPaymentValue] = useState('');

  const filteredDebts = debts.filter((debt) => {
    const matchSearch = debt.customer.toLowerCase().includes(query.toLowerCase());
    const debtStatus = getDebtRemaining(debt) === 0 ? 'Lunas' : 'Belum Lunas';
    const matchStatus = status === 'Semua' || debtStatus === status;
    return matchSearch && matchStatus;
  });

  const unpaidDebts = debts.filter((debt) => getDebtRemaining(debt) > 0);
  const unpaidTotal = unpaidDebts.reduce((sum, debt) => sum + getDebtRemaining(debt), 0);

  const modalDebt = useMemo(() => {
    if (!selectedDebt) return null;
    return debts.find((debt) => debt.id === selectedDebt.id) ?? selectedDebt;
  }, [debts, selectedDebt]);

  const modalRemaining = modalDebt ? getDebtRemaining(modalDebt) : 0;
  const modalOriginal = modalDebt ? getDebtOriginal(modalDebt) : 0;
  const modalPaid = modalDebt ? getDebtPaid(modalDebt) : 0;
  const numericPayment = Math.max(0, Number(paymentValue) || 0);
  const nextRemaining = Math.max(0, modalRemaining - Math.min(numericPayment, modalRemaining));
  const progress = modalOriginal > 0 ? Math.min(100, (modalPaid / modalOriginal) * 100) : 0;
  const nextProgress = modalOriginal > 0 ? Math.min(100, ((modalPaid + Math.min(numericPayment, modalRemaining)) / modalOriginal) * 100) : 0;

  const openPaymentModal = (debt) => {
    setSelectedDebt(debt);
    setPaymentValue('');
  };

  const closePaymentModal = () => {
    setSelectedDebt(null);
    setPaymentValue('');
  };

  const recordPayment = (amount) => {
    if (!modalDebt || amount <= 0) return;
    onPayDebt(modalDebt.id, amount);
    closePaymentModal();
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-rose-50 text-rose-700">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-500">Total Belum Lunas</p>
              <p className="text-3xl font-black text-slate-950">{formatCurrency(unpaidTotal)}</p>
            </div>
          </div>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-base font-bold text-slate-500">Pelanggan Belum Bayar</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{unpaidDebts.length}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-50 text-brand-700">
              <UsersRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-500">Semua Catatan</p>
              <p className="text-3xl font-black text-slate-950">{debts.length}</p>
            </div>
          </div>
        </article>
      </section>

      <SectionCard
        helper="Catat pelanggan yang belum melunasi pembayaran."
        title="Catatan Utang"
      >
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-base font-medium text-slate-900 placeholder:text-slate-400"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama pelanggan..."
              value={query}
            />
          </label>
          <select
            className="h-12 rounded-lg border border-slate-200 bg-slate-50 px-3 text-base font-bold text-slate-700"
            onChange={(event) => setStatus(event.target.value)}
            value={status}
          >
            <option>Semua</option>
            <option>Belum Lunas</option>
            <option>Lunas</option>
          </select>
        </div>

        {filteredDebts.length === 0 ? (
          <EmptyState
            helper="Belum ada pelanggan dengan status ini."
            icon={UsersRound}
            title="Tidak ada utang"
          />
        ) : (
        <div className="grid gap-3">
          {filteredDebts.map((debt) => {
            const original = getDebtOriginal(debt);
            const remaining = getDebtRemaining(debt);
            const paid = getDebtPaid(debt);
            const debtStatus = remaining === 0 ? 'Lunas' : 'Belum Lunas';
            const paidProgress = original > 0 ? Math.min(100, (paid / original) * 100) : 0;

            return (
              <article
                className="rounded-lg border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-soft"
                key={debt.id}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-black text-slate-950">{debt.customer}</h3>
                      <StatusBadge tone={debtStatus === 'Lunas' ? 'success' : 'warning'}>
                        {debtStatus}
                      </StatusBadge>
                    </div>
                    <p className="mt-1 text-base text-slate-500">
                      {formatShortDate(debt.date)} - {debt.note}
                    </p>
                    {debt.phone && <p className="mt-1 text-sm font-semibold text-slate-500">HP: {debt.phone}</p>}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-bold text-slate-500">Sisa utang</p>
                      <p className="text-2xl font-black text-slate-950">{formatCurrency(remaining)}</p>
                    </div>
                    {remaining > 0 ? (
                      <button
                        className="rounded-lg border border-brand-200 px-5 py-3 text-base font-black text-brand-700 transition hover:-translate-y-0.5 hover:bg-brand-50"
                        onClick={() => openPaymentModal(debt)}
                        type="button"
                      >
                        Bayar Cicilan
                      </button>
                    ) : (
                      <button
                        className="rounded-lg bg-emerald-50 px-5 py-3 text-base font-black text-emerald-700"
                        disabled
                        type="button"
                      >
                        Selesai ✓
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-500">
                    <span>Sudah dibayar {formatCurrency(paid)}</span>
                    <span>Total awal {formatCurrency(original)}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-600 transition-all duration-300"
                      style={{ width: `${paidProgress}%` }}
                    />
                  </div>
                </div>

                {(debt.payments ?? []).length > 0 && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-3">
                    <p className="text-sm font-black text-slate-600">Riwayat pembayaran</p>
                    <div className="mt-2 grid gap-1">
                      {(debt.payments ?? []).map((payment, index) => (
                        <p className="text-sm text-slate-600" key={`${debt.id}-${payment.date}-${index}`}>
                          {formatShortDate(payment.date)} bayar {formatCurrency(payment.amount)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
        )}
      </SectionCard>

      {modalDebt && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <section className="w-full max-w-lg rounded-lg bg-white shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Bayar Cicilan</h2>
                <p className="mt-1 text-base text-slate-500">Catat pembayaran sebagian atau lunaskan.</p>
              </div>
              <button
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                onClick={closePaymentModal}
                type="button"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-lg bg-brand-50 p-4">
                <p className="text-sm font-bold text-slate-500">Nama pelanggan</p>
                <p className="text-xl font-black text-slate-950">{modalDebt.customer}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-bold text-slate-500">Total utang awal</p>
                    <p className="text-lg font-black text-slate-950">{formatCurrency(modalOriginal)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500">Sisa utang saat ini</p>
                    <p className="text-lg font-black text-rose-700">{formatCurrency(modalRemaining)}</p>
                  </div>
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-base font-black text-slate-700">Nominal pembayaran</span>
                <input
                  className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-base font-medium text-slate-900 placeholder:text-slate-400"
                  min="0"
                  onChange={(event) => setPaymentValue(event.target.value)}
                  placeholder="Contoh: 20000"
                  type="number"
                  value={paymentValue}
                />
              </label>

              <div className="rounded-lg bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-500">
                  <span>Sudah dibayar {formatCurrency(modalPaid + Math.min(numericPayment, modalRemaining))}</span>
                  <span>Sisa {formatCurrency(nextRemaining)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-brand-600 transition-all duration-300"
                    style={{ width: `${paymentValue ? nextProgress : progress}%` }}
                  />
                </div>
              </div>

              {(modalDebt.payments ?? []).length > 0 && (
                <div className="rounded-lg border border-slate-100 p-4">
                  <p className="text-base font-black text-slate-700">Riwayat pembayaran</p>
                  <div className="mt-2 grid gap-2">
                    {(modalDebt.payments ?? []).map((payment, index) => (
                      <p className="text-sm text-slate-600" key={`modal-${payment.date}-${index}`}>
                        {formatShortDate(payment.date)} bayar {formatCurrency(payment.amount)}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-3 border-t border-slate-100 p-5 sm:grid-cols-2">
              <button
                className="rounded-lg border border-brand-200 px-4 py-3 text-base font-black text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                disabled={numericPayment <= 0 || modalRemaining === 0}
                onClick={() => recordPayment(numericPayment)}
                type="button"
              >
                Bayar Sebagian
              </button>
              <button
                className="rounded-lg bg-brand-600 px-4 py-3 text-base font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={modalRemaining === 0}
                onClick={() => recordPayment(modalRemaining)}
                type="button"
              >
                Lunaskan
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
