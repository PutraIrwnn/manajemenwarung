import {
  BarChart3,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  ShoppingCart,
  UsersRound,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { RealTimeClock } from './RealTimeClock.jsx';

const navItems = [
  { id: 'dashboard', label: 'Beranda', shortLabel: 'Beranda', icon: LayoutDashboard, roles: ['Admin'] },
  { id: 'pos', label: 'Kasir / Mulai Jualan', shortLabel: 'Kasir', icon: ShoppingCart, roles: ['Admin', 'Kasir'] },
  { id: 'products', label: 'Barang & Stok', shortLabel: 'Barang', icon: Boxes, roles: ['Admin'] },
  { id: 'debts', label: 'Catatan Utang', shortLabel: 'Utang', icon: UsersRound, roles: ['Admin', 'Kasir'] },
  { id: 'sessions', label: 'Rekap Absen Kasir', shortLabel: 'Absen', icon: ClipboardList, roles: ['Admin'] },
  { id: 'reports', label: 'Laporan Penjualan', shortLabel: 'Laporan', icon: BarChart3, roles: ['Admin'] },
  { id: 'transactions', label: 'Transaksi Terakhir', shortLabel: 'Transaksi', icon: ReceiptText, roles: ['Admin', 'Kasir'] },
];

function NavButton({ item, active, onClick, compact = false }) {
  const Icon = item.icon;

  return (
    <button
      className={[
        'flex items-center gap-3 rounded-lg px-3 py-3 text-left text-base font-bold transition duration-200',
        active
          ? 'bg-brand-600 text-white shadow-soft'
          : 'text-slate-600 hover:-translate-y-0.5 hover:bg-brand-50 hover:text-brand-700',
        compact ? 'flex-col justify-center gap-1 px-1 py-2 text-center text-[11px] leading-tight' : '',
      ].join(' ')}
      onClick={onClick}
      type="button"
      aria-label={item.label}
      title={item.label}
    >
      <Icon className={compact ? 'h-5 w-5 shrink-0' : 'h-6 w-6 shrink-0'} />
      {compact ? <span className="max-w-16 truncate">{item.shortLabel}</span> : <span>{item.label}</span>}
    </button>
  );
}

export function AppShell({ activePage, children, onLogout, onNavigate, role }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const accessibleNav = useMemo(
    () => navItems.filter((item) => item.roles.includes(role)),
    [role],
  );
  const current = accessibleNav.find((item) => item.id === activePage) ?? accessibleNav[0];

  useEffect(() => {
    setPageLoading(true);
    const timeoutId = window.setTimeout(() => setPageLoading(false), 180);
    return () => window.clearTimeout(timeoutId);
  }, [activePage]);

  const handleNavigate = (id) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white px-4 py-5 lg:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <img
            alt="Logo Warung"
            className="h-11 w-11 rounded-lg object-contain bg-white shadow-sm"
            src="/images/logo/Logo.png"
          />
          <div>
            <p className="text-sm font-black leading-5 text-slate-950">Warung Uti Azzam</p>
            <p className="text-xs font-medium text-slate-500">Sistem Informasi Manajemen</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {accessibleNav.map((item) => (
            <NavButton
              active={activePage === item.id}
              item={item}
              key={item.id}
              onClick={() => handleNavigate(item.id)}
            />
          ))}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-white text-sm font-black text-brand-700">
              {role.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">{role}</p>
              <p className="truncate text-xs text-slate-500">{role === 'Admin' ? 'Pemilik Warung' : 'Staf Kasir'}</p>
            </div>
          </div>
          <button
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
            onClick={onLogout}
            type="button"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur lg:ml-72">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
              onClick={() => setMobileOpen(true)}
              type="button"
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase text-brand-600">
                Warung Uti Azzam
              </p>
              <h1 className="text-base font-black text-slate-950 sm:text-xl">{current.label}</h1>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <RealTimeClock />
            <div className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-2 text-right">
              <p className="text-xs font-medium text-slate-500">Pengguna</p>
              <p className="text-sm font-black text-brand-700">{role}</p>
            </div>
            <button
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-brand-200 hover:text-brand-700"
              onClick={onLogout}
              type="button"
              aria-label="Keluar"
              title="Keluar"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden">
          <div className="h-full w-[min(320px,86vw)] bg-white p-4 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  alt="Logo Warung"
                  className="h-10 w-10 rounded-lg object-contain bg-white shadow-sm"
                  src="/images/logo/Logo.png"
                />
                <div>
                  <p className="text-sm font-black text-slate-950">Warung Uti Azzam</p>
                  <p className="text-xs text-slate-500">{role === 'Admin' ? 'Pemilik Warung' : 'Staf Kasir'}</p>
                </div>
              </div>
              <button
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700"
                onClick={() => setMobileOpen(false)}
                type="button"
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1.5">
              {accessibleNav.map((item) => (
                <NavButton
                  active={activePage === item.id}
                  item={item}
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                />
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="px-4 py-5 sm:px-6 lg:ml-72 lg:px-8">
        <div className="mx-auto max-w-7xl pb-24 transition-opacity duration-200 lg:pb-8">
          {pageLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-36 rounded-lg bg-slate-200/70" />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="h-28 rounded-lg bg-slate-200/70" />
                <div className="h-28 rounded-lg bg-slate-200/70" />
                <div className="h-28 rounded-lg bg-slate-200/70" />
                <div className="h-28 rounded-lg bg-slate-200/70" />
              </div>
            </div>
          ) : (
            <div className="animate-[fadeIn_0.18s_ease-out]">{children}</div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 grid grid-cols-5 border-t border-slate-200 bg-white px-2 py-2 shadow-[0_-10px_30px_-25px_rgba(15,23,42,0.45)] lg:hidden">
        {accessibleNav.slice(0, 5).map((item) => (
          <NavButton
            active={activePage === item.id}
            compact
            item={item}
            key={item.id}
            onClick={() => handleNavigate(item.id)}
          />
        ))}
      </nav>
    </div>
  );
}

export { navItems };
