-- Initialization script for MySQL/MariaDB
-- This file is used by Docker Compose to initialize the database

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS smc_dashboard 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE smc_dashboard;

-- Note: Tables will be created by Prisma migrations
-- This script just ensures the database exists

