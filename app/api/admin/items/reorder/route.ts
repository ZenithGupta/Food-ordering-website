import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';

// POST - reorder items within a category
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderedIds } = body;

        console.log('[items/reorder] Received orderedIds:', orderedIds);

        if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
            return NextResponse.json(
                { error: 'orderedIds must be a non-empty array' },
                { status: 400 }
            );
        }

        // Update each item's display_order based on its position in the array
        // Execute updates sequentially to ensure proper ordering
        for (let index = 0; index < orderedIds.length; index++) {
            const id = orderedIds[index];
            console.log(`[items/reorder] Updating item ${id} to display_order ${index}`);

            const { error } = await supabaseAdmin
                .from('menu_items')
                .update({ display_order: index })
                .eq('id', id);

            if (error) {
                console.error(`[items/reorder] ERROR updating item ${id}:`, error);
                throw new Error(`Failed to update item ${id}: ${error.message}`);
            }
        }

        console.log('[items/reorder] All updates successful, revalidating paths...');

        // Revalidate menu page and homepage
        revalidatePath('/menu');
        revalidatePath('/');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error reordering items:', error);
        return NextResponse.json(
            { error: 'Failed to reorder items' },
            { status: 500 }
        );
    }
}

