import express from 'express';
import path from 'path';
import { fetchAndCategorizeNews } from './services/news-service';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/digest', async (_req, res) => {
  try {
    const digest = await fetchAndCategorizeNews();
    res.json(digest);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const isConfigError = message.includes('NEWS_API_KEY');
    res.status(isConfigError ? 503 : 500).json({
      error: message,
      configNeeded: isConfigError,
    });
  }
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`AI Publishing Digest running at http://localhost:${PORT}`);
});
