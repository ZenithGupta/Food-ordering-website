import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET all featured items
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('menu_items')
            .select('*, categories(name, slug)')
            .eq('is_featured', true)
            .eq('is_available', true)
            .order('display_order', { ascending: true })
            .limit(3);

        if (error) throw error;

        return NextResponse.json(data || []);
    } catch (error) {
        console.error('Error fetching featured items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch featured items' },
            { status: 500 }
        );
    }
}

// POST - update featured items
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { itemIds } = body;

        console.log('[admin/featured] Received itemIds to feature:', itemIds);

        if (!Array.isArray(itemIds)) {
            return NextResponse.json(
                { error: 'itemIds must be an array' },
                { status: 400 }
            );
        }

        // First, unfeatured all items
        console.log('[admin/featured] Unfeaturing all currently featured items...');
        const { error: unfeaturedError } = await supabaseAdmin
            .from('menu_items')
            .update({ is_featured: false })
            .eq('is_featured', true);

        if (unfeaturedError) {
            console.error('[admin/featured] ERROR unfeaturing items:', unfeaturedError);
            throw unfeaturedError;
        }

        // Then, feature the selected items
        if (itemIds.length > 0) {
            console.log('[admin/featured] Featuring selected items:', itemIds);
            const { data, error: featureError } = await supabaseAdmin
                .from('menu_items')
                .update({ is_featured: true })
                .in('id', itemIds)
                .select('id, name, is_featured');

            if (featureError) {
                console.error('[admin/featured] ERROR featuring items:', featureError);
                throw featureError;
            }
            console.log('[admin/featured] Featured items result:', data);
        }

        console.log('[admin/featured] All updates successful, revalidating paths...');

        // Revalidate homepage and menu
        revalidatePath('/');
        revalidatePath('/menu');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating featured items:', error);
        return NextResponse.json(
            { error: 'Failed to update featured items' },
            { status: 500 }
        );
    }
}

