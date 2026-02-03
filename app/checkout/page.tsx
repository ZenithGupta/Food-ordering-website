'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Phone, MapPin, Clock, AlertTriangle, ShoppingBag } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Restaurant contact details
const RESTAURANT_PHONE = '+31 20 123 4567';
const RESTAURANT_ADDRESS = 'Damrak 123, 1012 LP Amsterdam, Netherlands';

const DELIVERY_FEE = 3.50;
const FREE_DELIVERY_THRESHOLD = 35;

export default function CheckoutPage() {
    const { items, subtotal } = useCart();

    const deliveryFee = subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
    const total = subtotal + deliveryFee;

    if (items.length === 0) {
        return (
            <PageWrapper>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h1 className="font-serif text-3xl font-bold mb-4">Your cart is empty</h1>
                        <p className="text-muted-foreground mb-6">Add some delicious dishes to get started!</p>
                        <Link href="/menu">
                            <Button className="btn-gradient">
                                Browse Menu
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-gradient">Checkout</span>
                        </h1>
                        <p className="text-muted-foreground">Review your order and contact us to place it</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="glass-card p-6">
                                <h2 className="font-serif text-xl font-semibold mb-4">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    {items.map((item) => (
                                        <div key={item.menuItem.id} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                {item.quantity}x {item.menuItem.name}
                                            </span>
                                            <span>{formatCurrency(item.menuItem.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-border/50 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Delivery</span>
                                        <span>
                                            {deliveryFee === 0 ? (
                                                <span className="text-primary">Free</span>
                                            ) : (
                                                formatCurrency(deliveryFee)
                                            )}
                                        </span>
                                    </div>
                                    {subtotal < FREE_DELIVERY_THRESHOLD && (
                                        <p className="text-xs text-muted-foreground">
                                            Add {formatCurrency(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery
                                        </p>
                                    )}
                                </div>

                                <div className="border-t border-border/50 pt-4 mt-4">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Total</span>
                                        <span className="text-xl font-bold text-secondary">
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Call to Order Notice */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="glass-card p-6">
                                {/* Maintenance Notice */}
                                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-primary mb-1">Online Payments Temporarily Disabled</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Online payments are currently disabled. To place your order, please call us directly or pay at the counter.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <h2 className="font-serif text-xl font-semibold mb-6">How to Order</h2>

                                {/* Phone */}
                                <motion.a
                                    href={`tel:${RESTAURANT_PHONE.replace(/\s/g, '')}`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="block glass-card p-4 mb-4 border-2 border-primary/50 hover:border-primary transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Phone className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Call Us Now</p>
                                            <p className="text-xl font-bold text-primary">{RESTAURANT_PHONE}</p>
                                        </div>
                                    </div>
                                </motion.a>

                                {/* Address */}
                                <div className="glass-card p-4 mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-secondary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Visit Us At</p>
                                            <p className="font-medium">{RESTAURANT_ADDRESS}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="glass-card p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Opening Hours</p>
                                            <p className="font-medium text-sm">
                                                Mon-Thu: 12:00-22:00 • Fri-Sat: 12:00-23:00 • Sun: 13:00-22:00
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Call Button */}
                                <motion.a
                                    href={`tel:${RESTAURANT_PHONE.replace(/\s/g, '')}`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="block mt-6"
                                >
                                    <Button className="w-full btn-gradient py-6 text-lg">
                                        <Phone className="w-5 h-5 mr-2" />
                                        Call to Place Order
                                    </Button>
                                </motion.a>

                                <p className="text-xs text-muted-foreground text-center mt-4">
                                    Mention your order items when you call and we&apos;ll have it ready for you!
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </PageWrapper>
    );
}
