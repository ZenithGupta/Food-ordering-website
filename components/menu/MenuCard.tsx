'use client';

import { motion } from 'framer-motion';
import { Plus, Leaf, WheatOff } from 'lucide-react';
import { MenuItem } from '@/data/menu';
import { formatCurrency, getSpiceDisplay } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { addItem } = useCart();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card overflow-hidden group cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

        {/* Dietary Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.isVegetarian && (
            <Badge className="bg-veg hover:bg-veg text-veg-foreground border-0">
              <Leaf className="w-3 h-3 mr-1" />
              Veg
            </Badge>
          )}
          {item.isGlutenFree && (
            <Badge className="bg-secondary/90 hover:bg-secondary text-secondary-foreground border-0">
              <WheatOff className="w-3 h-3 mr-1" />
              GF
            </Badge>
          )}
        </div>

        {/* Spice Level */}
        {item.spiceLevel > 0 && (
          <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-sm">
            {getSpiceDisplay(item.spiceLevel)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif text-lg font-semibold leading-tight">
            {item.name}
          </h3>
          <span className="text-secondary font-bold whitespace-nowrap">
            {formatCurrency(item.price)}
          </span>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {item.description}
        </p>

        <Button
          onClick={() => addItem(item)}
          className="w-full btn-gradient group-hover:animate-glow-pulse"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Order
        </Button>
      </div>
    </motion.div>
  );
}
