# PRD: AI Author Sentiment Analysis Pipeline

## 1. Overview

### 1.1 Problem Statement

Authors, illustrators, and content creators are actively debating the use of AI for content and image generation across social media. Understanding the sentiment landscape -- who supports it, who opposes it, and what specific concerns drive opinion -- is critical for anyone tracking this space. However, this data is fragmented across platforms and buried in unstructured text.

### 1.2 Proposed Solution

Build an automated pipeline that collects public discourse about AI-generated content from YouTube and Reddit, runs sentiment analysis using open-source NLP models, and produces structured reports and a dashboard for ongoing monitoring.

### 1.3 Target Users

- The site operator (primary) -- monitoring sentiment to inform content and reporting on the Manus-hosted author sentiment site
- Researchers and journalists tracking the AI content generation debate
- Publishers and content platforms evaluating creator sentiment

### 1.4 Success Criteria

| Metric | Target |
|--------|--------|
| Data collection uptime | > 95% over any 30-day window |
| Sentiment classification accuracy | > 80% on manually labeled validation set |
| Pipeline latency (collection to dashboard) | < 6 hours for daily batch; < 15 min for near-real-time |
| Coverage | Minimum 500 new data points per day across both platforms |
| Dashboard load time | < 3 seconds |

---

## 2. Data Sources

### 2.1 YouTube Data API v3

**What we collect:**

| Data Point | API Endpoint | Quota Cost |
|------------|-------------|------------|
| Video metadata (title, description, tags, publish date, view/like counts) | `search.list`, `videos.list` | 100 units (search), 1 unit (videos) |
| Comment threads (top-level comments + replies) | `commentThreads.list` | 1 unit per request (up to 100 comments) |
| Channel metadata | `channels.list` | 1 unit |

**Search strategy -- keyword groups:**

```
Group A (AI Writing):
  "AI writing", "ChatGPT for authors", "AI-generated content",
  "AI ghostwriting", "LLM writing", "AI copywriting",
  "Claude for writing", "AI novel", "AI fiction"

Group B (AI Art/Illustration):
  "AI art", "AI illustration", "AI-generated images",
  "Midjourney", "DALL-E", "Stable Diffusion",
  "AI cover art", "AI book covers"

Group C (Author/Creator Reaction):
  "authors against AI", "writers vs AI", "AI replacing writers",
  "AI art theft", "AI copyright", "AI plagiarism",
  "AI ethics content creation"
```

**Quota budget (default 10,000 units/day):**

| Operation | Units/call | Calls/day | Total units |
|-----------|-----------|-----------|-------------|
| Search for new videos | 100 | 30 | 3,000 |
| Fetch video details | 1 | 500 | 500 |
| Fetch comment threads | 1 | 5,000 | 5,000 |
| Fetch channel metadata | 1 | 200 | 200 |
| **Total** | | | **8,700 / 10,000** |

**Rate limits:** 10,000 quota units/day (free). Request a quota increase via Google Cloud console if needed (free, requires compliance audit).

### 2.2 Reddit API (via OAuth2)

**What we collect:**

| Data Point | Endpoint | Rate Limit |
|------------|----------|------------|
| Posts (title, selftext, score, num_comments, created_utc) | `/r/{subreddit}/search`, `/r/{subreddit}/new` | 100 req/min |
| Comments (body, score, author, created_utc) | `/r/{subreddit}/comments/{article}` | 100 req/min |
| Subreddit metadata | `/r/{subreddit}/about` | 100 req/min |

**Target subreddits:**

| Subreddit | Relevance | Estimated Activity |
|-----------|-----------|-------------------|
| r/writing | General writing community | High |
| r/selfpublish | Indie authors directly affected by AI | High |
| r/screenwriting | Screenwriters debating AI tools | Medium |
| r/freelanceWriters | Freelancers facing AI competition | High |
| r/digitalart | Digital artists on AI image gen | High |
| r/illustration | Professional illustrators | Medium |
| r/AIart | Pro-AI art community | High |
| r/DefendingAIArt | Pro-AI advocacy | Medium |
| r/ArtistHate | Anti-AI art community | High |
| r/publishing | Traditional publishing industry | Medium |
| r/graphicnovels | Visual storytelling community | Low-Medium |
| r/StableDiffusion | Stable Diffusion users | High |
| r/midjourney | Midjourney users | High |

**Search keywords:** Same keyword groups as YouTube, adapted for Reddit search syntax.

**Rate budget:** At 100 requests/minute (OAuth), we can comfortably collect from all target subreddits within a single batch window. Target: 60 requests/minute sustained to stay well under limits.

---

## 3. Architecture

### 3.1 System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        COLLECTION LAYER                             │
│                                                                     │
│  ┌──────────────────┐         ┌──────────────────┐                  │
│  │  YouTube Collector│         │  Reddit Collector │                 │
│  │  (yt-collector)   │         │  (reddit-collector)│                │
│  │                   │         │                    │                │
│  │  - Search API     │         │  - OAuth2 client   │                │
│  │  - Comments API   │         │  - Subreddit poller│                │
│  │  - Quota tracker  │         │  - Rate limiter    │                │
│  └────────┬─────────┘         └─────────┬──────────┘                │
│           │                             │                           │
│           └──────────┬──────────────────┘                           │
│                      ▼                                              │
│           ┌─────────────────────┐                                   │
│           │   Raw Data Store     │                                  │
│           │   (PostgreSQL)       │                                  │
│           └─────────┬───────────┘                                   │
└─────────────────────┼───────────────────────────────────────────────┘
                      │
┌─────────────────────┼───────────────────────────────────────────────┐
│                     ▼          PROCESSING LAYER                     │
│           ┌─────────────────────┐                                   │
│           │   Text Preprocessor  │                                  │
│           │                      │                                  │
│           │  - Clean HTML/markup │                                  │
│           │  - Normalize text    │                                  │
│           │  - Language detect   │                                  │
│           │  - Dedup             │                                  │
│           └─────────┬───────────┘                                   │
│                     ▼                                               │
│           ┌─────────────────────┐                                   │
│           │  Sentiment Analyzer  │                                  │
│           │                      │                                  │
│           │  Primary: DistilBERT │                                  │
│           │  Fallback: VADER     │                                  │
│           │                      │                                  │
│           │  Output per text:    │                                  │
│           │  - polarity score    │                                  │
│           │  - label (pos/neg/   │                                  │
│           │    neutral)          │                                  │
│           │  - confidence score  │                                  │
│           └─────────┬───────────┘                                   │
│                     ▼                                               │
│           ┌─────────────────────┐                                   │
│           │  Topic Classifier    │                                  │
│           │                      │                                  │
│           │  - Zero-shot (BART)  │                                  │
│           │  - Assigns topic     │                                  │
│           │    labels per text   │                                  │
│           └─────────┬───────────┘                                   │
│                     ▼                                               │
│           ┌─────────────────────┐                                   │
│           │  Analyzed Data Store │                                  │
│           │  (PostgreSQL)        │                                  │
│           └─────────┬───────────┘                                   │
└─────────────────────┼───────────────────────────────────────────────┘
                      │
┌─────────────────────┼───────────────────────────────────────────────┐
│                     ▼          PRESENTATION LAYER                   │
│           ┌─────────────────────┐    ┌──────────────────┐           │
│           │   REST API           │    │  Scheduled Reports│          │
│           │   (FastAPI)          │    │  (email/export)   │          │
│           └─────────┬───────────┘    └──────────────────┘           │
│                     ▼                                               │
│           ┌─────────────────────┐                                   │
│           │   Dashboard (React)  │                                  │
│           │                      │                                  │
│           │  - Sentiment trends  │                                  │
│           │  - Topic breakdown   │                                  │
│           │  - Platform compare  │                                  │
│           │  - Notable posts     │                                  │
│           │  - Export (CSV/PDF)  │                                  │
│           └─────────────────────┘                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Language | Python 3.12+ | Ecosystem for NLP, API clients, data processing |
| Data collection | `google-api-python-client`, `praw` (Reddit) | Official/well-maintained API wrappers |
| Task scheduling | APScheduler or Celery + Redis | Celery if scaling needed; APScheduler for simpler single-server setup |
| Database | PostgreSQL 16 | JSONB for flexible schema, full-text search, mature ecosystem |
| Sentiment analysis | Hugging Face Transformers (`distilbert-base-uncased-finetuned-sst-2-english`) | 40% smaller than BERT, 60% faster, 95% accuracy retention |
| Fallback sentiment | VADER (`vaderSentiment`) | No GPU needed, handles social media text, fast |
| Topic classification | Hugging Face (`facebook/bart-large-mnli`) | Zero-shot classification, no training data required |
| API server | FastAPI | Async, auto-generated OpenAPI docs, type-safe |
| Dashboard | React + Recharts (or Plotly Dash for faster MVP) | Recharts for custom React UI; Dash for rapid prototyping |
| Containerization | Docker + docker-compose | Reproducible environments, simple deployment |
| CI/CD | GitHub Actions | Already on GitHub |

### 3.3 Database Schema

```sql
-- Source platforms
CREATE TYPE platform AS ENUM ('youtube', 'reddit');

-- Sentiment labels
CREATE TYPE sentiment_label AS ENUM ('positive', 'negative', 'neutral');

-- Raw collected content
CREATE TABLE raw_content (
    id              BIGSERIAL PRIMARY KEY,
    platform        platform NOT NULL,
    platform_id     TEXT NOT NULL,           -- YouTube video/comment ID or Reddit post/comment ID
    parent_id       TEXT,                    -- Parent content ID (for replies/comments)
    content_type    TEXT NOT NULL,           -- 'video', 'comment', 'post', 'reply'
    author          TEXT,
    title           TEXT,                    -- Video/post title
    body            TEXT NOT NULL,           -- Comment text, post selftext, video description
    url             TEXT,
    score           INTEGER,                 -- Upvotes, likes
    reply_count     INTEGER,
    platform_created_at TIMESTAMPTZ,
    collected_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata        JSONB,                   -- Platform-specific fields (view count, subreddit, tags, etc.)

    UNIQUE (platform, platform_id)
);

CREATE INDEX idx_raw_content_platform ON raw_content (platform);
CREATE INDEX idx_raw_content_collected_at ON raw_content (collected_at);
CREATE INDEX idx_raw_content_platform_created ON raw_content (platform_created_at);

-- Sentiment analysis results
CREATE TABLE sentiment_analysis (
    id              BIGSERIAL PRIMARY KEY,
    raw_content_id  BIGINT NOT NULL REFERENCES raw_content(id),
    model_name      TEXT NOT NULL,           -- 'distilbert-sst2', 'vader', etc.
    model_version   TEXT,
    sentiment       sentiment_label NOT NULL,
    polarity_score  FLOAT NOT NULL,          -- -1.0 to 1.0
    confidence      FLOAT NOT NULL,          -- 0.0 to 1.0
    analyzed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (raw_content_id, model_name)
);

CREATE INDEX idx_sentiment_content ON sentiment_analysis (raw_content_id);
CREATE INDEX idx_sentiment_label ON sentiment_analysis (sentiment);
CREATE INDEX idx_sentiment_analyzed_at ON sentiment_analysis (analyzed_at);

-- Topic classification results
CREATE TABLE topic_classification (
    id              BIGSERIAL PRIMARY KEY,
    raw_content_id  BIGINT NOT NULL REFERENCES raw_content(id),
    topic           TEXT NOT NULL,            -- e.g., 'copyright', 'job_displacement', 'quality', 'ethics'
    confidence      FLOAT NOT NULL,
    model_name      TEXT NOT NULL,
    classified_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (raw_content_id, topic, model_name)
);

CREATE INDEX idx_topic_content ON topic_classification (raw_content_id);
CREATE INDEX idx_topic_topic ON topic_classification (topic);

-- Aggregated daily sentiment (materialized for dashboard performance)
CREATE TABLE daily_sentiment_summary (
    id              BIGSERIAL PRIMARY KEY,
    date            DATE NOT NULL,
    platform        platform NOT NULL,
    topic           TEXT,                    -- NULL = all topics
    positive_count  INTEGER NOT NULL DEFAULT 0,
    negative_count  INTEGER NOT NULL DEFAULT 0,
    neutral_count   INTEGER NOT NULL DEFAULT 0,
    avg_polarity    FLOAT NOT NULL,
    total_count     INTEGER NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (date, platform, topic)
);

-- Collection job tracking
CREATE TABLE collection_jobs (
    id              BIGSERIAL PRIMARY KEY,
    platform        platform NOT NULL,
    job_type        TEXT NOT NULL,           -- 'search', 'comments', 'subreddit_poll'
    status          TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'running', 'completed', 'failed'
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    items_collected INTEGER DEFAULT 0,
    error_message   TEXT,
    metadata        JSONB                    -- Search params, subreddit name, etc.
);
```

---

## 4. Functional Requirements

### 4.1 Data Collection

#### FR-1: YouTube Video Discovery

The system must search YouTube for videos matching configured keyword groups on a scheduled basis (default: every 6 hours). For each keyword query, retrieve up to 50 results sorted by relevance, then by date. Deduplicate against previously collected videos using `platform_id`. Store video metadata including title, description, tags, view count, like count, comment count, channel info, and publish date.

#### FR-2: YouTube Comment Collection

For each discovered video, the system must retrieve all top-level comment threads (up to 500 comments per video, configurable). For high-engagement comments (> 10 likes), also retrieve reply threads. Store comment text, author, like count, reply count, and publish date.

#### FR-3: Reddit Post Discovery

The system must poll configured subreddits for new posts on a scheduled basis (default: every 2 hours). Use both `/new` (chronological) and `/search` (keyword-matched) endpoints. Retrieve post title, selftext, score, comment count, author, flair, and creation timestamp. Deduplicate by Reddit post ID.

#### FR-4: Reddit Comment Collection

For each discovered post with > 5 comments, retrieve the full comment tree (up to 500 comments per post, configurable). Store comment body, score, author, depth, and parent ID. Handle Reddit's "More Comments" pagination.

#### FR-5: Rate Limit Management

The system must track API quota usage in real time. For YouTube, stop collection when quota reaches 9,500/10,000 units (configurable safety margin). For Reddit, enforce a maximum of 60 requests/minute with exponential backoff on 429 responses. Log all rate limit events.

#### FR-6: Collection Job Tracking

Every collection run must be logged in `collection_jobs` with status, item counts, and error details. Failed jobs must be retried up to 3 times with exponential backoff. Provide an API endpoint to view job history and status.

### 4.2 Text Processing

#### FR-7: Text Preprocessing

Before analysis, all text must be:
- Stripped of HTML tags and markdown formatting
- Normalized (unicode normalization, lowercased for analysis while preserving original)
- Filtered for language (English only in v1; log non-English content for future expansion)
- Deduplicated (exact and near-duplicate detection using simhash or similar)
- Minimum length filtered (discard texts < 10 characters as non-informative)

#### FR-8: Sentiment Analysis

Each text item must be scored using the primary model (DistilBERT fine-tuned on SST-2). Output: sentiment label (`positive`, `negative`, `neutral`), polarity score (-1.0 to 1.0), and confidence score (0.0 to 1.0).

The neutral threshold: items with confidence < 0.6 for both positive and negative are classified as neutral.

Fallback: If the transformer model fails (OOM, timeout), fall back to VADER and flag the result with `model_name = 'vader'`.

Batch processing: Process texts in batches of 32 on GPU or 8 on CPU to optimize throughput.

#### FR-9: Topic Classification

Each text item must be classified into one or more topic categories using zero-shot classification (BART-large-MNLI). Candidate labels:

```
- copyright_ip          ("copyright", "intellectual property", "AI training data")
- job_displacement      ("replacing writers", "replacing artists", "job loss")
- quality_concerns      ("AI quality", "generic output", "lacks creativity")
- ethics_fairness       ("ethical concerns", "fairness", "consent")
- pro_efficiency        ("saves time", "productivity", "useful tool")
- pro_accessibility     ("democratizing", "accessible", "lowers barrier")
- regulation_policy     ("regulation", "legislation", "policy")
- platform_specific     ("Midjourney", "ChatGPT", "Stable Diffusion", "DALL-E")
```

Assign all topics with confidence > 0.4. Store each as a separate row in `topic_classification`.

### 4.3 API

#### FR-10: Sentiment Trends Endpoint

`GET /api/v1/sentiment/trends`

Parameters:
- `start_date`, `end_date` (required)
- `platform` (optional, filter by youtube/reddit)
- `topic` (optional, filter by topic label)
- `granularity` (optional: `day`, `week`, `month`; default: `day`)

Returns: Time-series data with positive/negative/neutral counts and average polarity per period.

#### FR-11: Topic Breakdown Endpoint

`GET /api/v1/topics/breakdown`

Parameters:
- `start_date`, `end_date` (required)
- `platform` (optional)

Returns: Count and average sentiment per topic for the given period.

#### FR-12: Notable Content Endpoint

`GET /api/v1/content/notable`

Parameters:
- `start_date`, `end_date` (required)
- `platform` (optional)
- `sentiment` (optional: `positive`, `negative`)
- `min_score` (optional: minimum engagement score)
- `limit` (optional, default 20)

Returns: Highest-engagement content items with their sentiment and topic labels, sorted by engagement score.

#### FR-13: Platform Comparison Endpoint

`GET /api/v1/sentiment/compare`

Parameters:
- `start_date`, `end_date` (required)
- `topic` (optional)

Returns: Side-by-side sentiment distribution for YouTube vs Reddit.

#### FR-14: Export Endpoint

`GET /api/v1/export`

Parameters:
- `start_date`, `end_date` (required)
- `format` (`csv` or `json`)
- `include` (optional: `sentiment`, `topics`, `raw`; default: all)

Returns: Downloadable file with the requested data.

### 4.4 Dashboard

#### FR-15: Sentiment Trend Chart

Line chart showing sentiment polarity over time. Filterable by platform and topic. Default view: last 30 days, daily granularity.

#### FR-16: Topic Breakdown View

Horizontal bar chart showing volume and sentiment per topic category. Clicking a topic filters the trend chart to that topic.

#### FR-17: Platform Comparison Panel

Side-by-side donut charts showing positive/negative/neutral split for YouTube vs Reddit. Includes total volume for each.

#### FR-18: Notable Content Feed

Scrollable feed of high-engagement content items, showing: source platform icon, title/excerpt, sentiment badge, topic tags, engagement metrics, and link to original. Filterable by sentiment and platform.

#### FR-19: Export Controls

Buttons to export visible data as CSV or PDF. PDF includes rendered charts.

### 4.5 Reporting

#### FR-20: Weekly Digest

Automated weekly email report (configurable recipients) containing:
- Sentiment trend summary vs previous week
- Top 3 topics by volume
- Top 5 most-engaged content items (positive and negative)
- Notable shifts or anomalies

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Requirement | Target |
|------------|--------|
| Batch processing throughput (sentiment) | > 1,000 texts/minute on CPU; > 10,000/min on GPU |
| API response time (p95) | < 500ms for trend queries over 30-day range |
| Dashboard initial load | < 3 seconds |
| Database query time for aggregations | < 200ms using pre-computed daily summaries |

### 5.2 Reliability

- Collection jobs must retry on transient failures (network errors, rate limits) with exponential backoff
- Sentiment analysis must have a fallback model (VADER) if the primary model fails
- Database must have daily backups
- System must gracefully handle API quota exhaustion (pause and resume, not crash)

### 5.3 Scalability

v1 is designed for a single-server deployment. The architecture should support future scaling:
- Collection and analysis are separated so they can run on different machines
- Database schema supports partitioning by date if volume grows
- Celery workers can scale horizontally if batch processing becomes a bottleneck

### 5.4 Security

- API keys (YouTube, Reddit) stored in environment variables, never in code or config files
- Reddit OAuth2 client secret rotated quarterly
- Dashboard behind authentication (basic auth for v1, OAuth for future)
- No PII collection beyond public usernames (which are already public)
- Database access restricted to application service accounts

### 5.5 Monitoring & Observability

- Structured logging (JSON format) for all components
- Log levels: collection events (INFO), analysis results (DEBUG), errors (ERROR)
- Health check endpoints for API server (`/health`) and collection workers
- Metrics: items collected/day, items analyzed/day, API quota usage, error rates
- Alerts: quota exhaustion > 90%, collection failure rate > 10%, analysis backlog > 1 hour

---

## 6. Topic Categories (Detailed)

The zero-shot classifier uses these candidate labels. This list is the canonical reference and should be configurable without code changes (stored in a config file or database).

| Topic Key | Display Name | Description | Example Phrases |
|-----------|-------------|-------------|-----------------|
| `copyright_ip` | Copyright & IP | Intellectual property, training data rights, fair use | "trained on stolen art", "copyright infringement", "opt-out" |
| `job_displacement` | Job Displacement | Fear of or actual job loss due to AI | "replacing writers", "lost my gig to AI", "no more freelance work" |
| `quality_concerns` | Quality Concerns | AI output quality criticism | "generic", "soulless", "uncanny valley", "can always tell it's AI" |
| `ethics_fairness` | Ethics & Fairness | Moral and ethical dimensions | "consent", "exploitation", "unfair", "should artists be compensated" |
| `pro_efficiency` | Pro-Efficiency | AI as a productivity tool | "saves hours", "first draft", "brainstorming tool", "speeds up workflow" |
| `pro_accessibility` | Pro-Accessibility | AI democratizing content creation | "anyone can create", "lowers the barrier", "empowering" |
| `regulation_policy` | Regulation & Policy | Government/platform regulation | "should be regulated", "EU AI Act", "disclosure requirements" |
| `platform_specific` | Platform-Specific | Discussion of specific AI tools | "Midjourney", "ChatGPT", "Stable Diffusion", "DALL-E", "Claude" |

---

## 7. Milestones & Phases

### Phase 1: Data Collection Foundation (MVP)

**Goal:** Collect and store raw data from YouTube and Reddit.

| Deliverable | Details |
|------------|---------|
| YouTube collector service | Search + comment collection with quota tracking |
| Reddit collector service | Subreddit polling + comment tree retrieval with rate limiting |
| PostgreSQL database | Schema deployed, raw_content table populated |
| Collection job tracking | Status tracking, retry logic, error logging |
| Configuration | YAML-based config for keywords, subreddits, schedules |
| Docker setup | docker-compose with app + PostgreSQL containers |

**Exit criteria:** Both collectors running on schedule, > 200 items/day collected from each platform, zero unhandled crashes over 48 hours.

### Phase 2: Sentiment & Topic Analysis

**Goal:** Analyze all collected content for sentiment and topic.

| Deliverable | Details |
|------------|---------|
| Text preprocessor | Cleaning, normalization, language detection, dedup |
| Sentiment analyzer | DistilBERT primary + VADER fallback, batch processing |
| Topic classifier | Zero-shot BART-MNLI with configurable labels |
| Analysis pipeline | Scheduled job to process new raw_content rows |
| Daily summary aggregation | Materialized daily_sentiment_summary table |

**Exit criteria:** > 80% accuracy on a 200-item manually labeled validation set. Processing backlog stays under 1 hour.

### Phase 3: API & Dashboard

**Goal:** Make data accessible through an API and visual dashboard.

| Deliverable | Details |
|------------|---------|
| FastAPI server | All endpoints from FR-10 through FR-14 |
| React dashboard | Trend chart, topic breakdown, platform comparison, notable feed |
| Export functionality | CSV and JSON export |
| Authentication | Basic auth for dashboard access |

**Exit criteria:** Dashboard loads in < 3 seconds, all API endpoints return correct data, export produces valid files.

### Phase 4: Reporting & Polish

**Goal:** Automated reporting and production hardening.

| Deliverable | Details |
|------------|---------|
| Weekly digest email | Automated summary report |
| Alerting | Quota, error rate, and backlog alerts |
| Monitoring dashboard | System health metrics |
| Documentation | Deployment guide, API docs (auto-generated from FastAPI) |

**Exit criteria:** Weekly report delivered on schedule for 3 consecutive weeks. System runs unattended for 7 days without intervention.

---

## 8. Project Structure

```
russian-narrator-app/
├── src/
│   ├── collectors/
│   │   ├── __init__.py
│   │   ├── base.py              # Abstract collector interface
│   │   ├── youtube.py           # YouTube Data API v3 collector
│   │   └── reddit.py            # Reddit (PRAW) collector
│   ├── analysis/
│   │   ├── __init__.py
│   │   ├── preprocessor.py      # Text cleaning and normalization
│   │   ├── sentiment.py         # DistilBERT + VADER sentiment analysis
│   │   └── topics.py            # Zero-shot topic classification
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── routes/
│   │   │   ├── sentiment.py     # Sentiment trend endpoints
│   │   │   ├── topics.py        # Topic breakdown endpoints
│   │   │   ├── content.py       # Notable content endpoints
│   │   │   └── export.py        # Export endpoints
│   │   └── dependencies.py      # Auth, DB session, etc.
│   ├── models/
│   │   ├── __init__.py
│   │   └── database.py          # SQLAlchemy models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── scheduler.py         # Job scheduling (APScheduler)
│   │   ├── aggregator.py        # Daily summary computation
│   │   └── reporter.py          # Weekly digest generation
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── config.py            # Configuration loader
│   │   ├── logging.py           # Structured logging setup
│   │   └── rate-limiter.py      # Generic rate limiting utility
│   ├── types/
│   │   ├── __init__.py
│   │   └── schemas.py           # Pydantic schemas for API
│   └── index.py                 # Main entry point
├── dashboard/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SentimentTrendChart.tsx
│   │   │   ├── TopicBreakdown.tsx
│   │   │   ├── PlatformComparison.tsx
│   │   │   ├── NotableFeed.tsx
│   │   │   └── ExportControls.tsx
│   │   ├── hooks/
│   │   │   └── useApi.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
├── tests/
│   ├── collectors/
│   │   ├── test_youtube.py
│   │   └── test_reddit.py
│   ├── analysis/
│   │   ├── test_preprocessor.py
│   │   ├── test_sentiment.py
│   │   └── test_topics.py
│   ├── api/
│   │   └── test_routes.py
│   └── conftest.py              # Shared fixtures
├── config/
│   ├── keywords.yaml            # Search keyword groups
│   ├── subreddits.yaml          # Target subreddits + config
│   └── topics.yaml              # Topic classification labels
├── migrations/                  # Alembic database migrations
├── docker-compose.yml
├── Dockerfile
├── pyproject.toml               # Python project config + dependencies
├── README.md
└── CLAUDE.md
```

---

## 9. Configuration Example

```yaml
# config/keywords.yaml
keyword_groups:
  ai_writing:
    - "AI writing"
    - "ChatGPT for authors"
    - "AI-generated content"
    - "AI ghostwriting"
    - "LLM writing"
    - "AI novel"
    - "AI fiction"
  ai_art:
    - "AI art"
    - "AI illustration"
    - "AI-generated images"
    - "Midjourney"
    - "DALL-E"
    - "Stable Diffusion"
    - "AI book covers"
  author_reaction:
    - "authors against AI"
    - "writers vs AI"
    - "AI replacing writers"
    - "AI art theft"
    - "AI copyright"

# config/subreddits.yaml
subreddits:
  - name: writing
    poll_interval_minutes: 120
    search_keywords: true
    max_posts_per_poll: 100
  - name: selfpublish
    poll_interval_minutes: 120
    search_keywords: true
    max_posts_per_poll: 100
  - name: digitalart
    poll_interval_minutes: 120
    search_keywords: true
    max_posts_per_poll: 50
  - name: AIart
    poll_interval_minutes: 240
    search_keywords: false     # All content is relevant
    max_posts_per_poll: 100

# config/topics.yaml
topics:
  copyright_ip:
    display_name: "Copyright & IP"
    zero_shot_labels:
      - "copyright and intellectual property"
      - "AI training data rights"
      - "fair use of creative work"
  job_displacement:
    display_name: "Job Displacement"
    zero_shot_labels:
      - "AI replacing human writers and artists"
      - "job loss due to artificial intelligence"
  # ... (remaining topics)
```

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| YouTube quota exhaustion | Medium | High -- stops collection | Quota tracking with safety margin; prioritize high-value queries; request quota increase |
| Reddit API changes or rate limit reduction | Low | High | Abstract collector behind interface; PRAW handles most changes; monitor Reddit API changelog |
| Sentiment model inaccuracy on domain-specific language | High | Medium | Fine-tune DistilBERT on a labeled subset of AI-debate text; maintain VADER fallback |
| Sarcasm and irony misclassified | High | Medium | Flag low-confidence results for manual review; document known accuracy limitations |
| Legal/TOS risk from data collection | Low | High | Use only official APIs; collect only public data; no login bypass; document compliance |
| Model inference too slow on CPU | Medium | Medium | Batch processing; consider GPU instance or use VADER-only mode as degraded option |
| Scope creep to additional platforms | Medium | Low | Modular collector architecture makes adding sources straightforward in future phases |

---

## 11. Future Considerations (Out of Scope for v1)

- **Additional platforms:** TikTok (if API access obtained), X/Twitter (if pricing becomes reasonable), Bluesky (open API)
- **Fine-tuned sentiment model:** Train on a manually labeled dataset specific to the AI content debate for higher accuracy
- **Aspect-based sentiment:** Not just "positive/negative about AI" but "positive about efficiency, negative about quality" within the same text
- **Influencer tracking:** Identify and track sentiment from key voices over time
- **Real-time streaming:** Move from batch polling to real-time ingestion where APIs support it (Reddit streaming)
- **Multilingual support:** Expand beyond English to cover non-English author communities
- **Integration with Manus site:** Embed dashboard or feed sentiment data directly into the existing author sentiment site

---

## 12. Open Questions

1. **GPU availability:** Will the deployment environment have GPU access? This significantly affects model choice and batch size. If CPU-only, VADER may need to be the primary model with DistilBERT used selectively.

2. **Dashboard hosting:** Should the dashboard be a standalone deployment or embedded within the existing Manus site?

3. **Data retention:** How long should raw content be retained? Suggest 12 months with daily summaries retained indefinitely.

4. **Manual labeling:** Is there budget/willingness to manually label 200-500 items to create a validation set and potentially fine-tune the sentiment model?

5. **Notification preferences:** Email for weekly digest, or also Slack/Discord webhook support?
