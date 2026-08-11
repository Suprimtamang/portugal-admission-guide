import { Head, Link } from '@inertiajs/react';

export default function Landing({ features, latestPosts = [], lastReviewed }) {
    const primaryFeatures = features.slice(0, 4);

    return (
        <div className="min-h-screen bg-white text-crm-heading">
            <Head title="Portugal Admission Guide" />

            <header className="border-b border-crm bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                    <p className="text-base font-semibold">
                        PAG <span className="text-crm-primary">Guide</span>
                    </p>
                    <nav className="flex items-center gap-4 text-sm">
                        <Link href="/blog" className="text-crm-muted hover:text-crm-primary">
                            Blog
                        </Link>
                        <Link href={route('login')} className="text-crm-muted hover:text-crm-primary">
                            Log in
                        </Link>
                        <Link
                            href={route('register')}
                            className="rounded-md bg-crm-primary px-4 py-2 font-semibold text-white hover:bg-sky-600"
                        >
                            Create account
                        </Link>
                    </nav>
                </div>
            </header>

            <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-crm-primary">
                        National Student pathway
                    </p>
                    <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                        Portugal Admission Guide
                    </h1>
                    <p className="mt-5 max-w-lg text-base leading-relaxed text-crm-muted">
                        Eligibility, documents, equivalency, AIMA — sequenced for
                        immigrants already in Portugal, with an assistant that
                        cites official sources.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href={route('register')}
                            className="rounded-md bg-crm-primary px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600"
                        >
                            Start free
                        </Link>
                        <Link
                            href={route('login')}
                            className="rounded-md border border-crm px-5 py-3 text-sm font-semibold text-crm-heading hover:border-crm-primary hover:text-crm-primary"
                        >
                            Open the app
                        </Link>
                    </div>
                    <p className="mt-6 text-xs text-crm-muted">
                        Peer guidance only. Not DGES, DGE, or AIMA.
                        {lastReviewed ? ` Last reviewed ${lastReviewed}.` : ''}
                    </p>
                </div>
                <div className="crm-card shadow-crm overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=75"
                        alt="Portuguese azulejo tiles"
                        className="h-64 w-full object-cover sm:h-80"
                    />
                    <div className="p-5">
                        <p className="font-semibold">Already living in Portugal?</p>
                        <p className="mt-2 text-sm text-crm-muted">
                            This path is for the National Student contest —
                            different from international student admission.
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-y border-crm bg-crm-canvas">
                <div className="mx-auto max-w-6xl px-5 py-14">
                    <h2 className="text-2xl font-semibold">What you get after signing in</h2>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {primaryFeatures.map((feature) => (
                            <div key={feature.title} className="crm-card shadow-crm p-5">
                                <h3 className="font-semibold text-crm-primary">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-sm text-crm-muted">
                                    {feature.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {latestPosts?.length > 0 && (
                <section className="mx-auto max-w-6xl px-5 py-14">
                    <div className="flex items-baseline justify-between gap-4">
                        <h2 className="text-2xl font-semibold">Recent notes</h2>
                        <Link href="/blog" className="text-sm font-semibold text-crm-primary">
                            All posts
                        </Link>
                    </div>
                    <ul className="mt-6 divide-y divide-crm border-y border-crm">
                        {latestPosts.map((post) => (
                            <li key={post.slug} className="py-4">
                                <Link href={`/blog/${post.slug}`} className="block hover:text-crm-primary">
                                    <span className="text-xs text-crm-muted">
                                        {post.published_at}
                                    </span>
                                    <span className="mt-1 block text-lg font-semibold">
                                        {post.title}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <footer className="border-t border-crm px-5 py-8 text-sm text-crm-muted">
                <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:justify-between">
                    <span className="font-semibold text-crm-heading">
                        Portugal Admission Guide
                    </span>
                    <span>Not affiliated with DGES or AIMA</span>
                </div>
            </footer>
        </div>
    );
}
