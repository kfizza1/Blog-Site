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

    function saveArticles(articles) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    }

    function formatDate(iso) {
      return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    function formatDateShort(iso) {
      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // ── VIEWS ──
    function showView(name) {
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.getElementById('view-' + name).classList.add('active');
      window.scrollTo(0, 0);
    }

    // ── RENDER HOME ──
    function renderHome() {
      const articles = loadArticles();
      const featured = articles[0];
      const section = document.getElementById('featured-section');

      if (!featured) {
        section.innerHTML = `<div class="empty-state"><h2>No articles yet</h2><p>Click "Write your own" to publish your first article.</p></div>`;
        return;
      }

      const imgSrc = featured.cover || `https://picsum.photos/seed/${featured.id}/800/1000`;

      section.innerHTML = `
        <div class="featured-cover" onclick="openArticle('${featured.id}')">
          <img src="${imgSrc}" alt="${escHtml(featured.title)}" />
          <div class="featured-cover-overlay"></div>
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            Delete
          </button>
          <div class="featured-cover-body">
            <div>
              <span class="badge-latest">Latest</span>
              <span class="featured-date">${formatDateShort(featured.date)}</span>
            </div>
            <h2 class="featured-title">${escHtml(featured.title)}</h2>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="featured-author">${escHtml(featured.author)}</span>
              <span class="featured-read-arrow">Read article &#8594;</span>
            </div>
          </div>
        </div>

        <div class="featured-preview">
          <p class="featured-preview-excerpt">${escHtml(featured.excerpt)}</p>
          <div class="featured-preview-content">${escHtml(featured.content)}</div>
          <div class="featured-preview-footer" style="display:flex; gap:0.75rem; align-items:center;">
            <button class="btn btn-outline" onclick="openArticle('${featured.id}')">Continue reading</button>
            <button class="btn-delete" onclick="deleteArticle('${featured.id}', event)">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              Delete article
            </button>
          </div>
        </div>
      `;
    }

    // ── OPEN ARTICLE ──
    function openArticle(id) {
      const articles = loadArticles();
      const article = articles.find(a => a.id === id);
      if (!article) return;

      const imgSrc = article.cover || `https://picsum.photos/seed/${article.id}/1200/600`;
      document.getElementById('read-hero-img').src = imgSrc;
      document.getElementById('read-hero-img').alt = article.title;
      document.getElementById('read-author').textContent = article.author;
      document.getElementById('read-date').textContent = formatDate(article.date);
      document.getElementById('read-title').textContent = article.title;
      document.getElementById('read-body').textContent = article.content;

      showView('read');
    }

    // ── SEARCH ──
    function onSearch(query) {
      const featured = document.getElementById('featured-section');
      const results  = document.getElementById('search-results');

      if (!query.trim()) {
        featured.style.display = '';
        results.style.display = 'none';
        return;
      }

      featured.style.display = 'none';
      results.style.display = '';

      const articles = loadArticles();
      const q = query.toLowerCase();
      const matches = articles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        results.innerHTML = `<h2>Search Results</h2><div class="empty-state"><p>No articles found for "<strong>${escHtml(query)}</strong>".</p></div>`;
        return;
      }

      results.innerHTML = `<h2>Search Results</h2>` + matches.map(a => `
        <div class="article-card" onclick="openArticle('${a.id}')">
          <div class="article-card-meta">
            <span>${formatDateShort(a.date)}</span>
            <span>${escHtml(a.author)}</span>
            <button class="btn-delete" style="margin-left:auto;" onclick="deleteArticle('${a.id}', event)">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              Delete
            </button>
          </div>
          <h3>${escHtml(a.title)}</h3>
          <p>${escHtml(a.excerpt)}</p>
        </div>
      `).join('');
    }

    // ── PUBLISH ──
    function publishArticle(e) {
      e.preventDefault();

      const title   = document.getElementById('input-title').value.trim();
      const author  = document.getElementById('input-author').value.trim();
      const cover   = document.getElementById('input-cover').value.trim();
      const excerpt = document.getElementById('input-excerpt').value.trim();
      const content = document.getElementById('input-content').value.trim();

      if (!title || !author || !excerpt || !content) return;

      const newArticle = {
        id: Date.now().toString(),
        title,
        author,
        cover: cover || null,
        excerpt,
        content,
        date: new Date().toISOString()
      };

      const articles = loadArticles();
      articles.unshift(newArticle);
      saveArticles(articles);

      // Reset form
      e.target.reset();

      // Go back home and re-render with the new featured article
      renderHome();
      showView('home');
    }

    // ── DELETE ──
    function deleteArticle(id, event) {
      event.stopPropagation();
      if (!confirm('Delete this article? This cannot be undone.')) return;
      const articles = loadArticles().filter(a => a.id !== id);
      saveArticles(articles);
      const query = document.getElementById('search-input').value;
      if (query.trim()) {
        onSearch(query);
      } else {
        renderHome();
      }
    }

    // ── UTILS ──
    function escHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    // ── INIT ──
    renderHome();