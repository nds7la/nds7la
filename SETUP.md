# Good News Control Center - Setup Guide

## 📋 Prerequisites

- **Node.js 18+** - https://nodejs.org/
- **PostgreSQL 14+** - https://www.postgresql.org/
- **npm or yarn**
- **Git**

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd good-news
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database

#### Create PostgreSQL Database
```bash
# Via psql
createdb goodnews
```

#### Or use Docker (recommended)
```bash
docker run -d \
  --name postgres-goodnews \
  -e POSTGRES_DB=goodnews \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:15
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/goodnews"

# Auth
NEXTAUTH_SECRET="generate-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# APIs
ANTHROPIC_API_KEY="sk-ant-..."
REPLICATE_API_TOKEN="r8_..."

# Social Platforms (optional for MVP)
TELEGRAM_BOT_TOKEN="123456:ABC..."
TWITTER_BEARER_TOKEN="AAAA..."
# ... other platforms
```

### 5. Setup Database Schema

```bash
# Create tables and migrations
npx prisma migrate dev --name init

# (Optional) Seed with test data
npx prisma db seed
```

### 6. Run Development Server

```bash
npm run dev
```

Access:
- **Public site**: http://localhost:3000
- **Admin panel**: http://localhost:3000/control
- **Default login**: admin@goodnews.local / password123

### 7. Run Background Workers (in separate terminal)

```bash
npm run workers
```

## 📁 Project Structure

```
good-news/
├── app/
│   ├── (public)/          # Public site
│   │   └── page.tsx       # Blog homepage
│   ├── control/           # Admin panel
│   │   ├── login/
│   │   ├── articles/
│   │   ├── connectors/
│   │   └── page.tsx       # Admin dashboard
│   └── api/               # Backend routes
│       ├── admin/
│       ├── articles/
│       ├── rss/
│       ├── ai/
│       ├── images/
│       └── publishing/
├── services/              # Business logic
│   ├── ai.service.ts
│   ├── rss.service.ts
│   ├── image.service.ts
│   └── publishing.service.ts
├── components/            # React components
├── lib/                   # Utilities
├── prisma/
│   └── schema.prisma      # Database schema
└── public/                # Static files
    └── generated-images/  # Generated image storage
```

## 🔧 Configuration

### 1. Add RSS Sources

Go to `/control/rss-sources` and add your favorite news feeds:

**Popular Good News Sources:**
- https://www.goodgoodgood.co/feed
- https://www.globalgoodnews.com/rss
- https://www.upworthy.com/feed
- https://www.cnn.com/us/live-news/rss
- https://feeds.bbci.co.uk/news/rss.xml
- And many more...

### 2. Configure API Keys

#### Anthropic Claude API
1. Sign up: https://console.anthropic.com
2. Create API key
3. Add to `.env.local`

#### Replicate (Image Generation)
1. Sign up: https://replicate.com
2. Create API token
3. Add to `.env.local`

#### Telegram Bot (Optional)
1. Create bot via @BotFather on Telegram
2. Get bot token
3. Add channel/chat ID
4. Configure in admin panel

#### Twitter/X API (Optional)
1. Apply for API access
2. Get credentials
3. Add to admin panel

#### Instagram/Facebook (Optional)
1. Create Meta app
2. Get access tokens
3. Add to admin panel

### 3. Test Connections

In admin panel → Settings → Connectors, click "Test Connection" for each platform.

## 📊 Typical Workflow

1. **RSS Fetch** (automatic every hour or manual)
   - Fetches latest articles from RSS sources
   - Articles appear in "Incoming" queue

2. **Review & Approve**
   - Go to "Articles" → "Incoming"
   - Review articles and scores
   - Approve or reject

3. **AI Processing**
   - Approved articles sent to Claude
   - AI generates summaries and scores
   - Content generated for all platforms

4. **Image Generation** (optional)
   - AI generates image prompt
   - Replicate generates images
   - Platform-specific variants created

5. **Review Content**
   - Review generated content for each platform
   - Edit if needed
   - Preview before publishing

6. **Schedule/Publish**
   - Add to publishing queue
   - Schedule time or publish immediately
   - Monitor publishing status

## 🎯 First Article Step-by-Step

1. Go to admin dashboard (`/control`)
2. Click "Fetch RSS" button
3. Wait for articles to appear in "Articles" → "Incoming"
4. Find an article with high positivity score
5. Click "Review" → "Approve"
6. Click "Generate Content"
7. Click "Generate Image"
8. Go to "Publishing Queue"
9. Review generated content for each platform
10. Click "Publish Now" or "Schedule"
11. Check your social media channels!

## 🔐 Authentication

### Default Admin Account (Change in Production!)
- Email: `admin@goodnews.local`
- Password: `password123`

Change this in admin panel → Settings → Users

### Create New Admin
```bash
# Via API or database
INSERT INTO "User" (id, email, password, name, role)
VALUES ('xxx', 'newadmin@goodnews.local', 'bcrypted_hash', 'New Admin', 'ADMIN');
```

## 📈 Scaling Tips

### PostgreSQL
- For MVP: Local PostgreSQL works fine
- For production: Use Supabase, Railway, or managed PostgreSQL

### Image Generation
- Replicate handles scaling automatically
- ~$0.01-0.03 per image
- For 5-10 articles/day: ~$1-3/month

### Hosting Options
- **Vercel** (Next.js native) - free tier available
- **Railway** - simple deployment, generous free tier
- **Render** - similar to Railway
- **Self-hosted** - Docker + VPS

## 🚨 Troubleshooting

### "Can't connect to database"
```bash
# Check DATABASE_URL in .env.local
# Ensure PostgreSQL is running
# Test connection:
psql $DATABASE_URL -c "SELECT 1"
```

### "Claude API error"
```bash
# Verify ANTHROPIC_API_KEY
# Check API quota: https://console.anthropic.com
```

### "Image generation fails"
```bash
# Verify REPLICATE_API_TOKEN
# Check Replicate account balance
# Check internet connection
```

### Articles not appearing
```bash
# Check RSS_FETCH_INTERVAL in .env.local
# Check worker logs: npm run workers
# Manually test: Click "Fetch RSS" button
```

## 📚 API Documentation

### Admin Endpoints
```
POST   /api/admin/fetch-rss
POST   /api/admin/process-ai
POST   /api/admin/generate-images
POST   /api/admin/publish-scheduled
GET    /api/admin/stats
```

### Article Endpoints
```
GET    /api/articles              # List articles
GET    /api/articles/[id]         # Get article
POST   /api/articles/[id]/approve
POST   /api/articles/[id]/reject
POST   /api/articles/[id]/generate-content
POST   /api/articles/[id]/generate-image
```

### Publishing Endpoints
```
POST   /api/publishing/queue
POST   /api/publishing/schedule
POST   /api/publishing/publish-now
```

## 🔄 Automation Modes

### Semi-Auto (Recommended for MVP)
- Manual fetch and review
- Automatic content generation
- Manual publishing

Enable in: Settings → Automation

### Full-Auto
- Fully automatic workflow
- Use with caution!
- Requires well-tuned filters and scores

## 📊 Monitoring

### Logs
- Go to `/control/logs` to view all system activity
- Filter by category, level, date

### Health Check
- Dashboard shows:
  - RSS source status
  - Processing failures
  - Publishing errors
  - Image generation issues

### Cleanup Tasks
```bash
# Clean old logs (older than 30 days)
node scripts/cleanup-logs.js

# Clean old images
node scripts/cleanup-images.js
```

## 🚀 Deployment Checklist

- [ ] Change admin password
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS
- [ ] Configure backup strategy
- [ ] Set up monitoring/alerts
- [ ] Test all platform connections
- [ ] Review automation settings
- [ ] Set up domain name
- [ ] Configure email for notifications (future)

## 📖 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Claude API Docs](https://docs.anthropic.com)
- [Replicate Docs](https://replicate.com/docs)

## 🤝 Support

For issues:
1. Check logs: `/control/logs`
2. Review troubleshooting section above
3. Check error details in database
4. Contact support or open GitHub issue

## 📝 Notes

- Images are stored locally in `/public/generated-images/`
- Database backups recommended daily
- Monitor Anthropic/Replicate API usage
- Keep RSS sources updated
- Review automation settings monthly

---

**Happy news aggregating!** 🌟

For production deployment, consider:
- Using PostgreSQL managed service
- Setting up CI/CD pipeline
- Implementing proper monitoring
- Adding email alerts
- Setting up analytics tracking
