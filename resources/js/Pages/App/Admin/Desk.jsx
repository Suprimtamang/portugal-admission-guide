import AppLayout from '@/Layouts/AppLayout';
import CrmCard from '@/Components/Crm/CrmCard';
import PageHeader from '@/Components/Crm/PageHeader';
import StatCard from '@/Components/Crm/StatCard';
import StatusBadge from '@/Components/Crm/StatusBadge';
import { useDashboardMotion } from '@/hooks/useDashboardMotion';
import { Head, Link } from '@inertiajs/react';

export default function Desk({ stats, queue = [], applicants = [] }) {
    const motionRef = useDashboardMotion([stats?.open_tickets]);

    return (
        <AppLayout title="Desk">
            <Head title="Superadmin Desk" />
            <div ref={motionRef}>
                <PageHeader
                    title="Desk"
                    breadcrumbs={['Home', 'Desk']}
                    action={
                        <Link
                            href={route('app.applicants.index')}
                            className="rounded-md bg-crm-primary px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
                        >
                            All applicants
                        </Link>
                    }
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Applicants" value={stats.applicants} />
                    <StatCard
                        label="Open tickets"
                        value={stats.open_tickets}
                        tone="warning"
                    />
                    <StatCard
                        label="High priority"
                        value={stats.high_priority}
                        tone="danger"
                    />
                    <StatCard
                        label="Resolved (7d)"
                        value={stats.resolved_week}
                        tone="success"
                    />
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                    <CrmCard
                        title="Needs attention"
                        action={
                            <Link
                                href={route('app.support.index')}
                                className="text-sm font-semibold text-crm-primary"
                            >
                                Open queue
                            </Link>
                        }
                    >
                        <ul className="divide-y divide-crm">
                            {queue.length === 0 && (
                                <li className="py-4 text-sm text-crm-muted">
                                    Queue is clear.
                                </li>
                            )}
                            {queue.map((ticket) => (
                                <li key={ticket.id} data-motion="row">
                                    <Link
                                        href={route('app.support.show', ticket.id)}
                                        className="block py-3 hover:bg-crm-canvas/60"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-medium text-crm-heading">
                                                    {ticket.subject}
                                                </p>
                                                <p className="mt-1 text-xs text-crm-muted">
                                                    {ticket.user?.name} ·{' '}
                                                    {ticket.user?.email}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <StatusBadge value={ticket.priority} />
                                                <StatusBadge value={ticket.status} />
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CrmCard>

                    <CrmCard
                        title="Recent applicants"
                        action={
                            <Link
                                href={route('app.applicants.index')}
                                className="text-sm font-semibold text-crm-primary"
                            >
                                View all
                            </Link>
                        }
                    >
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-crm-canvas text-xs uppercase text-crm-muted">
                                    <tr>
                                        <th className="px-3 py-2 font-semibold">Name</th>
                                        <th className="px-3 py-2 font-semibold">Progress</th>
                                        <th className="px-3 py-2 font-semibold">Tickets</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-crm">
                                    {applicants.map((user) => (
                                        <tr key={user.id} data-motion="row">
                                            <td className="px-3 py-3">
                                                <Link
                                                    href={route(
                                                        'app.applicants.show',
                                                        user.id,
                                                    )}
                                                    className="font-medium text-crm-heading hover:text-crm-primary"
                                                >
                                                    {user.name}
                                                </Link>
                                                <p className="text-xs text-crm-muted">
                                                    {user.email}
                                                </p>
                                            </td>
                                            <td className="px-3 py-3 text-crm-muted">
                                                {user.progress_done}/
                                                {user.progress_total}
                                            </td>
                                            <td className="px-3 py-3 text-crm-muted">
                                                {user.open_tickets}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CrmCard>
                </div>
            </div>
        </AppLayout>
    );
}
