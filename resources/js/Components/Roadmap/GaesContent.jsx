export default function GaesContent({ meta }) {
    return (
        <div className="space-y-6">
            <div className="border border-rule p-5">
                <h4 className="text-sm font-bold">Accessing the portal</h4>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                    {meta.portal_note}
                </p>
                <ul className="mt-5 space-y-3">
                    {(meta.offices || []).map((office) => (
                        <li
                            key={office.label}
                            className="border border-rule bg-paper p-4"
                        >
                            <p className="text-xs font-bold text-azul">
                                {office.label}
                            </p>
                            <p className="mt-1 text-sm font-bold">{office.name}</p>
                            <p className="mt-1 text-xs text-muted">
                                {office.address}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border border-mark bg-mark/20 p-4">
                <p className="text-sm font-bold">{meta.warning_title}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink">
                    {meta.warning_body}
                </p>
            </div>
        </div>
    );
}
