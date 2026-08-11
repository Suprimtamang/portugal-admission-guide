import { Head, Link } from '@inertiajs/react';

export default function Show({ post }) {
    return (
        <div className="min-h-screen bg-crm-canvas text-crm-heading">
            <Head title={post.title} />
            <header className="border-b border-crm bg-white">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
                    <Link
                        href={route('blog.index')}
                        className="text-sm text-crm-muted hover:text-crm-primary"
                    >
                        ← Notes
                    </Link>
                    <Link href="/" className="font-semibold">
                        PAG <span className="text-crm-primary">Guide</span>
                    </Link>
                </div>
            </header>
            <article className="mx-auto max-w-3xl px-5 py-12">
                <div className="crm-card shadow-crm p-6 sm:p-10">
                    <p className="text-xs text-crm-muted">{post.published_at}</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                        {post.title}
                    </h1>
                    {post.excerpt && (
                        <p className="mt-4 text-lg text-crm-muted">{post.excerpt}</p>
                    )}
                    <div className="mt-8 whitespace-pre-wrap border-t border-crm pt-8 text-base leading-8">
                        {post.body}
                    </div>
                </div>
            </article>
        </div>
    );
}
