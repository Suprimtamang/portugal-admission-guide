import AppLayout from '@/Layouts/AppLayout';
import CrmCard from '@/Components/Crm/CrmCard';
import PageHeader from '@/Components/Crm/PageHeader';
import StatCard from '@/Components/Crm/StatCard';
import StatusBadge from '@/Components/Crm/StatusBadge';
import { useDashboardMotion } from '@/hooks/useDashboardMotion';
import { Head, Link, usePage } from '@inertiajs/react';

function ProgressBar({ done, total }) {
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return (
        <div className="min-w-[110px]">
            <div className="mb-1 flex items-center justify-between text-[11px] text-crm-muted">
                <span>
                    {done}/{total}
                </span>
                <span>{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-[#2aadff] to-[#0d99ff]"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

export default function Desk({ stats, queue = [], applicants = [] }) {
    const motionRef = useDashboardMotion([stats?.open_tickets]);
    const { auth } = usePage().props;
    const firstName = (auth.user?.name || 'there').split(' ')[0];

    return (
        <AppLayout title="Desk" breadcrumbs={['Home', 'Desk']}>
            <Head title="Superadmin Desk" />
            <div ref={motionRef}>
                <div
                    data-motion="hero"
                    className="crm-card mb-7 overflow-hidden bg-gradient-to-br from-[#0f1b2d] via-[#14304f] to-[#0d99ff] p-6 text-white sm:p-7"
                >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                                Operations desk
                            </p>
                            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                                Welcome back, {firstName}
                            </h1>
                            <p className="mt-2 max-w-xl text-sm text-white/75">
                                Track applicants, clear the support queue, and
                                publish guide posts from one workspace.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={route('app.posts.create')}
                                className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0f1b2d] transition hover:bg-sky-50"
                            >
                                New post
                            </Link>
                            <Link
                                href={route('app.applicants.index')}
                                className="rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                            >
                                All applicants
                            </Link>
                        </div>
                    </div>
                </div>

                <PageHeader
                    title="Overview"
                    subtitle="Live snapshot of applicants and support load."
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Applicants"
                        value={stats.applicants}
                        hint="Active applicant accounts"
                    />
                    <StatCard
                        label="Open tickets"
                        value={stats.open_tickets}
                        tone="warning"
                        hint="Needs a reply or update"
                    />
                    <StatCard
                        label="High priority"
                        value={stats.high_priority}
                        tone="danger"
                        hint="Urgent items in queue"
                    />
                    <StatCard
                        label="Resolved (7d)"
                        value={stats.resolved_week}
                        tone="success"
                        hint="Closed in the last week"
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
                        {queue.length === 0 ? (
                            <div className="crm-empty">
                                Queue is clear. Nice work.
                            </div>
                        ) : (
                            <ul className="-mx-1 space-y-1">
                                {queue.map((ticket) => (
                                    <li key={ticket.id} data-motion="row">
                                        <Link
                                            href={route(
                                                'app.support.show',
                                                ticket.id,
                                            )}
                                            className="block rounded-xl px-3 py-3 transition hover:bg-[#f5f9fc]"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-crm-heading">
                                                        {ticket.subject}
                                                    </p>
                                                    <p className="mt-1 truncate text-xs text-crm-muted">
                                                        {ticket.user?.name} ·{' '}
                                                        {ticket.user?.email}
                                                    </p>
                                                </div>
                                                <div className="flex shrink-0 flex-col items-end gap-1">
                                                    <StatusBadge
                                                        value={ticket.priority}
                                                    />
                                                    <StatusBadge
                                                        value={ticket.status}
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
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
                        padded={false}
                    >
                        {applicants.length === 0 ? (
                            <div className="p-5">
                                <div className="crm-empty">
                                    No applicants yet.
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="crm-table min-w-full text-sm">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Progress</th>
                                            <th>Tickets</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applicants.map((user) => (
                                            <tr key={user.id} data-motion="row">
                                                <td>
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
                                                <td>
                                                    <ProgressBar
                                                        done={user.progress_done}
                                                        total={
                                                            user.progress_total
                                                        }
                                                    />
                                                </td>
                                                <td className="text-crm-muted">
                                                    {user.open_tickets}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CrmCard>
                </div>
            </div>
        </AppLayout>
    );
}
