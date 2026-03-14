import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

interface RouteParams {
    params: { id: string };
}

// GET single category
export async function GET(request: Request, { params }: RouteParams) {
    const { id } = params;

    const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(data);
}

// PUT update category
export async function PUT(request: Request, { params }: RouteParams) {
    const { id } = params;
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

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath('/menu');
    return NextResponse.json(data);
}

// DELETE category
export async function DELETE(request: Request, { params }: RouteParams) {
    const { id } = params;

    console.log('DELETE category called with id:', id);

    // Delete menu items first (since they reference category)
    const { error: menuError } = await supabaseAdmin
        .from('menu_items')
        .delete()
        .eq('category_id', id);

    console.log('Menu items delete result:', menuError);

    // Then delete the category
    const { error } = await supabaseAdmin
        .from('categories')
        .delete()
        .eq('id', id);

    console.log('Category delete result:', error);

    if (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
    }

    revalidatePath('/menu');
    return NextResponse.json({ success: true });
}
