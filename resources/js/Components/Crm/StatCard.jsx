export default function StatCard({
    label,
    value,
    tone = 'primary',
    hint = null,
}) {
    const tones = {
        primary: {
            wrap: 'from-[#e8f5ff] to-white',
            icon: 'bg-[#0d99ff]/15 text-[#0d99ff]',
            bar: 'bg-[#0d99ff]',
        },
        success: {
            wrap: 'from-emerald-50 to-white',
            icon: 'bg-emerald-100 text-emerald-700',
            bar: 'bg-emerald-500',
        },
        danger: {
            wrap: 'from-rose-50 to-white',
            icon: 'bg-rose-100 text-rose-600',
            bar: 'bg-rose-500',
        },
        warning: {
            wrap: 'from-amber-50 to-white',
            icon: 'bg-amber-100 text-amber-700',
            bar: 'bg-amber-500',
        },
    };

    const style = tones[tone] || tones.primary;

    return (
        <div
            data-motion="card"
            className={`crm-card relative overflow-hidden bg-gradient-to-br ${style.wrap} p-5`}
        >
            <div className={`absolute inset-x-0 top-0 h-1 ${style.bar}`} />
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-crm-muted">
                        {label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-crm-heading">
                        {value}
                    </p>
                    {hint && (
                        <p className="mt-2 text-xs text-crm-muted">{hint}</p>
                    )}
                </div>
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${style.icon}`}
                >
                    {String(value ?? 0).toString().slice(0, 2)}
                </div>
            </div>
        </div>
    );
}
