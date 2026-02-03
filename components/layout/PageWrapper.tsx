'use client';

import { ReactNode } from 'react';
import { CartDrawer } from '@/components/cart/CartDrawer';

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-dark">
      <main className="flex-1 pt-16">
        {children}
      </main>
      <CartDrawer />
    </div>
  );
}
