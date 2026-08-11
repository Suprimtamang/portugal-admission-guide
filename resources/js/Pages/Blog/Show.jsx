import { Head, Link } from '@inertiajs/react';

export default function Show({ post }) {
    const seo = post.seo || {};

    return (
        <div className="min-h-screen bg-crm-canvas text-crm-heading">
            <Head title={seo.title || post.title}>
                {seo.description && (
                    <meta head-key="description" name="description" content={seo.description} />
                )}
                {seo.canonical && <link head-key="canonical" rel="canonical" href={seo.canonical} />}
                <meta head-key="og:title" property="og:title" content={seo.title || post.title} />
                {seo.description && (
                    <meta
                        head-key="og:description"
                        property="og:description"
                        content={seo.description}
                    />
                )}
                {seo.image && (
                    <meta head-key="og:image" property="og:image" content={seo.image} />
                )}
                <meta head-key="og:type" property="og:type" content="article" />
                <meta
                    head-key="twitter:card"
                    name="twitter:card"
                    content={seo.image ? 'summary_large_image' : 'summary'}
                />
            </Head>
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
                <div className="crm-card shadow-crm overflow-hidden">
                    {post.cover_image_url && (
                        <img
                            src={post.cover_image_url}
                            alt=""
                            className="max-h-[420px] w-full object-cover"
                        />
                    )}
                    <div className="p-6 sm:p-10">
                        <p className="text-xs text-crm-muted">{post.published_at}</p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                            {post.title}
                        </h1>
                        {post.excerpt && (
                            <p className="mt-4 text-lg text-crm-muted">
                                {post.excerpt}
                            </p>
                        )}
                        {post.body_is_html ? (
                            <div
                                className="post-content mt-8 border-t border-crm pt-8"
                                dangerouslySetInnerHTML={{ __html: post.body }}
                            />
                        ) : (
                            <div className="mt-8 whitespace-pre-wrap border-t border-crm pt-8 text-base leading-8">
                                {post.body}
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </div>
    );
}
