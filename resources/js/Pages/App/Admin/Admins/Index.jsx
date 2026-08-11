import AppLayout from '@/Layouts/AppLayout';
import CrmCard from '@/Components/Crm/CrmCard';
import PageHeader from '@/Components/Crm/PageHeader';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ admins, candidates }) {
    const { flash } = usePage().props;
    const [selected, setSelected] = useState(candidates[0]?.id ?? '');
    const form = useForm({ role: 'superadmin' });

    const promote = (e) => {
        e.preventDefault();
        if (!selected) {
            return;
        }
        form.patch(route('app.admins.update', selected), {
            preserveScroll: true,
            onSuccess: () => setSelected(''),
        });
    };

    const demote = (user) => {
        if (user.is_owner) {
            return;
        }
        if (!confirm(`Remove admin access for ${user.name}?`)) {
            return;
        }
        router.patch(
            route('app.admins.update', user.id),
            { role: 'user' },
            { preserveScroll: true },
        );
    };

    return (
        <AppLayout title="Admins">
            <Head title="Manage admins" />
            <PageHeader
                title="Admins"
                breadcrumbs={['Home', 'Admins']}
            />

            {flash?.success && (
                <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                    {flash.success}
                </p>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <CrmCard title="Current superadmins">
                    <ul className="divide-y divide-crm">
                        {admins.map((admin) => (
                            <li
                                key={admin.id}
                                className="flex flex-wrap items-center justify-between gap-3 py-3"
                            >
                                <div>
                                    <p className="font-medium text-crm-heading">
                                        {admin.name}
                                        {admin.is_owner && (
                                            <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-crm-primary">
                                                Owner
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-crm-muted">
                                        {admin.email}
                                    </p>
                                </div>
                                {!admin.is_owner && (
                                    <button
                                        type="button"
                                        onClick={() => demote(admin)}
                                        className="rounded-md border border-crm px-3 py-1.5 text-sm font-medium hover:border-red-400 hover:text-red-600"
                                    >
                                        Remove admin
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </CrmCard>

                <CrmCard title="Add admin">
                    <p className="mb-4 text-sm text-crm-muted">
                        Only the owner account can grant superadmin access.
                    </p>
                    {candidates.length === 0 ? (
                        <p className="text-sm text-crm-muted">
                            No applicants available to promote.
                        </p>
                    ) : (
                        <form onSubmit={promote} className="space-y-3">
                            <label className="block text-sm">
                                <span className="mb-1 block text-crm-muted">
                                    Applicant
                                </span>
                                <select
                                    value={selected}
                                    onChange={(e) => setSelected(e.target.value)}
                                    className="w-full rounded-md border-crm text-sm"
                                >
                                    <option value="">Select applicant…</option>
                                    {candidates.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button
                                type="submit"
                                disabled={!selected || form.processing}
                                className="rounded-md bg-crm-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                            >
                                Make superadmin
                            </button>
                        </form>
                    )}
                </CrmCard>
            </div>
        </AppLayout>
    );
}
