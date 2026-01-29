# Product Requirements Document (PRD)

## Amazon Author Visibility Guide

### *Strategies to Get Your Book Discovered by the Right Readers*

---

## 1. Overview

### 1.1 Product Summary

A web and mobile application that serves as a comprehensive, data-informed guide for authors — particularly self-published and indie authors — to understand, navigate, and optimize their visibility on Amazon's book marketplace. The app combines education (how Amazon's algorithms work), actionable tooling (rank tracking, keyword research, category analysis), and personalized strategy recommendations to help authors get their books discovered by the right readers.

### 1.2 Problem Statement

Amazon sells over 50% of all books in the U.S. and is the primary discovery platform for readers. Yet most authors — especially self-published ones — have little understanding of how Amazon's interconnected algorithms (search, BSR, recommendations, ads) determine which books get seen. Authors currently must:

- Piece together fragmented advice from blogs, YouTube, and forums
- Pay for multiple disconnected third-party tools (Publisher Rocket, BookBeam, KDPWizard, etc.)
- React to algorithm changes they learn about weeks or months late
- Guess at category selection, keyword strategy, and pricing decisions
- Have no unified view of how their visibility levers interact

This app consolidates algorithmic education, real-time market intelligence, and personalized action plans into a single platform.

### 1.3 Target Users

| Persona | Description | Key Needs |
|---------|-------------|-----------|
| **New Self-Published Author** | First-time KDP publisher, limited marketing knowledge | Step-by-step guidance, education-first experience, launch planning |
| **Experienced Indie Author** | Multiple titles published, understands basics, wants optimization | Rank tracking, competitive analysis, advanced keyword/category strategy |
| **Hybrid Author** | Traditionally published + self-published titles | Cross-format visibility, understanding how trad and indie titles interact on Amazon |
| **Author Entrepreneur** | Treats publishing as a business, 10+ titles, series-focused | Portfolio analytics, series read-through tracking, ROI on marketing spend |

### 1.4 Success Metrics

| Metric | Target | Timeframe |
|--------|--------|-----------|
| Monthly Active Users (MAU) | 10,000 | 6 months post-launch |
| User retention (30-day) | 40% | 6 months post-launch |
| NPS score | > 50 | Ongoing |
| Avg. user BSR improvement | 20% improvement within 90 days of using the app | Measured at 6 months |
| Conversion to paid tier | 8% of free users | Ongoing |

---

## 2. Amazon Algorithm Education Module

### 2.1 Purpose

Provide authors with a clear, always-current understanding of how Amazon's book discovery systems work — demystifying the algorithms so authors can make informed decisions rather than guessing or following outdated advice.

### 2.2 Core Content Areas

#### 2.2.1 Algorithm Explainers

Interactive, visual guides explaining each of Amazon's interconnected systems:

| Algorithm | What It Controls | Key Factors Explained |
|-----------|-----------------|----------------------|
| **Best Sellers Rank (BSR)** | Bestseller lists, "Best Seller" badge | Sales velocity, recency weighting (1–3 hr > 24 hr > 7 day > 30 day), KU borrows, relative ranking |
| **A9/A10 Search Algorithm** | Search result ordering when a reader types a query | Keywords (title, subtitle, 7 backend slots, description), conversion rate, sales history, reviews, relevance |
| **COSMO Personalization** | What each individual reader sees | Reader purchase history, browsing behavior, personalized ranking — same book ranks differently for different people |
| **Recommendation Engine** | "Customers also bought," "Recommended for you" emails | Co-purchase patterns, also-viewed data, category adjacency, series read-through |
| **New Release Algorithm** | "Hot New Releases" list, new release boost | 30–90 day boost window, first-30-day performance (40–50% of 90-day trajectory), pre-order stacking |
| **Category Ranking** | Category-specific bestseller lists | Category-relative sales, category competition level, Amazon's placement decisions |

Each explainer includes:

- **Visual diagrams** showing how inputs flow to ranking outputs
- **Concrete examples** (e.g., "Book A sells 10 copies at 2 PM, Book B sold 50 copies yesterday — Book A may temporarily outrank Book B because recency is weighted more heavily")
- **Common myths debunked** with evidence
- **"What changed" changelog** tracking recent algorithm shifts

#### 2.2.2 Algorithm Change Tracker

A feed of confirmed and suspected algorithm changes with:

- Date of change
- What was affected (BSR calculation, search ranking, category rules, etc.)
- Evidence/source (data patterns, Amazon announcements, community reports)
- Impact assessment (high/medium/low)
- Recommended author actions

Recent examples the tracker would cover:

- Rolling average for bestseller charts (no more hourly #1 snapshots)
- External traffic now weighted more heavily than internal Amazon discovery
- Read-through / series sell-through rewarded in ranking
- Category selection reduced to 3, Amazon controls final placement
- 6-day ranking update lag
- AI content disclosure requirement
- 3-book-per-day upload cap

#### 2.2.3 BSR-to-Sales Reference

Interactive calculator and reference table:

- Input a BSR → get estimated daily/weekly/monthly sales
- Input a sales target → get the BSR you need to hit
- Filter by category (Romance, Thriller, Nonfiction, etc.) since competition varies dramatically
- "Rule of 15" calculator: monthly sales ÷ 15 = daily sales needed for equivalent rank
- Historical BSR tracking: "What did BSR #5,000 mean in sales 6 months ago vs. today?"

#### 2.2.4 Policy & Compliance Center

Always-current reference for Amazon's rules:

- **Review policy**: What's allowed (ARC reviews, honest reader reviews) vs. prohibited (paid reviews, incentivized reviews, review swaps). Specific examples of enforcement actions.
- **Category rules**: 3-category limit, no change requests, Amazon controls final placement, companion guide ban.
- **AI disclosure**: What requires disclosure (AI-generated text, images, translations) vs. what doesn't (grammar tools, brainstorming). Consequences of non-disclosure.
- **Identity verification**: Requirements, accepted IDs, pen name rules, business entity rules.
- **Advertising policies**: Amazon Ads terms, prohibited claims, keyword bidding rules.
- **Content guidelines**: What gets books rejected or removed.

Each policy includes:

- Plain-language summary
- Exact Amazon source link
- Real-world examples of violations and consequences
- "Last verified" date

---

## 3. Visibility Strategy Engine

### 3.1 Purpose

Move beyond education into personalized, actionable strategy. Based on the author's specific books, goals, genre, and stage, the app generates and tracks a tailored visibility plan.

### 3.2 Features

#### 3.2.1 Author Profile & Book Intake

When onboarding, the author provides:

- **ASIN(s)** or book title(s) for existing books (app pulls metadata from Amazon)
- **Genre/category** preferences
- **Publishing stage**: pre-launch, launch window (first 30 days), post-launch optimization, backlist revival
- **Goals**: first book visibility, series read-through, category bestseller, overall BSR target, revenue target
- **Budget**: none, low ($0–$100/mo), medium ($100–$500/mo), high ($500+/mo)
- **Marketing channels available**: email list (size), social media (platforms + follower counts), blog/website, podcast, newsletter swaps, ARC team size

#### 3.2.2 Personalized Strategy Dashboard

Based on the author profile, the app generates a prioritized action plan. Example output for a new romance author launching their first book:

```
YOUR 90-DAY VISIBILITY PLAN
============================

Priority 1: LAUNCH WINDOW (Days 1–30) — Critical Period
  ☐ Optimize metadata (title, subtitle, 7 keywords, description)
  ☐ Select 3 categories (app recommends based on competition analysis)
  ☐ Set price at $3.99 (genre-optimized recommendation)
  ☐ Enroll in KDP Select for Kindle Unlimited visibility
  ☐ Coordinate ARC team reviews (target: 20 reviews in first week)
  ☐ Run Amazon Ads campaign (suggested keywords provided)
  ☐ Drive external traffic from email list + social (algorithm bonus)
  ☐ Schedule 2 newsletter swaps with comparable authors

Priority 2: SUSTAINED VELOCITY (Days 31–60)
  ☐ Monitor BSR daily — target: maintain sub-20,000
  ☐ Run Kindle Countdown Deal on day 35
  ☐ Increase Amazon Ads budget based on ACoS data
  ☐ Solicit 2nd wave of reviews (target: 50 total)
  ☐ Evaluate category performance — are you in the right 3?

Priority 3: LONG-TAIL OPTIMIZATION (Days 61–90)
  ☐ Analyze which keywords drive discovery
  ☐ A/B test book description
  ☐ Plan Book 2 announcement to existing readers
  ☐ Review read-through data if series
  ☐ Assess ROI on ad spend vs. organic discovery
```

Each action item includes:

- **Why it matters** (linked to specific algorithm behavior)
- **How to do it** (step-by-step instructions)
- **Expected impact** (high/medium/low)
- **Deadline** (relative to launch date)

#### 3.2.3 Category Intelligence

- **Category browser**: Explore all 19,000+ Amazon book categories
- **Competition score**: For each category, show estimated sales needed to rank #1, #5, #10, #20
- **Category recommendations**: Based on the book's metadata and comparable titles, suggest the 3 best categories
- **"Hidden gem" categories**: Low-competition categories that are still relevant to the book's content
- **Category bestseller tracking**: Monitor the top 20 in any category over time

#### 3.2.4 Keyword Research & Optimization

- **Keyword discovery**: Generate keyword suggestions based on genre, comp titles, and reader search behavior
- **Search volume estimates**: Relative popularity of each keyword on Amazon
- **Competition analysis**: How many books target this keyword, and how strong are they
- **Keyword scorecard**: Rate the author's current 7 backend keywords + title/subtitle keywords
- **Suggestions engine**: "Replace keyword X with keyword Y — Y has 3x the search volume with similar competition"

#### 3.2.5 Pricing Strategy Advisor

- **Genre benchmarks**: Show price distribution for top-selling books in the author's category
- **Royalty calculator**: Compare 35% vs. 70% royalty tiers at different price points
- **Price elasticity guidance**: "In your category, books priced $3.99–$4.99 convert 22% better than books at $2.99"
- **Promotion planner**: When to run Kindle Countdown Deals, Free promotions, and price drops for maximum rank impact

---

## 4. Analytics & Tracking Dashboard

### 4.1 Purpose

Give authors visibility into their book's performance with more context and actionable insight than Amazon's native KDP dashboard provides.

### 4.2 Features

#### 4.2.1 BSR Tracker

- **Real-time BSR monitoring** for all of the author's books (overall + per category)
- **Historical BSR charts**: Visualize rank over days, weeks, months
- **BSR-to-estimated-sales conversion**: See estimated daily sales alongside BSR
- **Event overlay**: Mark launch dates, promotions, ad campaigns, and external traffic pushes on the chart to correlate actions with rank movement
- **Alerts**: Notify author when BSR crosses a threshold (e.g., "Your book dropped below #10,000 — you're now in the top tier")

#### 4.2.2 Review Monitor

- **Review count and average rating** tracked over time
- **New review alerts** with full text
- **Sentiment analysis**: Aggregate reader sentiment from review text (what do readers love/dislike?)
- **Review velocity tracking**: Reviews per week trend
- **Milestone alerts**: "You've hit 50 reviews — this is the threshold where Amazon's recommendation engine gives your book significantly more visibility"

#### 4.2.3 Competitor Tracking

- **Track up to 10 competitor books** (comp titles)
- **Side-by-side comparison**: BSR, review count, price, category ranking
- **Competitor alerts**: "A comp title just dropped price to $0.99 — they may be running a promotion"
- **Keyword overlap analysis**: Which keywords do you share with competitors? Where are the gaps?

#### 4.2.4 Series Read-Through Analytics

For series authors:

- **Sell-through rate**: What % of Book 1 buyers go on to buy Book 2, Book 3, etc.
- **Read-through (KU)**: KENP read data across the series
- **Revenue per reader**: Estimate total series revenue per reader acquired
- **Drop-off analysis**: "42% of readers drop off between Book 2 and Book 3 — consider a cliffhanger or stronger book 2 ending"
- **Series BSR correlation**: How Book 1 promotions affect the rest of the series

#### 4.2.5 Advertising ROI Tracker

- **Amazon Ads integration**: Pull spend, impressions, clicks, and sales data
- **ACoS (Advertising Cost of Sales)** tracking with recommendations
- **Organic vs. paid sales breakdown**: Estimate how much of your rank comes from ads vs. organic
- **Keyword-level ad performance**: Which ad keywords convert to sales?
- **Budget recommendation**: "Based on your ACoS, increasing daily budget from $10 to $15 would likely yield X additional sales/day"

---

## 5. Launch Planner

### 5.1 Purpose

A dedicated module for the most critical phase of a book's lifecycle — the first 30–90 days — where algorithm behavior disproportionately rewards strong starts.

### 5.2 Features

#### 5.2.1 Pre-Launch Checklist (T-minus 90 to T-0)

Interactive checklist with timeline:

**T-90 days:**
- Set up pre-order on KDP (pre-orders count on order date, boosting pre-launch BSR)
- Begin building ARC team
- Research and finalize categories and keywords

**T-60 days:**
- Finalize cover design (app provides genre-specific cover benchmarks)
- Write and optimize book description (A+ Content if eligible)
- Set up Author Central page
- Begin social media / newsletter pre-promotion

**T-30 days:**
- Send ARCs to review team
- Schedule newsletter swaps and cross-promotions
- Set up Amazon Ads campaign (paused, ready to launch)
- Prepare email sequence for launch week

**T-7 days:**
- Final keyword and category review
- Verify all metadata is correct
- Confirm ARC team is ready to post reviews on launch day

**Launch Day (T-0):**
- Activate Amazon Ads
- Send email blast to list
- Post on all social channels
- Drive all external traffic to Amazon (algorithm bonus for external traffic)
- Monitor BSR hourly

#### 5.2.2 Launch Day Dashboard

A real-time view on launch day showing:

- Live BSR (updated as frequently as Amazon allows)
- Estimated sales count
- Review count (goal: 10–20 on day 1)
- Category ranking position
- Comparison to launch-day benchmarks for the genre

#### 5.2.3 Post-Launch Analysis

After 30 days, automatically generate a report:

- BSR trajectory vs. genre benchmark
- Review velocity vs. target
- Keyword performance (which keywords drove discovery)
- Ad spend ROI
- Recommendations for days 31–90

---

## 6. Content & Community

### 6.1 Knowledge Base

- **Written guides**: Deep-dive articles on each algorithm, strategy, and tool
- **Video tutorials**: Walkthroughs of KDP dashboard, Amazon Ads, Author Central, A+ Content
- **Case studies**: Real author stories — "How I went from BSR #500,000 to #5,000 in 60 days"
- **Glossary**: BSR, KENP, ACoS, ASIN, KDP Select, A+ Content, etc.

### 6.2 Algorithm Change Alerts

Push notifications and email alerts when:

- Amazon announces a policy change
- Community detects a suspected algorithm shift
- New KDP features or tools are released
- Relevant FTC or regulatory changes occur

### 6.3 Author Community Forum

- **Genre-specific channels**: Romance authors, thriller authors, nonfiction authors, etc.
- **Strategy discussions**: Share what's working, ask questions
- **Comp title matching**: Find authors in your genre for newsletter swaps and cross-promotion
- **Moderation**: No promotion of black-hat tactics (paid reviews, category manipulation, etc.)

---

## 7. Technical Architecture

### 7.1 Platform

| Component | Technology |
|-----------|-----------|
| **Frontend (Web)** | React / Next.js with TypeScript |
| **Frontend (Mobile)** | React Native (iOS + Android) |
| **Backend API** | Node.js / Express or Fastify, TypeScript |
| **Database** | PostgreSQL (relational data: users, books, strategies) + TimescaleDB extension (time-series: BSR history, sales estimates) |
| **Cache** | Redis (API response caching, rate limit management) |
| **Search** | Elasticsearch (keyword research, category browsing) |
| **Queue** | Bull/BullMQ with Redis (background data collection jobs) |
| **Auth** | OAuth 2.0 (Google, Apple, email/password) |
| **Hosting** | AWS (ECS/Fargate for API, CloudFront + S3 for frontend, RDS for database) |
| **CI/CD** | GitHub Actions |
| **Monitoring** | Datadog or Grafana + Prometheus |

### 7.2 Data Collection

#### 7.2.1 Amazon Product Data

- **Method**: Amazon Product Advertising API (PA-API 5.0) for authorized data access; supplemented by scheduled scraping within Amazon's Terms of Service for data not available via API
- **Data collected**: BSR, price, review count, average rating, category placement, metadata (title, author, description, keywords where available)
- **Frequency**: BSR and price checked every 2 hours for tracked books; metadata refreshed daily
- **Storage**: Time-series BSR data retained for 2 years; metadata snapshots retained indefinitely

#### 7.2.2 Keyword & Category Data

- **Category taxonomy**: Full Amazon book category tree, refreshed weekly
- **Keyword search volume**: Estimated via Amazon autocomplete API + PA-API search result counts
- **Competition scoring**: Based on number of results, average BSR of top results, review counts of top results

#### 7.2.3 User-Provided Data

- KDP sales reports (CSV upload or manual entry — no KDP API access available)
- Amazon Ads reports (CSV upload or Amazon Ads API integration)
- ARC team management data
- Marketing calendar events

### 7.3 Data Privacy & Compliance

- All user data encrypted at rest (AES-256) and in transit (TLS 1.3)
- No storage of Amazon account credentials
- GDPR and CCPA compliant with data export and deletion capabilities
- SOC 2 Type II target within 18 months of launch
- Rate limiting on all Amazon data collection to stay within terms of service

### 7.4 Third-Party Integrations

| Integration | Purpose |
|-------------|---------|
| **Amazon PA-API 5.0** | Book metadata, BSR, pricing, reviews |
| **Amazon Ads API** | Ad campaign performance data |
| **Mailchimp / ConvertKit** | Email list size tracking, newsletter performance |
| **Stripe** | Subscription billing |
| **OpenAI API** | AI-powered book description optimization, keyword suggestions |
| **Google Analytics** | App usage analytics |

---

## 8. Monetization

### 8.1 Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Algorithm education modules, BSR reference table, policy center, community access, 1 book tracked |
| **Starter** | $14.99/mo | Everything in Free + track up to 5 books, keyword research (50 queries/mo), category intelligence, launch checklist, basic analytics |
| **Professional** | $29.99/mo | Everything in Starter + track up to 20 books, unlimited keyword research, competitor tracking (5 comps), series analytics, ad ROI tracker, personalized strategy dashboard |
| **Enterprise** | $59.99/mo | Everything in Professional + track up to 100 books, competitor tracking (20 comps), team accounts (up to 3 users), priority support, API access, white-label reports |

### 8.2 Revenue Projections (Year 1)

| Quarter | Free Users | Paid Users | MRR |
|---------|-----------|-----------|-----|
| Q1 | 3,000 | 150 | $3,375 |
| Q2 | 8,000 | 500 | $11,250 |
| Q3 | 15,000 | 1,200 | $27,000 |
| Q4 | 25,000 | 2,500 | $56,250 |

Assumes 8% free-to-paid conversion, average $22.50 ARPU across paid tiers.

---

## 9. Roadmap

### Phase 1: Foundation (Months 1–3)

**Goal**: Launch MVP with education + basic tracking

- [ ] Algorithm education module (all 6 algorithm explainers)
- [ ] BSR-to-sales calculator
- [ ] Policy & compliance center
- [ ] User accounts and onboarding
- [ ] BSR tracking for 1 book (free tier)
- [ ] Basic keyword research tool
- [ ] Category browser with competition scores
- [ ] Landing page and waitlist

**Launch milestone**: Public beta with free tier

### Phase 2: Strategy & Analytics (Months 4–6)

**Goal**: Add the strategy engine and analytics that justify paid tiers

- [ ] Personalized strategy dashboard
- [ ] Launch planner with checklists
- [ ] Review monitor with sentiment analysis
- [ ] Competitor tracking
- [ ] Pricing strategy advisor
- [ ] Amazon Ads CSV import and ROI tracking
- [ ] Starter and Professional tier billing

**Launch milestone**: Paid tiers live

### Phase 3: Advanced Intelligence (Months 7–9)

**Goal**: Deepen analytics and add community

- [ ] Series read-through analytics
- [ ] Algorithm change tracker (automated + editorial)
- [ ] AI-powered book description optimizer
- [ ] AI-powered keyword suggestions
- [ ] Author community forum
- [ ] Newsletter swap matching
- [ ] Push notification alerts (BSR, reviews, algorithm changes)
- [ ] Enterprise tier with team accounts

**Launch milestone**: Full feature set live

### Phase 4: Scale & Expand (Months 10–12)

**Goal**: Grow user base and expand platform

- [ ] Amazon Ads API direct integration
- [ ] Mobile app (React Native, iOS + Android)
- [ ] Audiobook (ACX) analytics
- [ ] International marketplace support (UK, DE, CA, AU)
- [ ] Author Central integration guide + optimization tool
- [ ] A+ Content templates and best practices
- [ ] Public API for power users
- [ ] Affiliate/referral program

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Amazon API access restricted or rate-limited** | Medium | High | Implement aggressive caching, respect rate limits, diversify data sources, build graceful degradation so app still works with delayed data |
| **Amazon changes algorithm significantly** | High | Medium | Algorithm change tracker is a core feature — turns risk into value. Editorial team monitors and updates content within 48 hours. |
| **Competition from Publisher Rocket, BookBeam, etc.** | High | Medium | Differentiate on education + strategy (competitors are tools-only, not guides). Unified platform vs. point solutions. |
| **Low free-to-paid conversion** | Medium | High | Ensure free tier delivers genuine value to build trust. Paid features must show clear ROI. Consider annual pricing discount. |
| **Amazon ToS changes affecting data collection** | Medium | High | Legal review of all scraping. Prioritize official API. Build relationships with Amazon Ads partner program. |
| **Content accuracy — outdated algorithm info** | Medium | High | Dedicated editorial process. "Last verified" dates on all content. Community reporting of inaccuracies. |
| **Scope creep into ad management tool** | Medium | Low | Stay focused on visibility and strategy. Integrate with Amazon Ads for data, but don't try to replace the Amazon Ads console. |

---

## 11. Competitive Landscape

| Competitor | Strengths | Weaknesses | Our Differentiation |
|-----------|-----------|------------|-------------------|
| **Publisher Rocket** | Strong keyword/category research, one-time purchase ($199) | Desktop-only, no tracking over time, no education, no strategy | We offer ongoing tracking, education, and personalized strategy — not just a research tool |
| **BookBeam** | Sales/royalty tracking, Chrome extension, competitor monitoring | Focused on data display, not actionable strategy | We contextualize data with "what to do about it" |
| **KDPWizard** | Airtable integration, multi-market data | Niche/technical audience, limited marketing guidance | We're accessible to beginners while still powerful for pros |
| **Kindlepreneur blog** | Excellent free content, trusted brand | Blog format — no interactive tools, no personalization | We turn static advice into a dynamic, personalized tool |
| **Amazon KDP Dashboard** | First-party data, free | Minimal analytics, no strategic guidance, no competitor data | We augment KDP's data with context, benchmarks, and recommendations |

---

## 12. Legal & Compliance Considerations

- **Amazon Terms of Service**: All data collection must comply with Amazon's ToS. Use official APIs where available. Legal review required for any supplementary data collection methods.
- **Affiliate disclosure**: If the app links to Amazon products or uses Amazon Associates, proper FTC disclosure is required.
- **No guarantee of results**: All BSR estimates, sales projections, and strategy recommendations must include disclaimers. The app provides guidance, not guarantees.
- **User data**: GDPR and CCPA compliance from day one. Clear privacy policy. No selling of user data.
- **Trademark**: "Amazon," "Kindle," "KDP," and related terms are Amazon trademarks. The app must clearly state it is not affiliated with, endorsed by, or sponsored by Amazon.

---

## 13. Open Questions

1. **KDP data integration**: Should the MVP support CSV upload only, or invest in building an unofficial KDP scraper (higher risk, higher value)?
2. **AI features**: How aggressively should we use AI for description/keyword optimization in Phase 3? Cost implications of OpenAI API at scale.
3. **International priority**: Should Phase 4 international expansion prioritize UK (largest non-US English market) or go multi-market simultaneously?
4. **Community moderation**: In-house moderation team or community-driven moderation with flagging?
5. **Mobile priority**: Is mobile essential for Phase 4, or could a responsive PWA suffice initially?
6. **Partnerships**: Should we pursue partnerships with author communities (20BooksTo50K, SPF conference, Reedsy) for launch distribution?

---

*Document version: 1.0*
*Last updated: 2026-01-29*
*Author: Generated for Russian Narrator App project*
