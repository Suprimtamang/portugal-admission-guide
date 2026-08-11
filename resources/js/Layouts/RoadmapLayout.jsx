import { Link, usePage } from '@inertiajs/react';

export default function RoadmapLayout({ contactEmail, children }) {
    const { auth } = usePage().props;

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased md:h-screen md:overflow-hidden">
            <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
                <div className="flex items-center space-x-3">
                    <span className="text-3xl" aria-hidden>
                        🇵🇹
                    </span>
                    <div>
                        <h1 className="text-lg font-extrabold leading-tight text-slate-900">
                            Portugal Admission Roadmap
                        </h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            National Student Pathway (Immigrant Focus)
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href={`mailto:${contactEmail}`}
                        className="hidden rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[10px] font-extrabold uppercase text-blue-600 transition hover:bg-blue-600 hover:text-white sm:inline-block"
                    >
                        When in doubt email: {contactEmail}
                    </a>

                    {auth.user ? (
                        <div className="flex items-center gap-2 text-xs">
                            <Link
                                href={route('profile.edit')}
                                className="font-semibold text-slate-600 hover:text-slate-900"
                            >
                                {auth.user.name}
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="rounded-lg bg-slate-900 px-3 py-2 font-bold text-white hover:bg-slate-800"
                            >
                                Log out
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-xs">
                            <Link
                                href={route('login')}
                                className="font-semibold text-slate-600 hover:text-slate-900"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded-lg bg-slate-900 px-3 py-2 font-bold text-white hover:bg-slate-800"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {children}
        </div>
    );
}
