import { motion } from 'framer-motion';
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onCategoryChange('all')}
        className={cn('category-pill whitespace-nowrap', activeCategory === 'all' && 'active')}
      >
        All Items
      </motion.button>
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            'category-pill whitespace-nowrap',
            activeCategory === category.id && 'active'
          )}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  );
}
