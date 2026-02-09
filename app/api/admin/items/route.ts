import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET all menu items (with optional category filter)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('category_id');

        let query = supabaseAdmin
            .from('menu_items')
            .select('*, categories(name, slug)')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: true });

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch menu items' },
            { status: 500 }
        );
    }
}

// POST create new menu item
export async function POST(request: Request) {
    try {
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

        if (!category_id || !name || price === undefined) {
            return NextResponse.json(
                { error: 'Category ID, name, and price are required' },
                { status: 400 }
            );
        }

        // Auto-calculate display_order as max + 1 within category
        const { data: maxOrderData } = await supabaseAdmin
            .from('menu_items')
            .select('display_order')
            .eq('category_id', category_id)
            .order('display_order', { ascending: false })
            .limit(1)
            .single();

        const nextOrder = (maxOrderData?.display_order ?? -1) + 1;

        const { data, error } = await supabaseAdmin
            .from('menu_items')
            .insert({
                category_id,
                name,
                description: description ?? '',
                price,
                image_url: image_url ?? null,
                is_vegetarian: true, // Restaurant is vegetarian only
                is_vegan: false,
                is_gluten_free: false,
                spice_level: spice_level ?? 0,
                is_available: is_available ?? true,
                display_order: nextOrder,
            })
            .select('*, categories(name, slug)')
            .single();

        if (error) throw error;

        // Revalidate menu page
        revalidatePath('/menu');

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Error creating menu item:', error);
        return NextResponse.json(
            { error: 'Failed to create menu item' },
            { status: 500 }
        );
    }
}
