import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const icons = {
    desk: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l9-8 9 8M5 10v9h4v-5h6v5h4v-9"
        />
    ),
    applicants: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M12 11a4 4 0 100-8 4 4 0 000 8zm9 8v-1a3.5 3.5 0 00-2.5-3.35M16.5 3.2a3.5 3.5 0 010 6.8"
        />
    ),
    posts: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 5h14v14H5V5zm3 4h8M8 13h8M8 17h5"
        />
    ),
    support: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10a4 4 0 118 0c0 2.5-2 3.5-2 5h-4c0-1.5-2-2.5-2-5zm2 8h4"
        />
    ),
    admins: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3l8 4v5c0 4.5-3.2 7.7-8 9-4.8-1.3-8-4.5-8-9V7l8-4zm0 6v4m0 3h.01"
        />
    ),
    roadmap: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 19V5m0 14h16M8 15l3-4 3 2 4-6"
        />
    ),
    universities: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10l9-5 9 5-9 5-9-5zm2 3.5V18l7 3 7-3v-4.5"
        />
    ),
    aima: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21s7-4.4 7-11a7 7 0 10-14 0c0 6.6 7 11 7 11z"
        />
    ),
    assistant: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h8M8 14h5M5 5h14a1 1 0 011 1v10a1 1 0 01-1 1H9l-4 3V6a1 1 0 011-1z"
        />
    ),
    help: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 17h.01M9.1 9a2.9 2.9 0 115.1 1.9c-.7.8-2.2 1.4-2.2 2.6V14"
        />
    ),
};

function NavIcon({ name }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="h-4 w-4 shrink-0"
            aria-hidden="true"
        >
            {icons[name] || icons.desk}
        </svg>
    );
}

function NavItem({ href, active, icon, children }) {
    return (
        <Link
            href={href}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                    ? 'bg-white/10 text-white shadow-[inset_3px_0_0_0_#0d99ff]'
                    : 'text-[#8b9bb0] hover:bg-white/5 hover:text-white'
            }`}
        >
            <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    active
                        ? 'bg-[#0d99ff]/20 text-[#7cc8ff]'
                        : 'bg-white/5 text-[#8b9bb0] group-hover:text-white'
                }`}
            >
                <NavIcon name={icon} />
            </span>
            {children}
        </Link>
    );
}

export default function AppLayout({ title, breadcrumbs = [], children }) {
    const { auth } = usePage().props;
    const isSuper = auth.user?.role === 'superadmin';
    const canManageAdmins = Boolean(auth.user?.can_manage_admins);
    const [open, setOpen] = useState(false);

    const guideItems = [
        { name: 'Roadmap', href: 'app.roadmap', match: 'app.roadmap', icon: 'roadmap' },
        {
            name: 'Universities',
            href: 'app.universities',
            match: 'app.universities',
            icon: 'universities',
        },
        { name: 'AIMA', href: 'app.aima', match: 'app.aima', icon: 'aima' },
        { name: 'Assistant', href: 'app.chat', match: 'app.chat', icon: 'assistant' },
    ];

    const userItems = [
        ...guideItems,
        { name: 'Help', href: 'app.support.index', match: 'app.support.*', icon: 'help' },
    ];

    const adminPrimary = [
        { name: 'Desk', href: 'app.dashboard', match: 'app.dashboard', icon: 'desk' },
        {
            name: 'Applicants',
            href: 'app.applicants.index',
            match: 'app.applicants.*',
            icon: 'applicants',
        },
        { name: 'Posts', href: 'app.posts.index', match: 'app.posts.*', icon: 'posts' },
        { name: 'Support', href: 'app.support.index', match: 'app.support.*', icon: 'support' },
        ...(canManageAdmins
            ? [
                  {
                      name: 'Admins',
                      href: 'app.admins.index',
                      match: 'app.admins.*',
                      icon: 'admins',
                  },
              ]
            : []),
    ];

    return (
        <div className="crm-shell min-h-screen text-crm-heading">
            {open && (
                <button
                    type="button"
                    className="fixed inset-0 z-30 bg-[#0f1b2d]/45 backdrop-blur-[2px] lg:hidden"
                    aria-label="Close menu"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col bg-[#0f1b2d] text-white transition-transform lg:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-[4.5rem] items-center gap-3 border-b border-white/10 px-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2aadff] to-[#0d99ff] text-sm font-bold shadow-[0_8px_20px_rgba(13,153,255,0.35)]">
                        P
                    </div>
                    <Link
                        href={
                            isSuper
                                ? route('app.dashboard')
                                : route('app.roadmap')
                        }
                        className="leading-tight"
                    >
                        <span className="block text-[15px] font-semibold tracking-tight">
                            PAG CRM
                        </span>
                        <span className="text-[11px] text-[#8b9bb0]">
                            Portugal admissions
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-5">
                    {isSuper ? (
                        <>
                            <div>
                                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f8096]">
                                    Admin
                                </p>
                                <div className="space-y-1">
                                    {adminPrimary.map((item) => (
                                        <NavItem
                                            key={item.href}
                                            href={route(item.href)}
                                            active={route().current(item.match)}
                                            icon={item.icon}
                                        >
                                            {item.name}
                                        </NavItem>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f8096]">
                                    Guide tools
                                </p>
                                <div className="space-y-1">
                                    {guideItems.map((item) => (
                                        <NavItem
                                            key={item.href}
                                            href={route(item.href)}
                                            active={route().current(item.match)}
                                            icon={item.icon}
                                        >
                                            {item.name}
                                        </NavItem>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>
                            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f8096]">
                                Guide
                            </p>
                            <div className="space-y-1">
                                {userItems.map((item) => (
                                    <NavItem
                                        key={item.href}
                                        href={route(item.href)}
                                        active={route().current(item.match)}
                                        icon={item.icon}
                                    >
                                        {item.name}
                                    </NavItem>
                                ))}
                            </div>
                        </div>
                    )}
                </nav>

                <div className="border-t border-white/10 p-4">
                    <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d99ff]/25 text-xs font-semibold text-[#9fd4ff]">
                            {(auth.user?.name || 'U').slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                                {auth.user?.name}
                            </p>
                            <p className="text-[11px] text-[#8b9bb0]">
                                {isSuper ? 'Superadmin' : 'Applicant'}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-[272px]">
                <header className="sticky top-0 z-20 border-b border-crm/80 bg-white/80 backdrop-blur-xl">
                    <div className="flex h-[4.5rem] items-center justify-between px-4 sm:px-7">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="rounded-xl border border-crm bg-white px-3 py-1.5 text-sm font-medium lg:hidden"
                                onClick={() => setOpen(true)}
                            >
                                Menu
                            </button>
                            <div>
                                <p className="text-base font-semibold tracking-tight text-crm-heading">
                                    {title || 'Workspace'}
                                </p>
                                {breadcrumbs.length > 0 && (
                                    <p className="text-[11px] text-crm-muted">
                                        {breadcrumbs.join(' / ')}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm sm:gap-3">
                            <Link
                                href="/blog"
                                className="hidden rounded-xl px-3 py-2 font-medium text-crm-muted hover:bg-white hover:text-crm-primary sm:inline"
                            >
                                Blog
                            </Link>
                            <Link
                                href={route('profile.edit')}
                                className="rounded-xl px-3 py-2 font-medium text-crm-heading hover:bg-white hover:text-crm-primary"
                            >
                                {auth.user?.name}
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="rounded-xl border border-crm bg-white px-3.5 py-2 font-medium text-crm-heading transition hover:border-crm-primary hover:text-crm-primary"
                            >
                                Log out
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="px-4 py-7 sm:px-7">{children}</main>
            </div>
        </div>
    );
}
