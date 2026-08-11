import { Head, Link } from '@inertiajs/react';

export default function Index({ posts }) {
    return (
        <div className="min-h-screen bg-crm-canvas text-crm-heading">
            <Head title="Blog" />
            <header className="border-b border-crm bg-white">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
                    <Link href="/" className="font-semibold">
                        PAG <span className="text-crm-primary">Guide</span>
                    </Link>
                    <Link href={route('login')} className="text-sm text-crm-muted hover:text-crm-primary">
                        Log in
                    </Link>
                </div>
            </header>
            <main className="mx-auto max-w-3xl px-5 py-12">
                <h1 className="text-3xl font-semibold">Notes from the path</h1>
                <p className="mt-2 text-crm-muted">
                    Community writing — not official government notices.
                </p>
                <ul className="mt-8 space-y-4">
                    {posts.length === 0 && (
                        <li className="crm-card shadow-crm p-6 text-sm text-crm-muted">
                            No published posts yet.
                        </li>
                    )}
                    {posts.map((post) => (
                        <li key={post.id} className="crm-card shadow-crm p-6">
                            <p className="text-xs text-crm-muted">{post.published_at}</p>
                            <Link
                                href={route('blog.show', post.slug)}
                                className="mt-2 block text-xl font-semibold hover:text-crm-primary"
                            >
                                {post.title}
                            </Link>
                            {post.excerpt && (
                                <p className="mt-2 text-sm text-crm-muted">{post.excerpt}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}
