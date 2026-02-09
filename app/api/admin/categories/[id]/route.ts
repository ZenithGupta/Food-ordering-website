import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET single category
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        const { data, error } = await supabaseAdmin
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { error: 'Failed to fetch category' },
            { status: 500 }
        );
    }
}

// PUT update category
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, slug, display_order, is_active } = body;

        const { data, error } = await supabaseAdmin
            .from('categories')
            .update({
                name,
                slug,
                display_order,
                is_active,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        // Revalidate menu page
        revalidatePath('/menu');

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { error: 'Failed to update category' },
            { status: 500 }
        );
    }
}

// DELETE category
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        const { error } = await supabaseAdmin
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Revalidate menu page after deletion
        revalidatePath('/menu');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}
