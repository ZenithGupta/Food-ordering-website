import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';

// POST - reorder categories
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderedIds } = body;

        console.log('[categories/reorder] Received orderedIds:', orderedIds);

        if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
            return NextResponse.json(
                { error: 'orderedIds must be a non-empty array' },
                { status: 400 }
            );
        }

        // Update each category's display_order based on its position in the array
        // Execute updates sequentially to ensure proper ordering
        for (let index = 0; index < orderedIds.length; index++) {
            const id = orderedIds[index];
            console.log(`[categories/reorder] Updating category ${id} to display_order ${index}`);

            const { error } = await supabaseAdmin
                .from('categories')
                .update({ display_order: index })
                .eq('id', id);

            if (error) {
                console.error(`[categories/reorder] ERROR updating category ${id}:`, error);
                throw new Error(`Failed to update category ${id}: ${error.message}`);
            }
        }

        console.log('[categories/reorder] All updates successful, revalidating paths...');

        // Revalidate menu page and homepage
        revalidatePath('/menu');
        revalidatePath('/');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error reordering categories:', error);
        return NextResponse.json(
            { error: 'Failed to reorder categories' },
            { status: 500 }
        );
    }
}

