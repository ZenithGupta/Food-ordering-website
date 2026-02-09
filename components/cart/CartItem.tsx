'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType, useCart, MAX_QUANTITY } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { menuItem, quantity } = item;
  const [inputValue, setInputValue] = useState(quantity.toString());

  // Sync input value when quantity changes externally
  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string for typing
    if (value === '') {
      setInputValue('');
      return;
    }
    // Only allow numbers
    if (!/^\d+$/.test(value)) return;

    const num = parseInt(value, 10);
    if (num >= 1 && num <= MAX_QUANTITY) {
      setInputValue(value);
      updateQuantity(menuItem.id, num);
    }
  };

  const handleBlur = () => {
    // Reset to current quantity if empty or invalid
    if (inputValue === '' || parseInt(inputValue, 10) < 1) {
      setInputValue(quantity.toString());
    }
  };

  const handleDecrement = () => {
    const newQty = quantity - 1;
    if (newQty >= 1) {
      setInputValue(newQty.toString());
      updateQuantity(menuItem.id, newQty);
    }
  };

  const handleIncrement = () => {
    const newQty = quantity + 1;
    if (newQty <= MAX_QUANTITY) {
      setInputValue(newQty.toString());
      updateQuantity(menuItem.id, newQty);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 p-4 glass-card"
    >
      {/* Image */}
      <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
        <img
          src={menuItem.imageUrl}
          alt={menuItem.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{menuItem.name}</h4>
        <p className="text-secondary font-semibold text-sm mt-1">
          {formatCurrency(menuItem.price * quantity)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleDecrement}
            disabled={quantity <= 1}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Input
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="h-7 w-14 text-center text-sm px-1"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleIncrement}
            disabled={quantity >= MAX_QUANTITY}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
        onClick={() => removeItem(menuItem.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}
