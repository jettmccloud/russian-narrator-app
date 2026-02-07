const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function monthYearKey(dateStr) {
  const d = new Date(dateStr);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderHeadlines(headlines) {
  const container = document.getElementById('headlines-list');
  if (!headlines.length) {
    container.innerHTML = '<p class="empty-section">No headlines from yesterday.</p>';
    return;
  }
  container.innerHTML = headlines.map((a) => `
    <div class="headline-item">
      <a href="${escapeHtml(a.url)}" target="_blank" rel="noopener">${escapeHtml(a.title)}</a>
      <span class="headline-source">${escapeHtml(a.source.name)}</span>
    </div>
  `).join('');
}

function renderArticleCard(article) {
  return `
    <div class="article-card">
      <a href="${escapeHtml(article.url)}" target="_blank" rel="noopener">${escapeHtml(article.title)}</a>
      <div class="article-meta">
        <span>${escapeHtml(article.source.name)}</span>
        <span>${formatDate(article.publishedAt)}</span>
        ${article.author ? `<span>${escapeHtml(article.author)}</span>` : ''}
      </div>
      ${article.description ? `<p class="article-description">${escapeHtml(article.description)}</p>` : ''}
    </div>
  `;
}

function groupByMonth(articles) {
  const groups = new Map();
  for (const a of articles) {
    const key = monthYearKey(a.publishedAt);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(a);
  }
  return groups;
}

function renderSection(section) {
  const tagClass = `tag-${section.id}`;
  const hasYesterday = section.yesterdayArticles.length > 0;
  const hasEarlier = section.earlierArticles.length > 0;

  if (!hasYesterday && !hasEarlier) {
    return `
      <div class="category-section">
        <h2><span class="section-tag ${tagClass}"></span>${section.title}</h2>
        <p class="empty-section">No stories found for this category in the past week.</p>
      </div>
    `;
  }

  let html = `
    <div class="category-section">
      <h2><span class="section-tag ${tagClass}"></span>${section.title}</h2>
  `;

  if (hasYesterday) {
    html += `<div class="articles-grid">${section.yesterdayArticles.map(renderArticleCard).join('')}</div>`;
  }

  if (hasEarlier) {
    html += '<p class="earlier-label">Earlier coverage</p>';
    const months = groupByMonth(section.earlierArticles);
    for (const [month, articles] of months) {
      html += `<p class="month-label">${escapeHtml(month)}</p>`;
      html += `<div class="articles-grid">${articles.map(renderArticleCard).join('')}</div>`;
    }
  }

  html += '</div>';
  return html;
}

function renderTicker(ticker) {
  const container = document.getElementById('ticker-list');
  if (!ticker.length) {
    container.innerHTML = '<p class="empty-section">No major breaking updates in the last 12 hours.</p>';
    return;
  }
  container.innerHTML = ticker.map((a) => `
    <div class="ticker-item">
      <a href="${escapeHtml(a.url)}" target="_blank" rel="noopener">${escapeHtml(a.title)}</a>
      <span class="headline-source">${escapeHtml(a.source.name)}</span>
    </div>
  `).join('');
}

function showLoading() {
  document.getElementById('loading').hidden = false;
  document.getElementById('error').hidden = true;
  document.getElementById('digest').hidden = true;
}

function showError(message, isConfig) {
  document.getElementById('loading').hidden = true;
  document.getElementById('error').hidden = false;
  document.getElementById('digest').hidden = true;
  document.getElementById('error-message').textContent = message;
  document.getElementById('setup-instructions').hidden = !isConfig;
}

function showDigest(data) {
  document.getElementById('loading').hidden = true;
  document.getElementById('error').hidden = true;
  document.getElementById('digest').hidden = false;

  document.getElementById('digest-date').textContent = formatDate(data.date);
  renderHeadlines(data.headlines);

  const sectionsContainer = document.getElementById('category-sections');
  sectionsContainer.innerHTML = data.sections.map(renderSection).join('');

  renderTicker(data.ticker);

  document.getElementById('last-refreshed').textContent = new Date().toLocaleTimeString();
  document.getElementById('article-count').textContent = `${data.totalArticles} articles indexed`;
}

async function fetchDigest() {
  const btn = document.getElementById('refresh-btn');
  btn.disabled = true;
  showLoading();

  try {
    const res = await fetch('/api/digest');
    const data = await res.json();

    if (!res.ok) {
      showError(data.error || 'Failed to fetch digest', data.configNeeded);
      return;
    }

    showDigest(data);
  } catch (err) {
    showError('Network error — could not reach the server.', false);
  } finally {
    btn.disabled = false;
  }
}

document.getElementById('refresh-btn').addEventListener('click', fetchDigest);
fetchDigest();
