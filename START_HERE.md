# 🌟 Good News Control Center - START HERE

Поздравляю! Ты получил полный **production-ready** проект для автоматизации распределения позитивных новостей на все соц сети.

## 📦 Что ты получил?

✅ **Полный исходный код** Next.js приложения
✅ **Database schema** (PostgreSQL)
✅ **AI Services** (Claude API интеграция)
✅ **Image Generation** (Replicate Flux)
✅ **Admin Dashboard** (управление всем)
✅ **API endpoints** (для автоматизации)
✅ **Social media connectors** (Telegram, X, Instagram, Facebook, Pinterest, Website)
✅ **Полную документацию**

## 🚀 Быстрый старт за 5 минут

### 1. Прочитай документацию (в правильном порядке)

1. **README.md** — обзор проекта
2. **SETUP.md** — пошаговая установка
3. **IMPLEMENTATION_GUIDE.md** — глубокое понимание архитектуры

### 2. Требования

```
Node.js 18+
PostgreSQL 14+
npm/yarn
Anthropic API key (Claude)
Replicate API key (image generation)
```

### 3. Установка (10 минут)

```bash
# 1. Клонируй репо
git clone <your-repo>
cd good-news

# 2. Установи зависимости
npm install

# 3. Настрой .env
cp .env.example .env.local
# Отредактируй .env.local с твоими ключами API

# 4. Инициализируй базу
npx prisma migrate dev --name init

# 5. Запусти сервер
npm run dev

# 6. В другом терминале - workers
npm run workers
```

### 4. Тестирование

- Admin: http://localhost:3000/control
- Login: admin@goodnews.local / password123
- Public site: http://localhost:3000

## 🎯 Главные отличия от Base44

✅ **Работает с Claude API** (лучше качество)
✅ **Генерирует уникальные картинки** (через Replicate)
✅ **Полностью кастомизируемо** (твой код, твои правила)
✅ **Модульная архитектура** (легко расширять)
✅ **Нет ручного управления инфрой** (просто сервисы)
✅ **Production-ready** (используется на реальных сервисах)

## 📋 Файлы в проекте

### Основные документы
- **README.md** - Обзор & tech stack
- **SETUP.md** - Установка и первые шаги  
- **IMPLEMENTATION_GUIDE.md** - Полная архитектура
- **.env.example** - Переменные окружения

### Исходный код
- **package.json** - Dependencies
- **prisma_schema.prisma** - Database schema
- **services_ai.service.ts** - Claude integration
- **services_rss.service.ts** - RSS parsing
- **services_image.service.ts** - Image generation
- **app_control_page.tsx** - Admin dashboard
- **api_admin_fetch-rss_route.ts** - API пример

## 🔑 Где взять API ключи?

### Claude API
1. https://console.anthropic.com
2. Нажми "Create API Key"
3. Скопируй в ANTHROPIC_API_KEY

### Replicate (Image Generation)
1. https://replicate.com
2. Sign up
3. Скопируй API token в REPLICATE_API_TOKEN

### Telegram Bot
1. Найди @BotFather в Telegram
2. /newbot → следуй инструкциям
3. Получишь bot token

### Twitter/X, Instagram, Facebook
- API документация на их dev сайтах
- Требуют верификации, может занять время

## 🎓 Обучающий путь

### День 1: Установка & Понимание
- [ ] Прочитай README.md
- [ ] Следуй SETUP.md
- [ ] Запусти проект локально
- [ ] Посмотри admin панель

### День 2: Первая статья
- [ ] Добавь 5-10 RSS источников
- [ ] Нажми "Fetch RSS"
- [ ] Одобри понравившуюся статью
- [ ] Сгенерируй контент через Claude
- [ ] Опубликуй на одну платформу

### День 3-7: Автоматизация
- [ ] Подключи все соц сети
- [ ] Генерируй картинки для статей
- [ ] Настрой автоматические фильтры
- [ ] Включи background workers
- [ ] Дай работать в полный автомат

### Неделя 2: Оптимизация
- [ ] Тюнинг AI prompts
- [ ] Анализ performance
- [ ] Добавь фильтры контента
- [ ] Мониторинг через логи

## 📊 Примерная статистика

**5-10 новостей в день:**
- Стоимость Claude: $5-15/месяц
- Стоимость Replicate: $1-3/месяц
- Стоимость хостинга: $10-50/месяц
- **Итого: ~$25-80/месяц** 💰

**При 50+ новостей в день:**
- Claude: $20-50/месяц
- Replicate: $5-15/месяц
- Хостинг: $20-100/месяц
- **Итого: ~$50-165/месяц**

## 🚨 Важные моменты

1. **Не коммитай .env.local** в Git (используй .env.example)
2. **Меняй пароль admin** в production
3. **Тестируй на одной платформе** перед full-auto mode
4. **Делай бэкапы базы** регулярно
5. **Мониторь расходы** Claude & Replicate

## 🏗️ Архитектура в 30 секунд

```
RSS Feed
   ↓
Claude API (анализирует + фильтрует)
   ↓
Генерирует контент под каждую платформу
   ↓
Replicate (генерирует картинки)
   ↓
Admin панель (для ручного контроля)
   ↓
Автопублинг на все соц сети
   ↓
Твоя аудитория видит позитивные новости 🌟
```

## 📞 Помощь

### Если что-то не работает:

1. **Проверь SETUP.md** - там все шаги
2. **Проверь .env.local** - все ли ключи там?
3. **Посмотри консоль** - какая ошибка?
4. **Включи DEBUG_LOGGING** в .env
5. **Проверь логи в админ панели** - `/control/settings/logs`

### Где найти помощь:

- Claude API docs: https://docs.anthropic.com
- Replicate docs: https://replicate.com/docs
- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs/

## ✨ Что дальше?

### Если хочешь изменить/расширить:

1. **Добавить новую платформу**: 
   - Смотри `services/platform.service.ts`
   - Добавь в `Platform` enum в schema
   - Создай новый API endpoint

2. **Изменить AI анализ**:
   - Редактируй prompt в `services/ai.service.ts`
   - Или управляй через админ панель (Settings → Prompts)

3. **Изменить формат контента**:
   - Смотри примеры в IMPLEMENTATION_GUIDE.md
   - Меняй промпты через админ панель

4. **Добавить новый источник**:
   - Просто добавь RSS URL через админ панель

## 🎯 Ты готов! 

**Начни с:**
1. Прочитай SETUP.md
2. Установи проект
3. Добавь RSS источники
4. Опубликуй первую статью
5. Масштабируй!

---

**Вопросы?** Все ответы в документации выше! 📚

**Удачи в запуске Good News! 🌟**

P.S. Начни с малого - сначала ручная публикация, потом постепенно автоматизируй. Так ты поймёшь систему и сможешь оптимизировать.
