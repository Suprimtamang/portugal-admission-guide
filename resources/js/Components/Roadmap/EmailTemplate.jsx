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
        <div className="space-y-5">
            <p className="text-sm leading-relaxed text-muted">{meta.note}</p>
            <div className="border border-ink bg-ink p-5 text-white">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h4 className="text-sm font-bold text-mark">Email draft</h4>
                    <button
                        type="button"
                        onClick={copy}
                        className="border border-white/40 px-3 py-1 text-xs font-bold hover:bg-white hover:text-ink"
                    >
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
                <pre className="select-all whitespace-pre-wrap border border-white/15 bg-black/30 p-4 font-mono text-[11px] leading-relaxed text-white/85">
                    {meta.email_body}
                </pre>
            </div>
            <p className="border border-rule bg-paper p-3 text-sm">
                Send to: <strong>{meta.email_to}</strong>
            </p>
        </div>
    );
}
