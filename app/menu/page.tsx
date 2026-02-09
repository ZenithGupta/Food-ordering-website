'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CategoryFilter, MenuGrid } from '@/components/menu';
import { Input } from '@/components/ui/input';

interface Category {
    id: string;
    name: string;
    slug: string;
    display_order: number;
    is_active: boolean;
}

interface MenuItem {
    id: string;
    category_id: string;
    name: string;
    description: string;
    price: number;
    image_url: string | null;
    spice_level: number;
    is_available: boolean;
}

interface MenuData extends Category {
    items: MenuItem[];
}

export default function MenuPage() {
    const [menuData, setMenuData] = useState<MenuData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await fetch('/api/menu', { cache: 'no-store' });
                const data = await res.json();
                if (Array.isArray(data)) {
                    setMenuData(data);
                }
            } catch (error) {
                console.error('Error fetching menu:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    // Transform categories for CategoryFilter
    const categories = useMemo(() => {
        return menuData.map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            displayOrder: cat.display_order,
            isActive: cat.is_active,
        }));
    }, [menuData]);

    // Get all items flattened
    const allItems = useMemo(() => {
        return menuData.flatMap((cat) =>
            cat.items.map((item) => ({
                id: item.id,
                categoryId: item.category_id,
                name: item.name,
                description: item.description || '',
                price: item.price,
                imageUrl: item.image_url || '',
                spiceLevel: item.spice_level as 0 | 1 | 2 | 3,
                isAvailable: item.is_available,
            }))
        );
    }, [menuData]);

    const filteredItems = useMemo(() => {
        return allItems.filter((item) => {
            // Category filter
            if (activeCategory !== 'all' && item.categoryId !== activeCategory) {
                return false;
            }

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (
                    !item.name.toLowerCase().includes(query) &&
                    !item.description.toLowerCase().includes(query)
                ) {
                    return false;
                }
            }

            return item.isAvailable;
        });
    }, [activeCategory, searchQuery, allItems]);

    if (loading) {
        return (
            <PageWrapper>
                <section className="py-12">
                    <div className="container mx-auto px-4 text-center">
                        <div className="animate-pulse">Loading menu...</div>
                    </div>
                </section>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                            Our <span className="text-gradient">Menu</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Discover our authentic Indian dishes, prepared with traditional spices
                            and the freshest ingredients.
                        </p>
                    </motion.div>

                    {/* Search & Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6 mb-8"
                    >
                        {/* Search */}
                        <div className="relative max-w-md mx-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search dishes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-muted/30 border-border/50 input-glow"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex justify-center">
                            <CategoryFilter
                                categories={categories}
                                activeCategory={activeCategory}
                                onCategoryChange={setActiveCategory}
                            />
                        </div>
                    </motion.div>

                    {/* Menu Grid */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <MenuGrid items={filteredItems} />
                    </motion.div>
                </div>
            </section>
        </PageWrapper>
    );
}
