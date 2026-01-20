import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'FilmIQ - Smart Movie Recommendations',
    description: 'AI-powered movie recommendation platform built with Next.js',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-[#141414] text-white overflow-hidden`}>
                <div className="flex h-screen w-screen overflow-hidden">
                    <Navbar />
                    <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    )
}
