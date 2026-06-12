import { Banknote, CheckCircle2, ClipboardList, Clock, LogOut, Minus, Plus, Search, ShoppingCart, Store, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ReceiptModal } from '../components/ReceiptModal.jsx';
import { SectionCard } from '../components/SectionCard.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { formatCurrency, getStockTone } from '../utils/formatters.js';
import { getProductImage } from '../utils/productImages.js';

export function PosPage({ onCheckout, onEndShift, onStartShift, onToast, products, shift }) {
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [paymentMethod, setPaymentMethod] = useState('Tunai');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [receiptTransaction, setReceiptTransaction] = useState(null);

  const categories = useMemo(
    () => ['Semua', ...new Set(products.map((product) => product.category))],
    [products],
  );

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(query.toLowerCase());
    const matchCategory = category === 'Semua' || product.category === category;
    return matchSearch && matchCategory;
  });

  const subtotal = cart.reduce((sum, item) => sum + item.sellPrice * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (product) => {
    if (product.stock <= 0) return;

    setSuccessMessage('');
    onToast?.(`${product.name} berhasil ditambahkan`);
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, qty: Math.min(item.qty + 1, product.stock) } : item,
        );
      }

      return [...current, { ...product, qty: 1 }];
    });
  };

  const updateQty = (productId, nextQty) => {
    setSuccessMessage('');
    setCart((current) =>
      current
        .map((item) => {
          if (item.id !== productId) return item;
          return { ...item, qty: Math.max(1, Math.min(nextQty, item.stock)) };
        })
        .filter((item) => item.qty > 0),
    );
  };

  const removeItem = (productId) => {
    setSuccessMessage('');
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setSuccessMessage('');
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setPaymentMethod('Tunai');
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'Utang' && customerName.trim().length < 2) return;

    const transaction = onCheckout({
      cart,
      customerName: paymentMethod === 'Utang' ? customerName.trim() : 'Umum',
      customerPhone: paymentMethod === 'Utang' ? customerPhone.trim() : '',
      paymentMethod,
      total: subtotal,
    });

    setSuccessMessage(`${transaction.id} berhasil disimpan sebagai transaksi ${paymentMethod.toLowerCase()}.`);
    setReceiptTransaction(transaction);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setPaymentMethod('Tunai');
  };

  if (!shift) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-center shadow-soft">
        <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-600">
          <Store className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-950">Kasir Belum Dibuka</h2>
        <p className="mt-2 max-w-md text-lg text-slate-500">
          Silakan buka sesi kasir terlebih dahulu untuk mulai menerima transaksi dan melayani pelanggan.
        </p>
        <button
          className="mt-8 rounded-lg bg-brand-600 px-8 py-4 text-lg font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-1 hover:bg-brand-700"
          onClick={onStartShift}
          type="button"
        >
          Buka Kasir Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-brand-200 bg-brand-50 p-4">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-brand-600" />
          <div>
            <p className="text-sm font-bold text-brand-700">Sesi Kasir Aktif</p>
            <p className="text-xs font-medium text-brand-600">Mulai: {shift.startTime}</p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-rose-600 shadow-sm transition hover:bg-rose-50"
          onClick={onEndShift}
          type="button"
        >
          <LogOut className="h-4 w-4" />
          Tutup Kasir
        </button>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <ReceiptModal
        onClose={() => setReceiptTransaction(null)}
        transaction={receiptTransaction}
      />

      <section className="order-2 space-y-4 xl:order-1">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-950">Mulai Jualan</h2>
              <p className="mt-1 text-lg leading-7 text-slate-500">
                Pilih barang untuk mulai transaksi.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-brand-700">
              <ShoppingCart className="h-6 w-6" />
              <span className="text-base font-black">{totalItems} barang dipilih</span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-base font-medium text-slate-900 placeholder:text-slate-400"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ketik nama barang"
              value={query}
            />
          </label>
          <select
            className="h-12 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-base font-bold text-slate-700"
            onChange={(event) => setCategory(event.target.value)}
            value={category}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <button
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-soft transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
              key={product.id}
              onClick={() => addToCart(product)}
              type="button"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                <img
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  src={getProductImage(product)}
                />
                <span className="absolute right-2 top-2">
                  <StatusBadge tone={getStockTone(product.stock)}>
                    {product.stock} {product.unit}
                  </StatusBadge>
                </span>
                <span className="absolute bottom-2 right-2 grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 transition group-hover:scale-110 group-hover:bg-brand-700">
                  <Plus className="h-5 w-5" />
                </span>
              </div>
              <div className="p-3">
                <p className="text-sm font-black leading-5 text-slate-950 sm:text-base">{product.name}</p>
                <p className="mt-0.5 text-xs font-medium text-slate-400">{product.category}</p>
                <p className="mt-1.5 text-lg font-black text-brand-700">{formatCurrency(product.sellPrice)}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <aside className="order-1 xl:sticky xl:top-20 xl:order-2 xl:self-start">
        <SectionCard helper="Total pembayaran selalu terlihat di sini." title="Daftar Belanja">
          {successMessage && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-base font-semibold text-emerald-700">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="max-h-[340px] space-y-3 overflow-y-auto pr-1 scrollbar-thin">
            {cart.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <ShoppingCart className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-2 text-lg font-black text-slate-700">Belum ada barang dipilih</p>
                <p className="mt-1 text-base leading-6 text-slate-500">Klik produk di sebelah kiri untuk mulai transaksi.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div className="rounded-lg border border-slate-100 p-4" key={item.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-black text-slate-950">{item.name}</p>
                      <p className="text-base text-slate-500">{formatCurrency(item.sellPrice)} / {item.unit}</p>
                    </div>
                    <button
                      className="grid h-10 w-10 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => removeItem(item.id)}
                      type="button"
                      aria-label={`Hapus ${item.name}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-slate-200">
                      <button
                        className="grid h-12 w-12 place-items-center text-slate-700 hover:bg-slate-50"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        type="button"
                        aria-label={`Kurangi ${item.name}`}
                      >
                        <Minus className="h-6 w-6" />
                      </button>
                      <span className="grid h-12 min-w-12 place-items-center border-x border-slate-200 px-4 text-lg font-black">
                        {item.qty}
                      </span>
                      <button
                        className="grid h-12 w-12 place-items-center text-slate-700 hover:bg-slate-50"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        type="button"
                        aria-label={`Tambah ${item.name}`}
                      >
                        <Plus className="h-6 w-6" />
                      </button>
                    </div>
                    <p className="text-lg font-black text-slate-950">{formatCurrency(item.qty * item.sellPrice)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
            {cart.length > 0 && (
              <button
                className="w-full rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-base font-black text-rose-700 transition hover:bg-rose-100"
                onClick={clearCart}
                type="button"
              >
                Batalkan Belanja
              </button>
            )}

            <div>
              <p className="mb-2 text-base font-black text-slate-700">Cara bayar</p>
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
                <button
                  className={[
                    'flex items-center justify-center gap-2 rounded-md px-3 py-3 text-lg font-black transition',
                    paymentMethod === 'Tunai'
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                      : 'text-slate-600 hover:bg-white',
                  ].join(' ')}
                  onClick={() => setPaymentMethod('Tunai')}
                  type="button"
                >
                  <Banknote className="h-5 w-5" />
                  Tunai
                </button>
                <button
                  className={[
                    'flex items-center justify-center gap-2 rounded-md px-3 py-3 text-lg font-black transition',
                    paymentMethod === 'Utang'
                      ? 'bg-amber-100 text-amber-900 shadow-sm'
                      : 'text-slate-600 hover:bg-white',
                  ].join(' ')}
                  onClick={() => setPaymentMethod('Utang')}
                  type="button"
                >
                  <ClipboardList className="h-5 w-5" />
                  Utang
                </button>
              </div>
            </div>

            {paymentMethod === 'Utang' && (
              <label className="block">
                <span className="mb-2 block text-base font-black text-slate-700">Nama pelanggan</span>
                <input
                  className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 placeholder:text-slate-400"
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Contoh: Bu Rina"
                  value={customerName}
                />
                <span className="mb-2 mt-3 block text-base font-black text-slate-700">
                  Nomor HP (opsional)
                </span>
                <input
                  className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base font-medium text-slate-900 placeholder:text-slate-400"
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  placeholder="Contoh: 0812xxxx"
                  value={customerPhone}
                />
              </label>
            )}

            <div className="rounded-lg bg-brand-50 p-5">
              <div className="flex items-center justify-between text-base text-slate-600">
                <span>Total item</span>
                <span className="font-bold text-slate-900">{totalItems}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-black text-slate-700">Total harga</span>
                <span className="text-3xl font-black text-brand-700">{formatCurrency(subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-base text-slate-600">
                <span>Jenis pembayaran</span>
                <span className="font-black text-slate-900">{paymentMethod}</span>
              </div>
            </div>

            <button
              className="w-full rounded-lg bg-brand-600 px-4 py-4 text-xl font-black text-white shadow-lg shadow-brand-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/25 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              disabled={cart.length === 0 || (paymentMethod === 'Utang' && customerName.trim().length < 2)}
              onClick={handleCheckout}
              type="button"
            >
              {paymentMethod === 'Utang' ? 'Simpan sebagai Utang' : 'Simpan Transaksi'}
            </button>
          </div>
        </SectionCard>
      </aside>
    </div>
    </div>
  );
}
