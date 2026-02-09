import { motion } from 'framer-motion';
import { MenuItem } from '@/lib/types';
import { MenuCard } from './MenuCard';

interface MenuGridProps {
  items: MenuItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function MenuGrid({ items }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No items found matching your filters.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={itemVariants}>
          <MenuCard item={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}
