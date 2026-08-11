export default function FinishContent({ meta }) {
    return (
        <div className="space-y-6 py-4">
            <span className="stamp">Done</span>
            <h3 className="font-display text-3xl font-semibold tracking-tight">
                {meta.heading}
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-muted">
                {meta.body}
            </p>
            <a
                href={meta.support_url}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-azul px-5 py-3 text-sm font-bold text-white hover:bg-azul-deep"
            >
                {meta.support_label}
            </a>
        </div>
    );
}
