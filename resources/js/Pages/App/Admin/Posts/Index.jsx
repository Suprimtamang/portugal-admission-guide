import AppLayout from '@/Layouts/AppLayout';
import CrmCard from '@/Components/Crm/CrmCard';
import PageHeader from '@/Components/Crm/PageHeader';
import StatusBadge from '@/Components/Crm/StatusBadge';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ posts, filters }) {
    const { flash } = usePage().props;
    const [q, setQ] = useState(filters.q || '');

    const search = (e) => {
        e.preventDefault();
        router.get(
            route('app.posts.index'),
            q ? { q } : {},
            { preserveState: true },
        );
    };

    const destroy = (post) => {
        if (!confirm(`Delete “${post.title}”?`)) {
            return;
        }
        router.delete(route('app.posts.destroy', post.id));
    };

    return (
        <AppLayout title="Posts">
            <Head title="Posts" />
            <PageHeader
                title="Posts"
                breadcrumbs={['Home', 'Posts']}
                action={
                    <Link
                        href={route('app.posts.create')}
                        className="rounded-md bg-crm-primary px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
                    >
                        New post
                    </Link>
                }
            />

            {flash?.success && (
                <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                    {flash.success}
                </p>
            )}

            <CrmCard>
                <form onSubmit={search} className="mb-4 flex gap-2">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search title or slug…"
                        className="w-full max-w-sm rounded-md border-crm text-sm"
                    />
                    <button
                        type="submit"
                        className="rounded-md bg-crm-primary px-4 py-2 text-sm font-semibold text-white"
                    >
                        Search
                    </button>
                </form>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-crm-canvas text-xs uppercase text-crm-muted">
                            <tr>
                                <th className="px-3 py-2 font-semibold">Title</th>
                                <th className="px-3 py-2 font-semibold">Status</th>
                                <th className="px-3 py-2 font-semibold">Author</th>
                                <th className="px-3 py-2 font-semibold">Updated</th>
                                <th className="px-3 py-2 font-semibold" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-crm">
                            {posts.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-3 py-6 text-crm-muted"
                                    >
                                        No posts yet. Create your first guide
                                        article.
                                    </td>
                                </tr>
                            )}
                            {posts.data.map((post) => (
                                <tr
                                    key={post.id}
                                    className="hover:bg-crm-canvas/50"
                                >
                                    <td className="px-3 py-3">
                                        <Link
                                            href={route(
                                                'app.posts.edit',
                                                post.id,
                                            )}
                                            className="font-medium text-crm-heading hover:text-crm-primary"
                                        >
                                            {post.title}
                                        </Link>
                                        <p className="text-xs text-crm-muted">
                                            /blog/{post.slug}
                                        </p>
                                    </td>
                                    <td className="px-3 py-3">
                                        <StatusBadge value={post.status} />
                                    </td>
                                    <td className="px-3 py-3 text-crm-muted">
                                        {post.author || '—'}
                                    </td>
                                    <td className="px-3 py-3 text-crm-muted">
                                        {post.updated_at}
                                    </td>
                                    <td className="px-3 py-3 text-right">
                                        <div className="flex justify-end gap-3">
                                            {post.status === 'published' && (
                                                <a
                                                    href={route(
                                                        'blog.show',
                                                        post.slug,
                                                    )}
                                                    className="text-sm font-medium text-crm-muted hover:text-crm-primary"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    View
                                                </a>
                                            )}
                                            <Link
                                                href={route(
                                                    'app.posts.edit',
                                                    post.id,
                                                )}
                                                className="text-sm font-semibold text-crm-primary"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => destroy(post)}
                                                className="text-sm font-medium text-red-600 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CrmCard>
        </AppLayout>
    );
}
