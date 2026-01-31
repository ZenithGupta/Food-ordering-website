import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType, useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { menuItem, quantity } = item;

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
            onClick={() => updateQuantity(menuItem.id, quantity - 1)}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="text-sm font-medium w-6 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateQuantity(menuItem.id, quantity + 1)}
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
