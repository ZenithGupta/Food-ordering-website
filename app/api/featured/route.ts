import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Force dynamic - no caching at any level
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET featured items for homepage
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

        // Return with explicit no-cache headers for Vercel CDN
        return NextResponse.json(data || [], {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error) {
        console.error('Error fetching featured items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch featured items' },
            { status: 500 }
        );
    }
}

