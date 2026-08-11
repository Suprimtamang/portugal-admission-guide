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

    return (
        <div>
            <h4 className="text-sm font-bold text-ink">Checklist</h4>
            {!auth.user && (
                <p className="mt-3 border border-mark bg-mark/25 p-3 text-xs text-ink">
                    Log in to save checklist progress across devices.
                </p>
            )}
            <ul className="mt-4 divide-y divide-rule border border-rule">
                {items.map((item) => (
                    <li key={item.id}>
                        <label className="flex cursor-pointer items-start gap-3 p-3 hover:bg-paper">
                            <input
                                type="checkbox"
                                className="mt-0.5 border-rule text-azul focus:ring-azul"
                                checked={!!item.completed}
                                onChange={() => toggle(item)}
                            />
                            <span
                                className={`text-sm leading-snug ${
                                    item.completed
                                        ? 'text-muted line-through'
                                        : 'text-ink'
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
