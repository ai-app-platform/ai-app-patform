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
| GET | /api/v1/agents | لیست ایجنت‌ها |
| POST | /api/v1/agents | ایجاد ایجنت |
| GET | /api/v1/agents/{id} | جزئیات ایجنت |
| POST | /api/v1/agents/{id}/publish | انتشار ایجنت |
| POST | /api/v1/agents/{id}/deprecate | منسوخ کردن ایجنت |
| DELETE | /api/v1/agents/{id} | حذف ایجنت |
| GET | /api/v1/projects/{id}/team | تیم ایجنت پروژه |
| POST | /api/v1/projects/{id}/team/{agentId} | افزودن ایجنت به تیم |
| POST | /api/v1/projects/{id}/team/{agentId}/enable | فعال‌سازی ایجنت در تیم |
| POST | /api/v1/projects/{id}/team/{agentId}/disable | غیرفعال‌سازی ایجنت در تیم |
| DELETE | /api/v1/projects/{id}/team/{agentId} | حذف ایجنت از تیم |
| GET | /api/v1/projects/{id}/tasks | لیست وظایف پروژه |
| POST | /api/v1/projects/{id}/tasks | ایجاد وظیفه |
| GET | /api/v1/projects/{id}/tasks/{taskId} | جزئیات وظیفه |
| POST | /api/v1/projects/{id}/tasks/{taskId}/start | شروع وظیفه |
| POST | /api/v1/projects/{id}/tasks/{taskId}/complete | تکمیل وظیفه |
| POST | /api/v1/projects/{id}/tasks/{taskId}/fail | شکست وظیفه |
| DELETE | /api/v1/projects/{id}/tasks/{taskId} | حذف وظیفه |
| GET | /api/v1/prompts | لیست پرامپت‌ها |
| POST | /api/v1/prompts | ایجاد پرامپت |
| GET | /api/v1/prompts/{id} | جزئیات پرامپت |
| POST | /api/v1/prompts/{id}/activate | فعال‌سازی پرامپت |
| POST | /api/v1/prompts/{id}/deprecate | منسوخ کردن پرامپت |
| DELETE | /api/v1/prompts/{id} | حذف پرامپت |
| GET | /api/v1/roles | لیست نقش‌ها |
| POST | /api/v1/roles | ایجاد نقش |
| GET | /api/v1/roles/{id} | جزئیات نقش |
| POST | /api/v1/roles/{id}/activate | فعال‌سازی نقش |
| POST | /api/v1/roles/{id}/deprecate | منسوخ کردن نقش |
| DELETE | /api/v1/roles/{id} | حذف نقش |
| GET | /api/v1/skills | لیست مهارت‌ها |
| POST | /api/v1/skills | ایجاد مهارت |
| GET | /api/v1/skills/{id} | جزئیات مهارت |
| POST | /api/v1/skills/{id}/activate | فعال‌سازی مهارت |
| POST | /api/v1/skills/{id}/deprecate | منسوخ کردن مهارت |
| DELETE | /api/v1/skills/{id} | حذف مهارت |
| GET | /api/v1/health | وضعیت سرویس |
