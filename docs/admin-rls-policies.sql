-- =====================================================
-- Additional RLS Policies for Admin Operations
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Allow all operations on categories (for admin via API routes)
-- Since we protect at the API level with middleware, 
-- we can allow all operations here

CREATE POLICY "Allow all operations on categories" 
  ON categories FOR ALL 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on menu items" 
  ON menu_items FOR ALL 
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- Storage Bucket Setup
-- Run this AFTER creating the bucket in Supabase Dashboard
-- =====================================================

-- First, go to Storage in Supabase Dashboard and create a bucket called "menu-images"
-- Then run this policy to allow public read access:

-- Note: You need to create the bucket manually first in Dashboard > Storage > New Bucket
-- Bucket name: menu-images
-- Public bucket: Yes (check the box)

-- After bucket is created, this policy allows uploads:
CREATE POLICY "Allow public uploads to menu-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Allow public read from menu-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

CREATE POLICY "Allow public delete from menu-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'menu-images');
