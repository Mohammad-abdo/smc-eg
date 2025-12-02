-- SMC Dashboard Database Schema
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS smc_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smc_dashboard;

-- Product Categories Table
CREATE TABLE IF NOT EXISTS product_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nameAr VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  `order` INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nameAr VARCHAR(255),
  category_id INT,
  category ENUM('Industrial', 'Mining') DEFAULT 'Mining',
  status ENUM('active', 'inactive') DEFAULT 'active',
  views INT DEFAULT 0,
  description TEXT,
  descriptionAr TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
  INDEX idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- News Table
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  titleAr VARCHAR(255),
  date DATE DEFAULT (CURRENT_DATE),
  category VARCHAR(100),
  views INT DEFAULT 0,
  status ENUM('published', 'draft') DEFAULT 'published',
  content TEXT,
  contentAr TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
  status ENUM('active', 'inactive') DEFAULT 'active',
  permissions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  message TEXT,
  status ENUM('new', 'read') DEFAULT 'new',
  date DATE DEFAULT (CURRENT_DATE),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  subject VARCHAR(255),
  message TEXT,
  status ENUM('pending', 'in-progress', 'resolved') DEFAULT 'pending',
  date DATE DEFAULT (CURRENT_DATE),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Banners Table
CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image TEXT,
  title VARCHAR(255),
  titleAr VARCHAR(255),
  subtitle VARCHAR(255),
  subtitleAr VARCHAR(255),
  description TEXT,
  descriptionAr TEXT,
  `order` INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tenders Table
CREATE TABLE IF NOT EXISTS tenders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  titleAr VARCHAR(255),
  category VARCHAR(100),
  deadline DATE,
  description TEXT,
  descriptionAr TEXT,
  status ENUM('active', 'closed', 'draft') DEFAULT 'active',
  documentFile TEXT,
  documentFileName VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tender Submissions Table
CREATE TABLE IF NOT EXISTS tender_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tender_id INT NOT NULL,
  companyName VARCHAR(255) NOT NULL,
  contactName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  files JSON,
  status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
  submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tender_id) REFERENCES tenders(id) ON DELETE CASCADE,
  INDEX idx_tender_id (tender_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Financial Revenue Table
CREATE TABLE IF NOT EXISTS financial_revenue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year VARCHAR(10) NOT NULL,
  revenue DECIMAL(10, 2) NOT NULL,
  profit DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Financial Production Table
CREATE TABLE IF NOT EXISTS financial_production (
  id INT AUTO_INCREMENT PRIMARY KEY,
  month VARCHAR(50) NOT NULL,
  production DECIMAL(10, 2) NOT NULL,
  target DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Financial Export Table
CREATE TABLE IF NOT EXISTS financial_export (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  value DECIMAL(5, 2) NOT NULL,
  color VARCHAR(20) DEFAULT '#204393',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Page Content Table
CREATE TABLE IF NOT EXISTS page_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page VARCHAR(100) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  valueEn TEXT,
  valueAr TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_page_key (page, `key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) UNIQUE NOT NULL,
  valueEn TEXT,
  valueAr TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  reply TEXT,
  status ENUM('pending', 'replied', 'resolved') DEFAULT 'pending',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Members Table (Board Members)
CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nameAr VARCHAR(255),
  title VARCHAR(255),
  titleAr VARCHAR(255),
  `order` INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default data
INSERT INTO users (name, email, role, status, permissions) VALUES
('Admin User', 'admin@smc-eg.com', 'admin', 'active', '["all"]'),
('Editor User', 'editor@smc-eg.com', 'editor', 'active', '["products", "news"]'),
('Viewer User', 'viewer@smc-eg.com', 'viewer', 'active', '["view"]')
ON DUPLICATE KEY UPDATE name=name;

-- Insert default members
INSERT INTO members (name, nameAr, title, titleAr, `order`, status) VALUES
('Eng. Gamal Fathy Abdel Fattah', 'السيد الكيمائي / جمال فتحي عبدالفتاح', 'Chairman of the Board', 'رئيس مجلس الادارة', 1, 'active'),
('Eng. Mostafa Taher', 'السيد الجيولوجي / مصطفي طاهر', 'Executive Managing Director', 'العضو المنتدب التنفيذي', 2, 'active')
ON DUPLICATE KEY UPDATE name=name;

-- Insert default product categories
INSERT INTO product_categories (name, nameAr, slug, `order`, status) VALUES
('Industrial Products', 'المنتجات الصناعية', 'industrial', 1, 'active'),
('Mining Products', 'منتجات التعدين', 'mining', 2, 'active')
ON DUPLICATE KEY UPDATE name=name;

-- Insert default products (images will be added via dashboard)
INSERT INTO products (name, nameAr, category_id, category, status, views, description, descriptionAr) VALUES
('Silicomanganese Alloy', 'سبيكة السيلكون منجنيز', 1, 'Industrial', 'active', 0, 'High-quality silicomanganese ferroalloy used in steel production', 'سبيكة سيليكون منجنيز عالية الجودة تستخدم في إنتاج الصلب')
ON DUPLICATE KEY UPDATE name=name;



