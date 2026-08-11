import AppLayout from '@/Layouts/AppLayout';
import CrmCard from '@/Components/Crm/CrmCard';
import PageHeader from '@/Components/Crm/PageHeader';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ post }) {
    const editing = Boolean(post?.id);
    const { data, setData, post: create, put, processing, errors } = useForm({
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        body: post?.body || '',
        status: post?.status || 'draft',
        published_at: post?.published_at || '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('app.posts.update', post.id));
            return;
        }
        create(route('app.posts.store'));
    };

    return (
        <AppLayout title={editing ? 'Edit post' : 'New post'}>
            <Head title={editing ? 'Edit post' : 'New post'} />
            <PageHeader
                title={editing ? 'Edit post' : 'New post'}
                breadcrumbs={[
                    'Home',
                    'Posts',
                    editing ? 'Edit' : 'New',
                ]}
                action={
                    <Link
                        href={route('app.posts.index')}
                        className="text-sm font-semibold text-crm-primary"
                    >
                        ← All posts
                    </Link>
                }
            />

            <CrmCard className="max-w-3xl">
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <InputLabel htmlFor="title" value="Title" />
                        <TextInput
                            id="title"
                            className="mt-1 block w-full"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.title} />
                    </div>

                    <div>
                        <InputLabel htmlFor="slug" value="Slug (optional)" />
                        <TextInput
                            id="slug"
                            className="mt-1 block w-full"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            placeholder="Auto-generated from title"
                        />
                        <p className="mt-1 text-xs text-crm-muted">
                            Public URL: /blog/{data.slug || 'your-slug'}
                        </p>
                        <InputError className="mt-2" message={errors.slug} />
                    </div>

                    <div>
                        <InputLabel htmlFor="excerpt" value="Excerpt" />
                        <textarea
                            id="excerpt"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-crm text-sm"
                            value={data.excerpt}
                            onChange={(e) => setData('excerpt', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.excerpt} />
                    </div>

                    <div>
                        <InputLabel htmlFor="body" value="Body" />
                        <textarea
                            id="body"
                            rows={14}
                            className="mt-1 block w-full rounded-md border-crm font-mono text-sm"
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.body} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="status" value="Status" />
                            <select
                                id="status"
                                className="mt-1 block w-full rounded-md border-crm text-sm"
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                            <InputError
                                className="mt-2"
                                message={errors.status}
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="published_at"
                                value="Publish at"
                            />
                            <input
                                id="published_at"
                                type="datetime-local"
                                className="mt-1 block w-full rounded-md border-crm text-sm"
                                value={data.published_at}
                                onChange={(e) =>
                                    setData('published_at', e.target.value)
                                }
                            />
                            <p className="mt-1 text-xs text-crm-muted">
                                Leave blank when publishing to use now.
                            </p>
                            <InputError
                                className="mt-2"
                                message={errors.published_at}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <PrimaryButton disabled={processing}>
                            {editing ? 'Save changes' : 'Create post'}
                        </PrimaryButton>
                        <Link
                            href={route('app.posts.index')}
                            className="text-sm text-crm-muted hover:text-crm-heading"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </CrmCard>
        </AppLayout>
    );
}
