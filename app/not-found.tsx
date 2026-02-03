'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-dark px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
            >
                <h1 className="font-serif text-8xl font-bold text-gradient mb-4">404</h1>
                <h2 className="font-serif text-2xl font-semibold mb-4">Page Not Found</h2>
                <p className="text-muted-foreground mb-8">
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <Button className="btn-gradient">
                            <Home className="w-4 h-4 mr-2" />
                            Go Home
                        </Button>
                    </Link>
                    <Link href="/menu">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            View Menu
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
