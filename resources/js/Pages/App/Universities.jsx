import AppLayout from '@/Layouts/AppLayout';
import CrmCard from '@/Components/Crm/CrmCard';
import PageHeader from '@/Components/Crm/PageHeader';
import { Head } from '@inertiajs/react';

export default function Universities({ universities }) {
    return (
        <AppLayout title="Universities">
            <Head title="Universities" />
            <PageHeader
                title="Universities"
                breadcrumbs={['Home', 'Universities']}
            />
            <div className="grid gap-4">
                {universities.map((uni) => (
                    <CrmCard key={uni.short}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-crm-primary">
                            {uni.short}
                        </p>
                        <h2 className="mt-1 text-lg font-semibold text-crm-heading">
                            {uni.name}
                        </h2>
                        <p className="mt-2 text-sm text-crm-muted">{uni.notes}</p>
                        <p className="mt-3 text-sm">
                            <span className="font-semibold">Language:</span>{' '}
                            {uni.language}
                        </p>
                        <p className="mt-1 text-sm text-crm-muted">
                            {uni.paths.join(' · ')}
                        </p>
                        <ul className="mt-4 space-y-1 text-sm">
                            {uni.links.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium text-crm-primary hover:underline"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </CrmCard>
                ))}
            </div>
        </AppLayout>
    );
}
