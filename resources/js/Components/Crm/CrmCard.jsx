export default function CrmCard({
    children,
    className = '',
    title = null,
    action = null,
    id = undefined,
    padded = true,
}) {
    return (
        <div id={id} className={`crm-card ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between gap-3 border-b border-crm px-5 py-4">
                    {title && (
                        <h3 className="text-[15px] font-semibold tracking-tight text-crm-heading">
                            {title}
                        </h3>
                    )}
                    {action}
                </div>
            )}
            <div className={padded ? 'p-5' : ''}>{children}</div>
        </div>
    );
}
