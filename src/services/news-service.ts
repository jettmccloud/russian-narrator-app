import { Article, CategorizedDigest, DigestSection } from '../types';

const NEWS_API_BASE = 'https://newsapi.org/v2/everything';

const SEARCH_QUERY = [
  '"AI author"',
  '"AI writing"',
  '"AI publishing"',
  '"AI audiobook"',
  '"AI narration"',
  '"AI copyright"',
  '"interactive storytelling"',
  '"EU AI Act"',
  '"book adaptation"',
  '"AI editing"',
  '"Audible AI"',
  '"AI audio platform"',
].join(' OR ');

interface CategoryDef {
  id: string;
  title: string;
  keywords: string[];
}

const CATEGORIES: CategoryDef[] = [
  {
    id: 'authors-ai',
    title: '\u{1F4DA} Authors & AI',
    keywords: [
      'author', 'writing', 'writer', 'drafting', 'proofreading',
      'editing tool', 'manuscript', 'novelist', 'ai writing',
      'ghostwrit', 'plagiarism', 'ai-generated text',
    ],
  },
  {
    id: 'publishing-contracts',
    title: '\u{1F4C4} Publishing Contracts & Guidelines',
    keywords: [
      'publishing contract', 'guideline', 'clause', 'training rights',
      'disclosure', 'license agreement', 'copyright', 'intellectual property',
      'opt-out', 'compensation', 'collective management',
    ],
  },
  {
    id: 'ai-audio',
    title: '\u{1F3A7} AI Audio & Platform Policy',
    keywords: [
      'audiobook', 'narration', 'audible', 'suno', 'udio',
      'audio platform', 'music licensing', 'voice clone',
      'text-to-speech', 'ai voice', 'synthetic voice', 'ai audio',
    ],
  },
  {
    id: 'interactive-storytelling',
    title: '\u{1F3AE}\u{1F4FD}\uFE0F Interactive Storytelling & Adaptations',
    keywords: [
      'book-to-game', 'book-to-movie', 'adaptation', 'interactive fiction',
      'interactive storytelling', 'choice-based', 'game narrative',
      'cross-media', 'transmedia', 'book-to-tv', 'streaming deal',
    ],
  },
  {
    id: 'eu-uk-regulation',
    title: '\u{1F1EA}\u{1F1FA}\u{1F1EC}\u{1F1E7} Europe/UK Regulation & Rights',
    keywords: [
      'eu ai act', 'uk ai', 'cma', 'digital services act', 'dmcc',
      'scraping', 'data mining', 'regulation', 'european commission',
      'rights marketplace', 'licensing marketplace',
    ],
  },
];

function getDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function categorizeArticle(article: Article): string {
  const text = `${article.title} ${article.description || ''}`.toLowerCase();

  for (const cat of CATEGORIES) {
    if (cat.keywords.some((kw) => text.includes(kw.toLowerCase()))) {
      return cat.id;
    }
  }

  if (text.includes('ai') && (text.includes('publish') || text.includes('book'))) {
    return 'publishing-contracts';
  }

  return 'authors-ai';
}

export async function fetchAndCategorizeNews(): Promise<CategorizedDigest> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error('NEWS_API_KEY environment variable is not set');
  }

  const from = getDateString(7);
  const to = getDateString(0);
  const yesterday = getDateString(1);

  const params = new URLSearchParams({
    q: SEARCH_QUERY,
    from,
    to,
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '100',
    apiKey,
  });

  const url = `${NEWS_API_BASE}?${params.toString()}`;
  const response = await fetch(url);
  const data = (await response.json()) as {
    status: string;
    message?: string;
    articles?: Article[];
  };

  if (data.status !== 'ok') {
    throw new Error(data.message || 'NewsAPI request failed');
  }

  const articles: Article[] = (data.articles || []).filter(
    (a) => a.title && a.title !== '[Removed]'
  );

  const sections: DigestSection[] = CATEGORIES.map((cat) => ({
    id: cat.id,
    title: cat.title,
    yesterdayArticles: [],
    earlierArticles: [],
  }));

  const sectionMap = new Map(sections.map((s) => [s.id, s]));

  for (const article of articles) {
    const categoryId = categorizeArticle(article);
    const section = sectionMap.get(categoryId);
    if (!section) continue;

    const pubDate = article.publishedAt?.split('T')[0];
    if (pubDate === yesterday) {
      section.yesterdayArticles.push(article);
    } else {
      section.earlierArticles.push(article);
    }
  }

  const allYesterday = articles.filter(
    (a) => a.publishedAt?.split('T')[0] === yesterday
  );

  return {
    date: yesterday,
    headlines: allYesterday.slice(0, 10),
    sections,
    totalArticles: articles.length,
    ticker: allYesterday.slice(0, 7),
  };
}
