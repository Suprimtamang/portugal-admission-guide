const styles = {
    open: 'bg-sky-50 text-sky-700 ring-sky-100',
    in_progress: 'bg-amber-50 text-amber-700 ring-amber-100',
    waiting_user: 'bg-violet-50 text-violet-700 ring-violet-100',
    resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    closed: 'bg-slate-100 text-slate-600 ring-slate-200',
    high: 'bg-rose-50 text-rose-700 ring-rose-100',
    normal: 'bg-sky-50 text-sky-700 ring-sky-100',
    low: 'bg-slate-100 text-slate-600 ring-slate-200',
    draft: 'bg-slate-100 text-slate-600 ring-slate-200',
    published: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
};

export default function StatusBadge({ value }) {
    const key = String(value || '').toLowerCase();
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${
                styles[key] || 'bg-slate-100 text-slate-600 ring-slate-200'
            }`}
        >
            {String(value || '').replaceAll('_', ' ')}
        </span>
    );
}
