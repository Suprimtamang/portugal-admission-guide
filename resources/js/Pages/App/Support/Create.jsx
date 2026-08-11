import AppLayout from '@/Layouts/AppLayout';
import CrmCard from '@/Components/Crm/CrmCard';
import PageHeader from '@/Components/Crm/PageHeader';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        category: 'application',
        priority: 'normal',
        body: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('app.support.store'));
    };

    return (
        <AppLayout title="Request help">
            <Head title="Request help" />
            <PageHeader
                title="Request application help"
                breadcrumbs={['Home', 'Help', 'New']}
                action={
                    <Link
                        href={route('app.support.index')}
                        className="text-sm font-semibold text-crm-primary"
                    >
                        ← Back
                    </Link>
                }
            />

            <CrmCard className="max-w-2xl">
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <InputLabel htmlFor="subject" value="Subject" />
                        <TextInput
                            id="subject"
                            className="mt-1 block w-full"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.subject} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="category" value="Topic" />
                            <select
                                id="category"
                                className="mt-1 block w-full rounded-md border-crm text-sm"
                                value={data.category}
                                onChange={(e) =>
                                    setData('category', e.target.value)
                                }
                            >
                                <option value="application">Application</option>
                                <option value="documents">Documents</option>
                                <option value="equivalency">Equivalency</option>
                                <option value="aima">AIMA / stay</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="priority" value="Priority" />
                            <select
                                id="priority"
                                className="mt-1 block w-full rounded-md border-crm text-sm"
                                value={data.priority}
                                onChange={(e) =>
                                    setData('priority', e.target.value)
                                }
                            >
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High — deadline soon</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="body" value="What do you need?" />
                        <textarea
                            id="body"
                            rows={7}
                            className="mt-1 block w-full rounded-md border-crm text-sm"
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.body} />
                    </div>

                    <PrimaryButton disabled={processing}>
                        Send to admin
                    </PrimaryButton>
                </form>
            </CrmCard>
        </AppLayout>
    );
}
