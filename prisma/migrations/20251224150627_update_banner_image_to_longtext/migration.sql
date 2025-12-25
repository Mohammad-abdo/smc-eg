-- AlterTable
ALTER TABLE `banners` MODIFY `image` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `complaints` ALTER COLUMN `date` DROP DEFAULT;

-- AlterTable
ALTER TABLE `contacts` ALTER COLUMN `date` DROP DEFAULT;

-- AlterTable
ALTER TABLE `news` ALTER COLUMN `date` DROP DEFAULT;
