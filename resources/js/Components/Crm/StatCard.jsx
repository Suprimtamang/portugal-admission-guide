export default function StatCard({ label, value, tone = 'primary' }) {
    const tones = {
        primary: 'bg-crm-primary/10 text-crm-primary',
        success: 'bg-emerald-50 text-crm-success',
        danger: 'bg-red-50 text-crm-danger',
        warning: 'bg-orange-50 text-crm-warning',
    };

    return (
        <div
            data-motion="card"
            className="crm-card shadow-crm p-5"
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-medium text-crm-muted">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-crm-heading">
                        {value}
                    </p>
                </div>
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${tones[tone] || tones.primary}`}
                >
                    •
                </div>
            </div>
        </div>
    );
}
