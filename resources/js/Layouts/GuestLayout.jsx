import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-crm-canvas">
            <header className="border-b border-crm bg-white px-6 py-4">
                <Link href="/" className="text-base font-semibold text-crm-heading">
                    PAG <span className="text-crm-primary">Guide</span>
                </Link>
            </header>
            <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12">
                <div className="crm-card shadow-crm px-6 py-8">{children}</div>
            </div>
        </div>
    );
}
