'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, ImageIcon, Save } from 'lucide-react';
import { toast } from 'sonner';

interface MenuItem {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    is_featured: boolean;
    categories?: { name: string };
}

export default function FeaturedPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/items');
            const data = await res.json();
            if (Array.isArray(data)) {
                setItems(data);
                setSelectedIds(data.filter((item: MenuItem) => item.is_featured).map((item: MenuItem) => item.id));
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            toast.error('Failed to load items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleItem = (id: string) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((i) => i !== id);
            }
            if (prev.length >= 3) {
                toast.error('Maximum 3 featured items allowed');
                return prev;
            }
            return [...prev, id];
        });
    };

    const handleSave = async () => {
        if (selectedIds.length !== 3) {
            toast.error('Please select exactly 3 featured items');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/admin/featured', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemIds: selectedIds }),
            });

            if (!res.ok) throw new Error('Failed to save');

            toast.success('Featured items updated');
            fetchData();
        } catch (error) {
            console.error('Error saving featured items:', error);
            toast.error('Failed to save featured items');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                        Featured Items
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Select exactly 3 items to feature on the homepage &quot;Chef&apos;s Selection&quot; section
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving || selectedIds.length !== 3}
                    className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Featured'}
                </Button>
            </div>

            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Select Items ({selectedIds.length}/3)</span>
                        {selectedIds.length === 3 && (
                            <span className="text-sm font-normal text-green-600">Ready to save!</span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-zinc-500">Loading...</div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500">
                            No items found. Create menu items first!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((item) => {
                                const isSelected = selectedIds.includes(item.id);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleItem(item.id)}
                                        className={`relative rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${isSelected
                                                ? 'border-orange-500 ring-2 ring-orange-500/30'
                                                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                            }`}
                                    >
                                        {/* Checkbox */}
                                        <div className="absolute top-3 left-3 z-10">
                                            <Checkbox
                                                checked={isSelected}
                                                className="bg-white/80 backdrop-blur-sm"
                                            />
                                        </div>

                                        {/* Featured Badge */}
                                        {isSelected && (
                                            <div className="absolute top-3 right-3 z-10 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-white" />
                                                Featured
                                            </div>
                                        )}

                                        {/* Image */}
                                        <div className="h-32 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                            {item.image_url ? (
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    width={300}
                                                    height={128}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="h-8 w-8 text-zinc-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-3">
                                            <h3 className="font-semibold truncate">{item.name}</h3>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-sm text-zinc-500">
                                                    {item.categories?.name || 'Uncategorized'}
                                                </span>
                                                <span className="font-medium text-orange-500">
                                                    ${item.price.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
