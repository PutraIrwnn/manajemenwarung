import { BadgeCheck, Lock, ShieldCheck, Store, UserRound } from 'lucide-react';
import { useState } from 'react';

const roles = [
  {
    id: 'Admin',
    title: 'Admin',
    description: 'Kelola stok, laporan, utang, dan semua transaksi.',
    icon: ShieldCheck,
  },
  {
    id: 'Kasir',
    title: 'Kasir',
    description: 'Fokus jualan, catatan utang, dan transaksi terakhir.',
    icon: BadgeCheck,
  },
];

export function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('12345');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin(selectedRole, { username, password });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-brand-600 p-6 text-white sm:p-8 lg:p-10">
          <div className="mb-10 flex items-center gap-3">
            <img
              alt="Logo Warung"
              className="h-14 w-14 rounded-lg object-contain bg-white shadow-sm"
              src="/images/logo/Logo.png"
            />
            <div>
              <p className="text-xl font-black leading-6">Warung Uti Azzam</p>
              <p className="text-sm font-medium text-brand-100">Sistem Informasi Manajemen</p>
            </div>
          </div>

          <div className="max-w-sm">
            <Store className="mb-5 h-12 w-12 text-brand-100" />
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">
              Sistem Informasi Manajemen Warung
            </h1>
            <p className="mt-4 text-base leading-7 text-brand-100">
              Masuk sebagai Admin atau Kasir.
            </p>
          </div>
        </div>

        <form className="p-6 sm:p-8 lg:p-10" onSubmit={handleSubmit}>
          <div className="mb-8">
            <p className="text-sm font-bold text-brand-700">Masuk ke aplikasi</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Login pengguna</h2>
            <p className="mt-2 text-base leading-6 text-slate-500">
              Silakan masuk sesuai akun yang digunakan.
            </p>
          </div>

          <div className="grid gap-4">
            <label className="block">
              <span className="mb-2 block text-base font-black text-slate-700">Username</span>
              <span className="relative block">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-base font-medium text-slate-900"
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Masukkan username"
                  value={username}
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-base font-black text-slate-700">Password</span>
              <span className="relative block">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-base font-medium text-slate-900"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan password"
                  type="password"
                  value={password}
                />
              </span>
            </label>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {roles.map((role) => {
              const Icon = role.icon;
              const active = selectedRole === role.id;

              return (
                <button
                  className={[
                    'flex min-h-28 items-start gap-4 rounded-lg border p-4 text-left transition duration-200 hover:-translate-y-0.5',
                    active
                      ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100'
                      : 'border-slate-200 bg-white hover:border-brand-200',
                  ].join(' ')}
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  type="button"
                >
                  <span
                    className={[
                      'grid h-11 w-11 shrink-0 place-items-center rounded-lg',
                      active ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600',
                    ].join(' ')}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-lg font-black text-slate-950">{role.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-slate-500">
                      {role.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <button
            className="mt-6 w-full rounded-lg bg-brand-600 px-4 py-4 text-lg font-black text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700"
            type="submit"
          >
            Masuk
          </button>
        </form>
      </section>
    </main>
  );
}
