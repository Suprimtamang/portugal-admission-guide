import AppLayout from '@/Layouts/AppLayout';
import CrmCard from '@/Components/Crm/CrmCard';
import PageHeader from '@/Components/Crm/PageHeader';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Chat({ disclaimer }) {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content:
                'Ask about National Student eligibility, equivalency, exam substitution, AIMA residence, or university contests. I cite official sources only.',
            citations: [],
        },
    ]);
    const [input, setInput] = useState('');
    const [language, setLanguage] = useState('auto');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const send = async (event) => {
        event.preventDefault();
        if (!input.trim() || loading) {
            return;
        }

        const userMessage = input.trim();
        setInput('');
        setError('');
        setMessages((prev) => [
            ...prev,
            { role: 'user', content: userMessage, citations: [] },
        ]);
        setLoading(true);

        try {
            const csrf = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');

            const response = await window.axios.post(
                route('app.chat.store'),
                { message: userMessage, language },
                csrf ? { headers: { 'X-CSRF-TOKEN': csrf } } : undefined,
            );

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: response.data.reply,
                    citations: response.data.citations || [],
                },
            ]);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    'The assistant is unavailable right now. Check your Groq API key and try again.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout title="Assistant">
            <Head title="Assistant" />
            <PageHeader title="Assistant" breadcrumbs={['Home', 'Assistant']} />
            <p className="mb-4 max-w-3xl text-sm text-crm-muted">{disclaimer}</p>

            <CrmCard className="max-w-3xl">
                <div
                    className="space-y-3 overflow-y-auto"
                    style={{ maxHeight: '55vh' }}
                >
                    {messages.map((message, index) => (
                        <div
                            key={`${message.role}-${index}`}
                            className={`max-w-[92%] rounded-md border p-3 text-sm leading-relaxed ${
                                message.role === 'user'
                                    ? 'ml-auto border-crm-primary bg-crm-primary text-white'
                                    : 'mr-auto border-crm bg-crm-canvas text-crm-heading'
                            }`}
                        >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            {message.citations?.length > 0 && (
                                <ul className="mt-3 space-y-1 border-t border-current/20 pt-3 text-xs">
                                    {message.citations.map((citation) => (
                                        <li key={citation.url}>
                                            <a
                                                href={citation.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-semibold underline"
                                            >
                                                {citation.title || citation.url}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <p className="text-sm font-medium text-crm-muted">
                            Checking official pages…
                        </p>
                    )}
                </div>

                <form onSubmit={send} className="mt-4 border-t border-crm pt-4">
                    {error && (
                        <p className="mb-3 rounded-md bg-red-50 p-2 text-xs text-crm-danger">
                            {error}
                        </p>
                    )}
                    <div className="mb-3 flex items-center gap-2">
                        <label className="text-xs font-semibold text-crm-muted">
                            Reply in
                        </label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="rounded-md border-crm text-sm"
                        >
                            <option value="auto">Auto</option>
                            <option value="en">English</option>
                            <option value="pt">Portuguese</option>
                            <option value="hi">Hindi</option>
                            <option value="ne">Nepali</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about eligibility, equivalency, AIMA…"
                            className="flex-1 rounded-md border-crm text-sm"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-crm-primary px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
                        >
                            Ask
                        </button>
                    </div>
                </form>
            </CrmCard>
        </AppLayout>
    );
}
