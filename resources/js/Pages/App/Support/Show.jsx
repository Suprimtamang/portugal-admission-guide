import AppLayout from '@/Layouts/AppLayout';
import CrmCard from '@/Components/Crm/CrmCard';
import PageHeader from '@/Components/Crm/PageHeader';
import StatusBadge from '@/Components/Crm/StatusBadge';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Show({
    ticket,
    isSuperAdmin,
    statuses,
    applicantProgress,
}) {
    const replyForm = useForm({ body: '' });
    const statusForm = useForm({
        status: ticket.status,
        priority: ticket.priority,
    });

    const sendReply = (e) => {
        e.preventDefault();
        replyForm.post(route('app.support.reply', ticket.id), {
            preserveScroll: true,
            onSuccess: () => replyForm.reset('body'),
        });
    };

    const saveStatus = (e) => {
        e.preventDefault();
        statusForm.patch(route('app.support.update', ticket.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title={ticket.subject}>
            <Head title={ticket.subject} />
            <PageHeader
                title={ticket.subject}
                breadcrumbs={['Home', 'Support', 'Ticket']}
                action={
                    <Link
                        href={route('app.support.index')}
                        className="text-sm font-semibold text-crm-primary"
                    >
                        ← All requests
                    </Link>
                }
            />

            <div className="mb-4 flex flex-wrap gap-2">
                <StatusBadge value={ticket.category} />
                <StatusBadge value={ticket.priority} />
                <StatusBadge value={ticket.status} />
            </div>

            {isSuperAdmin && (
                <CrmCard className="mb-6" title="Applicant">
                    <p className="text-sm">
                        <strong>{ticket.user.name}</strong> ({ticket.user.email})
                        {applicantProgress && (
                            <>
                                {' '}
                                · Checklist {applicantProgress.done}/
                                {applicantProgress.total}
                            </>
                        )}
                    </p>
                    <form
                        onSubmit={saveStatus}
                        className="mt-4 flex flex-wrap items-end gap-3"
                    >
                        <div>
                            <label className="text-xs font-semibold text-crm-muted">
                                Status
                            </label>
                            <select
                                className="mt-1 block rounded-md border-crm text-sm"
                                value={statusForm.data.status}
                                onChange={(e) =>
                                    statusForm.setData('status', e.target.value)
                                }
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-crm-muted">
                                Priority
                            </label>
                            <select
                                className="mt-1 block rounded-md border-crm text-sm"
                                value={statusForm.data.priority}
                                onChange={(e) =>
                                    statusForm.setData(
                                        'priority',
                                        e.target.value,
                                    )
                                }
                            >
                                <option value="low">low</option>
                                <option value="normal">normal</option>
                                <option value="high">high</option>
                            </select>
                        </div>
                        <PrimaryButton disabled={statusForm.processing}>
                            Update
                        </PrimaryButton>
                    </form>
                </CrmCard>
            )}

            <div className="space-y-3">
                {ticket.messages.map((message) => (
                    <CrmCard key={message.id}>
                        <p className="text-xs font-semibold text-crm-muted">
                            {message.is_staff ? 'Staff' : 'Applicant'} ·{' '}
                            {message.author} · {message.created_at}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                            {message.body}
                        </p>
                    </CrmCard>
                ))}
            </div>

            <CrmCard className="mt-6" title={isSuperAdmin ? 'Reply' : 'Add a message'}>
                <form onSubmit={sendReply} className="space-y-3">
                    <textarea
                        rows={5}
                        className="block w-full rounded-md border-crm text-sm"
                        value={replyForm.data.body}
                        onChange={(e) =>
                            replyForm.setData('body', e.target.value)
                        }
                        required
                    />
                    <PrimaryButton disabled={replyForm.processing}>
                        Send
                    </PrimaryButton>
                </form>
            </CrmCard>
        </AppLayout>
    );
}
