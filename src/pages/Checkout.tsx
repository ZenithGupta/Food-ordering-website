import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Truck, Store, CreditCard, Building2 } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { useCart } from '@/context/CartContext';
import { formatCurrency, isValidDutchPostalCode, formatDutchPostalCode } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const DELIVERY_FEE = 3.50;
const FREE_DELIVERY_THRESHOLD = 35;

const checkoutSchema = z.object({
  orderType: z.enum(['delivery', 'pickup']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.orderType === 'delivery') {
    return data.address && data.address.length > 0;
  }
  return true;
}, {
  message: 'Address is required for delivery',
  path: ['address'],
}).refine((data) => {
  if (data.orderType === 'delivery') {
    return data.postalCode && isValidDutchPostalCode(data.postalCode);
  }
  return true;
}, {
  message: 'Please enter a valid Dutch postal code (e.g., 1234 AB)',
  path: ['postalCode'],
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      orderType: 'delivery',
      name: '',
      email: '',
      phone: '',
      address: '',
      postalCode: '',
      city: 'Amsterdam',
      notes: '',
    },
  });

  const orderType = form.watch('orderType');
  const deliveryFee = orderType === 'delivery' && subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    
    // Simulate order submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Format postal code if delivery
    if (data.orderType === 'delivery' && data.postalCode) {
      data.postalCode = formatDutchPostalCode(data.postalCode);
    }

    console.log('Order submitted:', { ...data, items, total });
    
    clearCart();
    navigate('/order-confirmation');
  };

  if (items.length === 0) {
    return (
      <PageWrapper>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some delicious dishes to get started!</p>
            <Button onClick={() => navigate('/menu')} className="btn-gradient">
              Browse Menu
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Checkout</span>
            </h1>
            <p className="text-muted-foreground">Complete your order details below</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Order Type */}
                  <div className="glass-card p-6">
                    <h2 className="font-serif text-xl font-semibold mb-4">Order Type</h2>
                    <FormField
                      control={form.control}
                      name="orderType"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="grid grid-cols-2 gap-4"
                            >
                              <div>
                                <RadioGroupItem
                                  value="delivery"
                                  id="delivery"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="delivery"
                                  className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-border/50 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                                >
                                  <Truck className="w-6 h-6 mb-2 text-primary" />
                                  <span className="font-medium">Delivery</span>
                                  <span className="text-xs text-muted-foreground mt-1">
                                    {subtotal >= FREE_DELIVERY_THRESHOLD
                                      ? 'Free delivery'
                                      : `+${formatCurrency(DELIVERY_FEE)}`}
                                  </span>
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem
                                  value="pickup"
                                  id="pickup"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="pickup"
                                  className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-border/50 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                                >
                                  <Store className="w-6 h-6 mb-2 text-primary" />
                                  <span className="font-medium">Pickup</span>
                                  <span className="text-xs text-muted-foreground mt-1">
                                    Ready in 20 min
                                  </span>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contact Details */}
                  <div className="glass-card p-6">
                    <h2 className="font-serif text-xl font-semibold mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                {...field}
                                className="bg-muted/30 border-border/50 input-glow"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+31 6 12345678"
                                {...field}
                                className="bg-muted/30 border-border/50 input-glow"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                {...field}
                                className="bg-muted/30 border-border/50 input-glow"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {orderType === 'delivery' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass-card p-6"
                    >
                      <h2 className="font-serif text-xl font-semibold mb-4">Delivery Address</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Damrak 123"
                                  {...field}
                                  className="bg-muted/30 border-border/50 input-glow"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="1012 LP"
                                  {...field}
                                  className="bg-muted/30 border-border/50 input-glow"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Amsterdam"
                                  {...field}
                                  className="bg-muted/30 border-border/50 input-glow"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Notes */}
                  <div className="glass-card p-6">
                    <h2 className="font-serif text-xl font-semibold mb-4">Order Notes</h2>
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Any special requests or delivery instructions..."
                              {...field}
                              className="bg-muted/30 border-border/50 input-glow min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Payment Buttons */}
                  <div className="glass-card p-6">
                    <h2 className="font-serif text-xl font-semibold mb-4">Payment Method</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-gradient py-6"
                      >
                        <Building2 className="w-5 h-5 mr-2" />
                        {isSubmitting ? 'Processing...' : 'Pay with iDEAL'}
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant="outline"
                        className="py-6 border-border/50"
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        {isSubmitting ? 'Processing...' : 'Pay with Card'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      Payment processing powered by Stripe (coming soon)
                    </p>
                  </div>
                </form>
              </Form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="glass-card p-6 sticky top-24">
                <h2 className="font-serif text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.menuItem.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span>{formatCurrency(item.menuItem.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/50 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-primary">Free</span>
                      ) : (
                        formatCurrency(deliveryFee)
                      )}
                    </span>
                  </div>
                  {orderType === 'delivery' && subtotal < FREE_DELIVERY_THRESHOLD && (
                    <p className="text-xs text-muted-foreground">
                      Add {formatCurrency(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery
                    </p>
                  )}
                </div>

                <div className="border-t border-border/50 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-secondary">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Checkout;
