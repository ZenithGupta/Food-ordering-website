import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

interface PageWrapperProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function PageWrapper({ children, showFooter = true }: PageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-dark">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      {showFooter && <Footer />}
      <CartDrawer />
    </div>
  );
}
