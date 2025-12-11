# 🔧 إصلاح ملف .env على السيرفر

## ✅ تم الإصلاح تلقائياً!

**`lib/env.cjs` الآن يتحقق من `DATABASE_URL` ويعيد بنائه تلقائياً إذا كان خاطئاً.**

## المشكلة الأصلية:
```
Error: P1013: The provided database string is invalid. invalid port number in database URL.
```

## السبب:
`DATABASE_URL` في ملف `.env` مكتوب بشكل خاطئ:
```
DATABASE_URL="mysql://root:M-##@@sum-eg%123:@localhost:3306/smc_dashboard"
```

### الأخطاء:
1. ❌ كلمة المرور غير مرمّزة (URL encoded)
2. ❌ يوجد `:` زائد بعد كلمة المرور
3. ❌ اسم قاعدة البيانات غير متطابق (`smc_dashboard` vs `smc-backend`)

---

## ✅ الحل:

### الخطوة 1: افتح ملف `.env` على السيرفر:
```bash
nano /var/www/smc-eg.com/.env
```

### الخطوة 2: تأكد من وجود المتغيرات المنفصلة (بدون DATABASE_URL المكتوب يدوياً):

**⚠️ مهم جداً: احذف أو علّق سطر `DATABASE_URL` المكتوب يدوياً!**

**استخدم هذا القالب:**

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================

# IMPORTANT: DO NOT write DATABASE_URL manually with special characters in password!
# lib/env.js will automatically build DATABASE_URL from DB_* variables
# Password encoding is handled automatically

# Use separate variables (RECOMMENDED):
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=M-##@@sum-eg%123
DB_NAME=smc-backend
DB_PORT=3306

# ⚠️ DO NOT write DATABASE_URL manually - lib/env.cjs will build it automatically!
# The system will automatically detect invalid DATABASE_URL and rebuild it from DB_* variables
# If DATABASE_URL is invalid, you'll see: "⚠️ Invalid DATABASE_URL format detected. Rebuilding from DB_* variables..."

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=3000
NODE_ENV=production

# ============================================
# CORS CONFIGURATION
# ============================================
FRONTEND_URL=https://smc-frontend-weld.vercel.app
```

### الخطوة 3: احفظ الملف:
- اضغط `Ctrl + X`
- اضغط `Y` للتأكيد
- اضغط `Enter`

### الخطوة 4: اختبر الاتصال:
```bash
npx prisma migrate dev
```

---

## 🔍 كيف يعمل `lib/env.js`:

1. إذا كان `DATABASE_URL` موجوداً ولكن غير صحيح، سيتم تجاهله تلقائياً
2. سيتم بناء `DATABASE_URL` من المتغيرات المنفصلة (`DB_HOST`, `DB_USER`, إلخ)
3. كلمة المرور ستتم معالجتها (URL encoding) تلقائياً

---

## ⚠️ ملاحظات مهمة:

1. **لا تكتب `DATABASE_URL` يدوياً** إذا كانت كلمة المرور تحتوي على أحرف خاصة (`@`, `#`, `%`, إلخ)
2. **استخدم المتغيرات المنفصلة** (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, إلخ) - أسهل وأكثر أماناً
3. **اسم قاعدة البيانات** يجب أن يكون متطابقاً: `smc-backend` (باستخدام `DB_NAME`)
4. **`lib/env.js` محدّث الآن** للتحقق من صحة `DATABASE_URL` وإعادة بنائه إذا كان خاطئاً

---

## ✅ بعد الإصلاح:

```bash
# اختبر الاتصال
npx prisma migrate dev

# أو قم بتشغيل السيرفر
npm start
```

كل شيء يجب أن يعمل الآن! 🎉
