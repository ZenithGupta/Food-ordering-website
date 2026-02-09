import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET single menu item
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        const { data, error } = await supabaseAdmin
            .from('menu_items')
            .select('*, categories(name, slug)')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) {
            return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching menu item:', error);
        return NextResponse.json(
            { error: 'Failed to fetch menu item' },
            { status: 500 }
        );
    }
}

// PUT update menu item
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();
        const {
            category_id,
            name,
            description,
            price,
            image_url,
            spice_level,
            is_available,
        } = body;

        const { data, error } = await supabaseAdmin
            .from('menu_items')
            .update({
                category_id,
                name,
                description,
                price,
                image_url,
                spice_level,
                is_available,
            })
            .eq('id', id)
            .select('*, categories(name, slug)')
            .single();

        if (error) throw error;
        if (!data) {
            return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating menu item:', error);
        return NextResponse.json(
            { error: 'Failed to update menu item' },
            { status: 500 }
        );
    }
}

// DELETE menu item
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        const { error } = await supabaseAdmin
            .from('menu_items')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        return NextResponse.json(
            { error: 'Failed to delete menu item' },
            { status: 500 }
        );
    }
}
