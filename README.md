# AI App Builder

## زیرساخت پروژه

### فرانت‌اند (React + Vite + TypeScript + Tailwind)
- **فونت**: Vazirmatn (Google Fonts)
- **RTL/LTR**: پشتیبانی کامل با dir=rtl پیش‌فرض
- **Dark Mode**: کامل با toggle
- **i18n**: فارسی + انگلیسی با i18next
- **State Management**: Zustand (auth + theme)
- **Server State**: TanStack Query
- **UI Components**: Button, Input, Modal, Badge, EmptyState, Spinner
- **Layout**: Sidebar + Header + Content

### بک‌اند (Java 21 + Spring Boot + PostgreSQL)
- **معماری**: Layered Architecture
- **Security**: JWT + Spring Security
- **Database**: PostgreSQL + Flyway migrations
- **Validation**: Bean Validation
- **Error Handling**: Global Exception Handler
- **API**: RESTful با DTO pattern

## ساختار فایل‌ها

```
├── src/                          # Frontend
│   ├── components/ui/           # UI Components
│   ├── layouts/                 # Layouts
│   ├── pages/                   # Pages
│   ├── lib/                     # Utilities
│   ├── store/                   # Zustand stores
│   ├── i18n/                    # Translations
│   ├── App.tsx
│   └── main.tsx
│
├── backend/                      # Backend
│   ├── pom.xml
│   └── src/main/java/com/aibuilder/
│       ├── api/controller/      # REST Controllers
│       ├── api/exception/       # Exception Handler
│       ├── application/
│       │   ├── dto/             # DTOs
│       │   └── service/         # Services
│       ├── domain/
│       │   ├── entity/          # JPA Entities
│       │   ├── repository/      # Repositories
│       │   └── exception/       # Domain Exceptions
│       └── infrastructure/
│           ├── config/          # Configuration
│           └── security/        # JWT Provider
│
└── README.md
```

## راه‌اندازی

### فرانت‌اند
```bash
npm install
npm run dev
```

### بک‌اند
```bash
cd backend
mvn spring-boot:run
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | ثبت‌نام |
| POST | /api/v1/auth/login | ورود |
| GET | /api/v1/projects | لیست پروژه‌ها |
| POST | /api/v1/projects | ایجاد پروژه |
| GET | /api/v1/projects/{id} | جزئیات پروژه |
| DELETE | /api/v1/projects/{id} | حذف پروژه |
| GET | /api/v1/tools | لیست ابزارها |
| POST | /api/v1/tools | ایجاد ابزار |
| GET | /api/v1/tools/{id} | جزئیات ابزار |
| POST | /api/v1/tools/{id}/activate | فعال‌سازی ابزار |
| POST | /api/v1/tools/{id}/disable | غیرفعال‌سازی ابزار |
| DELETE | /api/v1/tools/{id} | حذف ابزار |
| GET | /api/v1/health | وضعیت سرویس |
