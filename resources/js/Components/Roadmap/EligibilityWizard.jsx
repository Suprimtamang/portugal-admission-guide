import { useState } from 'react';

export default function EligibilityWizard({ meta }) {
    const [checks, setChecks] = useState(() =>
        (meta.rules || []).map(() => false),
    );

    const eligible = checks.some(Boolean);
    const checkedCount = checks.filter(Boolean).length;

    const toggle = (index) => {
        setChecks((prev) =>
            prev.map((value, i) => (i === index ? !value : value)),
        );
    };

    return (
        <div className="space-y-4 sm:space-y-5">
            <div className="overflow-hidden rounded-2xl border border-crm bg-gradient-to-br from-[#f4f9ff] to-white shadow-crm">
                <div className="border-b border-crm bg-white/80 px-4 py-4 sm:px-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-crm-primary">
                        Eligibility check
                    </p>
                    <h4 className="mt-1 text-lg font-semibold tracking-tight text-crm-heading sm:text-xl">
                        {meta.heading?.replace(/:$/, '') ||
                            'Check Your Status (Decree-Law 62/2018)'}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-crm-muted">
                        {meta.prompt ||
                            'Do you (or a parent) fall into any of these situations?'}
                    </p>
                </div>

                <ul className="divide-y divide-crm px-2 py-2 sm:px-3">
                    {(meta.rules || []).map((rule, index) => {
                        const active = checks[index];
                        return (
                            <li key={rule} className="p-1.5 sm:p-2">
                                <label
                                    htmlFor={`rule-${index}`}
                                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3.5 transition sm:gap-4 sm:px-4 ${
                                        active
                                            ? 'border-[#0d99ff]/35 bg-[#0d99ff]/8 shadow-[inset_3px_0_0_0_#0d99ff]'
                                            : 'border-transparent bg-white hover:border-crm hover:bg-slate-50'
                                    }`}
                                >
                                    <span
                                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${
                                            active
                                                ? 'border-crm-primary bg-crm-primary text-white'
                                                : 'border-slate-300 bg-white'
                                        }`}
                                    >
                                        {active && (
                                            <svg
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="h-3.5 w-3.5"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </span>
                                    <input
                                        id={`rule-${index}`}
                                        type="checkbox"
                                        className="sr-only"
                                        checked={active}
                                        onChange={() => toggle(index)}
                                    />
                                    <span className="min-w-0 flex-1 text-sm leading-relaxed text-crm-heading">
                                        {rule}
                                    </span>
                                </label>
                            </li>
                        );
                    })}
                </ul>

                <div className="border-t border-crm px-4 py-4 sm:px-5">
                    {eligible ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                            <p className="text-sm font-semibold text-emerald-800">
                                {meta.success ||
                                    'You are likely eligible to apply as a National Student.'}
                            </p>
                            <p className="mt-1 text-xs text-emerald-700/80">
                                {checkedCount} rule
                                {checkedCount === 1 ? '' : 's'} matched — still
                                confirm with DGES before applying.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-crm bg-slate-50 px-4 py-3">
                            <p className="text-sm font-medium text-crm-heading">
                                Tick any matching rule to check eligibility
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-crm-muted">
                                Select the situation that applies to you or a
                                parent. You can change this anytime.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {meta.footnote && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                        Important
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-amber-900/90">
                        {meta.footnote.replace(/^Important:\s*/i, '')}
                    </p>
                </div>
            )}
        </div>
    );
}
