/*
  Warnings:

  - You are about to drop the column `order` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `product_categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `banners` DROP COLUMN `order`,
    ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `clients` DROP COLUMN `order`,
    ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `product_categories` DROP COLUMN `order`,
    ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0;
