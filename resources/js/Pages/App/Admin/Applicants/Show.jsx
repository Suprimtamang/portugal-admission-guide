import AppLayout from '@/Layouts/AppLayout';
import CrmCard from '@/Components/Crm/CrmCard';
import PageHeader from '@/Components/Crm/PageHeader';
import StatusBadge from '@/Components/Crm/StatusBadge';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ applicant, tickets, canPromote = false }) {
    const promote = () => {
        if (!confirm(`Make ${applicant.name} a superadmin?`)) {
            return;
        }
        router.patch(route('app.admins.update', applicant.id), {
            role: 'superadmin',
        });
    };

    return (
        <AppLayout title={applicant.name}>
            <Head title={applicant.name} />
            <PageHeader
                title={applicant.name}
                breadcrumbs={['Home', 'Applicants', applicant.name]}
                action={
                    <div className="flex flex-wrap items-center gap-3">
                        {canPromote && (
                            <button
                                type="button"
                                onClick={promote}
                                className="rounded-md bg-crm-primary px-3 py-1.5 text-sm font-semibold text-white"
                            >
                                Make admin
                            </button>
                        )}
                        <Link
                            href={route('app.applicants.index')}
                            className="text-sm font-semibold text-crm-primary"
                        >
                            ← All applicants
                        </Link>
                    </div>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <CrmCard title="Profile" className="lg:col-span-1">
                    <dl className="space-y-3 text-sm">
                        <div>
                            <dt className="text-crm-muted">Email</dt>
                            <dd className="font-medium">{applicant.email}</dd>
                        </div>
                        <div>
                            <dt className="text-crm-muted">Joined</dt>
                            <dd className="font-medium">{applicant.created_at}</dd>
                        </div>
                        <div>
                            <dt className="text-crm-muted">Checklist progress</dt>
                            <dd className="font-medium">
                                {applicant.progress_done}/
                                {applicant.progress_total}
                            </dd>
                        </div>
                    </dl>
                </CrmCard>

                <CrmCard title="Support tickets" className="lg:col-span-2">
                    <ul className="divide-y divide-crm">
                        {tickets.length === 0 && (
                            <li className="py-4 text-sm text-crm-muted">
                                No tickets from this applicant.
                            </li>
                        )}
                        {tickets.map((ticket) => (
                            <li key={ticket.id} className="py-3">
                                <Link
                                    href={route('app.support.show', ticket.id)}
                                    className="flex flex-wrap items-center justify-between gap-2 hover:text-crm-primary"
                                >
                                    <span className="font-medium">
                                        {ticket.subject}
                                    </span>
                                    <span className="flex gap-2">
                                        <StatusBadge value={ticket.priority} />
                                        <StatusBadge value={ticket.status} />
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </CrmCard>
            </div>
        </AppLayout>
    );
}
