import { useState } from 'react';

export default function EmailTemplate({ meta }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(meta.email_body || '');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-sm leading-relaxed text-crm-muted">{meta.note}</p>
            <div className="overflow-hidden rounded-2xl border border-crm bg-[#0f1b2d] text-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
                    <h4 className="text-sm font-semibold text-[#9fd4ff]">
                        Email draft
                    </h4>
                    <button
                        type="button"
                        onClick={copy}
                        className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold hover:bg-white hover:text-[#0f1b2d]"
                    >
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
                <pre className="select-all whitespace-pre-wrap px-4 py-4 font-mono text-[11px] leading-relaxed text-white/85 sm:px-5">
                    {meta.email_body}
                </pre>
            </div>
            <p className="rounded-xl border border-crm bg-slate-50 px-4 py-3 text-sm text-crm-heading">
                Send to: <strong>{meta.email_to}</strong>
            </p>
        </div>
    );
}
