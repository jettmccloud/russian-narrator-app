export interface Article {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
  urlToImage: string | null;
  author: string | null;
}

export interface DigestSection {
  id: string;
  title: string;
  yesterdayArticles: Article[];
  earlierArticles: Article[];
}

export interface CategorizedDigest {
  date: string;
  headlines: Article[];
  sections: DigestSection[];
  totalArticles: number;
  ticker: Article[];
}

export interface MonthGroup {
  label: string;
  articles: Article[];
}
