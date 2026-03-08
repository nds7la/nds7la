# 📁 Good News Control Center - File Index

## 📚 Документация (НАЧНИ ОТСЮДА)

| Файл | Описание | Читай когда |
|------|---------|-----------|
| **START_HERE.md** | Точка входа, быстрый старт | ПЕРВЫМ! |
| **README.md** | Обзор проекта, tech stack | После START_HERE |
| **SETUP.md** | Пошаговая установка | Перед запуском |
| **IMPLEMENTATION_GUIDE.md** | Полная архитектура, детали | Когда захочешь понять глубже |
| **.env.example** | Шаблон переменных окружения | При настройке |

## 🔧 Конфигурация

| Файл | Назначение |
|------|-----------|
| **package.json** | Dependencies и scripts |
| **prisma_schema.prisma** | Database schema (PostgreSQL) |

## 💻 Исходный код (Services & API)

### AI Services
- **services_ai.service.ts** - Claude API интеграция
  - Анализ статей (positivity, relevance, etc)
  - Генерация контента для платформ
  - Создание image prompts
  - Проверка дубликатов

- **services_rss.service.ts** - RSS агрегация
  - Парсинг RSS лент
  - Добавление статей в БД
  - Управление источниками

- **services_image.service.ts** - Генерация картинок
  - Интеграция с Replicate (Flux)
  - Ресайз под платформы
  - Управление хранилищем

### API Endpoints
- **api_admin_fetch-rss_route.ts** - Ручная загрузка RSS
  - POST /api/admin/fetch-rss
  - Пример для других endpoints

## 🎨 React Components

- **app_control_page.tsx** - Admin Dashboard
  - Основная страница админа
  - Метрики и статистика
  - Quick action кнопки

## 📝 Логирование

- **lib_logger.ts** - Система логирования
  - Логирование в БД и консоль
  - Разные уровни (INFO, ERROR, DEBUG)
  - Поиск и фильтрация логов

## 🎓 Как использовать эти файлы?

### Для запуска проекта:
1. Прочитай **START_HERE.md**
2. Следуй **SETUP.md**
3. Используй **package.json** для npm install
4. Настрой **.env.example**

### Для разработки:
1. Изучи **IMPLEMENTATION_GUIDE.md**
2. Посмотри **prisma_schema.prisma** для структуры БД
3. Используй **services_ai.service.ts** как пример сервиса
4. Добавляй новые API endpoints аналогично **api_admin_fetch-rss_route.ts**

### Для деплоя:
1. Используй **package.json** скрипты
2. Настрой окружение из **.env.example**
3. Запусти миграции Prisma

## 📊 Что нужно добавить самому?

Это базовый набор. Для полного проекта нужно добавить:

### React Components (в `components/` папку)
- [ ] DashboardStats.tsx
- [ ] ArticleCard.tsx  
- [ ] ArticleEditor.tsx
- [ ] PublishingQueue.tsx
- [ ] ConnectorForm.tsx
- [ ] PlatformStatus.tsx

### API Routes (в `app/api/` папку)
- [ ] GET /api/articles
- [ ] POST /api/articles/[id]/approve
- [ ] POST /api/articles/[id]/generate-content
- [ ] POST /api/images/generate
- [ ] POST /api/publishing/schedule
- [ ] POST /api/platforms/[platform]/publish

### Services (в `services/` папку)
- [ ] publishing.service.ts
- [ ] platform.service.ts
- [ ] scheduling.service.ts
- [ ] content.service.ts

### Workers (в `workers/` папку)
- [ ] rss-fetch.worker.ts
- [ ] ai-process.worker.ts
- [ ] image-gen.worker.ts
- [ ] publish.worker.ts

### Pages (в `app/control/` папку)
- [ ] articles/page.tsx
- [ ] connectors/page.tsx
- [ ] queue/page.tsx
- [ ] settings/page.tsx
- [ ] logs/page.tsx

## 🚀 Быстрая миграция от Base44

**Если ты уже знаком с Base44:**

1. **Откажись от локального LLM** - используй Claude API (лучше)
2. **Откажись от локального Stable Diffusion** - используй Replicate (проще)
3. **Скопируй структуру БД** из prisma_schema.prisma
4. **Используй AI prompts** из IMPLEMENTATION_GUIDE.md
5. **Адаптируй социальные API** по примерам выше

## 💡 Чтобы начать разработку:

```bash
# 1. Установи dependencies
npm install

# 2. Настрой .env
cp .env.example .env.local

# 3. Инициализируй БД
npx prisma migrate dev

# 4. Запусти dev сервер
npm run dev

# 5. Запусти workers
npm run workers
```

## 📞 Если теряешься:

1. Вернись в **START_HERE.md** - там все по шагам
2. Посмотри соответствующие файлы:
   - Вопрос про AI? → services_ai.service.ts
   - Вопрос про API? → api_admin_fetch-rss_route.ts
   - Вопрос про БД? → prisma_schema.prisma
   - Вопрос про admin? → app_control_page.tsx

---

**Всё готово к разработке!** 🎉

Начни с чтения START_HERE.md и двигайся пошагово.
