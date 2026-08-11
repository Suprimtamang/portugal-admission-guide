import { useState } from 'react';

export default function EligibilityWizard({ meta }) {
    const [checks, setChecks] = useState(() =>
        (meta.rules || []).map(() => false),
    );

    const eligible = checks.some(Boolean);

    const toggle = (index) => {
        setChecks((prev) =>
            prev.map((value, i) => (i === index ? !value : value)),
        );
    };

    return (
        <div className="space-y-5">
            <div className="border border-ink bg-ink p-5 text-white sm:p-6">
                <h4 className="font-display text-xl font-semibold text-mark">
                    {meta.heading}
                </h4>
                <p className="mt-4 text-sm leading-relaxed">{meta.prompt}</p>
                <ul className="mt-5 space-y-3 text-sm">
                    {(meta.rules || []).map((rule, index) => (
                        <li key={rule} className="flex items-start gap-3">
                            <input
                                id={`rule-${index}`}
                                type="checkbox"
                                className="mt-1 border-white/40 bg-transparent text-azul focus:ring-azul"
                                checked={checks[index]}
                                onChange={() => toggle(index)}
                            />
                            <label htmlFor={`rule-${index}`}>{rule}</label>
                        </li>
                    ))}
                </ul>
                {eligible ? (
                    <p className="mt-5 border border-mark bg-mark/20 p-3 text-sm font-bold text-mark">
                        {meta.success}
                    </p>
                ) : (
                    <p className="mt-5 text-xs text-white/55">
                        Tick any matching rule to check eligibility.
                    </p>
                )}
            </div>
            {meta.footnote && (
                <p className="text-xs leading-relaxed text-muted">{meta.footnote}</p>
            )}
        </div>
    );
}
