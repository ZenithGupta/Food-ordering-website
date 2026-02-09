import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Force dynamic - no caching
export const dynamic = 'force-dynamic';

// GET public menu - categories with items (ordered by display_order)
export async function GET() {
    try {
        // Fetch active categories ordered by display_order
        const { data: categories, error: catError } = await supabaseAdmin
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (catError) throw catError;

        // Fetch available items ordered by display_order
        const { data: items, error: itemsError } = await supabaseAdmin
            .from('menu_items')
            .select('*')
            .eq('is_available', true)
            .order('display_order', { ascending: true });

        if (itemsError) throw itemsError;

        // Group items by category (items are already sorted by display_order)
        const menuData = categories?.map(category => ({
            ...category,
            items: items?.filter(item => item.category_id === category.id) || [],
        }));

        return NextResponse.json(menuData);
    } catch (error) {
        console.error('Error fetching menu:', error);
        return NextResponse.json(
            { error: 'Failed to fetch menu' },
            { status: 500 }
        );
    }
}
