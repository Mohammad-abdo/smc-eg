-- Migration: Add subcategories and product specifications tables
-- Run this migration to add support for subcategories and product specification tables

USE smc_dashboard;

-- Add parent_id to product_categories for subcategories support
ALTER TABLE product_categories 
ADD COLUMN IF NOT EXISTS parent_id INT NULL,
ADD FOREIGN KEY IF NOT EXISTS fk_parent_category (parent_id) REFERENCES product_categories(id) ON DELETE CASCADE,
ADD INDEX IF NOT EXISTS idx_parent_id (parent_id);

-- Add specifications_table JSON column to products for dynamic tables
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS specifications_table JSON NULL;

-- Update existing categories to ensure they work correctly
-- This migration is safe to run multiple times

