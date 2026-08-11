import AppLayout from '@/Layouts/AppLayout';
import CrmCard from '@/Components/Crm/CrmCard';
import PageHeader from '@/Components/Crm/PageHeader';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ applicants, filters }) {
    const [q, setQ] = useState(filters.q || '');

    const search = (e) => {
        e.preventDefault();
        router.get(
            route('app.applicants.index'),
            q ? { q } : {},
            { preserveState: true },
        );
    };

    return (
        <AppLayout title="Applicants" breadcrumbs={['Home', 'Applicants']}>
            <Head title="Applicants" />
            <PageHeader
                title="Applicants"
                subtitle="Search and open applicant profiles, progress, and tickets."
            />

            <CrmCard padded={false}>
                <div className="border-b border-crm px-5 py-4">
                    <form
                        onSubmit={search}
                        className="flex flex-col gap-3 sm:flex-row sm:items-center"
                    >
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search name or email…"
                            className="crm-input max-w-md"
                        />
                        <button type="submit" className="crm-btn-primary">
                            Search
                        </button>
                    </form>
                </div>

                {applicants.data.length === 0 ? (
                    <div className="p-5">
                        <div className="crm-empty">No applicants found.</div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="crm-table min-w-full text-sm">
                            <thead>
                                <tr>
                                    <th>Applicant</th>
                                    <th>Joined</th>
                                    <th>Checklist</th>
                                    <th>Open tickets</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applicants.data.map((user) => (
                                    <tr key={user.id}>
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
                                        <td className="text-crm-muted">
                                            {user.created_at}
                                        </td>
                                        <td className="text-crm-muted">
                                            {user.progress_done}/
                                            {user.progress_total}
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
        </AppLayout>
    );
}
