-- Add gallery column to products table
ALTER TABLE products
ADD COLUMN gallery JSON NULL AFTER image;

