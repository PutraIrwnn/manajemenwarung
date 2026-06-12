export function MetricCard({ icon: Icon, label, value, note, tone = 'brand' }) {
  const toneClasses = {
    brand: 'bg-brand-50 text-brand-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-rose-50 text-rose-700',
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-base font-bold text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
        </div>
        <div className={`mr-1 mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-lg opacity-85 ${toneClasses[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {note && <p className="mt-3 text-base font-medium leading-6 text-slate-500">{note}</p>}
    </article>
  );
}
