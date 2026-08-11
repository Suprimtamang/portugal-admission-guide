export default function FinishContent({ meta }) {
    return (
        <div className="space-y-5 py-2">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-100">
                Done
            </span>
            <h3 className="text-2xl font-semibold tracking-tight text-crm-heading sm:text-3xl">
                {meta.heading}
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-crm-muted">
                {meta.body}
            </p>
            <a
                href={meta.support_url}
                target="_blank"
                rel="noreferrer"
                className="crm-btn-primary inline-flex"
            >
                {meta.support_label}
            </a>
        </div>
    );
}
