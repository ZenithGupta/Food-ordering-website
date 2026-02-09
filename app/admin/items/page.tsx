'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Upload, X, ImageIcon, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
    id: string;
    name: string;
    slug: string;
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
    display_order?: number;
    categories?: { name: string; slug: string };
}

interface SortableRowProps {
    item: MenuItem;
    index: number;
    total: number;
    onEdit: (item: MenuItem) => void;
    onDelete: (id: string) => void;
    onMoveUp: (index: number) => void;
    onMoveDown: (index: number) => void;
}

function SortableRow({ item, index, total, onEdit, onDelete, onMoveUp, onMoveDown }: SortableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell>
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1"
                >
                    <GripVertical className="h-4 w-4 text-zinc-400" />
                </div>
            </TableCell>
            <TableCell>
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    {item.image_url ? (
                        <Image
                            src={item.image_url}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-zinc-400" />
                        </div>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-zinc-500 truncate max-w-[200px]">
                        {item.description}
                    </p>
                </div>
            </TableCell>
            <TableCell className="text-zinc-500">
                {item.categories?.name || 'Unknown'}
            </TableCell>
            <TableCell className="font-medium">
                ${item.price.toFixed(2)}
            </TableCell>
            <TableCell>
                <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.is_available
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}
                >
                    {item.is_available ? 'Available' : 'Unavailable'}
                </span>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMoveUp(index)}
                        disabled={index === 0}
                        title="Move up"
                    >
                        <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMoveDown(index)}
                        disabled={index === total - 1}
                        title="Move down"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

const defaultFormData = {
    category_id: '',
    name: '',
    description: '',
    price: 0,
    image_url: '',
    spice_level: 0,
    is_available: true,
};

export default function ItemsPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState(defaultFormData);
    const [uploading, setUploading] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchData = async () => {
        try {
            const [itemsRes, catRes] = await Promise.all([
                fetch('/api/admin/items'),
                fetch('/api/admin/categories'),
            ]);
            const itemsData = await itemsRes.json();
            const catData = await catRes.json();
            if (Array.isArray(itemsData)) setItems(itemsData);
            if (Array.isArray(catData)) setCategories(catData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openCreateDialog = () => {
        setEditingItem(null);
        setFormData({
            ...defaultFormData,
            category_id: categories[0]?.id || '',
        });
        setDialogOpen(true);
    };

    const openEditDialog = (item: MenuItem) => {
        setEditingItem(item);
        setFormData({
            category_id: item.category_id,
            name: item.name,
            description: item.description || '',
            price: item.price,
            image_url: item.image_url || '',
            spice_level: item.spice_level,
            is_available: item.is_available,
        });
        setDialogOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formDataUpload,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Upload failed');
            }

            const data = await res.json();
            setFormData((prev) => ({ ...prev, image_url: data.url }));
            toast.success('Image uploaded');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error instanceof Error ? error.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingItem
                ? `/api/admin/items/${editingItem.id}`
                : '/api/admin/items';
            const method = editingItem ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price.toString()),
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to save item');
            }

            toast.success(editingItem ? 'Item updated' : 'Item created');
            setDialogOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving item:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save item');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const res = await fetch(`/api/admin/items/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete item');
            toast.success('Item deleted');
            fetchData();
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Failed to delete item');
        }
    };

    const filteredItems = filterCategory === 'all'
        ? items
        : items.filter((item) => item.category_id === filterCategory);

    const saveOrder = async (newItems: MenuItem[]) => {
        try {
            // Only reorder items within the filtered category
            const orderedIds = newItems.map((item) => item.id);
            const res = await fetch('/api/admin/items/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderedIds }),
            });

            if (!res.ok) {
                throw new Error('Failed to save order');
            }

            toast.success('Order updated');
            // Refetch to get updated display_order values
            fetchData();
        } catch (error) {
            console.error('Error saving order:', error);
            toast.error('Failed to save order');
            fetchData(); // Revert on error
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = filteredItems.findIndex((item) => item.id === active.id);
            const newIndex = filteredItems.findIndex((item) => item.id === over.id);
            const newFilteredItems = arrayMove(filteredItems, oldIndex, newIndex);

            // Update items state
            if (filterCategory === 'all') {
                setItems(newFilteredItems);
            } else {
                // Replace filtered items in the full items array
                const newItems = items.map((item) => {
                    const updatedItem = newFilteredItems.find((fi) => fi.id === item.id);
                    return updatedItem || item;
                });
                setItems(newItems);
            }

            saveOrder(newFilteredItems);
        }
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newFilteredItems = arrayMove(filteredItems, index, index - 1);

        if (filterCategory === 'all') {
            setItems(newFilteredItems);
        } else {
            const newItems = [...items];
            const globalOldIndex = items.findIndex((item) => item.id === filteredItems[index].id);
            const globalNewIndex = items.findIndex((item) => item.id === filteredItems[index - 1].id);
            const temp = newItems[globalOldIndex];
            newItems[globalOldIndex] = newItems[globalNewIndex];
            newItems[globalNewIndex] = temp;
            setItems(newItems);
        }

        saveOrder(newFilteredItems);
    };

    const handleMoveDown = (index: number) => {
        if (index === filteredItems.length - 1) return;
        const newFilteredItems = arrayMove(filteredItems, index, index + 1);

        if (filterCategory === 'all') {
            setItems(newFilteredItems);
        } else {
            const newItems = [...items];
            const globalOldIndex = items.findIndex((item) => item.id === filteredItems[index].id);
            const globalNewIndex = items.findIndex((item) => item.id === filteredItems[index + 1].id);
            const temp = newItems[globalOldIndex];
            newItems[globalOldIndex] = newItems[globalNewIndex];
            newItems[globalNewIndex] = temp;
            setItems(newItems);
        }

        saveOrder(newFilteredItems);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Menu Items</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Drag to reorder or use ↑↓ buttons
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={openCreateDialog}
                                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingItem ? 'Edit Item' : 'Create Item'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={formData.category_id}
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({ ...prev, category_id: value }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    price: parseFloat(e.target.value) || 0,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, name: e.target.value }))
                                        }
                                        placeholder="e.g., Butter Chicken"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                        placeholder="Describe the item..."
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Image</Label>
                                    <div className="flex gap-4 items-start">
                                        {formData.image_url ? (
                                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                                                <Image
                                                    src={formData.image_url}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData((prev) => ({ ...prev, image_url: '' }))
                                                    }
                                                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-black/70"
                                                >
                                                    <X className="h-3 w-3 text-white" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-24 h-24 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                                                <ImageIcon className="h-8 w-8 text-zinc-400" />
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-2">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                {uploading ? 'Uploading...' : 'Upload Image'}
                                            </Button>
                                            <p className="text-xs text-zinc-500">Or paste URL:</p>
                                            <Input
                                                placeholder="https://..."
                                                value={formData.image_url}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        image_url: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <Label htmlFor="available" className="text-sm">Available</Label>
                                    <Switch
                                        id="available"
                                        checked={formData.is_available}
                                        onCheckedChange={(checked) =>
                                            setFormData((prev) => ({ ...prev, is_available: checked }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Spice Level</Label>
                                    <div className="flex gap-2">
                                        {[0, 1, 2, 3].map((level) => (
                                            <Button
                                                key={level}
                                                type="button"
                                                variant={formData.spice_level === level ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() =>
                                                    setFormData((prev) => ({ ...prev, spice_level: level }))
                                                }
                                            >
                                                {level === 0 ? 'None' : '🌶️'.repeat(level)}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editingItem ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>
                        All Items {filterCategory !== 'all' && `(${categories.find((c) => c.id === filterCategory)?.name})`}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-zinc-500">Loading...</div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500">
                            No items found. Create your first menu item!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12"></TableHead>
                                            <TableHead className="w-16">Image</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <SortableContext
                                        items={filteredItems.map((item) => item.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <TableBody>
                                            {filteredItems.map((item, index) => (
                                                <SortableRow
                                                    key={item.id}
                                                    item={item}
                                                    index={index}
                                                    total={filteredItems.length}
                                                    onEdit={openEditDialog}
                                                    onDelete={handleDelete}
                                                    onMoveUp={handleMoveUp}
                                                    onMoveDown={handleMoveDown}
                                                />
                                            ))}
                                        </TableBody>
                                    </SortableContext>
                                </Table>
                            </DndContext>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
