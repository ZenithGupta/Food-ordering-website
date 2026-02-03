'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Star, ChefHat, Award, Users } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function AboutPage() {
    return (
        <PageWrapper>
            {/* Hero */}
            <section className="py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-dark" />
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

                <div className="container mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <span className="text-primary text-sm font-medium uppercase tracking-wider">
                            Our Story
                        </span>
                        <h1 className="font-serif text-4xl md:text-6xl font-bold mt-4 mb-6">
                            About <span className="text-gradient">Indian Aroma</span>
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            For over two decades, we&apos;ve been bringing the authentic flavors of India
                            to the heart of Amsterdam. Our passion for traditional cooking and premium
                            ingredients has made us a beloved destination for food lovers.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-4 bg-card/30">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: ChefHat, value: '20+', label: 'Years of Excellence' },
                            { icon: Users, value: '50K+', label: 'Happy Customers' },
                            { icon: Star, value: '4.9', label: 'Average Rating' },
                            { icon: Award, value: '15+', label: 'Awards Won' },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                                <div className="text-3xl font-bold text-secondary mb-1">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Philosophy */}
            <section className="py-24 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="glass-card aspect-square rounded-2xl overflow-hidden">
                                <img
                                    src="/placeholder.svg"
                                    alt="Our kitchen"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-primary text-sm font-medium uppercase tracking-wider">
                                Our Philosophy
                            </span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2 mb-6">
                                Tradition Meets Innovation
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    At Indian Aroma, we believe that great food starts with great ingredients.
                                    We source our spices directly from India, ensuring authentic flavors in
                                    every dish we serve.
                                </p>
                                <p>
                                    Our chefs bring decades of experience from various regions of India,
                                    creating a menu that celebrates the diversity of Indian cuisine—from
                                    the rich curries of the North to the coconut-infused dishes of the South.
                                </p>
                                <p>
                                    Whether you&apos;re joining us for a casual dinner or ordering for a special
                                    occasion, we promise an unforgettable culinary journey.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Info */}
            <section className="py-24 px-4 bg-card/30">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="text-primary text-sm font-medium uppercase tracking-wider">
                            Visit Us
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
                            Find Us in Amsterdam
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-card p-6 text-center"
                        >
                            <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Address</h3>
                            <p className="text-muted-foreground text-sm">
                                Damrak 123<br />
                                1012 LP Amsterdam<br />
                                Netherlands
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-6 text-center"
                        >
                            <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Contact</h3>
                            <p className="text-muted-foreground text-sm">
                                <a href="tel:+31201234567" className="hover:text-primary transition-colors">
                                    +31 20 123 4567
                                </a>
                                <br />
                                <a href="mailto:info@indianaroma.nl" className="hover:text-primary transition-colors">
                                    info@indianaroma.nl
                                </a>
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-6 text-center"
                        >
                            <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Hours</h3>
                            <p className="text-muted-foreground text-sm">
                                Mon - Thu: 12:00 - 22:00<br />
                                Fri - Sat: 12:00 - 23:00<br />
                                Sunday: 13:00 - 22:00
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </PageWrapper>
    );
}
