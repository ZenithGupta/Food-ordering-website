-- Add is_featured column to menu_items table
-- Run this in Supabase SQL Editor

-- Add is_featured column if it doesn't exist
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Add display_order column if it doesn't exist
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Backfill display_order for existing items (by created_at order within category)
WITH ordered_items AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY created_at) - 1 as new_order
  FROM menu_items
  WHERE display_order IS NULL OR display_order = 0
)
UPDATE menu_items
SET display_order = ordered_items.new_order
FROM ordered_items
WHERE menu_items.id = ordered_items.id;

-- Create index for faster featured queries
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON menu_items(is_featured) WHERE is_featured = TRUE;
