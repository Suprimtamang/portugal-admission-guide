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
        if (window.innerWidth < 1024) {
            document
                .getElementById('detail-pane')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activeIndex]);

    return (
        <AppLayout title="Roadmap" breadcrumbs={['Home', 'Roadmap']}>
            <Head title="Admission Roadmap" />
            <PageHeader
                title="Admission roadmap"
                subtitle="Follow the National Student pathway step by step."
            />

            <div className="mb-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden">
                {steps.map((item, index) => {
                    const active = index === activeIndex;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                                active
                                    ? 'bg-crm-primary text-white'
                                    : 'bg-white text-crm-muted ring-1 ring-crm'
                            }`}
                        >
                            {index + 1}.{' '}
                            {item.title.replace(/^\d+\.\s*/, '').split(' ')[0]}
                        </button>
                    );
                })}
            </div>

            <div className="grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)] xl:gap-6">
                <CrmCard className="hidden h-fit lg:block" padded={false}>
                    <div className="border-b border-crm px-5 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-crm-muted">
                            Pathway
                        </p>
                    </div>
                    <div className="space-y-1 p-3">
                        {steps.map((item, index) => {
                            const active = index === activeIndex;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveIndex(index)}
                                    className={`w-full rounded-xl px-3 py-3 text-left text-sm transition ${
                                        active
                                            ? 'bg-crm-primary/10 text-crm-primary shadow-[inset_3px_0_0_0_#0d99ff]'
                                            : 'text-crm-muted hover:bg-slate-50 hover:text-crm-heading'
                                    }`}
                                >
                                    <span className="block text-[11px] font-semibold uppercase tracking-wide opacity-80">
                                        Step {index + 1}
                                    </span>
                                    <span className="mt-0.5 block font-medium leading-snug">
                                        {item.title.replace(/^\d+\.\s*/, '')}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="border-t border-crm px-5 py-4">
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
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-crm-primary">
                            Step {activeIndex + 1} of {steps.length}
                        </p>
                        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100 sm:w-36">
                            <div
                                className="h-full rounded-full bg-crm-primary transition-all"
                                style={{
                                    width: `${((activeIndex + 1) / steps.length) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-crm-heading sm:text-2xl">
                        {step.title.replace(/^\d+\.\s*/, '')}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-crm-muted">
                        {step.intro}
                    </p>
                    <div className="mt-6 border-t border-crm pt-6">
                        <StepBody step={step} />
                    </div>
                    <div className="mt-8 flex items-center justify-between gap-3 border-t border-crm pt-5">
                        <button
                            type="button"
                            onClick={() =>
                                setActiveIndex((i) => Math.max(0, i - 1))
                            }
                            className={`rounded-xl px-3 py-2 text-sm font-semibold text-crm-muted hover:bg-slate-50 hover:text-crm-heading ${
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
                            className={`crm-btn-primary ${
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
