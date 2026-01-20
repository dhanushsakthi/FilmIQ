import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch(
            "https://api.themoviedb.org/3/trending/movie/day",
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: "TMDB request failed" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
