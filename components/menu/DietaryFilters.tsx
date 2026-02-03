import { Leaf, Vegan, WheatOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DietaryFiltersProps {
  filters: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
  };
  onFilterChange: (filter: 'vegetarian' | 'vegan' | 'glutenFree') => void;
}

export function DietaryFilters({ filters, onFilterChange }: DietaryFiltersProps) {
  const filterOptions = [
    { key: 'vegetarian' as const, label: 'Vegetarian', icon: Leaf },
    { key: 'vegan' as const, label: 'Vegan', icon: Vegan },
    { key: 'glutenFree' as const, label: 'Gluten-Free', icon: WheatOff },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map(({ key, label, icon: Icon }) => (
        <motion.button
          key={key}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(key)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
            'border border-border/50 transition-all duration-200',
            filters[key]
              ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_hsl(30_100%_60%_/_0.3)]'
              : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
        </motion.button>
      ))}
    </div>
  );
}
