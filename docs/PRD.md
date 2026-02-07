# Product Requirements Document
## AI & Publishing Industry Daily Digest

| Field | Value |
|-------|-------|
| **Product** | AI & Publishing Daily Digest |
| **Version** | 1.0.0 |
| **Last Updated** | 2026-02-07 |
| **Status** | In Development |

---

## 1. Overview

A dual-delivery news digest system that curates, categorizes, and distributes daily reporting on AI's impact across the publishing, media, and creative industries. The product ships as two complementary artifacts:

1. **Web App** (Replit) — A live dashboard that fetches, categorizes, and displays articles with clickable links.
2. **n8n Workflow** — An automated pipeline that fetches articles, generates an AI-written digest via GPT-4o, and emails it to a subscriber list.

Both share the same NewsAPI data source, search queries, and content taxonomy.

---

## 2. Problem Statement

Professionals in publishing, rights management, and content creation need a reliable, daily briefing on how AI is reshaping their industry. Relevant coverage is scattered across dozens of outlets and beats (tech, legal, entertainment, policy). Manually tracking it is time-consuming and prone to blind spots.

### Target Users

- Publishing professionals tracking AI developments
- Authors and literary agents monitoring industry shifts
- Rights managers staying current on regulation and licensing
- Content creators following platform policies around AI-generated media

---

## 3. Content Taxonomy

All news is categorized into five sections. Every article is assigned to exactly one section via keyword matching.

| Section | Emoji | Topics Covered |
|---------|-------|----------------|
| **Authors & AI** | :books: | AI in writing, editing, publishing; drafting tools; proofreading; public backlash; accidental publication of AI content |
| **Publishing Contracts & Guidelines** | :page_facing_up: | AI clauses in contracts; audiobook narration rights; translation; cover art; AI training rights; disclosure requirements; collective management |
| **AI Audio & Platform Policy** | :headphones: | Audible AI voices; music licensing (Suno/Udio); voice cloning; text-to-speech; synthetic voice; creator backlash; labeling policies |
| **Interactive Storytelling & Adaptations** | :video_game::film_projector: | Book-to-game/movie/TV; AI-assisted adaptation; interactive fiction platforms; game narrative tools; choice-based storytelling; cross-media IP deals |
| **Europe/UK Regulation & Rights** | :eu::gb: | EU AI Act enforcement; UK AI/copyright proposals; CMA/DSA/DMCC platform rules; opt-out schemes; licensing marketplaces; scraping restrictions; compensation frameworks |

### EU/UK Integration Rule

Europe/UK regulation and rights-marketplace items are integrated into the most contextually relevant section above. When placement is ambiguous, they default to **Publishing Contracts & Guidelines**.

---

## 4. Freshness Rules

All output follows a strict temporal hierarchy:

1. **Yesterday's stories first** — Articles published on the previous calendar day (relative to run time) are the primary content.
2. **Earlier coverage fallback** — If a section has no qualifying stories from yesterday, an "Earlier coverage" subsection groups older articles by `Month YYYY` (e.g., "January 2026", "December 2025").
3. **Ultra-fresh ticker** — A final section surfaces 3-7 breaking updates from the last 6-12 hours. If none are available, displays: *"No major breaking updates in the last 12 hours."*

---

## 5. Deliverable A — Replit Web App

### 5.1 Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 22+ (built-in `fetch`) |
| Server | Express 4.x |
| Language | TypeScript 5.x (compiled via `tsx`) |
| Frontend | Vanilla HTML / CSS / JS (no framework) |
| API | NewsAPI `/v2/everything` |
| Hosting | Replit |

### 5.2 Architecture

```
src/
  index.ts                    Express server, static file serving, /api/digest endpoint
  services/
    news-service.ts           NewsAPI integration, keyword categorization, freshness splitting
  types/
    index.ts                  TypeScript interfaces (Article, DigestSection, CategorizedDigest, MonthGroup)
public/
  index.html                  Single-page app shell
  styles.css                  Dark-theme responsive stylesheet
  app.js                      Client-side fetch, DOM rendering, state management
```

### 5.3 API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /` | GET | Serves `public/index.html` |
| `GET /api/digest` | GET | Returns `CategorizedDigest` JSON |

#### `GET /api/digest` Response Shape

```typescript
{
  date: string;                // Yesterday's date (YYYY-MM-DD)
  headlines: Article[];        // Top 10 articles from yesterday
  sections: DigestSection[];   // 5 category sections
  totalArticles: number;       // Total articles indexed
  ticker: Article[];           // Up to 7 ultra-fresh articles
}
```

#### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| 503 | `NEWS_API_KEY` not set | `{ error: "...", configNeeded: true }` |
| 500 | NewsAPI failure or other | `{ error: "...", configNeeded: false }` |

### 5.4 Data Flow

```
Schedule/Manual Refresh
  └─> Express /api/digest
        └─> news-service.ts
              ├─> Fetch NewsAPI /everything (7-day window, 100 articles max)
              ├─> Filter removed articles
              ├─> Categorize each article by keyword matching
              ├─> Split into yesterdayArticles vs earlierArticles per section
              └─> Return CategorizedDigest
  └─> app.js renders to DOM
```

### 5.5 Search Configuration

**NewsAPI Endpoint:** `https://newsapi.org/v2/everything`

**Query (OR-joined):**
```
"AI author" OR "AI writing" OR "AI publishing" OR "AI audiobook"
OR "AI narration" OR "AI copyright" OR "interactive storytelling"
OR "EU AI Act" OR "book adaptation" OR "AI editing"
OR "Audible AI" OR "AI audio platform"
```

**Parameters:**

| Param | Value |
|-------|-------|
| `from` | 7 days ago (YYYY-MM-DD) |
| `to` | Today (YYYY-MM-DD) |
| `language` | `en` |
| `sortBy` | `publishedAt` |
| `pageSize` | `100` |

### 5.6 Categorization Logic

Articles are assigned to categories by scanning `title + description` for keyword matches. Categories are evaluated in order; the first match wins:

1. **authors-ai** — `author`, `writing`, `writer`, `drafting`, `proofreading`, `editing tool`, `manuscript`, `novelist`, `ai writing`, `ghostwrit`, `plagiarism`, `ai-generated text`
2. **publishing-contracts** — `publishing contract`, `guideline`, `clause`, `training rights`, `disclosure`, `license agreement`, `copyright`, `intellectual property`, `opt-out`, `compensation`, `collective management`
3. **ai-audio** — `audiobook`, `narration`, `audible`, `suno`, `udio`, `audio platform`, `music licensing`, `voice clone`, `text-to-speech`, `ai voice`, `synthetic voice`, `ai audio`
4. **interactive-storytelling** — `book-to-game`, `book-to-movie`, `adaptation`, `interactive fiction`, `interactive storytelling`, `choice-based`, `game narrative`, `cross-media`, `transmedia`, `book-to-tv`, `streaming deal`
5. **eu-uk-regulation** — `eu ai act`, `uk ai`, `cma`, `digital services act`, `dmcc`, `scraping`, `data mining`, `regulation`, `european commission`, `rights marketplace`, `licensing marketplace`

**Fallback:** If no keywords match, articles containing both `ai` and (`publish` or `book`) go to `publishing-contracts`; all others default to `authors-ai`.

### 5.7 Frontend

**Theme:** Dark (background `#0f1117`, surface `#1a1d27`)

**Layout (top to bottom):**

1. **Sticky header** — Title, digest date, refresh button
2. **Headlines section** — 6-10 one-line headlines with source labels, accent-tinted background
3. **Category sections** (x5) — Color-coded tag bars; article cards with title link, source, date, author, 2-line description; "Earlier coverage" month groupings
4. **Ticker section** — Amber-tinted background, lightning-bolt bullets
5. **Footer** — Attribution, last-refreshed timestamp, article count

**Section color coding:**

| Section | Color |
|---------|-------|
| Authors & AI | `#3b82f6` (blue) |
| Publishing Contracts | `#22c55e` (green) |
| AI Audio | `#a855f7` (purple) |
| Interactive Storytelling | `#f97316` (orange) |
| EU/UK Regulation | `#ef4444` (red) |

**States:** Loading (spinner), Error (setup instructions if API key missing), Digest (content)

**Responsive:** Single-column layout below 640px; stacked meta fields on mobile.

### 5.8 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEWS_API_KEY` | Yes | API key from newsapi.org |
| `PORT` | No | Server port (default: `3000`) |

### 5.9 Commands

```bash
npm install         # Install dependencies
npm start           # Run server (tsx src/index.ts)
npm run dev         # Run with file watching
npm run build       # Compile TypeScript to dist/
npm run lint        # ESLint check
```

---

## 6. Deliverable B — n8n Workflow

### 6.1 Workflow File

`ai-publishing-digest-workflow.json` — importable into any n8n instance.

### 6.2 Node Pipeline

```
Daily Schedule (7:00 AM UTC)
  └─> Pull AI Publishing News (HTTP Request → NewsAPI /everything)
        └─> AI News Curator (LangChain Agent)
              ├── OpenAI Chat Model (GPT-4o) ← ai_languageModel connection
              └─> Subscriber List (Google Sheets)
                    └─> Send Digest (Gmail)
```

### 6.3 Node Details

| Node | Type | Purpose |
|------|------|---------|
| **Daily Schedule** | `scheduleTrigger` | Fires once daily at 7:00 AM UTC |
| **Pull AI Publishing News** | `httpRequest` | Fetches from NewsAPI `/everything` with the same 12-term OR query and 7-day window |
| **AI News Curator** | `langchain.agent` | Processes all articles through a structured prompt that enforces the exact output format from the content spec |
| **OpenAI Chat Model** | `langchain.lmChatOpenAi` | GPT-4o for categorization and summarization quality |
| **Subscriber List** | `googleSheets` | Reads Name + Email columns from a Google Sheet |
| **Send Digest** | `gmail` | Sends personalized plain-text email per subscriber |

### 6.4 AI Prompt Behavior

The AI News Curator agent receives all articles as structured JSON and is instructed to:

1. Produce `Headlines (Yesterday)` — 6-10 one-liners with links
2. Write concise bullets under each of the 5 category headings
3. Integrate EU/UK regulation items into the most relevant section
4. Follow freshness rules (yesterday first, then "Earlier coverage" grouped by month)
5. End with `AI News Ticker (Ultra-Fresh)` — 3-7 breaking bullets or the "no updates" fallback
6. Maintain professional, fact-based tone with no hype or speculation
7. Always include hyperlinks to original reporting

### 6.5 Email Output

| Field | Value |
|-------|-------|
| **Subject** | `AI & Publishing Daily Digest — {Month Day, Year}` |
| **Body** | Personalized greeting + full AI-generated digest + subscription footer |
| **Format** | Plain text |

### 6.6 Credentials Required

| Credential | Service | Purpose |
|------------|---------|---------|
| NewsAPI Key | newsapi.org | Article fetching (replace `NEWS_API_KEY` placeholder in query params) |
| OpenAI API Key | OpenAI | GPT-4o summarization |
| Google Sheets OAuth2 | Google | Subscriber list access |
| Gmail OAuth2 | Google | Email delivery |

### 6.7 Google Sheets Schema

| Column | Description |
|--------|-------------|
| `Name` | Subscriber's name (used in email greeting) |
| `Email` | Recipient email address |

---

## 7. Shared Search Query

Both deliverables use the identical NewsAPI search query:

```
"AI author" OR "AI writing" OR "AI publishing" OR "AI audiobook"
OR "AI narration" OR "AI copyright" OR "interactive storytelling"
OR "EU AI Act" OR "book adaptation" OR "AI editing"
OR "Audible AI" OR "AI audio platform"
```

---

## 8. Tone & Style

- Professional, reader-friendly, fact-based
- No hype, no speculation
- Always link to original reporting
- Emoji section headers for scanability
- Article descriptions clamped to 2 lines in the web app

---

## 9. Non-Functional Requirements

| Requirement | Detail |
|-------------|--------|
| **Availability** | Web app runs on Replit; n8n workflow runs on any n8n instance |
| **Latency** | Web app API response depends on NewsAPI (~1-3s typical) |
| **Rate limits** | NewsAPI free tier: 100 requests/day, 100 articles/request |
| **Security** | API key stored as environment variable (Replit Secret), never committed to source; HTML output uses `escapeHtml` to prevent XSS |
| **Responsiveness** | Web app responsive down to 320px viewport width |
| **Browser support** | Modern evergreen browsers (Chrome, Firefox, Safari, Edge) |

---

## 10. Future Considerations

These are not in scope for v1.0 but noted for potential iteration:

- **AI summarization in web app** — Add an OpenAI integration to generate prose summaries alongside raw articles
- **Additional news sources** — Supplement NewsAPI with RSS feeds, Google News, or specialized publishing outlets
- **HTML email** — Switch n8n workflow from plain text to rich HTML for better link rendering
- **Filtering and search** — Let users filter by section, date range, or keyword in the web app
- **Slack/Teams delivery** — Add notification channel options beyond email
- **Subscriber self-service** — Add/remove from email list via a web form
- **Caching** — Cache API responses to reduce NewsAPI rate limit usage
- **Category refinement** — Use NLP/embeddings for more accurate categorization beyond keyword matching
- **Analytics** — Track open rates, click-through, and section engagement

---

## 11. Project Structure

```
russian-narrator-app/
├── src/
│   ├── index.ts                        # Express server entry point
│   ├── services/
│   │   └── news-service.ts             # NewsAPI fetch + categorization
│   └── types/
│       └── index.ts                    # TypeScript interfaces
├── public/
│   ├── index.html                      # Frontend shell
│   ├── styles.css                      # Dark-theme responsive styles
│   └── app.js                          # Client-side rendering
├── docs/
│   └── PRD.md                          # This document
├── ai-publishing-digest-workflow.json  # n8n workflow (importable)
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
├── .replit                             # Replit run configuration
├── .gitignore                          # node_modules, dist, .env
└── CLAUDE.md                           # AI assistant guidelines
```
