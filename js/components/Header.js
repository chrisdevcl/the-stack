const SUN_ICON = `
<svg viewBox="0 0 24 24" aria-hidden="true">
  <circle cx="12" cy="12" r="4"/>
  <line x1="12" y1="2" x2="12" y2="4"/>
  <line x1="12" y1="20" x2="12" y2="22"/>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
  <line x1="2" y1="12" x2="4" y2="12"/>
  <line x1="20" y1="12" x2="22" y2="12"/>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
</svg>`;

const MOON_ICON = `
<svg viewBox="0 0 24 24" aria-hidden="true">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
</svg>`;

export function renderHeader() {
  const header = document.createElement('header');
  header.className = 'site-header';

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  header.innerHTML = `
    <div class="header-inner">
      <div class="header-brand">
        <span class="header-logo" aria-hidden="true">◈</span>
        <div class="header-name">The Stack</div>
      </div>
      <div class="header-right">
        <button class="theme-toggle" id="theme-toggle" aria-label="Cambiar a modo ${isDark ? 'claro' : 'oscuro'}">
          ${isDark ? SUN_ICON : MOON_ICON}
        </button>
      </div>
    </div>
  `;

  header.querySelector('#theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('devprinciples-theme', next);

    const btn = header.querySelector('#theme-toggle');
    btn.innerHTML = next === 'dark' ? SUN_ICON : MOON_ICON;
    btn.setAttribute('aria-label', `Cambiar a modo ${next === 'dark' ? 'claro' : 'oscuro'}`);
  });

  return header;
}
