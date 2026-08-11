export default function GaesContent({ meta }) {
    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-crm bg-white p-4 sm:p-5">
                <h4 className="text-sm font-semibold text-crm-heading">
                    Accessing the portal
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-crm-muted">
                    {meta.portal_note}
                </p>
                <ul className="mt-5 space-y-3">
                    {(meta.offices || []).map((office) => (
                        <li
                            key={office.label}
                            className="rounded-xl border border-crm bg-slate-50 p-4"
                        >
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-crm-primary">
                                {office.label}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-crm-heading">
                                {office.name}
                            </p>
                            <p className="mt-1 text-xs text-crm-muted">
                                {office.address}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-950">
                    {meta.warning_title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
                    {meta.warning_body}
                </p>
            </div>
        </div>
    );
}
