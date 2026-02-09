'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    FolderTree,
    UtensilsCrossed,
    LogOut,
    Menu,
    X,
    ChevronRight,
    ChevronLeft,
    PanelLeftClose,
    PanelLeft,
    Star,
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Menu Items', href: '/admin/items', icon: UtensilsCrossed },
    { name: 'Featured', href: '/admin/featured', icon: Star },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Load collapsed state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('admin-sidebar-collapsed');
        if (saved !== null) {
            setIsCollapsed(JSON.parse(saved));
        }
    }, []);

    // Save collapsed state to localStorage
    const toggleCollapsed = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(newState));
    };

    // Don't show layout on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transform transition-all duration-300 ease-in-out lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                    isCollapsed ? 'lg:w-16' : 'lg:w-72',
                    'w-72' // Mobile width always full
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className={cn(
                        'flex h-16 items-center border-b border-zinc-200 dark:border-zinc-800',
                        isCollapsed ? 'justify-center px-2' : 'justify-between px-6'
                    )}>
                        <Link href="/admin" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                                <UtensilsCrossed className="h-4 w-4 text-white" />
                            </div>
                            {!isCollapsed && (
                                <span className="font-bold text-lg">Admin Panel</span>
                            )}
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className={cn('flex-1 py-6 space-y-1', isCollapsed ? 'px-2' : 'px-4')}>
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    title={isCollapsed ? item.name : undefined}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg text-sm font-medium transition-colors',
                                        isCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
                                        isActive
                                            ? 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400'
                                            : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                    )}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    {!isCollapsed && (
                                        <>
                                            {item.name}
                                            {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                                        </>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Collapse toggle (desktop only) */}
                    <div className="hidden lg:block p-2 border-t border-zinc-200 dark:border-zinc-800">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleCollapsed}
                            className={cn(
                                'w-full text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300',
                                isCollapsed ? 'justify-center' : 'justify-start gap-3'
                            )}
                        >
                            {isCollapsed ? (
                                <PanelLeft className="h-4 w-4" />
                            ) : (
                                <>
                                    <PanelLeftClose className="h-4 w-4" />
                                    <span>Collapse</span>
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Logout */}
                    <div className={cn(
                        'border-t border-zinc-200 dark:border-zinc-800',
                        isCollapsed ? 'p-2' : 'p-4'
                    )}>
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            title={isCollapsed ? 'Logout' : undefined}
                            className={cn(
                                'w-full text-zinc-600 hover:text-red-600 hover:bg-red-50 dark:text-zinc-400 dark:hover:text-red-400 dark:hover:bg-red-950',
                                isCollapsed ? 'justify-center px-2' : 'justify-start gap-3'
                            )}
                        >
                            <LogOut className="h-5 w-5 flex-shrink-0" />
                            {!isCollapsed && 'Logout'}
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className={cn(
                'transition-all duration-300',
                isCollapsed ? 'lg:pl-16' : 'lg:pl-72'
            )}>
                {/* Top bar */}
                <header className="sticky top-0 z-30 h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg mr-4"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <h1 className="text-lg font-semibold">
                        {navigation.find((item) => item.href === pathname)?.name || 'Admin'}
                    </h1>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
