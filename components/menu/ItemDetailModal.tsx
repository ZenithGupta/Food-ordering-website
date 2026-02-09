'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, X, Flame } from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { formatCurrency, getSpiceDisplay } from '@/lib/utils';
import { useCart, MAX_QUANTITY } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ItemDetailModalProps {
    item: MenuItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
    const { addItemWithQuantity } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [inputValue, setInputValue] = useState('1');

    // Reset quantity when modal opens with new item
    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setInputValue('1');
        }
    }, [isOpen, item?.id]);

    if (!item) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setInputValue('');
            return;
        }
        if (!/^\d+$/.test(value)) return;

        const num = parseInt(value, 10);
        if (num >= 1 && num <= MAX_QUANTITY) {
            setInputValue(value);
            setQuantity(num);
        }
    };

    const handleBlur = () => {
        if (inputValue === '' || parseInt(inputValue, 10) < 1) {
            setInputValue(quantity.toString());
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            const newQty = quantity - 1;
            setQuantity(newQty);
            setInputValue(newQty.toString());
        }
    };

    const handleIncrement = () => {
        if (quantity < MAX_QUANTITY) {
            const newQty = quantity + 1;
            setQuantity(newQty);
            setInputValue(newQty.toString());
        }
    };

    const handleAddToCart = () => {
        addItemWithQuantity(item, quantity);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-0">
                {/* Image Header */}
                <div className="relative h-56 sm:h-64 overflow-hidden flex-shrink-0">
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-bold">
                        {formatCurrency(item.price)}
                    </div>

                    {/* Spice Level */}
                    {item.spiceLevel > 0 && (
                        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm flex items-center gap-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            {getSpiceDisplay(item.spiceLevel)}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-2xl">{item.name}</DialogTitle>
                    </DialogHeader>

                    <p className="text-muted-foreground mt-3 leading-relaxed">
                        {item.description}
                    </p>

                    {/* Quantity Selector */}
                    <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Quantity</span>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={handleDecrement}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className="h-9 w-16 text-center text-base"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={handleIncrement}
                                    disabled={quantity >= MAX_QUANTITY}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Subtotal */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="text-xl font-bold text-secondary">
                                {formatCurrency(item.price * quantity)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Add to Cart Button */}
                <div className="p-4 border-t border-border/50 bg-background">
                    <Button
                        onClick={handleAddToCart}
                        className="w-full btn-gradient py-6 text-lg"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add {quantity} to Cart
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
