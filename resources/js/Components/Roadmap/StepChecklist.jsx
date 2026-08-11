import { router, usePage } from '@inertiajs/react';

export default function StepChecklist({ items }) {
    const { auth } = usePage().props;

    const toggle = (item) => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        router.post(
            route('progress.toggle', item.id),
            { completed: !item.completed },
            { preserveScroll: true, preserveState: true },
        );
    };

    const done = items.filter((item) => item.completed).length;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                    <h4 className="text-sm font-semibold text-crm-heading">
                        Checklist
                    </h4>
                    <p className="mt-1 text-xs text-crm-muted">
                        {done} of {items.length} complete
                    </p>
                </div>
            </div>

            {!auth.user && (
                <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
                    Log in to save checklist progress across devices.
                </div>
            )}

            <ul className="overflow-hidden rounded-2xl border border-crm bg-white">
                {items.map((item) => (
                    <li key={item.id} className="border-b border-crm last:border-b-0">
                        <label className="flex cursor-pointer items-start gap-3 px-4 py-3.5 transition hover:bg-slate-50 sm:gap-4">
                            <span
                                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                                    item.completed
                                        ? 'border-crm-primary bg-crm-primary text-white'
                                        : 'border-slate-300 bg-white'
                                }`}
                            >
                                {item.completed && (
                                    <svg
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="h-3.5 w-3.5"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </span>
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={!!item.completed}
                                onChange={() => toggle(item)}
                            />
                            <span
                                className={`min-w-0 flex-1 text-sm leading-relaxed ${
                                    item.completed
                                        ? 'text-crm-muted line-through'
                                        : 'text-crm-heading'
                                }`}
                            >
                                {item.label}
                            </span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}
