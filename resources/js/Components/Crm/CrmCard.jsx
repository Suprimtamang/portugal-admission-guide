export default function CrmCard({
    children,
    className = '',
    title = null,
    action = null,
    id = undefined,
}) {
    return (
        <div id={id} className={`crm-card shadow-crm ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between border-b border-crm px-5 py-4">
                    {title && (
                        <h3 className="text-base font-semibold text-crm-heading">
                            {title}
                        </h3>
                    )}
                    {action}
                </div>
            )}
            <div className="p-5">{children}</div>
        </div>
    );
}
