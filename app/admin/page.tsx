'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderTree, UtensilsCrossed, TrendingUp } from 'lucide-react';

interface Stats {
    categories: number;
    items: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({ categories: 0, items: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [catRes, itemsRes] = await Promise.all([
                    fetch('/api/admin/categories'),
                    fetch('/api/admin/items'),
                ]);
                const categories = await catRes.json();
                const items = await itemsRes.json();
                setStats({
                    categories: Array.isArray(categories) ? categories.length : 0,
                    items: Array.isArray(items) ? items.length : 0,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        {
            title: 'Total Categories',
            value: stats.categories,
            icon: FolderTree,
            color: 'from-blue-500 to-cyan-600',
        },
        {
            title: 'Menu Items',
            value: stats.items,
            icon: UtensilsCrossed,
            color: 'from-orange-500 to-amber-600',
        },
        {
            title: 'Active Items',
            value: stats.items,
            icon: TrendingUp,
            color: 'from-green-500 to-emerald-600',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Admin Panel</h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                    Manage your menu categories and items from here.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                    <Card key={card.title} className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                {card.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color}`}>
                                <card.icon className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {loading ? '—' : card.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <a
                        href="/admin/categories"
                        className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500 transition-colors group"
                    >
                        <FolderTree className="h-8 w-8 text-orange-500 mb-2" />
                        <h3 className="font-semibold group-hover:text-orange-500 transition-colors">
                            Manage Categories
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Create, edit, or delete categories
                        </p>
                    </a>
                    <a
                        href="/admin/items"
                        className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500 transition-colors group"
                    >
                        <UtensilsCrossed className="h-8 w-8 text-orange-500 mb-2" />
                        <h3 className="font-semibold group-hover:text-orange-500 transition-colors">
                            Manage Menu Items
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Add, edit, or remove menu items
                        </p>
                    </a>
                </CardContent>
            </Card>
        </div>
    );
}
