import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET all categories
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST create new category
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, slug, is_active } = body;

        if (!name || !slug) {
            return NextResponse.json(
                { error: 'Name and slug are required' },
                { status: 400 }
            );
        }

        // Auto-calculate display_order as max + 1
        const { data: maxOrderData } = await supabaseAdmin
            .from('categories')
            .select('display_order')
            .order('display_order', { ascending: false })
            .limit(1)
            .single();

        const nextOrder = (maxOrderData?.display_order ?? -1) + 1;

        const { data, error } = await supabaseAdmin
            .from('categories')
            .insert({
                name,
                slug,
                display_order: nextOrder,
                is_active: is_active ?? true,
            })
            .select()
            .single();

        if (error) throw error;

        // Revalidate menu page
        revalidatePath('/menu');

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        );
    }
}
