import AppLayout from '@/Layouts/AppLayout';
import CrmCard from '@/Components/Crm/CrmCard';
import PageHeader from '@/Components/Crm/PageHeader';
import StatusBadge from '@/Components/Crm/StatusBadge';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ tickets, filters, isSuperAdmin }) {
    const { flash } = usePage().props;

    return (
        <AppLayout title={isSuperAdmin ? 'Support queue' : 'Help'}>
            <Head title="Support" />
            <PageHeader
                title={isSuperAdmin ? 'Support queue' : 'Help requests'}
                breadcrumbs={['Home', isSuperAdmin ? 'Support' : 'Help']}
                action={
                    !isSuperAdmin ? (
                        <Link
                            href={route('app.support.create')}
                            className="rounded-md bg-crm-primary px-4 py-2 text-sm font-semibold text-white"
                        >
                            New request
                        </Link>
                    ) : null
                }
            />

            {flash?.success && (
                <p className="mb-4 rounded-md border border-crm-primary bg-crm-primary/10 p-3 text-sm text-crm-primary">
                    {flash.success}
                </p>
            )}

            <div className="mb-4 flex flex-wrap gap-2">
                {[
                    { label: 'All', value: '' },
                    { label: 'Open', value: 'open' },
                    { label: 'In progress', value: 'in_progress' },
                    { label: 'Waiting', value: 'waiting_user' },
                    { label: 'Resolved', value: 'resolved' },
                ].map((item) => {
                    const active = (filters.status || '') === item.value;
                    return (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() =>
                                router.get(
                                    route('app.support.index'),
                                    item.value ? { status: item.value } : {},
                                    { preserveState: true },
                                )
                            }
                            className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${
                                active
                                    ? 'border-crm-primary bg-crm-primary text-white'
                                    : 'border-crm bg-white text-crm-muted hover:text-crm-heading'
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            <CrmCard>
                <ul className="divide-y divide-crm">
                    {tickets.data.length === 0 && (
                        <li className="py-6 text-sm text-crm-muted">
                            No tickets here.
                        </li>
                    )}
                    {tickets.data.map((ticket) => (
                        <li key={ticket.id}>
                            <Link
                                href={route('app.support.show', ticket.id)}
                                className="block py-4 hover:bg-crm-canvas/50"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div>
                                        <p className="font-medium text-crm-heading">
                                            {ticket.subject}
                                        </p>
                                        <p className="mt-1 text-xs text-crm-muted">
                                            {isSuperAdmin && ticket.user
                                                ? `${ticket.user.name} · `
                                                : ''}
                                            {ticket.category}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <StatusBadge value={ticket.priority} />
                                        <StatusBadge value={ticket.status} />
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </CrmCard>
        </AppLayout>
    );
}
