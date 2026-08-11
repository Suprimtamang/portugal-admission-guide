export default function PageHeader({ title, breadcrumbs = [], action = null }) {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <div className="crm-page-title">
                    <h1>{title}</h1>
                </div>
                {breadcrumbs.length > 0 && (
                    <nav className="mt-1 flex flex-wrap items-center gap-1 text-xs text-crm-muted">
                        {breadcrumbs.map((crumb, index) => (
                            <span key={`${crumb}-${index}`} className="flex items-center gap-1">
                                {index > 0 && <span>/</span>}
                                <span
                                    className={
                                        index === breadcrumbs.length - 1
                                            ? 'text-crm-heading'
                                            : ''
                                    }
                                >
                                    {crumb}
                                </span>
                            </span>
                        ))}
                    </nav>
                )}
            </div>
            {action}
        </div>
    );
}
