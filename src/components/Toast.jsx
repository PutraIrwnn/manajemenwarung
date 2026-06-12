import { CheckCircle2 } from 'lucide-react';

export function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed right-4 top-20 z-[70] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg border border-emerald-200 bg-white px-4 py-3 text-base font-bold text-emerald-700 shadow-xl shadow-slate-900/10 animate-[fadeIn_0.2s_ease-out] sm:right-6">
      <CheckCircle2 className="h-5 w-5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
