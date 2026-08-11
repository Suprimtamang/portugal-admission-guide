export default function PageHeader({
    title,
    breadcrumbs = [],
    action = null,
    subtitle = null,
}) {
    return (
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                {breadcrumbs.length > 0 && (
                    <nav className="mb-2 flex flex-wrap items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-crm-muted">
                        {breadcrumbs.map((crumb, index) => (
                            <span
                                key={`${crumb}-${index}`}
                                className="flex items-center gap-1.5"
                            >
                                {index > 0 && (
                                    <span className="text-crm-border">/</span>
                                )}
                                <span
                                    className={
                                        index === breadcrumbs.length - 1
                                            ? 'text-crm-primary'
                                            : ''
                                    }
                                >
                                    {crumb}
                                </span>
                            </span>
                        ))}
                    </nav>
                )}
                <div className="crm-page-title">
                    <h1>{title}</h1>
                </div>
                {subtitle && (
                    <p className="mt-1.5 max-w-2xl text-sm text-crm-muted">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
        </div>
    );
}
