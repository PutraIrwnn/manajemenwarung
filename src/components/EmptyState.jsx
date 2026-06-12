export function EmptyState({ action, helper, icon: Icon, title }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
      {Icon && (
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-white text-slate-400">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <p className="mt-3 text-lg font-black text-slate-800">{title}</p>
      {helper && <p className="mx-auto mt-1 max-w-md text-base leading-6 text-slate-500">{helper}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
