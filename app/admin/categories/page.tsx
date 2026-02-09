'use client';

import { useEffect, useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
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
import { Plus, Pencil, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
    id: string;
    name: string;
    slug: string;
    display_order: number;
    is_active: boolean;
}

interface SortableRowProps {
    category: Category;
    index: number;
    total: number;
    onEdit: (cat: Category) => void;
    onDelete: (id: string) => void;
    onMoveUp: (index: number) => void;
    onMoveDown: (index: number) => void;
}

function SortableRow({ category, index, total, onEdit, onDelete, onMoveUp, onMoveDown }: SortableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id });

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
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell className="text-zinc-500">{category.slug}</TableCell>
            <TableCell>{category.display_order}</TableCell>
            <TableCell>
                <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.is_active
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                >
                    {category.is_active ? 'Active' : 'Inactive'}
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
                        onClick={() => onEdit(category)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(category.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        is_active: true,
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            if (Array.isArray(data)) {
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (name: string) => {
        setFormData((prev) => ({
            ...prev,
            name,
            slug: editingCategory ? prev.slug : generateSlug(name),
        }));
    };

    const openCreateDialog = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            slug: '',
            is_active: true,
        });
        setDialogOpen(true);
    };

    const openEditDialog = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            is_active: category.is_active,
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingCategory
                ? `/api/admin/categories/${editingCategory.id}`
                : '/api/admin/categories';
            const method = editingCategory ? 'PUT' : 'POST';

            const payload = editingCategory
                ? { ...formData, display_order: editingCategory.display_order }
                : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to save category');
            }

            toast.success(editingCategory ? 'Category updated' : 'Category created');
            setDialogOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save category');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category? All items in this category will also be deleted.')) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete category');
            }

            toast.success('Category deleted');
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category');
        }
    };

    const saveOrder = async (newCategories: Category[]) => {
        try {
            const orderedIds = newCategories.map((c) => c.id);
            const res = await fetch('/api/admin/categories/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderedIds }),
            });

            if (!res.ok) {
                throw new Error('Failed to save order');
            }

            toast.success('Order updated');
            // Refetch to get updated display_order values
            fetchCategories();
        } catch (error) {
            console.error('Error saving order:', error);
            toast.error('Failed to save order');
            fetchCategories(); // Revert on error
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = categories.findIndex((c) => c.id === active.id);
            const newIndex = categories.findIndex((c) => c.id === over.id);
            const newCategories = arrayMove(categories, oldIndex, newIndex);
            setCategories(newCategories);
            saveOrder(newCategories);
        }
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newCategories = arrayMove(categories, index, index - 1);
        setCategories(newCategories);
        saveOrder(newCategories);
    };

    const handleMoveDown = (index: number) => {
        if (index === categories.length - 1) return;
        const newCategories = arrayMove(categories, index, index + 1);
        setCategories(newCategories);
        saveOrder(newCategories);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Categories</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Drag to reorder or use ↑↓ buttons
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog} className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingCategory ? 'Edit Category' : 'Create Category'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="e.g., Party Services"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, slug: e.target.value }))
                                    }
                                    placeholder="e.g., party-services"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="is_active">Active</Label>
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) =>
                                        setFormData((prev) => ({ ...prev, is_active: checked }))
                                    }
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingCategory ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-zinc-500">Loading...</div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500">
                            No categories yet. Create your first category!
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12"></TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <SortableContext
                                    items={categories.map((c) => c.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <TableBody>
                                        {categories.map((category, index) => (
                                            <SortableRow
                                                key={category.id}
                                                category={category}
                                                index={index}
                                                total={categories.length}
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
