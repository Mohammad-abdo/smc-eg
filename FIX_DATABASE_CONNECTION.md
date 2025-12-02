# 🔧 إصلاح مشكلة الاتصال بقاعدة البيانات

## المشكلة
```
Error: P1001: Can't reach database server at `localhost:3306`
```

## الحلول

### 1. التحقق من أن MySQL Service يعمل

#### Windows:
```powershell
# التحقق من حالة MySQL
Get-Service -Name "*mysql*"

# تشغيل MySQL Service
Start-Service -Name "MySQL80"  # أو اسم الخدمة الخاص بك

# أو من Services:
# Win + R → services.msc → ابحث عن MySQL → Start
```

#### Linux/Mac:
```bash
# التحقق من حالة MySQL
sudo systemctl status mysql
# أو
sudo service mysql status

# تشغيل MySQL
sudo systemctl start mysql
# أو
sudo service mysql start
```

### 2. التحقق من ملف .env

تأكد من وجود ملف `backend/.env` مع الإعدادات الصحيحة:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=smc_dashboard
DB_PORT=3306

# أو استخدام DATABASE_URL مباشرة
DATABASE_URL="mysql://root:your_password@localhost:3306/smc_dashboard"

# Server Configuration
PORT=3001
```

### 3. إنشاء ملف .env إذا لم يكن موجوداً

```bash
cd backend
copy .env.example .env  # Windows
# أو
cp .env.example .env    # Linux/Mac
```

ثم عدّل القيم حسب إعدادات MySQL الخاصة بك.

### 4. التحقق من الاتصال

```bash
cd backend
npm run check-db
```

### 5. إذا كان MySQL غير مثبت

#### Windows:
1. تحميل MySQL من: https://dev.mysql.com/downloads/installer/
2. تثبيت MySQL Server
3. تذكر كلمة المرور التي قمت بتعيينها

#### Linux:
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

#### Mac:
```bash
brew install mysql
brew services start mysql
```

### 6. بعد إصلاح الاتصال

```bash
cd backend
npm run check-db        # التحقق من الاتصال
npm run prisma:migrate  # تشغيل Migrations
```

---

**ملاحظة:** إذا كنت تستخدم قاعدة بيانات بعيدة (مثل Railway أو PlanetScale)، تأكد من:
1. تحديث `DB_HOST` في `.env`
2. التحقق من IP whitelist
3. التحقق من Firewall rules

