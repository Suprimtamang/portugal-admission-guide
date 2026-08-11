const styles = {
    open: 'bg-sky-50 text-crm-primary',
    in_progress: 'bg-orange-50 text-crm-warning',
    waiting_user: 'bg-violet-50 text-violet-600',
    resolved: 'bg-emerald-50 text-crm-success',
    closed: 'bg-gray-100 text-crm-muted',
    high: 'bg-red-50 text-crm-danger',
    normal: 'bg-sky-50 text-crm-primary',
    low: 'bg-gray-100 text-crm-muted',
    draft: 'bg-gray-100 text-crm-muted',
    published: 'bg-emerald-50 text-crm-success',
};

export default function StatusBadge({ value }) {
    const key = String(value || '').toLowerCase();
    return (
        <span
            className={`inline-flex rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                styles[key] || 'bg-gray-100 text-crm-muted'
            }`}
        >
            {String(value || '').replaceAll('_', ' ')}
        </span>
    );
}
