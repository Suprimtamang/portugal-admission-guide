import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

function NavItem({ href, active, children }) {
    return (
        <Link
            href={href}
            className={`flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition ${
                active
                    ? 'bg-crm-primary/10 text-crm-primary'
                    : 'text-crm-muted hover:bg-white hover:text-crm-heading'
            }`}
        >
            {children}
        </Link>
    );
}

export default function AppLayout({ title, breadcrumbs = [], children }) {
    const { auth } = usePage().props;
    const isSuper = auth.user?.role === 'superadmin';
    const [open, setOpen] = useState(false);

    const guideItems = [
        { name: 'Roadmap', href: 'app.roadmap', match: 'app.roadmap' },
        { name: 'Universities', href: 'app.universities', match: 'app.universities' },
        { name: 'AIMA', href: 'app.aima', match: 'app.aima' },
        { name: 'Assistant', href: 'app.chat', match: 'app.chat' },
    ];

    const userItems = [
        ...guideItems,
        { name: 'Help', href: 'app.support.index', match: 'app.support.*' },
    ];

    const adminPrimary = [
        { name: 'Desk', href: 'app.dashboard', match: 'app.dashboard' },
        { name: 'Applicants', href: 'app.applicants.index', match: 'app.applicants.*' },
        { name: 'Support', href: 'app.support.index', match: 'app.support.*' },
    ];

    return (
        <div className="min-h-screen bg-crm-canvas text-crm-heading">
            {open && (
                <button
                    type="button"
                    className="fixed inset-0 z-30 bg-black/30 lg:hidden"
                    aria-label="Close menu"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-crm bg-white transition-transform lg:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center border-b border-crm px-5">
                    <Link
                        href={
                            isSuper
                                ? route('app.dashboard')
                                : route('app.roadmap')
                        }
                        className="text-base font-semibold text-crm-heading"
                    >
                        PAG <span className="text-crm-primary">CRM</span>
                    </Link>
                </div>

                <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
                    {isSuper ? (
                        <>
                            <div>
                                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-crm-muted">
                                    Admin
                                </p>
                                <div className="space-y-1">
                                    {adminPrimary.map((item) => (
                                        <NavItem
                                            key={item.href}
                                            href={route(item.href)}
                                            active={route().current(item.match)}
                                        >
                                            {item.name}
                                        </NavItem>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-crm-muted">
                                    Guide tools
                                </p>
                                <div className="space-y-1">
                                    {guideItems.map((item) => (
                                        <NavItem
                                            key={item.href}
                                            href={route(item.href)}
                                            active={route().current(item.match)}
                                        >
                                            {item.name}
                                        </NavItem>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-crm-muted">
                                    CMS
                                </p>
                                <a
                                    href="/admin"
                                    className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-crm-muted hover:bg-white hover:text-crm-heading"
                                >
                                    Blog CMS
                                </a>
                            </div>
                        </>
                    ) : (
                        <div>
                            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-crm-muted">
                                Guide
                            </p>
                            <div className="space-y-1">
                                {userItems.map((item) => (
                                    <NavItem
                                        key={item.href}
                                        href={route(item.href)}
                                        active={route().current(item.match)}
                                    >
                                        {item.name}
                                    </NavItem>
                                ))}
                            </div>
                        </div>
                    )}
                </nav>

                <div className="border-t border-crm p-4 text-xs text-crm-muted">
                    {isSuper ? 'Superadmin' : 'Applicant'}
                </div>
            </aside>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-crm bg-white px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="rounded-md border border-crm px-2 py-1 text-sm lg:hidden"
                            onClick={() => setOpen(true)}
                        >
                            Menu
                        </button>
                        <p className="text-sm font-medium text-crm-heading">
                            {title || 'Workspace'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Link
                            href="/blog"
                            className="hidden text-crm-muted hover:text-crm-primary sm:inline"
                        >
                            Blog
                        </Link>
                        <Link
                            href={route('profile.edit')}
                            className="font-medium text-crm-heading hover:text-crm-primary"
                        >
                            {auth.user?.name}
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="rounded-md border border-crm px-3 py-1.5 font-medium hover:border-crm-primary hover:text-crm-primary"
                        >
                            Log out
                        </Link>
                    </div>
                </header>

                <main className="px-4 py-6 sm:px-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
