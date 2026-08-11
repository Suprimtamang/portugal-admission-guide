export default function EquivalencyContent({ meta }) {
    return (
        <div className="space-y-6">
            <div className="border border-azul bg-azul/5 p-5">
                <h4 className="text-sm font-bold text-azul">{meta.where_heading}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                    {meta.where_body}
                </p>
                <address className="mt-4 border border-rule bg-sheet p-3 text-sm not-italic">
                    <span className="font-bold">School on file:</span>{' '}
                    {meta.school_name}
                    <br />
                    {meta.school_address}
                </address>
            </div>

            <div>
                <h4 className="text-sm font-bold">Take with you</h4>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                    {(meta.bring || []).map((item) => (
                        <li key={item} className="flex gap-2">
                            <span className="font-bold text-azul">•</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                {meta.tip && (
                    <p className="mt-5 border-l-4 border-stamp bg-stamp/5 p-3 text-xs leading-relaxed text-ink">
                        <strong>Tip:</strong> {meta.tip}
                    </p>
                )}
            </div>
        </div>
    );
}
