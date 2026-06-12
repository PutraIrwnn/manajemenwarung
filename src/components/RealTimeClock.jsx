import { useEffect, useState } from 'react';

export function RealTimeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="hidden items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-right sm:flex flex-col">
      <p className="text-sm font-black text-slate-950 tabular-nums leading-tight">
        {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </p>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        {time.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
      </p>
    </div>
  );
}
