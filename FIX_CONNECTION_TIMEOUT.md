# إصلاح مشكلة Connection Timeout مع Railway

## المشكلة
```
pool timeout: failed to retrieve a connection from pool after 10009ms
```

## الحل: استخدام DATABASE_URL مباشرة

المشكلة هي أن Prisma adapter لا يتصل بشكل صحيح مع Railway. الحل هو استخدام DATABASE_URL مباشرة بدون adapter.

### 1. تأكد من ملف `.env` يحتوي على:

```env
DATABASE_URL=mysql://root:YOUR_PASSWORD@switchback.proxy.rlwy.net:28406/railway?sslaccept=accept_invalid_certs
```

أو:

```env
DB_HOST=switchback.proxy.rlwy.net
DB_PORT=28406
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=railway
```

### 2. استخدم Prisma بدون adapter

الـ Prisma Client سيعمل مع DATABASE_URL مباشرة بدون حاجة للـ adapter.

### 3. إضافة SSL Parameters

للـ Railway، أضف هذه المعاملات لـ DATABASE_URL:

```
?sslaccept=accept_invalid_certs&connect_timeout=60
```

### 4. تشغيل Seed

```powershell
npm run seed
```

## حل بديل: استخدام mysql2 مباشرة للـ Seed

إذا استمرت المشكلة، يمكنك تعديل seed script لاستخدام mysql2 مباشرة بدلاً من Prisma.

