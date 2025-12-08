-- CreateTable
CREATE TABLE `product_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `nameAr` VARCHAR(255) NULL,
    `slug` VARCHAR(255) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `product_categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `nameAr` VARCHAR(255) NULL,
    `category_id` INTEGER NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'Mining',
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `views` INTEGER NOT NULL DEFAULT 0,
    `description` TEXT NULL,
    `descriptionAr` TEXT NULL,
    `image` TEXT NULL,
    `gallery` JSON NULL,
    `specifications_table` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `products_category_id_idx`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `titleAr` VARCHAR(255) NULL,
    `date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `category` VARCHAR(100) NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(50) NOT NULL DEFAULT 'published',
    `content` TEXT NULL,
    `contentAr` TEXT NULL,
    `image` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'viewer',
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `permissions` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(50) NULL,
    `message` TEXT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'new',
    `date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `complaints` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `subject` VARCHAR(255) NULL,
    `message` TEXT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` TEXT NULL,
    `title` VARCHAR(255) NULL,
    `titleAr` VARCHAR(255) NULL,
    `subtitle` VARCHAR(255) NULL,
    `subtitleAr` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `descriptionAr` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `titleAr` VARCHAR(255) NULL,
    `category` VARCHAR(100) NULL,
    `deadline` DATE NULL,
    `description` TEXT NULL,
    `descriptionAr` TEXT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `documentFile` TEXT NULL,
    `documentFileName` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tender_submissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tender_id` INTEGER NOT NULL,
    `companyName` VARCHAR(255) NOT NULL,
    `contactName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NULL,
    `files` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `tender_submissions_tender_id_idx`(`tender_id`),
    INDEX `tender_submissions_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `financial_revenue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` VARCHAR(10) NOT NULL,
    `revenue` DECIMAL(10, 2) NOT NULL,
    `profit` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `financial_revenue_year_key`(`year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `financial_production` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `month` VARCHAR(50) NOT NULL,
    `production` DECIMAL(10, 2) NOT NULL,
    `target` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `financial_export` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `value` DECIMAL(5, 2) NOT NULL,
    `color` VARCHAR(20) NOT NULL DEFAULT '#204393',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `page_content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `page` VARCHAR(100) NOT NULL,
    `key` VARCHAR(100) NOT NULL,
    `valueEn` TEXT NULL,
    `valueAr` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `page_content_page_key_key`(`page`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(100) NOT NULL,
    `valueEn` TEXT NULL,
    `valueAr` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `site_settings_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `reply` TEXT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `chat_messages_email_idx`(`email`),
    INDEX `chat_messages_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `nameAr` VARCHAR(255) NULL,
    `title` VARCHAR(255) NULL,
    `titleAr` VARCHAR(255) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `nameAr` VARCHAR(255) NULL,
    `logo` TEXT NULL,
    `website` VARCHAR(255) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tender_submissions` ADD CONSTRAINT `tender_submissions_tender_id_fkey` FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
