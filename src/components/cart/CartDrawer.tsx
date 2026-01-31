import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CartItem } from './CartItem';
import { menuItems, upsellItems } from '@/data/menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export function CartDrawer() {
  const { items, isOpen, setCartOpen, subtotal, addItem } = useCart();
  const navigate = useNavigate();

  // Get upsell suggestions (items not in cart)
  const cartItemIds = items.map(item => item.menuItem.id);
  const suggestions = menuItems.filter(
    item => upsellItems.includes(item.id) && !cartItemIds.includes(item.id)
  );

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background border-l border-border/50">
        <SheetHeader className="border-b border-border/50 pb-4">
          <SheetTitle className="flex items-center gap-2 font-serif">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Your Order
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-lg mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Explore our menu and add some delicious dishes!
            </p>
            <Button
              onClick={() => {
                setCartOpen(false);
                navigate('/menu');
              }}
              className="btn-gradient"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItem key={item.menuItem.id} item={item} />
                ))}
              </AnimatePresence>

              {/* Upsell Suggestions */}
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 glass-card border-dashed"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium">Complete your meal</span>
                  </div>
                  <div className="space-y-2">
                    {suggestions.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-secondary">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addItem(item)}
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 pt-4 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-semibold text-secondary">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Delivery fees calculated at checkout
              </p>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full btn-gradient text-base py-6"
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
