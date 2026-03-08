# Good News Control Center - Complete Implementation Guide

## 🎯 Project Overview

**Good News Control Center** is a full-stack AI-powered news aggregation platform that:

1. **Fetches** positive news from 100+ RSS sources (US, Canada, English-speaking countries)
2. **Filters** articles using Claude AI for positivity & relevance
3. **Generates** platform-specific content using Claude
4. **Creates** beautiful images using Replicate Flux
5. **Distributes** to Telegram, X, Instagram, Facebook, Pinterest, and your website
6. **Manages** everything through one clean admin dashboard

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PUBLIC SITE                              │
│                   (Good News Blog)                              │
│                  goodnews.com (frontend)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ADMIN PANEL                                │
│              goodnews.com/control (protected)                   │
│         ┌──────────────────────────────────────┐               │
│         │  Dashboard                           │               │
│         │  RSS Sources Management              │               │
│         │  Articles Inbox                      │               │
│         │  Content Editor                      │               │
│         │  Publishing Queue                    │               │
│         │  Platform Connectors                 │               │
│         │  Settings & Automation               │               │
│         │  Logs & Monitoring                   │               │
│         └──────────────────────────────────────┘               │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Database    │  │  AI Services │  │ Image Gen    │
│ (PostgreSQL) │  │  (Claude)    │  │ (Replicate)  │
└──────────────┘  └──────────────┘  └──────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
        ┌────────────────┼────────────────────────────────┐
        ▼                ▼                ▼               ▼
    Telegram          Twitter/X      Instagram       Facebook
     (Channels)       (Tweets)     (Posts+Images)    (Pages)
        ▼                ▼                ▼               ▼
     Pinterest      Website Blog    Your Audience
    (Pins)         (Articles)
```

---

## 📦 Complete File Structure

```
good-news/
│
├── 📄 README.md                      # Project overview
├── 📄 SETUP.md                       # Installation & setup
├── 📄 .env.example                   # Environment template
├── 📄 package.json                   # Dependencies
├── 📄 tsconfig.json                  # TypeScript config
├── 📄 next.config.js                 # Next.js config
├── 📄 tailwind.config.js             # Tailwind config
├── 📄 docker-compose.yml             # Local development
│
├── 📁 app/                           # Next.js app directory
│   ├── 📁 (public)/                  # Public routes
│   │   ├── page.tsx                  # Blog homepage
│   │   ├── layout.tsx                # Public layout
│   │   ├── [slug]/page.tsx           # Article pages
│   │   ├── category/[cat]/page.tsx   # Category pages
│   │   └── search/page.tsx           # Search page
│   │
│   ├── 📁 control/                   # Admin panel
│   │   ├── layout.tsx                # Admin layout wrapper
│   │   ├── page.tsx                  # Dashboard
│   │   │
│   │   ├── 📁 login/
│   │   │   └── page.tsx              # Login page
│   │   │
│   │   ├── 📁 articles/
│   │   │   ├── page.tsx              # Articles list
│   │   │   ├── [id]/page.tsx         # Article detail
│   │   │   └── [id]/editor.tsx       # Article editor
│   │   │
│   │   ├── 📁 rss-sources/
│   │   │   ├── page.tsx              # Sources list
│   │   │   └── [id]/page.tsx         # Source detail
│   │   │
│   │   ├── 📁 queue/
│   │   │   └── page.tsx              # Publishing queue
│   │   │
│   │   ├── 📁 library/
│   │   │   └── page.tsx              # Content library
│   │   │
│   │   ├── 📁 connectors/
│   │   │   ├── page.tsx              # Platform connections
│   │   │   └── [platform]/page.tsx   # Platform setup
│   │   │
│   │   ├── 📁 settings/
│   │   │   ├── page.tsx              # Settings home
│   │   │   ├── general.tsx           # General settings
│   │   │   ├── automation.tsx        # Automation rules
│   │   │   ├── prompts.tsx           # Prompt templates
│   │   │   ├── filters.tsx           # Content filters
│   │   │   └── logs.tsx              # Activity logs
│   │   │
│   │   └── 📁 media/
│   │       └── page.tsx              # Media library
│   │
│   ├── 📁 api/                       # API routes
│   │   ├── 📁 admin/
│   │   │   ├── stats/route.ts
│   │   │   ├── fetch-rss/route.ts
│   │   │   ├── process-ai/route.ts
│   │   │   ├── generate-images/route.ts
│   │   │   └── publish-scheduled/route.ts
│   │   │
│   │   ├── 📁 articles/
│   │   │   ├── route.ts              # List/create
│   │   │   ├── [id]/route.ts         # Get/update/delete
│   │   │   ├── [id]/approve/route.ts
│   │   │   ├── [id]/reject/route.ts
│   │   │   ├── [id]/analyze/route.ts
│   │   │   └── [id]/generate-content/route.ts
│   │   │
│   │   ├── 📁 images/
│   │   │   ├── generate/route.ts
│   │   │   ├── [id]/route.ts
│   │   │   └── [id]/regenerate/route.ts
│   │   │
│   │   ├── 📁 publishing/
│   │   │   ├── queue/route.ts
│   │   │   ├── schedule/route.ts
│   │   │   ├── publish-now/route.ts
│   │   │   └── [id]/status/route.ts
│   │   │
│   │   ├── 📁 platforms/
│   │   │   ├── route.ts              # List platforms
│   │   │   ├── [platform]/connect/route.ts
│   │   │   ├── [platform]/test/route.ts
│   │   │   └── [platform]/publish/route.ts
│   │   │
│   │   ├── 📁 auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── verify/route.ts
│   │   │
│   │   └── 📁 settings/
│   │       ├── automation/route.ts
│   │       ├── prompts/route.ts
│   │       ├── filters/route.ts
│   │       └── general/route.ts
│   │
│   ├── globals.css                   # Global styles
│   └── layout.tsx                    # Root layout
│
├── 📁 lib/                           # Utilities & helpers
│   ├── prisma.ts                     # Prisma client
│   ├── auth.ts                       # Auth utilities
│   ├── logger.ts                     # Logging system
│   ├── validators.ts                 # Data validation
│   ├── constants.ts                  # App constants
│   ├── types.ts                      # TypeScript types
│   └── utils.ts                      # Helper functions
│
├── 📁 services/                      # Business logic
│   ├── ai.service.ts                 # Claude API integration
│   ├── rss.service.ts                # RSS parsing & fetching
│   ├── image.service.ts              # Image generation
│   ├── publishing.service.ts         # Publishing orchestration
│   ├── platform.service.ts           # Platform-specific logic
│   ├── duplicate.service.ts          # Duplicate detection
│   ├── content.service.ts            # Content transformation
│   └── scheduling.service.ts         # Publishing scheduler
│
├── 📁 workers/                       # Background jobs
│   ├── index.ts                      # Job queue setup
│   ├── rss-fetch.worker.ts           # RSS fetching job
│   ├── ai-process.worker.ts          # AI processing job
│   ├── image-gen.worker.ts           # Image generation job
│   └── publish.worker.ts             # Publishing job
│
├── 📁 components/                    # React components
│   ├── 📁 admin/
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleEditor.tsx
│   │   ├── ConnectorForm.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── PublishingQueue.tsx
│   │   └── SettingsPanel.tsx
│   │
│   ├── 📁 public/
│   │   ├── BlogCard.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── BlogGrid.tsx
│   │
│   └── 📁 common/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Toast.tsx
│       └── Loading.tsx
│
├── 📁 prisma/
│   ├── schema.prisma                 # Database schema
│   ├── seed.ts                       # Database seeding
│   └── migrations/                   # Migration history
│
├── 📁 public/
│   ├── 📁 generated-images/          # AI-generated images
│   ├── 📁 images/                    # Static images
│   ├── 📁 icons/                     # Platform icons
│   └── favicon.ico
│
├── 📁 scripts/
│   ├── cleanup-logs.js               # Log cleanup
│   └── cleanup-images.js             # Image cleanup
│
├── 📁 styles/                        # CSS files
│   └── globals.css
│
└── 📁 .github/
    └── 📁 workflows/                 # CI/CD pipelines
        ├── test.yml
        └── deploy.yml
```

---

## 🔌 Platform-Specific Content Format

### Telegram
```
✨ [Article Title]

[Main summary - informative, 2-3 sentences]

📌 Key points:
• Point 1
• Point 2
• Point 3

#GoodNews #Telegram #Category
```

**Constraints:**
- Max ~500 chars (Telegram is generous)
- Can use markdown formatting
- Hashtags at end
- Image: 1080x608

### Twitter/X
```
🌟 [Punchy headline - max 280 chars total]

[Up to 2 hashtags]
[URL if needed]
```

**Constraints:**
- Max 280 characters
- Shorter is better
- 1-2 hashtags max
- Image: 1200x675 (horizontal)

### Instagram
```
✨ [Engaging opening line with emotion]

[Main story - 2-3 paragraphs max]

[Emojis throughout for engagement]

👉 [Call to action]

#GoodNews #Positive #Uplifting #Category [10-15 hashtags]
```

**Constraints:**
- Max ~2000 chars (use it!)
- Emojis important for algorithm
- Strong CTA
- Image: 1080x1080 (square)
- 15-30 hashtags optimal

### Facebook
```
[Friendly greeting + hook]

[Main content - 3-5 sentences]

[Link or CTA]

#GoodNews
```

**Constraints:**
- Max ~1000 chars
- Paragraph breaks for readability
- Facebook link preview shows auto
- Image: 1200x628

### Pinterest
```
[Inspirational title - SEO optimized]

[Description - 100-200 words]
- Keywords woven naturally
- Benefits mentioned
- Actionable insights

#GoodNews #Category #Positive
```

**Constraints:**
- Title is crucial (vertical image shows this)
- Description: 100-200 words with keywords
- Image: 1000x1500 (vertical, 2:3 ratio)
- Rich descriptions help with discovery

### Website Blog
```
# [SEO-Optimized Title]

*Last updated: [Date]*

## Introduction
[Hook + brief intro - 50-100 words]

## Main Story
[Full article - 800-1200 words]
- Multiple paragraphs
- Headings for scanability
- Links to sources
- Related articles

## Key Takeaways
- Point 1
- Point 2
- Point 3

## Further Reading
[Related articles/links]
```

**Constraints:**
- SEO-optimized (keywords, meta descriptions)
- 800-1200 words optimal
- Multiple headings
- Image: 1200x630 (featured image)
- Schema markup for articles

---

## 🤖 AI Prompts Architecture

### 1. Article Analysis Prompt
```
You are an expert news analyzer specializing in positive news.
Analyze this article for:
- Positivity (1-100)
- Relevance to our audience
- Novelty vs past articles
- Virality potential
- Factual accuracy

Return JSON with structured analysis.
```

### 2. Content Generation Prompts (per platform)

#### Telegram Prompt
```
Transform this news into an engaging Telegram message.
Requirements:
- Informative but concise
- Can use formatting
- Include key facts
- Max 500 characters
- Add relevant hashtags

Return only the message text.
```

#### Twitter Prompt
```
Create a Twitter-perfect post about this news.
Requirements:
- Punchy and engaging
- Max 280 characters (including hashtags)
- 1-2 hashtags max
- Compelling hook

Return only the tweet.
```

#### Instagram Prompt
```
Write an engaging Instagram caption.
Requirements:
- Emotional and inspiring
- Multiple paragraphs for readability
- Emojis throughout
- Strong CTA at end
- 15-30 relevant hashtags
- Max 2000 characters

Return only the caption.
```

#### Pinterest Prompt
```
Create a Pinterest-optimized description.
Requirements:
- SEO-keyword rich
- Describes what's in the image
- 100-200 words
- Actionable/inspirational tone
- 3-5 hashtags

Return only the description.
```

#### Website Prompt
```
Convert this news into a full blog article.
Requirements:
- SEO-optimized title
- 800-1200 words
- Multiple H2 headings
- Readable paragraphs
- 3-5 key takeaways section
- Links to sources
- Meta description under 160 chars

Return full HTML article ready to publish.
```

### 3. Image Prompt Generation
```
Create a detailed image generation prompt for a news illustration.
Input: [Article title, category, sentiment]

Requirements:
- Specific and descriptive (2-3 sentences)
- Positive and inspiring
- Editorial/professional style
- Suggest mood, composition, elements
- Include important visual keywords

Example output:
"Modern illustration of renewable energy wind turbines 
spinning peacefully in a bright morning landscape with 
blue sky and green fields. People walking nearby smiling. 
Style: clean, optimistic, editorial art, high quality."
```

---

## 🔑 Environment Variables Complete List

```env
# ===== DATABASE =====
DATABASE_URL=postgresql://user:pass@localhost:5432/goodnews

# ===== AUTHENTICATION =====
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=another-secret-key

# ===== AI & LLM =====
ANTHROPIC_API_KEY=sk-ant-xxxxx
CLAUDE_MODEL=claude-sonnet-4-20250514

# ===== IMAGE GENERATION =====
REPLICATE_API_TOKEN=r8_xxxxx
FLUX_MODEL_ID=flux-pro

# ===== SOCIAL PLATFORMS =====
# Telegram
TELEGRAM_BOT_TOKEN=123456:ABCxyz
TELEGRAM_CHANNEL_USERNAME=@my_channel

# Twitter/X
TWITTER_API_KEY=xxxxx
TWITTER_API_SECRET=xxxxx
TWITTER_ACCESS_TOKEN=xxxxx
TWITTER_ACCESS_TOKEN_SECRET=xxxxx
TWITTER_BEARER_TOKEN=Bearer xxxxx

# Instagram
INSTAGRAM_ACCESS_TOKEN=xxxxx
INSTAGRAM_BUSINESS_ACCOUNT_ID=xxxxx

# Facebook
FACEBOOK_PAGE_ACCESS_TOKEN=xxxxx
FACEBOOK_PAGE_ID=xxxxx

# Pinterest
PINTEREST_ACCESS_TOKEN=xxxxx
PINTEREST_BOARD_ID=xxxxx

# ===== WEBSITE =====
NEXT_PUBLIC_SITE_URL=https://goodnews.com
NEXT_PUBLIC_SITE_NAME=Good News

# ===== JOBS & SCHEDULING =====
REDIS_URL=redis://localhost:6379
RSS_FETCH_INTERVAL=60
AI_PROCESS_INTERVAL=30
IMAGE_GEN_INTERVAL=30
PUBLISH_CHECK_INTERVAL=5

# ===== LOGGING =====
LOG_LEVEL=info
ENABLE_DEBUG_LOGGING=false

# ===== ENVIRONMENT =====
NODE_ENV=development
```

---

## 📊 Database Schema Key Tables

### articles
- id, title, originalUrl, sourceId
- description, content
- status (NEW, ANALYZED, APPROVED, REJECTED, etc)
- positivityScore, relevanceScore, noveltyScore
- publishedAt, fetchedAt, createdAt

### ai_analysis
- articleId (foreign key)
- titleCleaned, fullSummary
- positivityScore, relevanceScore, viralityScore
- sentiment, category, keywords
- imagePromptBase, shouldUse

### generated_content
- articleId (foreign key)
- masterSummary, seoTitle, metaDescription
- telegramText, twitterText, instagramCaption
- facebookPost, pinterestDescription, websiteArticle

### generated_images
- articleId (foreign key)
- imagePrompt, imageUrl, localPath
- status (PROMPT_READY, GENERATING, GENERATED, FAILED)
- variants for each platform (telegramUrl, twitterUrl, etc)

### publishing_queue_item
- articleId (foreign key)
- status (DRAFT, READY, SCHEDULED, PUBLISHED, FAILED)
- platforms (array of: TELEGRAM, TWITTER, INSTAGRAM, FACEBOOK, PINTEREST, WEBSITE)
- scheduledAt, publishedAt

### publishing_result
- articleId, platform
- status (PENDING, SUCCESS, FAILED)
- externalPostId, externalUrl
- publishedAt, failureReason

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Setup environment in dashboard
# Database: Vercel Postgres or external PostgreSQL
```

### Option 2: Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 3: Docker + Self-hosted
```bash
# Build Docker image
docker build -t goodnews .

# Run with docker-compose
docker-compose up -d
```

---

## 💰 Cost Breakdown

### Monthly (5-10 articles/day)

| Service | Cost | Notes |
|---------|------|-------|
| Claude API | $5-15 | ~1000 requests |
| Replicate (images) | $1-3 | ~150-300 images |
| PostgreSQL | $10-30 | Managed service |
| Hosting | $10-50 | Vercel/Railway/VPS |
| Domain | $12 | goodnews.com |
| **TOTAL** | **$38-110** | Minimal investment |

### Scaling (50+ articles/day)
- Claude API: $20-50
- Replicate: $5-15
- Database: $30-100
- Hosting: $20-100+
- **Total: $75-265/month**

---

## 🎓 Learning Path

1. **Setup** - Get project running locally
2. **RSS** - Add RSS sources, fetch articles
3. **AI** - Configure Claude API, test analysis
4. **Content** - Generate content for articles
5. **Images** - Set up image generation
6. **Platforms** - Connect social media
7. **Publishing** - Publish your first post
8. **Automation** - Enable background workers
9. **Monitoring** - Set up logs and alerts
10. **Optimization** - Fine-tune prompts and rules

---

## 🔒 Security Best Practices

1. **Never commit .env.local** (use .env.example)
2. **Use strong passwords** (minimum 16 chars)
3. **Enable HTTPS** on production
4. **Rotate API keys** quarterly
5. **Use environment-based secrets** (not in code)
6. **Validate all inputs** (use Zod)
7. **Rate limit APIs** (prevent abuse)
8. **Backup database** daily
9. **Monitor logs** for suspicious activity
10. **Use strong JWT secrets**

---

## 📈 Success Metrics

Track these KPIs in your admin dashboard:

- **Articles per day**: Target 5-10
- **Approval rate**: Target 40-60%
- **Image success rate**: Target 95%+
- **Publishing success**: Target 98%+
- **Engagement**: Track in analytics
- **Audience growth**: Monthly increase
- **Cost per article**: Should decrease with scale

---

## 🎯 Next Steps

1. **Follow SETUP.md** to get running
2. **Add 10-20 RSS sources** to start
3. **Configure Claude + Replicate** APIs
4. **Connect one social platform** (Telegram easiest)
5. **Publish your first 5 articles** manually
6. **Monitor results** and adjust prompts
7. **Enable automation** gradually
8. **Scale to more platforms**
9. **Optimize content** based on performance
10. **Consider monetization** (affiliate, ads)

---

**You're now ready to build the Good News platform!** 🌟

Start with the SETUP.md guide and take it one step at a time. The architecture is modular, so you can add features incrementally.
