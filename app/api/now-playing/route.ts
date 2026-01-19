import { fetchTMDB } from '@/lib/tmdbServer';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = await fetchTMDB('/movie/now_playing');
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
