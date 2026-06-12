import { Printer, X } from 'lucide-react';
import { formatCurrency } from '../utils/formatters.js';

export function ReceiptModal({ onClose, transaction }) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/40 p-4">
      <section className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-2xl animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h2 className="text-xl font-black text-slate-950">Struk Transaksi</h2>
          <button
            aria-label="Tutup struk"
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="m-4 rounded-lg border border-slate-200 bg-slate-50 p-5 font-mono text-sm text-slate-900">
          <div className="text-center">
            <p className="text-lg font-black">WARUNG UTI AZZAM</p>
            <p>GG. Merdeka, Karawang Barat</p>
          </div>

          <div className="my-4 border-t border-dashed border-slate-300" />

          <div className="space-y-1">
            <div className="flex justify-between gap-3">
              <span>Tanggal</span>
              <span className="text-right">{transaction.date}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>No</span>
              <span>{transaction.id}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Kasir</span>
              <span>{transaction.cashier}</span>
            </div>
          </div>

          <div className="my-4 border-t border-dashed border-slate-300" />

          <div className="space-y-3">
            {transaction.items.map((item) => (
              <div key={`${transaction.id}-${item.name}`}>
                <p className="font-bold">{item.name}</p>
                <div className="flex justify-between gap-3">
                  <span>{item.qty} x {formatCurrency(item.price)}</span>
                  <span>{formatCurrency(item.qty * item.price)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="my-4 border-t border-dashed border-slate-300" />

          <div className="space-y-1 text-base font-black">
            <div className="flex justify-between gap-3">
              <span>Metode</span>
              <span>{transaction.method}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Total</span>
              <span>{formatCurrency(transaction.total)}</span>
            </div>
          </div>

          <div className="my-4 border-t border-dashed border-slate-300" />
          <p className="text-center font-bold">Terima kasih</p>
        </div>

        <div className="grid gap-2 border-t border-slate-100 p-4 sm:grid-cols-3">
          <button
            className="rounded-lg border border-slate-200 px-4 py-3 text-base font-black text-slate-700 transition hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            Tutup
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-base font-black text-white transition hover:bg-brand-700"
            type="button"
          >
            <Printer className="h-5 w-5" />
            Cetak Struk
          </button>
          <button
            className="rounded-lg border border-brand-200 px-4 py-3 text-base font-black text-brand-700 transition hover:bg-brand-50"
            type="button"
          >
            Simpan PDF
          </button>
        </div>
      </section>
    </div>
  );
}
