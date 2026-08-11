import AppLayout from '@/Layouts/AppLayout';
import CrmCard from '@/Components/Crm/CrmCard';
import PageHeader from '@/Components/Crm/PageHeader';
import { Head, router } from '@inertiajs/react';

export default function Aima({ sections, links, documents = [], lastUpdated }) {
    const toggle = (doc) => {
        router.post(
            route('app.aima.documents.toggle'),
            { document_key: doc.key, completed: !doc.completed },
            { preserveScroll: true },
        );
    };

    return (
        <AppLayout title="AIMA">
            <Head title="AIMA & Stay" />
            <PageHeader
                title="AIMA & residence"
                breadcrumbs={['Home', 'AIMA']}
            />

            <div className="grid gap-6 lg:grid-cols-5">
                <div className="space-y-6 lg:col-span-3">
                    <CrmCard title="Guide">
                        {lastUpdated && (
                            <p className="mb-4 text-xs text-crm-muted">
                                Content last updated {lastUpdated}
                            </p>
                        )}
                        <div className="space-y-5">
                            {sections.map((section) => (
                                <article
                                    key={section.title}
                                    className="border-b border-crm pb-5 last:border-0 last:pb-0"
                                >
                                    <div className="flex flex-wrap items-baseline gap-2">
                                        <h2 className="text-base font-semibold text-crm-heading">
                                            {section.title}
                                        </h2>
                                        <span className="text-[11px] font-semibold uppercase text-crm-muted">
                                            {section.official
                                                ? 'Official'
                                                : 'Tip'}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm leading-relaxed text-crm-muted">
                                        {section.body}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </CrmCard>
                </div>

                <div className="space-y-6 lg:col-span-2">
                    <CrmCard title="Your documents">
                        <p className="mb-4 text-xs text-crm-muted">
                            Tick items as you gather them for your AIMA file.
                        </p>
                        <ul className="space-y-2">
                            {documents.map((doc) => (
                                <li key={doc.key}>
                                    <label className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 hover:bg-crm-canvas">
                                        <input
                                            type="checkbox"
                                            className="mt-0.5 rounded border-crm text-crm-primary focus:ring-crm-primary"
                                            checked={doc.completed}
                                            onChange={() => toggle(doc)}
                                        />
                                        <span
                                            className={`text-sm ${
                                                doc.completed
                                                    ? 'text-crm-muted line-through'
                                                    : 'text-crm-heading'
                                            }`}
                                        >
                                            {doc.label}
                                        </span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </CrmCard>

                    <CrmCard title="Official links">
                        <ul className="space-y-2 text-sm">
                            {links.map((link) => (
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
                </div>
            </div>
        </AppLayout>
    );
}
