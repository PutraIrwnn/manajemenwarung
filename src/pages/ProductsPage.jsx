import { Boxes, CalendarClock, Edit3, PackageSearch, Plus, Search, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState.jsx';
import { SectionCard } from '../components/SectionCard.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { formatCurrency, formatShortDate, getDaysUntil, getExpiryStatus, getStockTone } from '../utils/formatters.js';
import { getProductImage } from '../utils/productImages.js';

const emptyForm = {
  name: '',
  category: 'Sembako',
  buyPrice: '',
  sellPrice: '',
  stock: '',
  unit: 'pcs',
  expiryDate: '',
  imageUrl: '',
};

const categoryOptions = ['Sembako', 'Makanan', 'Minuman', 'Snack', 'Rokok', 'Lainnya'];

function ProductFormModal({ initialData, onClose, onSubmit, title }) {
  const [form, setForm] = useState(initialData ?? emptyForm);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('imageUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Nama wajib diisi';
    if (!form.buyPrice || Number(form.buyPrice) <= 0) next.buyPrice = 'Harga beli harus > 0';
    if (!form.sellPrice || Number(form.sellPrice) <= 0) next.sellPrice = 'Harga jual harus > 0';
    if (!form.stock && form.stock !== 0) next.stock = 'Stok wajib diisi';
    if (!form.unit.trim()) next.unit = 'Satuan wajib diisi';
    if (!form.expiryDate) next.expiryDate = 'Tanggal kadaluarsa wajib diisi';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      category: form.category,
      buyPrice: Number(form.buyPrice),
      sellPrice: Number(form.sellPrice),
      stock: Number(form.stock),
      unit: form.unit.trim(),
      expiryDate: form.expiryDate,
      imageUrl: form.imageUrl?.trim() || '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-2xl animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            <h2 className="text-2xl font-black text-slate-950">{title}</h2>
            <p className="mt-1 text-base text-slate-500">Lengkapi data produk di bawah ini.</p>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            onClick={onClose}
            type="button"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-4 p-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-base font-black text-slate-700">Nama Produk</span>
            <input
              className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-base font-medium text-slate-900 placeholder:text-slate-400"
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Contoh: Indomie Goreng"
              value={form.name}
            />
            {errors.name && <span className="mt-1 block text-sm text-rose-600">{errors.name}</span>}
          </label>

          <label className="block">
            <span className="mb-1 block text-base font-black text-slate-700">Kategori</span>
            <select
              className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-base font-bold text-slate-700"
              onChange={(e) => handleChange('category', e.target.value)}
              value={form.category}
            >
              {categoryOptions.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-base font-black text-slate-700">Harga Beli</span>
              <input
                className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-base font-medium text-slate-900 placeholder:text-slate-400"
                min="0"
                onChange={(e) => handleChange('buyPrice', e.target.value)}
                placeholder="Contoh: 3000"
                type="number"
                value={form.buyPrice}
              />
              {errors.buyPrice && <span className="mt-1 block text-sm text-rose-600">{errors.buyPrice}</span>}
            </label>

            <label className="block">
              <span className="mb-1 block text-base font-black text-slate-700">Harga Jual</span>
              <input
                className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-base font-medium text-slate-900 placeholder:text-slate-400"
                min="0"
                onChange={(e) => handleChange('sellPrice', e.target.value)}
                placeholder="Contoh: 3500"
                type="number"
                value={form.sellPrice}
              />
              {errors.sellPrice && <span className="mt-1 block text-sm text-rose-600">{errors.sellPrice}</span>}
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-base font-black text-slate-700">Stok</span>
              <input
                className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-base font-medium text-slate-900 placeholder:text-slate-400"
                min="0"
                onChange={(e) => handleChange('stock', e.target.value)}
                placeholder="Contoh: 24"
                type="number"
                value={form.stock}
              />
              {errors.stock && <span className="mt-1 block text-sm text-rose-600">{errors.stock}</span>}
            </label>

            <label className="block">
              <span className="mb-1 block text-base font-black text-slate-700">Satuan</span>
              <input
                className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-base font-medium text-slate-900 placeholder:text-slate-400"
                onChange={(e) => handleChange('unit', e.target.value)}
                placeholder="pcs, botol, kg..."
                value={form.unit}
              />
              {errors.unit && <span className="mt-1 block text-sm text-rose-600">{errors.unit}</span>}
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-base font-black text-slate-700">Tanggal Kadaluarsa</span>
            <input
              className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-base font-medium text-slate-900"
              onChange={(e) => handleChange('expiryDate', e.target.value)}
              type="date"
              value={form.expiryDate}
            />
            {errors.expiryDate && <span className="mt-1 block text-sm text-rose-600">{errors.expiryDate}</span>}
          </label>

          <label className="block">
            <span className="mb-1 block text-base font-black text-slate-700">Gambar Produk (Opsional)</span>
            <div className="flex items-center gap-4">
              {form.imageUrl && (
                <img
                  alt="Preview"
                  className="h-12 w-12 rounded-lg bg-slate-100 object-cover"
                  src={form.imageUrl}
                />
              )}
              <input
                accept="image/*"
                className="w-full text-base font-medium text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-black file:text-brand-700 hover:file:bg-brand-100"
                onChange={handleImageUpload}
                type="file"
              />
            </div>
          </label>

          <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
            <button
              className="rounded-lg border border-slate-200 px-4 py-3 text-base font-black text-slate-700 transition hover:bg-slate-50"
              onClick={onClose}
              type="button"
            >
              Batal
            </button>
            <button
              className="rounded-lg bg-brand-600 px-4 py-3 text-base font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700"
              type="submit"
            >
              {initialData ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function DeleteConfirmModal({ onClose, onConfirm, productName }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl animate-[fadeIn_0.2s_ease-out]">
        <h2 className="text-2xl font-black text-slate-950">Hapus Produk?</h2>
        <p className="mt-2 text-base leading-7 text-slate-500">
          Produk <strong className="text-slate-900">{productName}</strong> akan dihapus secara permanen.
          Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            className="rounded-lg border border-slate-200 px-4 py-3 text-base font-black text-slate-700 transition hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            Batal
          </button>
          <button
            className="rounded-lg bg-rose-600 px-4 py-3 text-base font-black text-white shadow-lg shadow-rose-600/20 transition hover:-translate-y-0.5 hover:bg-rose-700"
            onClick={onConfirm}
            type="button"
          >
            Ya, Hapus
          </button>
        </div>
      </section>
    </div>
  );
}

export function ProductsPage({ onAddProduct, onDeleteProduct, onToast, onUpdateProduct, products }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [formModal, setFormModal] = useState(null); // null | 'add' | { ...product }
  const [deleteTarget, setDeleteTarget] = useState(null);

  const categories = useMemo(
    () => ['Semua', ...new Set(products.map((product) => product.category))],
    [products],
  );

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(query.toLowerCase());
    const matchCategory = category === 'Semua' || product.category === category;
    return matchSearch && matchCategory;
  });

  const lowStock = products.filter((product) => product.stock <= 8);
  const expiringProducts = products
    .filter((product) => getDaysUntil(product.expiryDate) <= 45)
    .sort((a, b) => getDaysUntil(a.expiryDate) - getDaysUntil(b.expiryDate));

  const handleFormSubmit = (data) => {
    if (formModal === 'add') {
      onAddProduct(data);
    } else {
      onUpdateProduct(formModal.id, data);
    }
    setFormModal(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDeleteProduct(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-5">
      {formModal && (
        <ProductFormModal
          initialData={
            formModal === 'add'
              ? null
              : {
                  name: formModal.name,
                  category: formModal.category,
                  buyPrice: formModal.buyPrice,
                  sellPrice: formModal.sellPrice,
                  stock: formModal.stock,
                  unit: formModal.unit,
                  expiryDate: formModal.expiryDate,
                }
          }
          onClose={() => setFormModal(null)}
          onSubmit={handleFormSubmit}
          title={formModal === 'add' ? 'Tambah Produk Baru' : `Edit ${formModal.name}`}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          productName={deleteTarget.name}
        />
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-500">Barang Terdaftar</p>
              <p className="text-3xl font-black text-slate-950">{products.length}</p>
            </div>
          </div>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-amber-50 text-amber-700">
              <PackageSearch className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-500">Barang Hampir Habis</p>
              <p className="text-3xl font-black text-slate-950">{lowStock.length}</p>
            </div>
          </div>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-rose-50 text-rose-700">
              <CalendarClock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-500">Perlu Cek Kadaluarsa</p>
              <p className="text-3xl font-black text-slate-950">{expiringProducts.length}</p>
            </div>
          </div>
        </article>
      </section>

      <SectionCard
        helper="Segera cek atau jual lebih dulu barang berikut."
        title="Barang Mendekati Kadaluarsa"
      >
        {expiringProducts.length === 0 ? (
          <EmptyState
            helper="Tidak ada barang yang perlu dicek dalam waktu dekat."
            icon={CalendarClock}
            title="Belum ada barang mendekati kadaluarsa"
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {expiringProducts.map((product) => {
              const days = getDaysUntil(product.expiryDate);
              const tone = days <= 14 ? 'danger' : 'warning';

              return (
                <article
                  className={[
                    'rounded-lg border p-4',
                    tone === 'danger' ? 'border-rose-200 bg-rose-50' : 'border-amber-200 bg-amber-50',
                  ].join(' ')}
                  key={`expiry-${product.id}`}
                >
                  <p className="text-lg font-black text-slate-950">{product.name}</p>
                  <p className="mt-1 text-base text-slate-600">{formatShortDate(product.expiryDate)}</p>
                  <StatusBadge tone={tone}>
                    {days > 0 ? `${days} hari lagi` : 'Cek hari ini'}
                  </StatusBadge>
                </article>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard
        action={
          <button
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-base font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700"
            onClick={() => setFormModal('add')}
            type="button"
          >
            <Plus className="h-5 w-5" />
            Tambah Produk
          </button>
        }
        helper="Cek harga jual dan stok barang yang biasa dicari pelanggan."
        title="Barang & Stok"
      >
        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-base font-medium text-slate-900 placeholder:text-slate-400"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ketik nama barang"
              value={query}
            />
          </label>
          <select
            className="h-12 rounded-lg border border-slate-200 bg-slate-50 px-3 text-base font-bold text-slate-700"
            onChange={(event) => setCategory(event.target.value)}
            value={category}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState
            helper="Coba cari dengan nama barang lain atau pilih kategori Semua."
            icon={Boxes}
            title="Tidak ada barang ditemukan"
          />
        ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const expiry = getExpiryStatus(product.expiryDate);
            const daysUntilExpiry = getDaysUntil(product.expiryDate);
            return (
              <article
                className="overflow-hidden rounded-lg border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-soft"
                key={product.id}
              >
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="h-40 w-full rounded-t-lg object-cover bg-slate-100"
                />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xl font-black leading-7 text-slate-950">{product.name}</p>
                      <p className="mt-1 text-base text-slate-500">{product.category}</p>
                    </div>
                    <StatusBadge tone={getStockTone(product.stock)}>
                      Stok {product.stock} {product.unit}
                    </StatusBadge>
                  </div>

                  <div className="mt-4 grid gap-3 grid-cols-2">
                    <div className="rounded-lg bg-brand-50 p-3">
                      <p className="text-sm font-bold text-slate-500">Harga Jual</p>
                      <p className="mt-1 text-lg font-black text-brand-700">
                        {formatCurrency(product.sellPrice)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-sm font-bold text-slate-500">Harga Beli</p>
                      <p className="mt-1 text-lg font-black text-slate-950">
                        {formatCurrency(product.buyPrice)}
                      </p>
                    </div>
                    <div className="col-span-2 rounded-lg bg-slate-50 p-3">
                      <p className="text-sm font-bold text-slate-500">Kadaluarsa</p>
                      <div className="mt-1 flex items-baseline justify-between">
                        <p className="text-lg font-black text-slate-950">
                          {formatShortDate(product.expiryDate)}
                        </p>
                        <p className="text-sm font-bold text-slate-500">
                          {daysUntilExpiry > 0 ? `${daysUntilExpiry} hari lagi` : 'Perlu dicek hari ini'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {product.stock <= 8 && <StatusBadge tone="warning">Perlu restok</StatusBadge>}
                      <StatusBadge tone={expiry.tone}>{expiry.label}</StatusBadge>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="flex items-center gap-1.5 rounded-lg border border-brand-200 px-3 py-2 text-sm font-black text-brand-700 transition hover:-translate-y-0.5 hover:bg-brand-50"
                        onClick={() => setFormModal(product)}
                        type="button"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        className="flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-sm font-black text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-50"
                        onClick={() => setDeleteTarget(product)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        )}
      </SectionCard>
    </div>
  );
}
