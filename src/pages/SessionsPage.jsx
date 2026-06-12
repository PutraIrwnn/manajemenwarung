import { ClipboardList, Clock } from 'lucide-react';
import { EmptyState } from '../components/EmptyState.jsx';
import { SectionCard } from '../components/SectionCard.jsx';

export function SessionsPage({ sessions }) {
  if (!sessions || sessions.length === 0) {
    return (
      <EmptyState
        helper="Belum ada sesi kasir yang tercatat. Sesi akan otomatis tercatat ketika kasir membuka dan menutup sesi jualan."
        icon={ClipboardList}
        title="Belum ada rekap absen"
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">Rekap Absen Kasir</h1>
        <p className="mt-2 max-w-2xl text-lg leading-7 text-slate-500">
          Catatan riwayat jam buka dan jam tutup sesi kasir.
        </p>
      </div>

      <SectionCard
        helper="Daftar rekap waktu absen masuk dan keluar kasir."
        title="Riwayat Sesi"
      >
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[600px] text-left text-base">
            <thead className="text-sm font-black text-slate-500">
              <tr className="border-b border-slate-200">
                <th className="py-4 font-bold text-slate-400">TANGGAL</th>
                <th className="py-4">WAKTU MASUK</th>
                <th className="py-4">WAKTU KELUAR</th>
                <th className="py-4 text-right">DURASI (MENIT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessions.map((sess, idx) => {
                const start = new Date(sess.startTime.replace(' ', 'T'));
                const end = new Date(sess.endTime.replace(' ', 'T'));
                const diffMs = end - start;
                const diffMins = Math.max(1, Math.round(diffMs / 60000));
                
                return (
                  <tr className="transition hover:bg-slate-50" key={idx}>
                    <td className="py-4 font-bold text-slate-950">
                      {start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {sess.startTime.split(' ')[1]}
                      </div>
                    </td>
                    <td className="py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {sess.endTime.split(' ')[1]}
                      </div>
                    </td>
                    <td className="py-4 text-right font-black text-brand-700">
                      {diffMins} mnt
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
