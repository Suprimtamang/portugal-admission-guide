import { useEffect, useState } from 'react';
import EligibilityWizard from '@/Components/Roadmap/EligibilityWizard';
import EmailTemplate from '@/Components/Roadmap/EmailTemplate';
import EquivalencyContent from '@/Components/Roadmap/EquivalencyContent';
import FinishContent from '@/Components/Roadmap/FinishContent';
import GaesContent from '@/Components/Roadmap/GaesContent';
import StepChecklist from '@/Components/Roadmap/StepChecklist';
import AppLayout from '@/Layouts/AppLayout';
import CrmCard from '@/Components/Crm/CrmCard';
import PageHeader from '@/Components/Crm/PageHeader';
import { Head } from '@inertiajs/react';

function StepBody({ step }) {
    const type = step.meta?.type;

    switch (type) {
        case 'wizard':
            return <EligibilityWizard meta={step.meta} />;
        case 'checklist':
            return <StepChecklist items={step.checklist_items} />;
        case 'equivalency':
            return <EquivalencyContent meta={step.meta} />;
        case 'email_template':
            return <EmailTemplate meta={step.meta} />;
        case 'gaes':
            return <GaesContent meta={step.meta} />;
        case 'finish':
            return <FinishContent meta={step.meta} />;
        default:
            return null;
    }
}

export default function Index({ steps, supportLinks }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const step = steps[activeIndex];

    useEffect(() => {
        if (window.innerWidth < 768) {
            document
                .getElementById('detail-pane')
                ?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeIndex]);

    return (
        <AppLayout title="Roadmap">
            <Head title="Admission Roadmap" />
            <PageHeader
                title="Admission roadmap"
                breadcrumbs={['Home', 'Roadmap']}
            />

            <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
                <CrmCard className="h-fit">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-crm-muted">
                        Pathway
                    </p>
                    <div className="space-y-1">
                        {steps.map((item, index) => {
                            const active = index === activeIndex;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveIndex(index)}
                                    className={`w-full rounded-md px-3 py-2.5 text-left text-sm transition ${
                                        active
                                            ? 'bg-crm-primary/10 text-crm-primary'
                                            : 'text-crm-muted hover:bg-crm-canvas hover:text-crm-heading'
                                    }`}
                                >
                                    <span className="block text-[11px] font-semibold">
                                        Step {index + 1}
                                    </span>
                                    <span className="mt-0.5 block font-medium leading-snug">
                                        {item.title.replace(/^\d+\.\s*/, '')}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-5 border-t border-crm pt-4">
                        <p className="text-xs font-semibold text-crm-muted">
                            Official desks
                        </p>
                        <ul className="mt-2 space-y-2">
                            {supportLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm font-medium text-crm-primary hover:underline"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CrmCard>

                <CrmCard id="detail-pane">
                    <p className="text-xs font-semibold uppercase tracking-wide text-crm-primary">
                        Step {activeIndex + 1} of {steps.length}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-crm-heading">
                        {step.title.replace(/^\d+\.\s*/, '')}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-crm-muted">
                        {step.intro}
                    </p>
                    <div className="mt-6 border-t border-crm pt-6">
                        <StepBody step={step} />
                    </div>
                    <div className="mt-8 flex items-center justify-between border-t border-crm pt-5">
                        <button
                            type="button"
                            onClick={() =>
                                setActiveIndex((i) => Math.max(0, i - 1))
                            }
                            className={`text-sm font-semibold text-crm-muted hover:text-crm-heading ${
                                activeIndex === 0 ? 'invisible' : ''
                            }`}
                        >
                            ← Back
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                setActiveIndex((i) =>
                                    Math.min(steps.length - 1, i + 1),
                                )
                            }
                            className={`rounded-md bg-crm-heading px-4 py-2 text-sm font-semibold text-white hover:bg-crm-primary ${
                                activeIndex === steps.length - 1
                                    ? 'invisible'
                                    : ''
                            }`}
                        >
                            Next →
                        </button>
                    </div>
                </CrmCard>
            </div>
        </AppLayout>
    );
}
