-- =====================================================
-- Indian Aroma - Supabase Database Schema
-- Run these queries in your Supabase SQL Editor
-- =====================================================

-- 1. CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MENU ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_vegetarian BOOLEAN NOT NULL DEFAULT false,
  is_vegan BOOLEAN NOT NULL DEFAULT false,
  is_gluten_free BOOLEAN NOT NULL DEFAULT false,
  spice_level INTEGER NOT NULL DEFAULT 0 CHECK (spice_level >= 0 AND spice_level <= 3),
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  order_type TEXT NOT NULL CHECK (order_type IN ('delivery', 'pickup')),
  delivery_address TEXT,
  delivery_postal_code TEXT,
  delivery_notes TEXT,
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories and menu items
CREATE POLICY "Allow public read access to categories" 
  ON categories FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to menu items" 
  ON menu_items FOR SELECT 
  USING (true);

-- Allow public to create orders (for placing orders)
CREATE POLICY "Allow public to create orders" 
  ON orders FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public to create order items" 
  ON order_items FOR INSERT 
  WITH CHECK (true);

-- =====================================================
-- SEED DATA: CATEGORIES
-- =====================================================
INSERT INTO categories (name, slug, display_order, is_active) VALUES
  ('Starters', 'starters', 1, true),
  ('Mains', 'mains', 2, true),
  ('Biryani', 'biryani', 3, true),
  ('Breads', 'breads', 4, true),
  ('Drinks', 'drinks', 5, true),
  ('Desserts', 'desserts', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED DATA: MENU ITEMS
-- Run this after the categories are inserted
-- =====================================================
INSERT INTO menu_items (category_id, name, description, price, image_url, is_vegetarian, is_vegan, is_gluten_free, spice_level, is_available)
SELECT 
  c.id,
  m.name,
  m.description,
  m.price,
  m.image_url,
  m.is_vegetarian,
  m.is_vegan,
  m.is_gluten_free,
  m.spice_level,
  m.is_available
FROM (VALUES
  -- Starters
  ('starters', 'Samosa', 'Crispy pastry filled with spiced potatoes and peas, served with mint chutney', 5.95, 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=800&auto=format&fit=crop&q=80', true, true, false, 1, true),
  ('starters', 'Chicken Tikka', 'Tender chicken pieces marinated in yogurt and spices, grilled in tandoor', 8.95, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop&q=80', false, false, true, 2, true),
  ('starters', 'Onion Bhaji', 'Crispy onion fritters with aromatic spices and herbs', 5.50, 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=800&auto=format&fit=crop&q=80', true, true, false, 1, true),
  ('starters', 'Paneer Tikka', 'Grilled cottage cheese cubes with bell peppers and Indian spices', 7.95, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80', true, false, true, 2, true),
  -- Mains
  ('mains', 'Butter Chicken', 'Tender chicken in creamy tomato sauce with aromatic spices', 16.95, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80', false, false, true, 1, true),
  ('mains', 'Lamb Rogan Josh', 'Slow-cooked lamb in rich Kashmiri spices and yogurt gravy', 18.95, 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop&q=80', false, false, true, 2, true),
  ('mains', 'Palak Paneer', 'Cottage cheese cubes in creamy spinach gravy with garlic', 14.95, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80', true, false, true, 1, true),
  ('mains', 'Chicken Vindaloo', 'Fiery Goan curry with potatoes and tangy vinegar notes', 16.95, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80', false, false, true, 3, true),
  ('mains', 'Dal Makhani', 'Creamy black lentils slow-cooked overnight with butter and cream', 13.95, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80', true, false, true, 1, true),
  ('mains', 'Chana Masala', 'Spiced chickpeas in tangy tomato sauce with aromatic spices', 12.95, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80', true, true, true, 2, true),
  -- Biryani
  ('biryani', 'Chicken Biryani', 'Fragrant basmati rice layered with spiced chicken and saffron', 17.95, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80', false, false, true, 2, true),
  ('biryani', 'Lamb Biryani', 'Royal Hyderabadi-style biryani with tender lamb and aromatic spices', 19.95, 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=800&auto=format&fit=crop&q=80', false, false, true, 2, true),
  ('biryani', 'Vegetable Biryani', 'Basmati rice with seasonal vegetables, nuts, and saffron', 14.95, 'https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?w=800&auto=format&fit=crop&q=80', true, true, true, 1, true),
  -- Breads
  ('breads', 'Garlic Naan', 'Fluffy naan bread topped with fresh garlic and butter', 3.95, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80', true, false, false, 0, true),
  ('breads', 'Plain Naan', 'Traditional clay oven-baked bread', 2.95, 'https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=800&auto=format&fit=crop&q=80', true, false, false, 0, true),
  ('breads', 'Cheese Naan', 'Naan stuffed with melted mozzarella cheese', 4.50, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80', true, false, false, 0, true),
  ('breads', 'Roti', 'Whole wheat flatbread, healthy and light', 2.50, 'https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=800&auto=format&fit=crop&q=80', true, true, false, 0, true),
  -- Drinks
  ('drinks', 'Mango Lassi', 'Refreshing yogurt drink blended with sweet Alphonso mango', 4.95, 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&auto=format&fit=crop&q=80', true, false, true, 0, true),
  ('drinks', 'Sweet Lassi', 'Traditional sweet yogurt drink with cardamom', 4.50, 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800&auto=format&fit=crop&q=80', true, false, true, 0, true),
  ('drinks', 'Masala Chai', 'Spiced Indian tea with milk, ginger, and cardamom', 3.50, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&auto=format&fit=crop&q=80', true, false, true, 0, true),
  -- Desserts
  ('desserts', 'Gulab Jamun', 'Soft milk dumplings soaked in rose-flavored sugar syrup', 5.95, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80', true, false, false, 0, true),
  ('desserts', 'Kheer', 'Creamy rice pudding with cardamom, almonds, and saffron', 5.50, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80', true, false, true, 0, true),
  ('desserts', 'Mango Kulfi', 'Traditional Indian ice cream with rich mango flavor', 5.95, 'https://images.unsplash.com/photo-1520218576681-95d433bcea6e?w=800&auto=format&fit=crop&q=80', true, false, true, 0, true)
) AS m(category_slug, name, description, price, image_url, is_vegetarian, is_vegan, is_gluten_free, spice_level, is_available)
JOIN categories c ON c.slug = m.category_slug;

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
