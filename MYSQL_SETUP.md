# إعداد MySQL - MySQL Setup Guide

## الخطوات المطلوبة

### 1. تثبيت MySQL
إذا لم يكن MySQL مثبتاً على جهازك:
- **Windows**: حمّل من [mysql.com/downloads](https://dev.mysql.com/downloads/installer/)
- **Mac**: `brew install mysql` أو استخدم MySQL Installer
- **Linux**: `sudo apt-get install mysql-server` (Ubuntu/Debian)

### 2. إنشاء قاعدة البيانات
افتح MySQL Command Line أو MySQL Workbench ونفذ:

```bash
mysql -u root -p
```

ثم نفذ ملف `schema.sql`:
```sql
source backend/schema.sql
```

أو انسخ محتوى `schema.sql` والصقه في MySQL.

### 3. إعداد ملف .env
انسخ `.env.example` إلى `.env`:

```bash
cd backend
cp .env.example .env
```

ثم عدّل `.env` بمعلومات قاعدة البيانات الخاصة بك:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smc_dashboard
PORT=3000
```

### 4. تثبيت المكتبات
```bash
cd backend
npm install
```

### 5. تشغيل السيرفر
```bash
npm start
```

أو للتطوير مع auto-reload:
```bash
npm run dev
```

## للاتصال بقاعدة بيانات بعيدة (Remote MySQL)

إذا كان لديك MySQL على سيرفر بعيد:

```env
DB_HOST=your-mysql-host.com
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=smc_dashboard
PORT=3000
```

**ملاحظة مهمة**: تأكد من:
1. فتح Port 3306 في Firewall
2. السماح بالاتصال من IP الخاص بك في MySQL
3. استخدام SSL إذا لزم الأمر

## اختبار الاتصال

بعد تشغيل السيرفر، يجب أن ترى:
```
✅ MySQL Database connected successfully!
🚀 Server running on http://localhost:3000
📊 MySQL Database: smc_dashboard
```

## استكشاف الأخطاء

### خطأ: "Access denied"
- تأكد من صحة username و password في `.env`
- تأكد من أن المستخدم لديه صلاحيات على قاعدة البيانات

### خطأ: "Can't connect to MySQL server"
- تأكد من أن MySQL service يعمل
- تأكد من صحة `DB_HOST` في `.env`
- تأكد من فتح Port 3306

### خطأ: "Unknown database"
- تأكد من إنشاء قاعدة البيانات أولاً (نفذ `schema.sql`)

## الجداول المتوفرة

- `products` - المنتجات
- `news` - الأخبار
- `users` - المستخدمين
- `contacts` - جهات الاتصال
- `complaints` - الشكاوى
- `banners` - البانرات
- `tenders` - المناقصات
- `tender_submissions` - طلبات المناقصات
- `financial_revenue` - بيانات الإيرادات
- `financial_production` - بيانات الإنتاج
- `financial_export` - بيانات التصدير
- `page_content` - محتوى الصفحات
- `site_settings` - إعدادات الموقع
- `chat_messages` - رسائل الشات

## API Endpoints

جميع الـ endpoints متوفرة على:
- `GET /api/products` - جميع المنتجات
- `POST /api/products` - إضافة منتج
- `PUT /api/products/:id` - تحديث منتج
- `DELETE /api/products/:id` - حذف منتج

ونفس الشيء لـ: `news`, `users`, `contacts`, `complaints`, `banners`, `tenders`, `financial/*`, `chat`, `page-content`, `settings`

## ملاحظات

- البيانات محفوظة بشكل دائم في MySQL
- يمكنك استخدام MySQL Workbench لإدارة البيانات
- يمكنك عمل Backup بسهولة من MySQL
- البيانات مشتركة بين جميع المستخدمين



