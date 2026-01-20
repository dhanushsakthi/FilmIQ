import { fetchTMDB } from '@/lib/tmdbServer';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    if (!id) {
        return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
    }

    try {
        const data = await fetchTMDB(`/movie/${id}/videos`);
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
