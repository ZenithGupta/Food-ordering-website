'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { formatCurrency, getSpiceDisplay } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ItemDetailModal } from './ItemDetailModal';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { addItem } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="glass-card overflow-hidden group cursor-pointer flex flex-col"
        onClick={handleCardClick}
      >
        {/* Image - fixed height */}
        <div className="relative h-32 sm:h-36 overflow-hidden flex-shrink-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

          {/* Spice Level */}
          {item.spiceLevel > 0 && (
            <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-xs">
              {getSpiceDisplay(item.spiceLevel)}
            </div>
          )}
        </div>

        {/* Content - flex-1 to fill remaining space */}
        <div className="p-3 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="font-serif text-sm sm:text-base font-semibold leading-tight line-clamp-1">
              {item.name}
            </h3>
            <span className="text-secondary font-bold text-sm whitespace-nowrap">
              {formatCurrency(item.price)}
            </span>
          </div>

          {/* Description with fixed min-height for 2 lines */}
          <p className="text-muted-foreground text-xs line-clamp-2 mb-3 min-h-[2.5em]">
            {item.description}
          </p>

          {/* Button pushed to bottom with mt-auto */}
          <Button
            onClick={handleAddClick}
            size="sm"
            className="w-full btn-gradient group-hover:animate-glow-pulse text-xs sm:text-sm mt-auto"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add to Order
          </Button>
        </div>
      </motion.div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
