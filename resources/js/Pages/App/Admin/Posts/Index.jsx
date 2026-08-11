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
        <AppLayout title="Posts" breadcrumbs={['Home', 'Posts']}>
            <Head title="Posts" />
            <PageHeader
                title="Posts"
                subtitle="Write, publish, and improve SEO for guide articles."
                action={
                    <Link
                        href={route('app.posts.create')}
                        className="crm-btn-primary"
                    >
                        New post
                    </Link>
                }
            />

            {flash?.success && (
                <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {flash.success}
                </p>
            )}

            <CrmCard padded={false}>
                <div className="border-b border-crm px-5 py-4">
                    <form
                        onSubmit={search}
                        className="flex flex-col gap-3 sm:flex-row sm:items-center"
                    >
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search title or slug…"
                            className="crm-input max-w-md"
                        />
                        <button type="submit" className="crm-btn-primary">
                            Search
                        </button>
                    </form>
                </div>

                {posts.data.length === 0 ? (
                    <div className="p-5">
                        <div className="crm-empty">
                            No posts yet.{' '}
                            <Link
                                href={route('app.posts.create')}
                                className="font-semibold text-crm-primary"
                            >
                                Create your first guide article
                            </Link>
                            .
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="crm-table min-w-full text-sm">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Author</th>
                                    <th>Updated</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.data.map((post) => (
                                    <tr key={post.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                {post.cover_image_url ? (
                                                    <img
                                                        src={
                                                            post.cover_image_url
                                                        }
                                                        alt=""
                                                        className="h-11 w-14 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-11 w-14 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-semibold uppercase tracking-wide text-crm-muted">
                                                        Post
                                                    </div>
                                                )}
                                                <div>
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
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <StatusBadge value={post.status} />
                                        </td>
                                        <td className="text-crm-muted">
                                            {post.author || '—'}
                                        </td>
                                        <td className="text-crm-muted">
                                            {post.updated_at}
                                        </td>
                                        <td>
                                            <div className="flex justify-end gap-2">
                                                {post.status ===
                                                    'published' && (
                                                    <a
                                                        href={route(
                                                            'blog.show',
                                                            post.slug,
                                                        )}
                                                        className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-crm-muted hover:bg-slate-50 hover:text-crm-primary"
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
                                                    className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-crm-primary hover:bg-sky-50"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        destroy(post)
                                                    }
                                                    className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
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
                )}
            </CrmCard>
        </AppLayout>
    );
}
