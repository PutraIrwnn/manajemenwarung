export function SectionCard({ action, children, helper, title }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-xl font-black text-slate-950">{title}</h2>
          {helper && <p className="mt-1 text-base leading-6 text-slate-500">{helper}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
