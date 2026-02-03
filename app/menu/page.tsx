'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CategoryFilter, MenuGrid, DietaryFilters } from '@/components/menu';
import { categories, menuItems } from '@/data/menu';
import { Input } from '@/components/ui/input';

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dietaryFilters, setDietaryFilters] = useState({
        vegetarian: false,
        vegan: false,
        glutenFree: false,
    });

    const filteredItems = useMemo(() => {
        return menuItems.filter((item) => {
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

            // Dietary filters
            if (dietaryFilters.vegetarian && !item.isVegetarian) return false;
            if (dietaryFilters.vegan && !item.isVegan) return false;
            if (dietaryFilters.glutenFree && !item.isGlutenFree) return false;

            return item.isAvailable;
        });
    }, [activeCategory, searchQuery, dietaryFilters]);

    const handleDietaryFilterChange = (filter: 'vegetarian' | 'vegan' | 'glutenFree') => {
        setDietaryFilters((prev) => ({
            ...prev,
            [filter]: !prev[filter],
        }));
    };

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

                        {/* Dietary Filters */}
                        <div className="flex justify-center">
                            <DietaryFilters
                                filters={dietaryFilters}
                                onFilterChange={handleDietaryFilterChange}
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
