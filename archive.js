  const STORAGE_KEY = 'blog_articles';

    const SEED = [
      {
        id: '1',
        title: 'The Art of Noticing',
        content: 'We move through the world so quickly that we often forget to simply look. Noticing is a muscle that must be exercised. When we pay attention to the small details—the way light catches on a coffee cup, the specific cadence of a friend\'s voice, the texture of a leaf—we ground ourselves in the present moment.\n\nWriting is just applied noticing. It is the act of taking what you have seen and translating it into something others can experience. The best writers are not necessarily the ones with the largest vocabularies; they are the ones who pay the closest attention.',
        author: 'Elena Rostova',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        excerpt: 'Noticing is a muscle that must be exercised. When we pay attention to the small details, we ground ourselves in the present moment.',
        cover: 'https://picsum.photos/seed/article1/800/1000'
      },
      {
        id: '2',
        title: 'Quiet Mornings and Strong Coffee',
        content: 'There is a specific quality to the air before 6 AM. It feels untouched, pristine. For years, I considered myself a night owl, staying up past midnight to find the quiet I needed to work. But recently, I have discovered the magic of early mornings.\n\nThe house is still. The streets outside are empty. I make a strong cup of coffee, sit by the window, and just breathe before the demands of the day begin. This time belongs to no one but me. It is a daily sanctuary.',
        author: 'Marcus Chen',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        excerpt: 'There is a specific quality to the air before 6 AM. It feels untouched, pristine.',
        cover: 'https://picsum.photos/seed/article2/800/1000'
      },
      {
        id: '3',
        title: 'On Digital Gardens',
        content: 'A blog used to be a stream of consciousness, sorted reverse-chronologically. But a digital garden is different. It is a place where ideas can be planted, nurtured, and allowed to grow over time.\n\nInstead of publishing finished, polished pieces, you publish raw thoughts. You return to them, edit them, expand upon them. The focus shifts from "performance" to "cultivation". It makes writing online feel less like standing on a stage and more like inviting someone into your study.',
        author: 'Sarah Jenkins',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        excerpt: 'A digital garden is a place where ideas can be planted, nurtured, and allowed to grow over time.',
        cover: 'https://picsum.photos/seed/article3/800/1000'
      }
    ];

    function loadArticles() {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (stored && stored.length > 0) return stored;
      } catch (e) {}
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }

    function formatDate(iso) {
      return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    function formatDateShort(iso) {
      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    let allArticles = loadArticles();

    function renderList(articles) {
      const list = document.getElementById('articles-list');
      if (articles.length === 0) {
        list.innerHTML = `<div class="empty-state"><h2>No articles found</h2><p>Try a different search term.</p></div>`;
        return;
      }
      list.innerHTML = articles.map(a => `
        <div class="archive-card" onclick="openArticle('${a.id}')">
          <div class="archive-card-body">
            <div class="archive-card-meta">
              <span>
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                ${formatDateShort(a.date)}
              </span>
              <span>
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                ${escHtml(a.author)}
              </span>
            </div>
            <h2>${escHtml(a.title)}</h2>
            <p>${escHtml(a.excerpt)}</p>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.75rem; flex-shrink:0;">
            <div class="archive-card-arrow">Read &#8594;</div>
            <button class="btn-delete" onclick="deleteArticle('${a.id}', event)">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              Delete
            </button>
          </div>
        </div>
      `).join('');
    }

    function onSearch(query) {
      const q = query.toLowerCase().trim();
      if (!q) { renderList(allArticles); return; }
      const filtered = allArticles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q)
      );
      renderList(filtered);
    }

    function openArticle(id) {
      const article = allArticles.find(a => a.id === id);
      if (!article) return;

      const img = article.cover || `https://picsum.photos/seed/${article.id}/1200/600`;
      document.getElementById('overlay-img').src = img;
      document.getElementById('overlay-img').alt = article.title;
      document.getElementById('overlay-author').textContent = article.author;
      document.getElementById('overlay-date').textContent = formatDate(article.date);
      document.getElementById('overlay-title').textContent = article.title;
      document.getElementById('overlay-content').textContent = article.content;

      document.getElementById('read-overlay').classList.add('open');
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    }

    function closeOverlay() {
      document.getElementById('read-overlay').classList.remove('open');
      document.body.style.overflow = '';
    }

    function escHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function deleteArticle(id, event) {
      event.stopPropagation();
      if (!confirm('Delete this article? This cannot be undone.')) return;
      allArticles = loadArticles().filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allArticles));
      const query = document.getElementById('search-input').value;
      onSearch(query);
    }

    function refresh() {
      const query = document.getElementById('search-input').value;
      allArticles = loadArticles();
      onSearch(query);
    }

    // Re-render when another tab writes to localStorage (e.g. new article published in index.html)
    window.addEventListener('storage', function(e) {
      if (e.key === STORAGE_KEY) refresh();
    });

    // Re-render when user switches back to this tab
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'visible') refresh();
    });

    // Init
    renderList(allArticles);