# Good News Control Center

A full-stack AI-powered news aggregation and automation platform for positive news distribution across multiple social media platforms.

## Project Overview

**Good News** is a complete solution for:
- Aggregating positive news from RSS feeds
- AI filtering and content generation
- Multi-platform distribution (Telegram, X, Instagram, Facebook, Pinterest, Website)
- Admin dashboard for content management
- Automatic image generation with Replicate + Flux
- Platform-specific formatting using Claude API

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TailwindCSS** - styling
- **Shadcn/ui** - UI components
- **Zustand** - state management

### Backend
- **Node.js** + **Express.js**
- **Prisma ORM** - database management
- **PostgreSQL** - primary database
- **Bull** - job queue for background tasks

### AI & Services
- **Claude API** (Anthropic) - content analysis & generation
- **Replicate API** - image generation (Flux model)
- **RSS Parser** - feedparser library
- **Official Platform APIs** - social media integration

### DevOps & Deployment
- **Docker** - containerization
- **GitHub Actions** - CI/CD
- **Vercel/Railway** - hosting
- **Environment-based config** - .env management

## Project Structure

```
good-news/
├── app/                          # Next.js app directory
│   ├── (public)/                 # Public routes (blog)
│   │   ├── page.tsx              # Homepage / blog listing
│   │   ├── layout.tsx            # Public layout
│   │   └── [slug]/               # Individual article pages
│   │
│   ├── control/                  # Admin panel (protected)
│   │   ├── layout.tsx            # Admin layout
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── login/                # Login page
│   │   ├── articles/             # Article management
│   │   ├── connectors/           # Platform connections
│   │   ├── queue/                # Publishing queue
│   │   ├── library/              # Content library
│   │   └── settings/             # Configuration
│   │
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication
│   │   ├── articles/             # Article operations
│   │   ├── rss/                  # RSS fetching
│   │   ├── ai/                   # AI processing
│   │   ├── images/               # Image generation
│   │   ├── publishing/           # Publishing operations
│   │   └── platforms/            # Platform integrations
│   │
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
│
├── lib/                          # Shared utilities
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # Auth utilities
│   ├── validators.ts             # Data validation
│   ├── constants.ts              # App constants
│   └── types.ts                  # TypeScript types
│
├── services/                     # Business logic services
│   ├── rss.service.ts            # RSS parsing & fetching
│   ├── ai.service.ts             # Claude API integration
│   ├── image.service.ts          # Image generation service
│   ├── publishing.service.ts     # Publishing orchestration
│   ├── platform.service.ts       # Platform-specific logic
│   ├── duplicate.service.ts      # Duplicate detection
│   └── content.service.ts        # Content transformation
│
├── workers/                      # Background jobs
│   ├── rss-fetch.worker.ts       # Periodic RSS fetching
│   ├── ai-process.worker.ts      # AI processing queue
│   ├── image-gen.worker.ts       # Image generation queue
│   └── publish.worker.ts         # Publishing scheduler
│
├── components/                   # React components
│   ├── admin/                    # Admin-specific components
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleEditor.tsx
│   │   ├── ConnectorForm.tsx
│   │   └── ...
│   ├── public/                   # Public-facing components
│   │   ├── BlogCard.tsx
│   │   ├── Header.tsx
│   │   └── ...
│   └── common/                   # Shared components
│       └── ...
│
├── prisma/
│   └── schema.prisma             # Database schema
│
├── public/                       # Static assets
│   ├── images/
│   └── icons/
│
├── .env.example                  # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── docker-compose.yml            # Local dev setup
```

## Key Features

### 1. **RSS Aggregation**
- Fetch from 100+ top English news sources
- Automatic duplicate detection
- Category classification
- Source trust scoring

### 2. **AI Content Processing**
- Sentiment analysis via Claude API
- Positivity filtering
- Multi-platform content generation
- SEO optimization
- Platform-specific text & formatting

### 3. **Image Generation**
- Automatic AI image generation via Replicate (Flux)
- Platform-specific dimensions:
  - Telegram: 1080x608
  - Twitter/X: 1200x675
  - Instagram: 1080x1080
  - Facebook: 1200x628
  - Pinterest: 1000x1500
  - Website: 1200x630

### 4. **Admin Dashboard**
- Real-time content review queue
- Article editing & preview
- Platform connector management
- Publishing schedule management
- Analytics & logs

### 5. **Multi-Platform Publishing**
- Telegram Bot API
- X/Twitter v2 API
- Instagram Graph API
- Facebook Graph API
- Pinterest API
- Internal website CMS

### 6. **Automation Modes**
- **Semi-Auto**: Manual review before publishing
- **Full-Auto**: Automatic publishing based on rules

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone & Install
```bash
git clone <repo>
cd good-news
npm install
```

### 2. Database Setup
```bash
cp .env.example .env.local
# Fill in DATABASE_URL and other secrets
npx prisma migrate dev
npx prisma db seed
```

### 3. Environment Variables
Create `.env.local`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/goodnews
NEXTAUTH_SECRET=<generate random>
NEXTAUTH_URL=http://localhost:3000

# Claude API
ANTHROPIC_API_KEY=<your key>

# Image Generation
REPLICATE_API_TOKEN=<your token>

# Social Platforms
TELEGRAM_BOT_TOKEN=<your token>
TWITTER_API_KEY=<your key>
TWITTER_API_SECRET=<your secret>
# ... other platform keys
```

### 4. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
# Admin: http://localhost:3000/control
# Login with default credentials (see seeds)
```

### 5. Start Background Workers
```bash
npm run workers
```

## Database Schema

Key tables:
- `users` - Admin users
- `rss_sources` - RSS feed sources
- `articles` - Raw articles from feeds
- `article_content` - Processed article content
- `ai_analysis` - AI processing results
- `generated_content` - Platform-specific content
- `generated_images` - Image generation results
- `publishing_queue` - Posts waiting to publish
- `publishing_results` - Published post history
- `platform_connections` - Social media account connections
- `automation_settings` - Global automation rules
- `logs` - System activity logs

## API Documentation

### Public Routes
- `GET /api/articles` - List published articles
- `GET /api/articles/[slug]` - Get article details

### Admin Routes (Protected)
- `POST /api/articles/process` - Process pending articles
- `POST /api/articles/[id]/approve` - Approve article
- `POST /api/articles/[id]/reject` - Reject article
- `POST /api/articles/[id]/generate-content` - Generate platform content
- `POST /api/articles/[id]/generate-image` - Generate image
- `POST /api/publishing/schedule` - Schedule post
- `POST /api/publishing/publish-now` - Publish immediately
- `POST /api/platforms/test-connection` - Test platform connection

## Development Workflow

1. **Create RSS sources** in admin panel
2. **Fetch & review** incoming articles
3. **Approve articles** for processing
4. **AI generates** content for all platforms
5. **Review** generated content & images
6. **Schedule/publish** to platforms
7. **Monitor** analytics & logs

## Deployment

### Option 1: Vercel (Recommended for Next.js)
```bash
vercel deploy
```

### Option 2: Railway
```bash
railway deploy
```

### Option 3: Docker + Self-hosted
```bash
docker-compose up -d
```

## Cost Estimation

Monthly costs (5-10 articles/day):
- Claude API: ~$5-15
- Replicate (image generation): ~$1-3
- Database (Railway/Supabase): ~$10
- Hosting: ~$10-50
- **Total: ~$25-80/month**

## Contributing & Roadmap

### Phase 1 (MVP)
- ✅ Dashboard
- ✅ RSS Ingestion
- ✅ AI Filtering & Analysis
- ✅ Content Generation
- ✅ Image Generation
- ✅ Manual Publishing
- ✅ Admin Panel

### Phase 2
- [ ] Full automation
- [ ] Advanced analytics
- [ ] A/B testing
- [ ] Performance metrics
- [ ] Team support

### Phase 3
- [ ] Mobile app
- [ ] API for third-party
- [ ] Multi-language support
- [ ] Advanced scheduling

## License

MIT

## Support

For issues, feature requests, or questions, open an issue on GitHub.

---

**Good News Control Center** - Spreading positive news, one article at a time. 🌟
