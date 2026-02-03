import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    variable: '--font-serif',
    display: 'swap',
});

const outfit = Outfit({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-sans',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Indian Aroma | Authentic Indian Cuisine in Netherlands',
    description: 'Experience the finest authentic Indian cuisine. Order online for delivery or pickup. Premium dishes crafted with traditional recipes and the freshest ingredients.',
    keywords: 'Indian restaurant, Indian food, curry, biryani, tandoori, delivery, Netherlands',
    authors: [{ name: 'Indian Aroma' }],
    openGraph: {
        title: 'Indian Aroma | Authentic Indian Cuisine',
        description: 'Experience the finest authentic Indian cuisine. Order online for delivery or pickup.',
        type: 'website',
        images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@indianaroma',
        images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`dark ${cormorant.variable} ${outfit.variable}`}>
            <body className="font-sans antialiased">
                <Providers>
                    <Navbar />
                    {children}
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
