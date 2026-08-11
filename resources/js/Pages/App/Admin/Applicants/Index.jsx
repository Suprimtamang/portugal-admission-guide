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
        <AppLayout title="Applicants">
            <Head title="Applicants" />
            <PageHeader title="Applicants" breadcrumbs={['Home', 'Applicants']} />

            <CrmCard>
                <form onSubmit={search} className="mb-4 flex gap-2">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search name or email…"
                        className="w-full max-w-sm rounded-md border-crm text-sm"
                    />
                    <button
                        type="submit"
                        className="rounded-md bg-crm-primary px-4 py-2 text-sm font-semibold text-white"
                    >
                        Search
                    </button>
                </form>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-crm-canvas text-xs uppercase text-crm-muted">
                            <tr>
                                <th className="px-3 py-2 font-semibold">Applicant</th>
                                <th className="px-3 py-2 font-semibold">Joined</th>
                                <th className="px-3 py-2 font-semibold">Checklist</th>
                                <th className="px-3 py-2 font-semibold">Open tickets</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-crm">
                            {applicants.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-3 py-6 text-crm-muted"
                                    >
                                        No applicants found.
                                    </td>
                                </tr>
                            )}
                            {applicants.data.map((user) => (
                                <tr key={user.id} className="hover:bg-crm-canvas/50">
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
                                        {user.created_at}
                                    </td>
                                    <td className="px-3 py-3 text-crm-muted">
                                        {user.progress_done}/{user.progress_total}
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
        </AppLayout>
    );
}
