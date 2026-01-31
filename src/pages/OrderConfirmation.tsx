import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Clock, Phone } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Button } from '@/components/ui/button';

const OrderConfirmation = () => {
  return (
    <PageWrapper>
      <section className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-primary" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="font-serif text-4xl font-bold mb-4">
              Order <span className="text-gradient">Confirmed!</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Thank you for your order. We're preparing your delicious meal!
            </p>
          </motion.div>

          {/* Order Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            <div className="glass-card p-4">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Estimated Time</p>
              <p className="font-semibold">30-45 minutes</p>
            </div>
            <div className="glass-card p-4">
              <Phone className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Questions?</p>
              <a href="tel:+31201234567" className="font-semibold hover:text-primary transition-colors">
                +31 20 123 4567
              </a>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/menu">
              <Button className="btn-gradient">
                Order More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-border/50">
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </PageWrapper>
  );
};

export default OrderConfirmation;
