export default function EquivalencyContent({ meta }) {
    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 sm:p-5">
                <h4 className="text-sm font-semibold text-crm-primary">
                    {meta.where_heading}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-crm-heading">
                    {meta.where_body}
                </p>
                <address className="mt-4 rounded-xl border border-crm bg-white p-3.5 text-sm not-italic text-crm-heading">
                    <span className="font-semibold">School on file:</span>{' '}
                    {meta.school_name}
                    <br />
                    <span className="text-crm-muted">{meta.school_address}</span>
                </address>
            </div>

            <div>
                <h4 className="text-sm font-semibold text-crm-heading">
                    Take with you
                </h4>
                <ul className="mt-3 space-y-2">
                    {(meta.bring || []).map((item) => (
                        <li
                            key={item}
                            className="flex gap-2 rounded-xl border border-crm bg-white px-3.5 py-3 text-sm text-crm-heading"
                        >
                            <span className="font-bold text-crm-primary">•</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                {meta.tip && (
                    <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm leading-relaxed text-amber-950">
                        <strong>Tip:</strong> {meta.tip}
                    </p>
                )}
            </div>
        </div>
    );
}
